import React from "react";
import _ from "lodash";
import classnames from "classnames";
import { CSSTransition, TransitionGroup } from "react-transition-group";
import { FormattedMessage } from "react-intl";
import { Link } from "react-router-dom";

import ChannelSummary from "./ChannelSummary";
import ChannelCard from "./ChannelCard";
import { ADD_ONS_ID } from "constants/constants";
import EmptyMessage from "components/empty-message";
import { NAVIGATION_URLS } from "constants/URIConstants";
import { IChannelsState } from "../ChannelsReducer";
import { IChannel } from "models/Channel";
import CardTemplate from "components/page-template/card-template/CardTemplate";
import PageTemplate from "components/page-template";

import "./SuggestedChannels.scss";
import "../../../styles/global.scss";

interface IProps {
  isDetailsChanged: boolean;
  setDetailsChange: (val: boolean) => void;
  match: any;
  getSuggestedChannelsNew: any;
  statusName: string;
  channelsState: IChannelsState;
  onNext: (val: boolean) => void;
  toggleSelectedChannel: (channel: IChannel) => void;
  showStatisticsModal: (channels: IChannel[]) => void;
  campaign: any;
  addingChannel: boolean;
  selectedChannel: IChannel | null;
  isTourOpen?: boolean;
}

class SuggestedChannels extends React.PureComponent<IProps, any> {
  componentWillMount() {
    const {
      match: {
        params: { campaignId }
      },
      isDetailsChanged,
      setDetailsChange,
      getSuggestedChannelsNew,
      channelsState: { suggestedChannels, suggestedChannelsLoaded },
      campaign
    } = this.props;

    if (
      (!suggestedChannels.length && !suggestedChannelsLoaded) ||
      _.isEmpty(campaign) ||
      !campaign.id ||
      isDetailsChanged
    ) {
      if (isDetailsChanged) {
        setDetailsChange(false);
      }

      getSuggestedChannelsNew(campaignId, isDetailsChanged);
      if (suggestedChannels.length === 0) {
        getSuggestedChannelsNew(campaignId, true);
      }
      return;
    }
  }

  private renderCardItem = (channel, index) => {
    const {
      toggleSelectedChannel,
      showStatisticsModal,
      statusName,
      channelsState: { campaignChannels },
      selectedChannel
    } = this.props;

    if (selectedChannel && selectedChannel.id === channel.id) {
      return (
        <CSSTransition key={"template"} classNames="fade" timeout={300}>
          <CardTemplate key="template-card" />
        </CSSTransition>
      );
    }

    return (
      <CSSTransition key={channel.id} classNames="fade" timeout={300}>
        <ChannelCard
          key={index}
          channel={channel}
          selected={campaignChannels}
          onChannelToggle={channel => toggleSelectedChannel(channel)}
          onShowStatistics={channel => showStatisticsModal([channel])}
          readOnly={"order_new" !== statusName}
          isAddRemoveProcessing={!_.isEmpty(selectedChannel)}
        />
      </CSSTransition>
    );
  };

  private getChannelGroup = (channelList, groupName, groupId) => (
    <div key={groupId} className="channel-group">
      <h2 className="channel-type">{groupName}</h2>
      <TransitionGroup>{channelList.map(this.renderCardItem)}</TransitionGroup>
    </div>
  );

  private renderChannels = () => {
    const {
      channelsState: { suggestedChannels, campaignChannels, channelTypes }
    } = this.props;
    let channelsToShow = _.chain(suggestedChannels)
      .unionBy(campaignChannels, "id")
      .orderBy(channel => _.get(channel, "suggestionScore", 0), "desc")
      .value();

    const selectedChannels = campaignChannels.filter(
      (channel: IChannel) => channel.channelType !== ADD_ONS_ID
    );

    channelsToShow = _.filter(
      channelsToShow,
      channel =>
        !campaignChannels.some(({ name }) => name === channel.name) &&
        channel.channelType !== ADD_ONS_ID
    );

    const result: any = [];

    if (selectedChannels.length) {
      result.push(
        this.getChannelGroup(selectedChannels, <FormattedMessage id="SELECTED" />, "SELECTED")
      );
    }

    const groupedChannels = _.groupBy(channelsToShow, "channelType");
    let newGroupedChannels: any = [];
    if (Object.keys(groupedChannels).includes("18")) {
      const { "18": nicheJobBoards, ...restGroups } = groupedChannels;
      newGroupedChannels = [{ key: "18", channels: nicheJobBoards }].concat(
        Object.keys(restGroups).map(key => ({ key, channels: groupedChannels[key] }))
      );
    } else {
      newGroupedChannels = Object.keys(groupedChannels).map(key => ({
        key,
        channels: groupedChannels[key]
      }));
    }

    newGroupedChannels.map(({ key, channels }) => {
      const group = _.find(channelTypes, type => type.id === key);
      if (group) {
        result.push(this.getChannelGroup(channels, group.name, key));
      }
    });

    return result;
  };

  private renderEmptyText = () => {
    const { campaign } = this.props;

    const { CAMPAIGN_CHANNELS, ALL_CHANNELS } = NAVIGATION_URLS;
    const { id } = campaign;
    const values = {
      link: (
        <Link to={`${CAMPAIGN_CHANNELS}/${id}${ALL_CHANNELS}`}>
          <FormattedMessage id="ALL_CHANNELS" />
        </Link>
      )
    };
    return (
      <EmptyMessage>
        <div>
          <FormattedMessage id="SUGGESTED_CHANNELS_EMPTY" />
        </div>
        <div>
          <FormattedMessage id="SUGGESTED_CHANNELS_EMPTY_WITH_LINK" values={values} />
        </div>
      </EmptyMessage>
    );
  };

  private renderPageTemplate = () => {
    return (
      <div className="channel-group">
        <h2 className="channel-type">
          <FormattedMessage id="SELECTED" />
        </h2>
        <PageTemplate page={NAVIGATION_URLS.CAMPAIGN_CHANNELS} />
      </div>
    );
  };

  private hasChannels = () => {
    const {
      channelsState: { suggestedChannels, campaignChannels }
    } = this.props;
    const selectedChannels = campaignChannels.filter(
      ({ channelType }) => channelType !== ADD_ONS_ID
    );
    return (
      (suggestedChannels && suggestedChannels.length > 0) ||
      (selectedChannels && selectedChannels.length > 0)
    );
  };

  private initSummaryChannels = () => {
    const {
      channelsState: { campaignChannels },
      campaign
    } = this.props;
    if (!_.isEmpty(campaignChannels)) {
      const defaultAddOn = {
        addedToCampaign: false,
        channelType: ADD_ONS_ID,
        days: "0.00",
        description:
          "We will perform our default checks on your vacancy text.<br />, This service is included in all campaigns.",
        educations: "",
        id: 4863,
        logo: "920805",
        name: "Default vacancy text check",
        postingUrl: null,
        price: 0,
        regions: [0],
        sectors: "",
        statistics: { estimatedClicks: null, rating: null, visitorsPerDay: Array(0) },
        suggestionScore: null
      };
      const { visitedBreadcrumbs: visited } = JSON.parse(campaign.campaignState || "{}");

      const hasAddOns = visited && visited["/campaign-add-ons"];

      return hasAddOns ? _.unionBy([defaultAddOn], campaignChannels, "id") : campaignChannels;
    }

    return [];
  };

  render() {
    const {
      statusName,
      onNext,
      toggleSelectedChannel,
      showStatisticsModal,
      campaign,
      addingChannel,
      selectedChannel,
      isTourOpen,
      channelsState: { suggestedChannelsIsLoading, isLoading }
    } = this.props;
    const summaryChannels = this.initSummaryChannels();
    const scrollClass = isTourOpen ? "tour-scroll" : "";
    return (
      <div id="suggested-channel">
        <div className={classnames("channel-list")}>
          <div className={scrollClass}>
            <div className="channel-list">
              {isLoading || suggestedChannelsIsLoading
                ? this.renderPageTemplate()
                : this.hasChannels()
                ? this.renderChannels()
                : this.renderEmptyText()}
            </div>
          </div>
        </div>
        <ChannelSummary
          title="SELECTED_CHANNELS_AND_ADD_ONS"
          nextButtonText="NEXT"
          onNext={() => onNext("order_new" !== statusName)}
          onRemove={channel => toggleSelectedChannel(channel)}
          onShowStatistics={() => showStatisticsModal(summaryChannels)}
          readOnly={"order_new" !== statusName}
          selected={summaryChannels}
          campaign={campaign}
          selectedChannel={selectedChannel}
          addingChannel={addingChannel}
          isLoading={suggestedChannelsIsLoading || isLoading}
        />
      </div>
    );
  }
}

export default SuggestedChannels;
