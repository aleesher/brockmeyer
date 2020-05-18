import React from "react";
import { FormattedMessage } from "react-intl";
import { Link } from "react-router-dom";
import _ from "lodash";

import { Edit } from "components/icons";
import {
  formatPrice,
  getTotalChannelaClicks as getTotalClicks,
  getTotalPrice
} from "helpers/common";
import { IChannel } from "models/.";
import ChannelReviewCardTemplate from "../../components/page-template/card-template/ChannelReviewCardTemplate";
import { ThemeConsumer } from "constants/themes/theme-context";

import "./TotalCard.scss";

interface IProps {
  children?: any;
  items?: IChannel[];
  title: string;
  url: string;
  readonly?: boolean;
  withoutInfo?: boolean;
  onClickStats?: () => void;
  campaign: any;
  idProps?: string;
  isLoading?: boolean;
}

class CampaignCard extends React.Component<IProps> {
  private content = (channel, index, color) => (
    <div className="item-row" key={index}>
      <div className="left-content">
        <h2>{channel.name}</h2>
        {!this.props.withoutInfo && (
          <span className="views-text">
            {!_.isNil(channel.days) && (
              <span>
                {channel.days} <FormattedMessage id="DAYS" />
              </span>
            )}
            {!_.isNil(channel.statistics.estimatedClicks) && (
              <span>
                {!_.isNil(channel.days) && " - "}
                {channel.statistics.estimatedClicks} <FormattedMessage id="EST_CLICKS" />
              </span>
            )}
          </span>
        )}
      </div>
      <div className="price" style={{ color }}>
        &euro;{formatPrice(channel.price)}
      </div>
    </div>
  );

  private totals(color) {
    const { items = [], onClickStats, withoutInfo } = this.props;

    if (!items.length) {
      return null;
    }

    return (
      <div className="item-row">
        <div className="left-content">
          <FormattedMessage id="TOTAL" tagName="h2" />
          {!withoutInfo && (
            <span className="views-text">
              {getTotalClicks(items)} <FormattedMessage id="EST_VIEWS" />
            </span>
          )}
          {onClickStats && (
            <span className="show-results" onClick={onClickStats}>
              <FormattedMessage id="VIEW_EXPECTED_RESULT" />
            </span>
          )}
        </div>
        <div className="price" style={{ color }}>
          &euro;{getTotalPrice(items)}
        </div>
      </div>
    );
  }

  render() {
    const { title, items = [], url, children, readonly, campaign, idProps, isLoading } = this.props;

    if (!items.length && !children && !isLoading) {
      return null;
    }

    const id = campaign ? campaign.id : -1;

    return (
      <ThemeConsumer>
        {theme => {
          return isLoading ? (
            <ChannelReviewCardTemplate />
          ) : (
            <div className="review-item card" id={idProps}>
              <div className="label">
                <FormattedMessage id={title} tagName="h3" />
                {readonly && (
                  <Link className="edit-button" to={`${url}/${id}`}>
                    <Edit className="icon" />
                    <FormattedMessage id="EDIT" tagName="span" />
                  </Link>
                )}
              </div>
              <div className="content">
                {children}
                {items.map((item, index) => this.content(item, index, theme.primary_color))}
                {this.totals(theme.primary_color)}
              </div>
            </div>
          );
        }}
      </ThemeConsumer>
    );
  }
}

export default CampaignCard;
