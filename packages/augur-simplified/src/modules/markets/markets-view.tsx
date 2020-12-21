import React from 'react';
import Styles from 'modules/markets/markets-view.styles.less';
import makePath from 'modules/routes/helpers/make-path';
import { MARKET, SIDEBAR_TYPES } from 'modules/constants';
import { Link } from 'react-router-dom';
import {
  ValueLabel,
  AppViewStats,
  CategoryLabel,
  CategoryIcon,
} from 'modules/common/labels';
import { formatDai } from 'utils/format-number';
import { EthIcon, FilterIcon, UsdIcon } from 'modules/common/icons';
import classNames from 'classnames';
import { PrimaryButton } from 'modules/common/buttons';
import { SquareDropdown } from 'modules/common/selection';
import { Pagination } from 'modules/common/pagination';
import { useAppStatusStore } from 'modules/stores/app-status';
import { ETH, INVALID_OUTCOME_ID, YES_OUTCOME_ID } from '../constants';

const OutcomesTable = ({ outcomes, marketId, priceNo, priceYes }) => {
  return (
    <div className={Styles.OutcomesTable}>
      {outcomes
        .filter((outcome) => outcome.id !== INVALID_OUTCOME_ID)
        .map((outcome) => (
          <div key={`${outcome.name}-${marketId}-${outcome.id}`}>
            <span>{outcome.name.toLowerCase()}</span>
            <span>{formatDai(outcome.name === YES_OUTCOME_ID ? priceYes : priceNo).full}</span>
          </div>
        ))}
    </div>
  );
};

const MarketCard = ({ market }) => {
  const { categories, description, outcomes, marketId, ammExchange } = market;

  return (
    <article
      className={classNames(Styles.MarketCard, {
        [Styles.NoLiquidity]: !ammExchange,
      })}
    >
      <Link to={makePath(MARKET)}>
        <div>
          <CategoryIcon category={categories[0]} />
          <CategoryLabel category={categories[1]} />
          <div>{ammExchange && ammExchange?.name === ETH ? EthIcon : UsdIcon}</div>
          <span>{description}</span>
          {!ammExchange ? (
            <div>
              <span>Market requires Initial liquidity</span>
              <PrimaryButton text="Earn fees as a liquidity provider" />
            </div>
          ) : (
            <>
              <ValueLabel
                label="total volume"
                value={formatDai(market.ammExchange?.volumeTotalUSD).full}
              />
              <OutcomesTable
                marketId={marketId}
                priceNo={ammExchange?.priceNo}
                priceYes={ammExchange?.priceYes}
                outcomes={outcomes}
              />
            </>
          )}
        </div>
      </Link>
    </article>
  );
};

const MarketsView = () => {
  const {
    isMobile,
    actions: { setSidebar },
    processed: { markets },
  } = useAppStatusStore();
  return (
    <div className={Styles.MarketsView}>
      <AppViewStats showCashAmounts />
      {isMobile && (
        <PrimaryButton
          text="filters"
          icon={FilterIcon}
          action={() => setSidebar(SIDEBAR_TYPES.FILTERS)}
        />
      )}
      <ul>
        <SquareDropdown
          onChange={() => null}
          options={[
            { label: 'Open', value: 0 },
            { label: 'Closed', value: 1 },
          ]}
          defaultValue="All Markets"
        />
        <SquareDropdown
          onChange={() => null}
          options={[
            { label: 'Open', value: 0 },
            { label: 'Closed', value: 1 },
          ]}
          defaultValue="Volume"
        />
        <SquareDropdown
          onChange={() => null}
          options={[
            { label: 'Open', value: 0 },
            { label: 'Closed', value: 1 },
          ]}
          defaultValue="Open"
        />
        <SquareDropdown
          onChange={() => null}
          options={[
            { label: 'Open', value: 0 },
            { label: 'Closed', value: 1 },
          ]}
          defaultValue="All Currencies"
        />
      </ul>
      <section>
        {Object.values(markets).map((market, index) => (
          <MarketCard key={`${market.marketId}-${index}`} market={market} />
        ))}
      </section>
      <Pagination
        page={1}
        itemCount={10}
        itemsPerPage={9}
        action={() => null}
        updateLimit={() => null}
      />
    </div>
  );
};

export default MarketsView;
