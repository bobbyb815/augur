import { UIOrder } from 'modules/types';
import {
  MarketInfo,
  convertOnChainPriceToDisplayPrice,
  convertOnChainAmountToDisplayAmount,
  numTicksToTickSize,
  convertDisplayValuetoAttoValue,
} from '@augurproject/sdk-lite';
import {
  SELL,
  BUY,
  TX_TRADE_GROUP_ID,
  TX_MARKET_ID,
  TX_OUTCOME_ID,
  TX_PRICE,
  TX_AMOUNT,
  TX_DIRECTION,
} from 'modules/common/constants';
import { createBigNumber } from 'utils/create-big-number';
import { augurSdk } from 'services/augursdk';

export function convertTransactionOrderToUIOrder(
  hash: string,
  onChainOrder,
  status: string,
  market: MarketInfo
): UIOrder {

  const Augur = augurSdk ? augurSdk.get() : undefined;

  console.log(JSON.stringify(onChainOrder));
  const outcomeId = onChainOrder[TX_OUTCOME_ID].toNumber();
  const outcome = market.outcomes.find(o => o.id === outcomeId);
  const onChainMinPrice = convertDisplayValuetoAttoValue(
    createBigNumber(market.minPrice)
  );
  const onChainMaxPrice = convertDisplayValuetoAttoValue(
    createBigNumber(market.maxPrice)
  );
  const numTicks = createBigNumber(market.numTicks);
  const tickSize = numTicksToTickSize(
    numTicks,
    onChainMinPrice,
    onChainMaxPrice
  );
  const price = convertOnChainPriceToDisplayPrice(
    onChainOrder[TX_PRICE],
    onChainMinPrice,
    tickSize
  ).toString(10);
  const amount = convertOnChainAmountToDisplayAmount(
    onChainOrder[TX_AMOUNT],
    tickSize,
    Augur.precision,
  ).toString();
  return {
    id: onChainOrder[TX_TRADE_GROUP_ID],
    marketId: onChainOrder[TX_MARKET_ID],
    outcomeId,
    price,
    fullPrecisionPrice: price,
    amount,
    fullPrecisionAmount: amount,
    type: onChainOrder[TX_DIRECTION].eq(0) ? BUY : SELL,
    outcomeName: outcome.description,
    status,
    hash,
  };
}
