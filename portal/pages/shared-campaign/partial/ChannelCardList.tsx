import React from "react";
import { FormattedMessage } from "react-intl";
import _ from "lodash";

import { getTotalClicks, getTotalPrice } from "helpers/common";
import ChannelCard from "./ChannelCard";

import "./ChannelCard.scss";

interface IProps {
  channels: any;
  title: string;
  isOtherChannel?: boolean;
  page?: string;
  withoutInfo?: string;
  onClickStats?: () => void;
  images?: boolean;
  status: string;
}

interface IState {
  channelId?: number;
  showDescription: boolean;
}

class ChannelCardList extends React.Component<IProps, IState> {
  constructor(props) {
    super(props);

    this.state = {
      channelId: -1,
      showDescription: false
    };
  }

  private totals() {
    const { channels = [], onClickStats, withoutInfo } = this.props;

    if (!channels.length) {
      return null;
    }

    return (
      <div className="item-row">
        <div className="channel-img" />
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
      </div>
    );
  }

  render() {
    const { channels = [], title, onClickStats, isOtherChannel, status } = this.props;

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
          {channels.map((ch, index) => (
            <ChannelCard
              key={`${ch.name}-${index}`}
              channel={ch}
              index={index}
              isOtherChannel={isOtherChannel}
              status={status}
            />
          ))}
          {onClickStats && this.totals()}
        </div>
      </div>
    );
  }
}

export default ChannelCardList;
