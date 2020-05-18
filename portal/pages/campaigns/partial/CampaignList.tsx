import React from "react";
import moment from "moment";
import { FormattedMessage } from "react-intl";
import { CSSTransition, TransitionGroup } from "react-transition-group";
import classnames from "classnames";

import { CardItem } from "components/.";
import { roundNumber } from "helpers/common";

import PageTemplate from "components/page-template";
import { NAVIGATION_URLS } from "constants/URIConstants";

import "./CampaignList.scss";

interface IProps {
  campaigns: any;
  statuses: any;
  onClick: (campaign: any) => void;
  className?: string;
  isLoading?: boolean;
  isMobile?: boolean;
  globalLoading?: boolean;
}

const CampaignList: React.StatelessComponent<IProps> = ({
  campaigns,
  statuses,
  onClick,
  className = "",
  isMobile,
  globalLoading
}) => {
  const renderCartItem = campaign => {
    const status = statuses.find(status => status.id === campaign.campaignStatus);
    if (!status) {
      return null;
    }

    return (
      <CSSTransition key={campaign.id} classNames="fade" timeout={300}>
        <CardItem onClick={() => onClick(campaign)}>
          <div className="card-item-content">
            <div className="campaign-headers-container">
              <div className="campaign-header">{campaign.companyName}</div>
              <div className="campaign-header">{campaign.jobTitle}</div>
              <div className="campaign-status">
                <span className={classnames("status-tour", status.name)}>
                  <FormattedMessage id={status.name.toUpperCase()} />
                </span>
              </div>
            </div>

            <div className="campaign-headers-container--mobile">
              <div id="job-title-mobile">
                <div className="campaign-header">{campaign.companyName}</div>
                <div className="campaign-subheader">{campaign.jobTitle}</div>
              </div>
              <div className="campaign-status">
                <span className={classnames("status-tour", status.name)}>
                  <FormattedMessage id={status.name.toUpperCase()} />
                </span>
              </div>
            </div>

            {["order_publish", "order_online"].includes(status.name) ? (
              <div className="campaign-data">
                <div>
                  {campaign.clicks || 0}
                  <span>
                    <FormattedMessage id="VIEWS" />
                  </span>
                </div>
                <div>
                  {campaign.clicksCpc || 0}
                  <span>
                    <FormattedMessage id="CLICKS" /> (cpc)
                  </span>
                </div>
                <div>
                  {`${campaign.performance ? roundNumber(campaign.performance * 100, 0) : 0}%`}
                  <span>
                    <FormattedMessage id="PERFORMANCE" />
                  </span>
                </div>
                <div>
                  {`${campaign.ctr ? roundNumber(campaign.ctr * 100, 0) : 0}%`} <span>CTR</span>
                </div>
                <div>
                  {moment(campaign.dateEnd).diff(moment(), "days")}
                  <span>
                    <FormattedMessage id="DAYS_LEFT" />
                  </span>
                </div>
              </div>
            ) : (
              <div className="campaign-data remark">
                <span>{status.description}</span>
              </div>
            )}
          </div>
        </CardItem>
      </CSSTransition>
    );
  };

  return globalLoading ? (
    <PageTemplate page={NAVIGATION_URLS.CAMPAIGNS} listClassName={className} isMobile={isMobile} />
  ) : (
    <TransitionGroup id="campaign-list" className={className}>
      {campaigns.map(renderCartItem)}
    </TransitionGroup>
  );
};

export default CampaignList;
