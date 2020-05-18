import React from "react";
import classnames from "classnames";
import { FormattedMessage } from "react-intl";
import { Link } from "react-router-dom";

import { NAVIGATION_URLS } from "../../../../portal/constants/URIConstants";

import "../../customers/partial/CustomerTab.scss";

const CustomerTab: React.StatelessComponent<{
  sharedCampaignId: string;
  tabIndex: number;
  hasMarketAnalysis: boolean;
  statusNew: boolean;
}> = ({ sharedCampaignId, tabIndex, hasMarketAnalysis, statusNew }) =>
  statusNew ? (
    <div className="customet-tab">
      {hasMarketAnalysis && (
        <Link
          to={`${NAVIGATION_URLS.SHARED_CAMPAIGN_MARKET_ANALYSIS}/${sharedCampaignId}`}
          className="menu-item"
        >
          <div className={classnames({ selected: tabIndex === 0 })}>
            <FormattedMessage id="MARKET_ANALYSIS" />
          </div>
        </Link>
      )}
      <Link to={`${NAVIGATION_URLS.SHARED_CAMPAIGN}/${sharedCampaignId}`} className="menu-item">
        <div className={classnames({ selected: tabIndex === 1 })}>
          {statusNew ? <FormattedMessage id="OVERVIEW_NEW" /> : <FormattedMessage id="OVERVIEW" />}
        </div>
      </Link>
    </div>
  ) : (
    <div className="customet-tab">
      <Link to={`${NAVIGATION_URLS.SHARED_CAMPAIGN}/${sharedCampaignId}`} className="menu-item">
        <div className={classnames({ selected: tabIndex === 0 })}>
          {statusNew ? <FormattedMessage id="OVERVIEW_NEW" /> : <FormattedMessage id="OVERVIEW" />}
        </div>
      </Link>
      {hasMarketAnalysis && (
        <Link
          to={`${NAVIGATION_URLS.SHARED_CAMPAIGN_MARKET_ANALYSIS}/${sharedCampaignId}`}
          className="menu-item"
        >
          <div className={classnames({ selected: tabIndex === 1 })}>
            <FormattedMessage id="MARKET_ANALYSIS" />
          </div>
        </Link>
      )}
    </div>
  );

export default CustomerTab;
