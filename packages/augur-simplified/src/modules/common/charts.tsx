import React, { useEffect, useState, useMemo, useRef } from 'react';
import Highcharts from 'highcharts/highstock';
import NoDataToDisplay from 'highcharts/modules/no-data-to-display';
import { createBigNumber } from 'utils/create-big-number';
import Styles from 'modules/common/charts.styles.less';
import classNames from 'classnames';
import { formatDai } from 'utils/format-number';
import { Checkbox } from 'modules/common/icons';
import { SmallRoundedButton } from './buttons';
import { MarketInfo } from '../types';

const HIGHLIGHTED_LINE_WIDTH = 2;
const NORMAL_LINE_WIDTH = 2;
const DEFAULT_SELECTED_ID = 2;
const FIFTEEN_MIN_MS = 900000;
const ONE_HOUR_MS = 3600 * 1000;
const ONE_QUARTER_DAY = ONE_HOUR_MS * 6;
const ONE_DAY_MS = 24 * ONE_HOUR_MS;
const ONE_WEEK_MS = ONE_DAY_MS * 7;
const ONE_MONTH_MS = ONE_DAY_MS * 30;
const DATE = new Date();
const END_TIME = DATE.getTime();

const RANGE_OPTIONS = [
  {
    id: 0,
    label: '24hr',
    tick: FIFTEEN_MIN_MS,
    startTime: END_TIME - ONE_DAY_MS,
  },
  {
    id: 1,
    label: '7d',
    tick: ONE_HOUR_MS,
    startTime: END_TIME - ONE_WEEK_MS,
  },
  {
    id: 2,
    label: '30d',
    tick: ONE_QUARTER_DAY,
    startTime: END_TIME - ONE_MONTH_MS,
  },
  {
    id: 3,
    label: 'All time',
    tick: ONE_DAY_MS,
    startTime: END_TIME - ONE_MONTH_MS * 6,
  },
];

const SERIES_COLORS = ['#58586B', '#FF7D5E', '#05B169'];
const SERIES_GRADIENTS = [
  [[0, 'rgba(88, 88, 107, .15)'], [1, 'rgba(88, 88, 107, 0)']],
  [[0, 'rgba(255, 125, 94, .15)'], [1, 'rgba(255, 125, 94, 0)']],
  [[0, 'rgba(5, 177, 105, .15)'], [1, 'rgba(5, 177, 105, 0)']],
];

function getRandomInt(max) {
  return Math.floor(Math.random() * Math.floor(max));
}
interface HighcartsChart extends Highcharts.Chart {
  renderTo?: string | Element | React.ReactNode;
}

const getMockPriceTime = (formattedOutcomes, market, rangeSelection) => ({
  priceTimeArray: formattedOutcomes.map(outcome => {
    const { startTime, tick } = RANGE_OPTIONS[rangeSelection];
    const totalTicks = (END_TIME - startTime) / tick;
    const outcomePriceTime = [];
    let lastPrice = createBigNumber(outcome.lastPrice);
    let curTimestamp = END_TIME;
    while (outcomePriceTime.length < totalTicks) {
      const rand = getRandomInt(5);
      let priceVariance = getRandomInt(rand) * 0.1;
      let nextPrice = Boolean(Math.round(Math.random()))
        ? lastPrice.plus(priceVariance)
        : lastPrice.minus(priceVariance);
      if (nextPrice.gt(market.maxPriceBigNumber || 1)) {
        nextPrice = createBigNumber(market.maxPriceBigNumber || 1);
      } else if (nextPrice.lt(market.minPriceBigNumber || 0)) {
        nextPrice = createBigNumber(market.minPriceBigNumber || 0);
      }
      outcomePriceTime.push({
        price: nextPrice.toFixed(2),
        amount: 100,
        timestamp: curTimestamp,
        logIndex: 0,
      });
      curTimestamp = curTimestamp - tick;
      lastPrice = nextPrice;
    }
    return outcomePriceTime;
  }),
});

export const PriceHistoryChart = ({
  formattedOutcomes,
  market,
  selectedOutcomes,
  rangeSelection,
}) => {
  const container = useRef(null);
  // eslint-disable-next-line
  const [forceRender, setForceRender] = useState(false);
  const { maxPriceBigNumber: maxPrice, minPriceBigNumber: minPrice } = market;
  // const { priceTimeArray } = useMemo(() => getMockPriceTime(market), [market]);
  const { priceTimeArray } = getMockPriceTime(formattedOutcomes, market, rangeSelection);
  const options = useMemo(
    () =>
      getOptions({
        maxPrice,
        minPrice,
      }),
    [maxPrice, minPrice]
  );

  useMemo(() => {
    const chartContainer = container.current;
    if (chartContainer) {
      const chart: HighcartsChart = Highcharts.charts.find(
        (chart: HighcartsChart) => chart?.renderTo === chartContainer
      );
      const formattedOutcomes = getFormattedOutcomes({ market });
      const series =
        priceTimeArray.length === 0
          ? []
          : handleSeries(priceTimeArray, selectedOutcomes, formattedOutcomes);
      if (!chart || chart?.renderTo !== chartContainer) {
        // @ts-ignore
        Highcharts.stockChart(chartContainer, { ...options, series });
      } else {
        series?.forEach((seriesObj, index) => {
          if (chart.series[index]) {
            chart.series[index].update(seriesObj, false);
          } else {
            chart.addSeries(seriesObj, false);
          }
        });
        chart.redraw();
      }
    }
    // eslint-disable-next-line
  }, [selectedOutcomes, options, priceTimeArray]);

  useEffect(() => {
    const chartContainer = container.current;
    NoDataToDisplay(Highcharts);
    const chart: HighcartsChart = Highcharts.charts.find(
      (chart: HighcartsChart) => chart?.renderTo === chartContainer
    );
    if (!chart || chart?.renderTo !== chartContainer) {
      // needs to be done because container ref is null on first load.
      setForceRender(true);
    }
    return () => {
      Highcharts.charts
        .find((chart: HighcartsChart) => chart?.renderTo === chartContainer)
        ?.destroy();
    };
  }, []);

  return <section className={Styles.PriceHistoryChart} ref={container} />;
};

export const SelectOutcomeButton = ({
  outcome: { outcomeIdx, label, lastPrice },
  toggleSelected,
  isSelected,
}) => {
  return (
    <button
      className={classNames(Styles.SelectOutcomeButton, {
        [Styles[`isSelected_${outcomeIdx}`]]: isSelected,
      })}
      onClick={() => toggleSelected(outcomeIdx)}
    >
      <span>{Checkbox}</span>
      {label}
      <b>{formatDai(createBigNumber(lastPrice)).full}</b>
    </button>
  );
};

export const SimpleChartSection = ({ market }) => {
  const formattedOutcomes = getFormattedOutcomes({ market });
  // eslint-disable-next-line
  const [selectedOutcomes, setSelectedOutcomes] = useState(
    formattedOutcomes.map(({ outcomeIdx }) =>
      Boolean(outcomeIdx === DEFAULT_SELECTED_ID)
    )
  );
  const [rangeSelection, setRangeSelection] = useState(3);

  const toggleOutcome = id => {
    const updates = [].concat(selectedOutcomes);
    updates[id] = !updates[id];
    setSelectedOutcomes(updates);
  };

  return (
    <section className={Styles.SimpleChartSection}>
      <ul className={Styles.RangeSelection}>
        {RANGE_OPTIONS.map(({ id, label }) => (
          <li key={`range-option-${id}`}>
            <SmallRoundedButton
              text={label}
              selected={rangeSelection === id}
              action={() => rangeSelection !== id && setRangeSelection(id)}
            />
          </li>
        ))}
      </ul>
      <PriceHistoryChart
        {...{ market, formattedOutcomes, selectedOutcomes, rangeSelection }}
      />
      <div>
        {formattedOutcomes.map(outcome => (
          <SelectOutcomeButton
            key={`${outcome.id}_${outcome.value}`}
            outcome={outcome}
            toggleSelected={toggleOutcome}
            isSelected={selectedOutcomes[outcome.outcomeIdx]}
          />
        ))}
      </div>
    </section>
  );
};

export default SimpleChartSection;

// helper functions:
const handleSeries = (
  priceTimeArray,
  selectedOutcomes,
  formattedOutcomes,
  mostRecentTradetime = 0
) => {
  const series = [];
  priceTimeArray.forEach((priceTimeData, index) => {
    const length = priceTimeData.length;
    const isSelected = selectedOutcomes[index];
    if (
      length > 0 &&
      priceTimeData[length - 1].timestamp > mostRecentTradetime
    ) {
      mostRecentTradetime = priceTimeData[length - 1].timestamp;
    }
    const data = priceTimeData.map(pts => [
      pts.timestamp,
      createBigNumber(pts.price).toNumber(),
    ]);
    const baseSeriesOptions = {
      name: formattedOutcomes[index].label,
      type: isSelected ? 'area' : 'line',
      lineWidth: isSelected ? HIGHLIGHTED_LINE_WIDTH : NORMAL_LINE_WIDTH,
      states: {
        hover: {
          lineWidth: isSelected ? HIGHLIGHTED_LINE_WIDTH : NORMAL_LINE_WIDTH,
        }
      },
      color: SERIES_COLORS[index],
      fillColor: {
        linearGradient: { x1: 0, x2: 0, y1: 0, y2: 1 },
        stops: SERIES_GRADIENTS[index],
      },
      marker: {
        enabled: false,
        symbol: 'circle',
        states: {
          hover: {
            enabled: true,
            symbol: 'circle',
            radius: 4,
          }
        }
      },
      // @ts-ignore
      data,
      visible: isSelected,
    };

    series.push({ ...baseSeriesOptions });
  });
  series.forEach(seriesObject => {
    const seriesData = seriesObject.data;
    // make sure we have a trade to fill chart
    if (
      seriesData.length > 0 &&
      seriesData[seriesData.length - 1][0] !== mostRecentTradetime
    ) {
      const mostRecentTrade = seriesData[seriesData.length - 1];
      seriesObject.data.push([mostRecentTradetime, mostRecentTrade[1]]);
    }
    seriesObject.data.sort((a, b) => a[0] - b[0]);
  });
  return series;
};

const getOptions = ({
  maxPrice = createBigNumber(1),
  minPrice = createBigNumber(0),
}) => ({
  lang: {
    noData: 'No data...',
  },
  title: {
    text: '',
  },
  chart: {
    backgroundColor: 'transparent',
    type: 'line',
    styledMode: false,
    animation: false,
    reflow: true,
    marginTop: 11,
    spacing: [22, 0, 22, 0],
  },
  credits: {
    enabled: false,
  },
  plotOptions: {
    area: {
      threshold: null,
    },
    line: {
      dataGrouping: {
        forced: true,
        // units: [['minute', [1]]],
      },
    },
  },
  scrollbar: { enabled: false },
  navigator: { enabled: false },
  xAxis: {
    ordinal: false,
    tickLength: 0,
    gridLineWidth: 0,
    gridLineColor: null,
    lineWidth: 0,
    labels: false,
  },
  yAxis: {
    showEmpty: true,
    opposite: false,
    max: maxPrice.toFixed(2),
    min: minPrice.toFixed(2),
    gridLineWidth: 0,
    gridLineColor: null,
    labels: false,
  },
  tooltip: {
    enabled: true,
    shape: 'square',
    shared: true,
    split: false,
    useHTML: true,
    formatter() {
      let out = `<h5>${Highcharts.dateFormat('%b %e %k:%M %p', this.x)}</h5><ul>`;
      this.points.forEach(point => {
        out += `<li><span style="color:${point.color}">&#9679;</span><b>${point.series.name}</b><span>${formatDai(createBigNumber(point.y)).full}</span></li>`;
      });
      out += '</ul>';
      return out;
    }
  },
  rangeSelector: {
    enabled: false,
  },
});

export const getFormattedOutcomes = ({
  market: { amm, outcomes },
}: { market: MarketInfo }) => {
  return outcomes.map((outcome, outcomeIdx) => ({
    ...outcome,
    outcomeIdx,
    label: (outcome?.name || outcome?.value).toLowerCase(),
    lastPrice: !amm ? '0.5' : outcomeIdx === 1 ? amm.priceNo : amm.priceYes,
  }));

};
