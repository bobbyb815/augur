import React, { useState, useMemo, useEffect } from 'react';
import classNames from 'classnames';
import PriceHistory from 'modules/market-charts/components/price-history/price-history';
// @ts-ignore
import Styles from 'modules/market-charts/sports-group-charts.styles.less';
import { selectMarket } from 'modules/markets/selectors/market';
import { SquareDropdown } from 'modules/common/selection';
import {
  SPORTS_GROUP_TYPES,
  SPORTS_GROUP_MARKET_TYPES,
  SPORTS_GROUP_MARKET_TYPES_READABLE,
} from 'modules/common/constants';

const RANGE_OPTIONS = [
  {
    id: 0,
    label: '24hr',
    value: 86400,
  },
  {
    id: 1,
    label: '7d',
    value: 86400 * 7,
  },
  {
    id: 2,
    label: '30d',
    value: 86400 * 30,
  },
  {
    id: 3,
    label: 'All time',
    value: 0,
  },
];

export const SportsGroupCharts = ({ sportsGroup, marketId }) => {
  const [selectedMarket, setSelectedMarket] = useState(marketId);
  const [rangeSelection, setRangeSelection] = useState(3);
  const currentRangeValue = RANGE_OPTIONS[rangeSelection].value;
  const marketNum = sportsGroup.markets.length;
  const { market, outcomes, options } = useMemo(() => {
    const market = selectMarket(selectedMarket);
    const outcomes = market.outcomesFormatted;
    const invalid = outcomes.shift();
    outcomes.push(invalid);
    const options = sportsGroup.markets.map(
      ({ id, sportsBook: { title, groupType } }) => {
        const readableName = SPORTS_GROUP_MARKET_TYPES_READABLE[groupType];
        return {
          value: id,
          label: title ? title : readableName,
          name: title ? title : readableName,
        };
      }
    );
    return {
      market,
      outcomes,
      options,
    };
  }, [selectedMarket]);

  useEffect(() => {
    if (marketId !== selectedMarket) setSelectedMarket(marketId);
  }, [marketId]);

  return (
    <section className={Styles.Container}>
      <div className={Styles.ChartArea}>
        <h4>Price History</h4>
        {sportsGroup.type !== SPORTS_GROUP_TYPES.FUTURES && marketNum > 1 && (
          <SquareDropdown
            defaultValue={selectedMarket}
            options={options}
            minimalStyle
            onChange={sortOption => setSelectedMarket(sortOption)}
            stretchOutOnMobile
          />
        )}
        <ul className={Styles.RangeSelection}>
          {RANGE_OPTIONS.map(({ value, id, label }) => (
            <li key={`range-option-${id}`}>
              <button
                className={classNames({
                  [Styles.selected]: rangeSelection === id,
                })}
                onClick={() => rangeSelection !== id && setRangeSelection(id)}
              >
                {RANGE_OPTIONS[id].label}
              </button>
            </li>
          ))}
        </ul>
        <PriceHistory
          marketId={selectedMarket}
          market={market}
          rangeValue={currentRangeValue}
        />
      </div>
      <div className={Styles.Legend}>
        <h5>References:</h5>
        <ul>
          {outcomes.map(outcome => (
            <li
              key={outcome.id}
              id={`legend-outcome-${outcome.id}`}
              className={classNames({
                [Styles.hidden]:
                  outcome.id === 0 && outcome.lastPricePercent.value === 0,
                [Styles.invalid]: outcome.id === 0,
              })}
            >
              <span>{outcome.description}</span>
              <span>{outcome.lastPricePercent.full}</span>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
};
