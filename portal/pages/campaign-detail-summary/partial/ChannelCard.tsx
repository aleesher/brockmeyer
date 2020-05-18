import React from "react";
import { FormattedMessage } from "react-intl";
import _ from "lodash";
import classnames from "classnames";

import { KeyboardArrowDown, KeyboardArrowUp } from "components/icons";
import { formatPrice, getTotalClicks, getTotalPrice } from "helpers/common";
import { DEFAULT_CHANNEL_LOGO } from "constants/constants";
import URIConstants, { NAVIGATION_URLS } from "constants/URIConstants";

import "./ChannelCard.scss";

interface IProps {
  channels: any;
  title: string;
  isOtherChannel?: boolean;
  page?: string;
  withoutInfo?: string;
  onClickStats?: () => void;
}

interface IState {
  channelId?: number;
}

class ChannelCard extends React.Component<IProps, IState> {
  constructor(props) {
    super(props);

    this.state = { channelId: -1 };
  }

  private renderDays = channel => {
    const { isOtherChannel, page } = this.props;
    if (isOtherChannel || page === NAVIGATION_URLS.SHARED_CAMPAIGN) {
      return;
    }
    const days = channel.days ? parseInt(channel.days, 10) : 0;
    return (
      <span>
        {days} <FormattedMessage id="DAYS" />
      </span>
    );
  };

  private renderChannel = (channel, index: number) => {
    const { isOtherChannel } = this.props;
    const channelId = this.state.channelId;
    const toggleClasses = classnames("item-additional-panel", {
      "folded-out": channelId === channel.id
    });
    const logo = channel.logo
      ? URIConstants.REMOTE_RESOURCES_URI + channel.logo
      : DEFAULT_CHANNEL_LOGO;

    return (
      <div key={`${channel.id}-${index}`} className="item-row">
        <span className="item-name">{channel.name}</span>

        <span className="item-text">
          {this.renderDays(channel)}
          {!_.isNil(channel.statistics.estimatedClicks) && (
            <span>
              {!isOtherChannel && channel.days && " - "}
              {channel.statistics.estimatedClicks} <FormattedMessage id="EST_CLICKS" />
            </span>
          )}
        </span>

        <div className="item-price">
          €{formatPrice(channel.price)}
          <br />
          <span className="item-est-clicks">
            {channel.days ? parseInt(channel.days, 10) : 0} <FormattedMessage id="DAYS" />
            {!_.isNil(channel.statistics.estimatedClicks) && (
              <span>
                {channel.days && " - "}
                {channel.statistics.estimatedClicks} <FormattedMessage id="EST_CLICKS" />
              </span>
            )}
          </span>
        </div>

        <span
          className="item-toggle"
          onClick={() => this.setState({ channelId: channel.id === channelId ? -1 : channel.id })}
        >
          <FormattedMessage id={channelId === channel.id ? "HIDE" : "LC_DETAILS"} />
          {channelId === channel.id ? <KeyboardArrowUp /> : <KeyboardArrowDown />}
        </span>
        <div className={toggleClasses}>
          <div className="logo">
            <img src={logo} />
          </div>
          {channel.postingUrl && (
            <span className="url">
              <FormattedMessage id="VACANCY_URL" />{" "}
              <a href={channel.postingUrl} target="_blank">
                {channel.postingUrl}
              </a>
            </span>
          )}
        </div>
      </div>
    );
  };

  private totals() {
    const { channels = [], onClickStats, withoutInfo } = this.props;

    if (!channels.length) {
      return null;
    }

    return (
      <div className="item-row">
        <span className="item-name total">
          <FormattedMessage id="TOTAL" tagName="h2" />
          <span className="item-text">
            {!withoutInfo && (
              <span className="views-text">
                {getTotalClicks(channels)} <FormattedMessage id="EST_VIEWS" />
              </span>
            )}
            {onClickStats && (
              <span className="show-results" onClick={onClickStats}>
                <FormattedMessage id="VIEW_EXPECTED_RESULT" />
              </span>
            )}
          </span>
        </span>

        <div className="item-price">€{getTotalPrice(channels)}</div>
        <span className="item-toggle" />
      </div>
    );
  }

  render() {
    const { channels = [], title, onClickStats } = this.props;

    if (!channels.length) {
      return null;
    }

    return (
      <div className="channel-item card">
        <div className="label">
          <span className="title">
            <FormattedMessage id={title} />
          </span>
        </div>
        <div className="content">
          {channels.map(this.renderChannel)}
          {onClickStats && this.totals()}
        </div>
      </div>
    );
  }
}

export default ChannelCard;
