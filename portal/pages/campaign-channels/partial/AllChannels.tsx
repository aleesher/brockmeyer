import React from "react";
import _ from "lodash";
import { CSSTransition, TransitionGroup } from "react-transition-group";
import { FormattedMessage } from "react-intl";
import classnames from "classnames";

import { FiltersBar } from "components/.";
import Filters from "./Filters";
import Button from "components/button/Button";
import ChannelCard from "./ChannelCard";
import ChannelSummary from "./ChannelSummary";
import { CHANNEL_SORT, ADD_ONS_ID } from "constants/constants";
import EmptyMessage from "components/empty-message";
import { IChannelsState, IChannelFilters } from "../ChannelsReducer";
import { IChannel } from "models/Channel";
import CardTemplate from "components/page-template/card-template/CardTemplate";
import PageTemplate from "components/page-template";
import { NAVIGATION_URLS } from "constants/URIConstants";

import "./AllChannels.scss";
import "../../../styles/global.scss";

interface IProps {
  statusName: string;
  showLoadMore: boolean;
  onSearch: (any) => void;
  filters: any;
  match: any;
  initFilters: (campaign) => void;
  channelsState: IChannelsState;
  onNext: (val: boolean) => void;
  toggleSelectedChannel: (channel: IChannel) => void;
  showStatisticsModal: (channels: IChannel[]) => void;
  campaign: any;
  search: string;
  channelFilters: IChannelFilters;
  onFilterChange: (key, ids) => void;
  getMoreData: () => void;
  initAllChannels: (id) => void;
  addingChannel: boolean;
  selectedChannel: IChannel | null;
  isTourOpen?: boolean;
  page?: number;
}

interface IState {
  showFilters: boolean;
  isMobile: boolean;
  view: string;
}

class AllChannels extends React.PureComponent<IProps, IState> {
  constructor(props) {
    super(props);

    this.state = {
      showFilters: false,
      isMobile: window.innerWidth < 1200,
      view: "card"
    };
  }

  componentWillMount() {
    const {
      match: {
        params: { campaignId }
      },
      initAllChannels,
      campaign,
      initFilters,
      channelsState: { channelFilters, allChannelsIsLoading },
      search
    } = this.props;

    if (_.isEmpty(campaign) || allChannelsIsLoading) {
      initAllChannels(campaignId);
    } else {
      if ((this.isChannelsListEmpty() || _.isEmpty(channelFilters)) && _.isEmpty(search)) {
        initFilters(campaign);
      }
    }

    window.addEventListener("resize", this.handleWindowResize);
  }

  componentWillUnmount() {
    window.removeEventListener("resize", this.handleWindowResize);
  }

  private handleWindowResize = () => {
    this.setState({ isMobile: window.innerWidth < 1200 });
  };

  private renderCardItem = (channel, index) => {
    const {
      toggleSelectedChannel,
      showStatisticsModal,
      statusName,
      channelsState: { campaignChannels },
      selectedChannel
    } = this.props;
    const { view } = this.state;

    if (selectedChannel && selectedChannel.id === channel.id) {
      return (
        <CSSTransition key={channel.id} classNames="fade" timeout={300}>
          <CardTemplate className={view} />
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
          view={view}
        />
      </CSSTransition>
    );
  };

  private renderEmptyMessage = () => (
    <EmptyMessage>
      <FormattedMessage id="CHANNELS_NO_DATA" />
    </EmptyMessage>
  );

  private renderPageTemplate = className => {
    return <PageTemplate page={NAVIGATION_URLS.CAMPAIGN_CHANNELS} className={className} />;
  };

  private renderChannels = () => {
    const {
      channelsState: { channelItems, campaignChannels, isLoading, allChannelsIsLoading },
      page
    } = this.props;
    const { view } = this.state;

    const { showFilters } = this.state;

    const channelsList = _.differenceBy(channelItems, campaignChannels, "id");
    const firstLoading = isLoading && page === 1;

    return (
      <div
        className={classnames(
          "channel-group",
          { "tile-group": view === "tile" },
          { "hide-channel-group": showFilters }
        )}
      >
        <h2 className="channel-type">
          <FormattedMessage id="SEARCH_RESULTS" />
        </h2>

        {allChannelsIsLoading || firstLoading ? (
          this.renderPageTemplate({ "tile-group": view === "tile" })
        ) : _.isEmpty(channelsList) ? (
          this.renderEmptyMessage()
        ) : (
          <TransitionGroup>{channelsList.map(this.renderCardItem)}</TransitionGroup>
        )}
      </div>
    );
  };

  private isChannelsListEmpty = () => {
    const {
      channelsState: { channelItems }
    } = this.props;
    const channels = channelItems.filter(channel => channel.channelType !== ADD_ONS_ID);
    return _.isEmpty(channels);
  };

  private initSummaryChannels = () => {
    const {
      channelsState: { campaignChannels }
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
      const hasAddons = campaignChannels.findIndex(channel => channel.channelType === ADD_ONS_ID);
      return hasAddons !== -1
        ? _.unionBy([defaultAddOn], campaignChannels, "id")
        : campaignChannels;
    }

    return [];
  };

  private handleShowFilters = () => this.setState({ showFilters: !this.state.showFilters });
  private handleToggleView = (view: string) => this.setState({ view });

  render() {
    const {
      statusName,
      showLoadMore,
      channelsState: { campaignChannels, allChannelsIsLoading, isLoading },
      onSearch,
      onFilterChange,
      channelFilters,
      toggleSelectedChannel,
      showStatisticsModal,
      onNext,
      getMoreData,
      filters,
      search,
      campaign,
      selectedChannel,
      addingChannel,
      isTourOpen
    } = this.props;
    const { showFilters, isMobile, view } = this.state;

    const selectors = [
      {
        key: "sort",
        label: "SORT",
        options: [
          { label: "A_Z", value: CHANNEL_SORT.A_Z },
          { label: "Z_A", value: CHANNEL_SORT.Z_A },
          { label: "RANKING_DESC", value: CHANNEL_SORT.RANKING }
        ]
      }
    ];

    const summaryChannels = this.initSummaryChannels();
    const scrollClass = isTourOpen ? "tour-scroll" : "";
    return (
      <div id="all-channels">
        {!isMobile && (
          <Filters
            filters={channelFilters}
            onChange={onFilterChange}
            initialValue={filters}
            show={showFilters}
            isLoading={allChannelsIsLoading || isLoading}
          />
        )}
        <div className="result-container">
          <FiltersBar
            search={search}
            searchPlaceholder="CHANNEL_SEARCH_PLACEHOLDER"
            selectors={selectors}
            onChange={onSearch}
            className="channels-bar all-channels"
            showFiltersButton
            onChangeShowFilters={this.handleShowFilters}
            showFilters={showFilters}
            onToggleView={this.handleToggleView}
            view={view}
          />
          {isMobile && (
            <Filters
              filters={channelFilters}
              onChange={onFilterChange}
              initialValue={filters}
              show={showFilters}
            />
          )}
          <div className={scrollClass}>{this.renderChannels()}</div>

          <div className="footer">
            <Button
              onClick={getMoreData}
              loading={allChannelsIsLoading || isLoading}
              loadingText="DATA_LOADING"
              visible={showLoadMore}
              btnColorType="primary"
            >
              LOAD_MORE_DATA
            </Button>
          </div>
        </div>

        <ChannelSummary
          title="SELECTED_CHANNELS_AND_ADD_ONS"
          nextButtonText="NEXT"
          onNext={() => onNext("order_new" !== statusName)}
          onRemove={channel => toggleSelectedChannel(channel)}
          onShowStatistics={() => showStatisticsModal(campaignChannels)}
          readOnly={"order_new" !== statusName}
          selected={summaryChannels}
          campaign={campaign}
          selectedChannel={selectedChannel}
          addingChannel={addingChannel}
          isLoading={allChannelsIsLoading || isLoading}
        />
      </div>
    );
  }
}

export default AllChannels;
