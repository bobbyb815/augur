import { ParsedLog } from '@augurproject/types';
import { Block } from 'ethers/providers';
import * as fp from 'lodash/fp';
import { Augur } from '../Augur';
import { ZeroXStats } from '../api/ZeroX';
import { SubscriptionEventName, NULL_ADDRESS } from '../constants';
import { Subscriptions } from '../subscriptions';
import { DB } from './db/DB';
import { Markets } from './getter/Markets';
import { LogFilterAggregatorInterface } from './logs/LogFilterAggregator';

export class Controller {
  private static latestBlock: Block;
  constructor(
    private augur: Augur,
    private db: Promise<DB>,
    private logFilterAggregator: LogFilterAggregatorInterface,
  ) {
    this.logFilterAggregator.listenForAllEvents(this.allEvents);
    this.logFilterAggregator.notifyNewBlockAfterLogsProcess(this.notifyNewBlockEvent.bind(this));

    this.augur.events.on(SubscriptionEventName.OrderBooksSynced, ({marketIds}) => this.updateMarketsData(marketIds));

    db.then((dbObject) => {
      logFilterAggregator.listenForBlockRemoved(
        dbObject.rollback.bind(db)
      );
    });
  }

  private updateMarketsData = async (marketIds: string[]) => {
    const marketsInfo = await Markets.getMarketsInfo(this.augur, await this.db, {
      marketIds
    });

    if (marketsInfo.length > 0) {
      this.augur.events.emit(SubscriptionEventName.MarketsUpdated,  {
        marketsInfo
      });
    }
  };

  private allEvents = async (blockNumber: number, allLogs: ParsedLog[]) => {
    // Grab market ids from all logs.
    // Compose applies operations from bottom to top.
    const marketIds = fp.compose(
      fp.compact,
      fp.uniq,
      fp.map('market')
    )(allLogs);

    const validMarketIds = marketIds.filter(m => m !== NULL_ADDRESS);
    const nullMarketLogs = allLogs.filter(l => l.market === NULL_ADDRESS);

    if (validMarketIds.length > 0) this.updateMarketsData(validMarketIds as string[]);
    // emit non market related logs
    if (nullMarketLogs.length > 0) nullMarketLogs.forEach(l => this.augur.events.emit(l.name, {...l}));
  }

  private notifyNewBlockEvent = async (blockNumber: number, logs: ParsedLog[]): Promise<void> => {
    let lowestBlock = await (await this
      .db).syncStatus.getLowestSyncingBlockForAllDBs();

    if (lowestBlock === -1) {
      lowestBlock = blockNumber;
    }

    const blocksBehindCurrent = blockNumber - lowestBlock;
    const percentSynced = ((lowestBlock / blockNumber) * 100).toFixed(4);

    const timestamp = await this.augur.getTimestamp();

    let stats: ZeroXStats = {peers: 0, orders: 0};
    if(this.augur.zeroX) {
      stats = await this.augur.zeroX.getStats();
    }

    this.augur.events.emit(SubscriptionEventName.NewBlock, {
      eventName: SubscriptionEventName.NewBlock,
      highestAvailableBlockNumber: blockNumber,
      lastSyncedBlockNumber: lowestBlock,
      blocksBehindCurrent,
      percentSynced,
      timestamp: timestamp.toNumber(),
      logs,
      ...stats
    });
  };

  private async getLatestBlock(): Promise<Block> {
    const blockNumber: number = await this.augur.provider.getBlockNumber();
    Controller.latestBlock = await this.augur.provider.getBlock(blockNumber);
    if (!Controller.latestBlock) {
      throw new Error(`Could not get latest block: ${blockNumber}`);
    }

    return Controller.latestBlock;
  }
}
