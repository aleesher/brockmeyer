import React from "react";
import { FormattedMessage } from "react-intl";
import _ from "lodash";
import classnames from "classnames";

import { ExpandMore, ExpandLess } from "components/icons";
import { formatPrice } from "helpers/common";
import { DEFAULT_CHANNEL_LOGO } from "constants/constants";
import URIConstants from "constants/URIConstants";

import "./ChannelCard.scss";

interface IProps {
  channel: any;
  index: number;
  isOtherChannel?: boolean;
  status: string;
}

interface IState {
  showDescription: boolean;
}

class ChannelCardList extends React.Component<IProps, IState> {
  constructor(props) {
    super(props);

    this.state = {
      showDescription: false
    };
  }

  private getChannelDescription = () => {
    this.setState(prevState => {
      return {
        ...prevState,
        showDescription: !prevState.showDescription
      };
    });
  };

  render() {
    const { isOtherChannel, channel, index, status } = this.props;
    const logo = channel.logo
      ? URIConstants.REMOTE_RESOURCES_URI + channel.logo
      : DEFAULT_CHANNEL_LOGO;
    const channelUrl =
      (status === "60" ||
        status === "56" ||
        status === "62" ||
        status === "52" ||
        status === "68") &&
      channel.url != null
        ? `https://${_.get(channel, "url", "")}`
        : (status === "66" || status === "64") && channel.postingUrl != null
        ? `https://${_.get(channel, "postingUrl", "")}`
        : "";

    const zoom = Math.round((window.outerWidth / window.innerWidth) * 100) / 100;
    let scale = "large";

    if (zoom <= 0.5) {
      scale = "small";
    } else if (zoom <= 0.8) {
      scale = "medium";
    }

    const isFirefox = navigator.userAgent.indexOf("Firefox") !== -1;
    if (isFirefox) {
      scale = "";
    }

    return (
      <div className="info-description" key={`shared${index}`}>
        <div className="item-row">
          <div className="channel-img" />
          <div className="channel-info-description">
            <div className="channel-info">
              <div className="channel-img">
                <a href={channelUrl} target="_blank">
                  <img src={logo} className={scale} />
                </a>
              </div>
              <span className="item-name">
                {channelUrl !== "" ? (
                  <a href={channelUrl} target="_blank" className="channel-url">
                    {channel.name}
                  </a>
                ) : (
                  channel.name
                )}
              </span>
              <span className="item-text">
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
            </div>
            <div>
              {_.get(channel, "description", "").length > 0 && (
                <div
                  className={classnames("expand-more", {
                    "no-display": this.state.showDescription
                  })}
                >
                  <ExpandMore className="expand-icon" onClick={this.getChannelDescription} />
                </div>
              )}
              <div
                className={classnames("expand-more", { "no-display": !this.state.showDescription })}
              >
                <ExpandLess className="expand-icon" onClick={this.getChannelDescription} />
              </div>
              <div className={classnames({ "no-display": !this.state.showDescription })}>
                <div
                  dangerouslySetInnerHTML={{ __html: channel.description }}
                  className="channel-summary"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default ChannelCardList;
