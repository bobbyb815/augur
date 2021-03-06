import { AmmTransaction, Trades, AmmExchange, Cash, Cashes, MarketOutcome, TransactionTypes, MarketInfo, ActivityData } from "../modules/types";
import { BigNumber as BN } from 'bignumber.js'
import { getDayFormat, getTimeFormat } from "../utils/date-utils";
import { convertAttoValueToDisplayValue } from "@augurproject/sdk";
import { onChainMarketSharesToDisplayFormatter } from "./format-number";
interface GraphMarket {
  id: string,
  description: string,
  endTimestamp: string,
  status: string,
  extraInfoRaw: string,
  fee: string,
  categories: string[],
  outcomes: GraphMarketOutcome[]
  amms: GraphAmmExchange[]
}

interface GraphMarketOutcome {
  id: string,
  isFinalNumerator: boolean,
  payoutNumerator: string,
  value: string,
}
interface GraphTransaction {
  id: string,
  cash: string,
  noShares: string,
  yesShares: string,
  sender: { id: string },
  timestamp: string,
  tx_hash: string,
}
interface GraphEnter extends GraphTransaction {
  price: string,
}

interface GraphExit extends GraphTransaction {
  price: string,
}

interface GraphAddLiquidity extends GraphTransaction {
  ammExchange: GraphAmmExchange,
}

interface GraphRemoveLiquidity extends GraphTransaction {
  ammExchange: GraphAmmExchange,
}

interface GraphAmmExchange {
  id: string,
  cashBalance: string,
  shareToken: {
    id: string,
    cash: {
      id: string,
    },
  },
  liquidity: string,
  liquidityCash: string,
  liquidityInvalid: string,
  liquidityNo: string,
  liquidityYes: string,
  volumeYes: string,
  volumeNo: string,
  percentageNo: string,
  percentageYes: string,
  feePercent: string,
  enters: GraphEnter[],
  exits: GraphExit[],
  addLiquidity: GraphAddLiquidity[],
  removeLiquidity: GraphRemoveLiquidity[]
}

interface GraphData {
  markets: GraphMarket[],
  past: GraphMarket[],
  paraShareTokens: {}
  cashes: { [address: string]: Cash }
}

interface ProcessedData {
  markets: {
    [marketIdKey: string]: MarketInfo
  },
  cashes: {
    [address: string]: Cash
  },
  ammExchanges: {
    [id: string]: AmmExchange
  }
}

export const processGraphMarkets = (graphData: GraphData): ProcessedData => {
  const { markets: rawMarkets, past: rawPastMarkets, cashes } = graphData;

  const keyedMarkets: { [marketId: string]: GraphMarket } = rawMarkets.reduce((group, a) => ({ ...group, [a.id]: a }), {});
  const keyedPastMarkets: { [marketId: string]: GraphMarket } = rawPastMarkets.reduce((group, a) => ({ ...group, [a.id]: a }), {});

  let markets = {};
  let ammExchanges = {};
  Object.keys(keyedMarkets).forEach(marketId => {
    const market = keyedMarkets[marketId]
    const past = keyedPastMarkets[marketId];
    const amms = market.amms;

    // keying markets by marketId or marketId-ammExchange.id.
    if (amms.length === 0) {
      markets[marketId] = shapeMarketInfo(market, null);
    } else if (amms.length === 1) {
      const ammExchange = shapeAmmExchange(market.amms[0], past?.amms[0], cashes, market)
      markets[`${marketId}-${ammExchange.id}`] = shapeMarketInfo(market, ammExchange);
      ammExchanges[ammExchange.id] = ammExchange;
    } else {

      const marketAmms: { [marketId: string]: GraphAmmExchange } = market.amms.reduce((group, a) => ({ ...group, [a.id]: a }), {});
      const pastMarketAmms: { [marketId: string]: GraphAmmExchange } = market.amms.reduce((group, a) => ({ ...group, [a.id]: a }), {});

      Object.keys(marketAmms).forEach(ammId => {
        const amm = marketAmms[ammId];
        const pastAmm = pastMarketAmms[ammId];
        const newAmmExchange = shapeAmmExchange(amm, pastAmm, cashes, market);
        markets[`${marketId}-${ammId}`] = shapeMarketInfo(market, newAmmExchange);
        ammExchanges[newAmmExchange.id] = newAmmExchange;
      })
    }
  });

  //console.log(cashes, markets, ammExchanges)
  return { cashes, markets, ammExchanges };
}

const shapeMarketInfo = (market: GraphMarket, ammExchange: AmmExchange): MarketInfo => {
  const extraInfo = JSON.parse(market?.extraInfoRaw)
  const feeAsPercent = convertAttoValueToDisplayValue(new BN(market.fee)).times(100)
  return {
    marketId: market.id,
    description: market.description,
    longDescription: extraInfo.longDescription,
    categories: extraInfo?.categories || [],
    endTimestamp: market.endTimestamp,
    extraInfoRaw: market.extraInfoRaw,
    fee: String(feeAsPercent),
    outcomes: shapeOutcomes(market.outcomes),
    amm: ammExchange,
    reportingState: market.status
  }
}

const shapeOutcomes = (graphOutcomes: GraphMarketOutcome[]): MarketOutcome[] =>
  (graphOutcomes || []).map(g => ({
    id: Number(g.id.split('-')[1]),
    isFinalNumerator: g.isFinalNumerator,
    payoutNumerator: g.payoutNumerator,
    name: g.value
  }));


const shapeAmmExchange = (amm: GraphAmmExchange, past: GraphAmmExchange, cashes: Cashes, market: GraphMarket): AmmExchange => {
  const marketId = market.id;
  const outcomes = shapeOutcomes(market.outcomes);
  const cash: Cash = cashes[amm.shareToken.cash.id]
  let transactions = [];
  transactions = transactions.concat(amm.enters.map(e => ({ ...e, tx_type: TransactionTypes.ENTER, sender: e.sender.id })));
  transactions = transactions.concat(amm.exits.map(e => ({ ...e, tx_type: TransactionTypes.EXIT, sender: e.sender.id })));
  transactions = transactions.concat(amm.addLiquidity.map(e => ({ ...e, tx_type: TransactionTypes.ADD_LIQUIDITY, sender: e.sender.id })));
  transactions = transactions.concat(amm.removeLiquidity.map(e => ({ ...e, tx_type: TransactionTypes.REMOVE_LIQUIDITY, sender: e.sender.id })));

  let outcomeTrades = outcomes.reduce((p, o) => ({ ...p, [o.id]: [] }), {});

  const trades = getAmmTradeData(outcomeTrades, amm.enters, amm.exits, cash.displayDecimals)
  const priceYes = (Number(amm.percentageNo) / 100);
  const priceNo = (Number(amm.percentageYes) / 100);

  const { volumeNo, volumeYes, liquidity } = amm;
  const { volumeNo: pastVolumeNo, volumeYes: pastVolumeYes, liquidity: pastLiquidity } = (past || {});

  const volumeNoUSD = calculateVolumeInUsd(volumeNo, priceNo, cash.usdPrice);
  const volumeYesUSD = calculateVolumeInUsd(volumeYes, priceYes, cash.usdPrice);
  const volumeTotal = String(new BN(volumeNo).plus(new BN(volumeYes)))
  const volumeTotalUSD = calculateTotalShareVolumeInUsd(volumeNo, volumeYes, priceNo, priceYes, cash.usdPrice);
  const liquidityUSD = calculateLiquidityInUsd(amm.liquidity, cash.usdPrice);

  const volume24hrNoUSD = calculatePastVolumeInUsd(volumeNo, pastVolumeNo, priceNo, cash.usdPrice);
  const volume24hrYesUSD = calculatePastVolumeInUsd(volumeYes, pastVolumeYes, priceYes, cash.usdPrice);
  const volume24hrTotalUSD = String(new BN(volume24hrNoUSD).plus(new BN(volume24hrYesUSD)))
  const liquidity24hrUSD = calculatePastLiquidityInUsd(liquidity, pastLiquidity, cash.usdPrice)

  return {
    id: amm.id,
    marketId,
    liquidity: amm.liquidity,
    liquidity24hrUSD,
    liquidityInvalid: amm.liquidityInvalid,
    liquidityNo: amm.liquidityNo,
    liquidityYes: amm.liquidityYes,
    liquidityCash: amm.liquidityCash,
    liquidityUSD,
    cash,
    priceYes: priceYes.toFixed(2),
    priceNo: priceNo.toFixed(2),
    sharetoken: amm?.shareToken?.id,
    percentageNo: amm.percentageNo,
    percentageYes: amm.percentageYes,
    volumeYes,
    volumeNo,
    volumeYesUSD,
    volumeNoUSD,
    feePercent: amm.feePercent,
    volumeTotal,
    volume24hrTotalUSD,
    volumeTotalUSD,
    transactions,
    trades,
  }
}

const calculateTotalShareVolumeInUsd = (volumeNo: string, volumeYes: string, priceNo: number, priceYes: number, priceUsd: string): string => {
  if (!priceNo || !priceYes) return "0";
  const normalizedYes = new BN(volumeNo || 0).times(new BN(priceNo));
  const normalizedNo = new BN(volumeYes || 0).times(new BN(priceYes));
  return String(normalizedYes.plus(normalizedNo).times(new BN(priceUsd)));
}

const calculateVolumeInUsd = (volumeShare: string, priceShare: number, priceUsd: string): string => {
  if (!volumeShare || !priceUsd || !priceShare) return "0"
  return String(new BN(volumeShare).times(new BN(priceShare)).times(new BN(priceUsd)))
}

const calculateLiquidityInUsd = (volumeOrLiquidity: string, priceUsd: string): string => {
  if (!volumeOrLiquidity || !priceUsd) return "0"
  return String(new BN(volumeOrLiquidity).times(new BN(priceUsd)))
}

const calculatePastVolumeInUsd = (volume: string, pastVolume: string, priceShare: number, priceUsd: string): string => {
  if (!volume || !pastVolume || !priceShare || !priceUsd) return "0"
  return String(new BN(volume)
    .minus(new BN(pastVolume))
    .times(priceShare)
    .times(new BN(priceUsd)))
}

const calculatePastLiquidityInUsd = (volume: string, pastVolume: string, priceUsd: string): string => {
  if (!volume || !pastVolume || !priceUsd) return "0"
  return String(new BN(volume)
    .minus(new BN(pastVolume))
    .times(new BN(priceUsd)))
}

// TODO: this needs to chagne when categoricals come along. We'll need to change up graph data processing
const calculateTradePrice = (txs: (GraphEnter | GraphExit)[], trades: Trades, displayDecimals: number) => {
  return txs.reduce((p, tx) => {
    if (tx.noShares !== '0') {
      p[1].push({ shares: tx.noShares, price: Number(Number.parseFloat(tx.price).toPrecision(displayDecimals)), timestamp: Number(tx.timestamp) })
    } else {
      p[2].push({ shares: tx.yesShares, price: Number(Number.parseFloat(tx.price).toPrecision(displayDecimals)), timestamp: Number(tx.timestamp) })
    }
    return p;
  }, trades)
}

export const getAmmTradeData = (outcomeTrades: Trades, enters: GraphEnter[], exits: GraphExit[], displayDecimals: number) => {
  const enterTrades = calculateTradePrice(enters, outcomeTrades, displayDecimals)
  return calculateTradePrice(exits, enterTrades, displayDecimals)
}

export const getUserActvity = (account: string, markets: { [id: string]: MarketInfo }, ammExchanges: { [id: string]: AmmExchange }): ActivityData[] => {
  if (!ammExchanges) return [];
  const exchanges = Object.values(ammExchanges)
  if (!exchanges || exchanges.length === 0) return []

  const transactions = exchanges.reduce((p, exchange) => {
    const cashName = exchange.cash?.name;
    const userTx: AmmTransaction[] = exchange.transactions.filter(t => t.sender.toLowerCase() === account.toLowerCase())
    if (userTx.length === 0) return p;

    const datedUserTx = userTx.map(t => {
      const type = t.tx_type === TransactionTypes.ENTER ? 'buy' : 'sell';
      const shares = t.yesShares !== "0" ?
        onChainMarketSharesToDisplayFormatter(t.yesShares, exchange.cash.decimals) :
        onChainMarketSharesToDisplayFormatter(t.noShares, exchange.cash.decimals)
      const price = Number(t.price).toFixed(2)
      const subheader = `${shares} yes @ ${price}`
      const value = String(new BN(price).times(new BN(shares)).times(new BN(exchange.cash.usdPrice)))
      return ({
        id: t.id,
        currency: cashName,
        description: markets[`${exchange.marketId}-${exchange.id}`]?.description,
        type,
        date: getDayFormat(t.timestamp),
        time: getTimeFormat(t.timestamp),
        subheader,
        value,
        txHash: t.tx_hash,
      })
    })
    return [...p, ...datedUserTx]
  }, [])

  // form array of grouped by date activities
  return transactions.reduce((p, t) => {
    const item = p.find(x => x.date === t.date)
    if (item) {
      item.activity.push(t);
      return p;
    }
    return [...p, {
      date: t.date,
      activity: [t]
    }]

  }, [])

}
