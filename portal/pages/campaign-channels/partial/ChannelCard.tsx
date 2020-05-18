import React from "react";
import classNames from "classnames";
import Switch from "react-switch";
import { FormattedMessage, injectIntl } from "react-intl";
import _ from "lodash";

import StarRating from "components/star-rating/StarRating";
import URLS from "constants/URIConstants";
import { formatPrice } from "helpers/common";
import Tooltip from "components/tooltip";
import { DEFAULT_CHANNEL_LOGO } from "constants/constants";
import { ExpandMore, ExpandLess } from "components/icons";
import { ThemeConsumer } from "constants/themes/theme-context";

import "./ChannelCard.scss";

interface IProps {
  channel: any;
  selected: any;
  intl: any;
  readOnly: boolean;
  disabled: boolean;
  buttonText?: string;
  onShowStatistics?: (channel) => void;
  onChannelToggle?: (channel) => void;
  isAddRemoveProcessing?: any;
  view?: string;
  color?: string;
}

interface IState {
  showDescription: boolean;
}

class ChannelCard extends React.Component<IProps, IState> {
  constructor(props: any) {
    super(props);

    this.state = {
      showDescription: false
    };
  }

  private getChannelDescription = () => {
    this.setState({ showDescription: !this.state.showDescription });
  };

  private calculateSuggestionScore = () => {
    const { channel } = this.props;

    return Math.round(channel.suggestionScore * 100);
  };

  render() {
    const {
      channel,
      selected,
      onShowStatistics = () => null,
      onChannelToggle = () => null,
      buttonText,
      readOnly,
      disabled,
      intl: { formatMessage },
      isAddRemoveProcessing,
      view,
      color
    } = this.props;

    const channelIsSelected = selected.some(({ name }) => name === channel.name);
    const selectedText = channelIsSelected ? "CARD_SELECTED" : "CARD_SELECT";

    const logo = channel.logo ? URLS.REMOTE_RESOURCES_URI + channel.logo : DEFAULT_CHANNEL_LOGO;
    const css = isAddRemoveProcessing ? "processing" : "";

    return (
      <ThemeConsumer>
        {theme => {
          const borderColor = color ? color : theme.primary_color;
          return (
            <div
              className={classNames("channel-item", "card", {
                "tile-view": view === "tile"
              })}
              style={{ borderColor: channelIsSelected ? borderColor : "transparent" }}
            >
              <div className="channel-info">
                <div className="channel-logo">
                  <img src={logo} />
                </div>
                <div className="channel-description">
                  <h2>{channel.name}</h2>
                  <p className="summary">
                    {channel.days &&
                      `${Math.round(channel.days)} ${formatMessage({ id: "DAYS" })} - `}
                    &euro;{formatPrice(channel.price)}
                    {channel.statistics.estimatedClicks &&
                      ` - ${channel.statistics.estimatedClicks} ${formatMessage({
                        id: "EST_CLICKS"
                      })}`}
                  </p>

                  {channel.suggestionScore ? (
                    <div className="rating suggestion-score">
                      <p className="label">
                        <FormattedMessage id="MATCHING_SCORE" />
                      </p>
                      <div style={{ color: theme.primary_color }}>
                        {`${this.calculateSuggestionScore()}%`}
                      </div>
                      <Tooltip id="MATCHING_SCORE_INFO" />
                    </div>
                  ) : (
                    <div className="rating">
                      <StarRating valueInPercent={channel.statistics.rating} />
                      <Tooltip id="CHANNEL_RANKING_INFO" classname="tooltip-overlap" />
                    </div>
                  )}

                  <p className="links">
                    <a onClick={() => onShowStatistics(channel)}>
                      <FormattedMessage id={buttonText || "VIEW_STATISTICS"} />
                    </a>
                  </p>
                </div>

                {!readOnly && (
                  <div className={classNames("channel-selector", css)}>
                    <label>
                      <FormattedMessage id={selectedText} />
                    </label>
                    <Switch
                      onChange={() => onChannelToggle(channel)}
                      disabled={!(!disabled && _.isEmpty(css))}
                      checked={channelIsSelected}
                      onColor={borderColor}
                      uncheckedIcon={false}
                      checkedIcon={false}
                    />
                  </div>
                )}
              </div>
              {channel.description.length > 0 && (
                <div
                  className={classNames("expand-more", {
                    "no-display": this.state.showDescription
                  })}
                >
                  <ExpandMore className="expand-icon" onClick={this.getChannelDescription} />
                </div>
              )}
              <div
                className={classNames("expand-more", { "no-display": !this.state.showDescription })}
              >
                <ExpandLess className="expand-icon" onClick={this.getChannelDescription} />
              </div>
              <div className={classNames({ "no-display": !this.state.showDescription })}>
                <div
                  dangerouslySetInnerHTML={{ __html: channel.description }}
                  className="channel-summary"
                />
              </div>
            </div>
          );
        }}
      </ThemeConsumer>
    );
  }
}

export default injectIntl(ChannelCard);
