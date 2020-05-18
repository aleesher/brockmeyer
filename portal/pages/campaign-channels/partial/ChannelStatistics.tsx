import React from "react";
import classNames from "classnames";
import { FormattedMessage, injectIntl } from "react-intl";
import _ from "lodash";

import { KeyboardArrowDown, KeyboardArrowUp } from "components/icons";
import StarRating from "components/star-rating/StarRating";
import URIConstants from "constants/URIConstants";
import { IChannel } from "models/Channel";
import ModalTemplate from "components/modals/ModalTemplate";

import "./ChannelStatistics.scss";

interface IProps {
  channels: IChannel[];
  intl: any;
  onClose: () => void;
  visible: boolean;
}

interface IState {
  selectedChannelIndexes: number[];
}

const initialState: IState = {
  selectedChannelIndexes: []
};

class ChannelStatistics extends React.Component<IProps, IState> {
  constructor(props) {
    super(props);

    this.state = {
      selectedChannelIndexes: props.channels.length === 1 ? [0] : []
    };
  }

  componentWillReceiveProps(newProps) {
    if (
      newProps.channels &&
      newProps.channels.length === 1 &&
      this.state.selectedChannelIndexes !== [0]
    ) {
      this.setState({ selectedChannelIndexes: [0] });
    }
  }

  private getBarHeight = maxVisitorsPerDay => dailyAverage => {
    const height = (dailyAverage / maxVisitorsPerDay) * 100;
    return `calc(${height}% - 24px)`;
  };

  private renderChannel = (channel, index) => {
    const {
      intl: { formatMessage }
    } = this.props;
    const maxVisitorsPerDay = Math.max(...channel.statistics.visitorsPerDay);
    const totalVisits = _.get(channel, "statistics.visitorsPerDay", []).reduce((a, b) => a + b, 0);
    const totalDays = _.get(channel, "statistics.visitorsPerDay", []).length;
    const averageVisitsPerDay = !!totalDays ? totalVisits / totalDays : 0;
    const currentChannelIsSelected = this.state.selectedChannelIndexes.indexOf(index) > -1;
    const getBarHeight = this.getBarHeight(maxVisitorsPerDay);
    const toogleStats = currentChannelIsSelected ? "LESS_STATS" : "MORE_STATS";
    const weekdays = formatMessage({ id: "WEEKDAYS_SHORT" }).split(", ");

    return (
      <div key={channel.id} className="channel-column">
        <div className="channel-data">
          <div className="logo-container">
            <img src={URIConstants.REMOTE_RESOURCES_URI + channel.logo} />
          </div>
          <div className="channel-statistics">
            <div className="channel-statistics-row">
              <div className="label-container">
                <FormattedMessage id="CAMPAIGN_EXPECTED_RESULT_SHORT" />
              </div>
              <div className="value-container">{channel.statistics.estimatedClicks || "-"}</div>
            </div>

            {channel.statistics.rating && (
              <div className="channel-statistics-row">
                <div className="label-container">
                  <FormattedMessage id="BROCKMEYER_RATING" />
                </div>
                <div className="value-container">
                  <StarRating valueInPercent={channel.statistics.rating} />
                </div>
              </div>
            )}

            {channel.suggestionScore && (
              <div className="channel-statistics-row">
                <div className="label-container">
                  <FormattedMessage id="MATCHING_SCORE" />
                </div>
                <div className="value-container">
                  {`${Math.round(channel.suggestionScore * 100)}%`}
                </div>
              </div>
            )}
          </div>
        </div>

        <div
          className="show-statistics-button-container"
          onClick={() => this.toggleSelectedChannel(index)}
        >
          <FormattedMessage id={toogleStats} tagName="p" />
          {currentChannelIsSelected ? <KeyboardArrowUp /> : <KeyboardArrowDown />}
        </div>

        <div
          className={classNames("statistics-hide-container", {
            open: currentChannelIsSelected
          })}
        >
          {currentChannelIsSelected && (
            <div className="weekly-statistics-container">
              <p className="weekly-disclaimer">
                <FormattedMessage id="WEEKLY_DISCLAIMER" />
              </p>
              <p className="weekly-header">
                <FormattedMessage id="AVERAGE_VISITORS_PER_DAY" />
              </p>
              <div className="weekly-statistics">
                {_.get(channel, "statistics.visitorsPerDay", []).map((dailyAverage, index) => (
                  <div key={index} className="weekly-statistics-column">
                    <p>{Math.round(dailyAverage)}</p>
                    <div className="diagram-bar" style={{ height: getBarHeight(dailyAverage) }}>
                      <div />
                    </div>
                  </div>
                ))}
                {!!totalDays && (
                  <div
                    className="average-line"
                    style={{ bottom: getBarHeight(averageVisitsPerDay) }}
                  >
                    <div className="tag">
                      <div />
                      <p>
                        {Math.round(averageVisitsPerDay)} {formatMessage({ id: "AVG" })}
                      </p>
                    </div>
                  </div>
                )}
              </div>
              <div className="weekdays-labels">
                {weekdays.map(weekday => (
                  <p key={weekday}>{weekday}</p>
                ))}
              </div>
            </div>
          )}
        </div>
        <hr className="delimiter" />
      </div>
    );
  };

  private onClose() {
    this.setState(initialState);
    this.props.onClose();
  }

  private toggleSelectedChannel(channelIndex) {
    const selectedChannelIndexes = this.state.selectedChannelIndexes;
    if (selectedChannelIndexes.indexOf(channelIndex) > -1) {
      selectedChannelIndexes.splice(selectedChannelIndexes.indexOf(channelIndex), 1);
    } else {
      selectedChannelIndexes.push(channelIndex);
    }
    this.setState({ selectedChannelIndexes });
  }

  render() {
    const { visible, channels } = this.props;
    return (
      <ModalTemplate open={visible} onClose={() => this.onClose()}>
        <div id="channel-statistics">
          <div className="header">
            <FormattedMessage id="CAMPAIGN_EXPECTED_RESULT" />
          </div>
          <div className="disclaimer-container">
            <FormattedMessage id="MODAL_DISCLAIMER" />
          </div>
          {channels.map(this.renderChannel)}
        </div>
      </ModalTemplate>
    );
  }
}

export default injectIntl(ChannelStatistics);
