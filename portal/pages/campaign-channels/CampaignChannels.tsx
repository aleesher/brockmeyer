import React from "react";
import _ from "lodash";
import { getFormValues } from "redux-form";
import { NavLink, Route, Switch, Redirect } from "react-router-dom";
import { FormattedMessage, injectIntl } from "react-intl";
import { compose } from "recompose";

import ChannelsActions from "./ChannelsActions";
import ChannelStatistics from "./partial/ChannelStatistics";
import SuggestedChannels from "./partial/SuggestedChannels";
import AllChannels from "./partial/AllChannels";
import { NAVIGATION_URLS, CAMPAIGN_ID_PARAMETER } from "constants/URIConstants";
import { connect, campaignForm } from "../../reduxConnector";
import { IChannel } from "models/Channel";
import { IChannelsState, IChannelFilters } from "./ChannelsReducer";
import { PageLayout } from "components/.";
import { SOCIAL_MEDIA_ID, BANNERS_ID, CHANNEL_SORT } from "constants/constants";
import { filterAddons, redirect, getStatusName } from "helpers/common";
import CampaignOverviewActions from "../campaigns/CampaignOverviewActions";
import { STEPS_CAMPAIGN_CHANNELS } from "constants/constants";

import "./CampaignChannels.scss";

interface IProps {
  campaignWizard: any;
  channelFilters: IChannelFilters;
  channelsState: IChannelsState;
  history: any;
  isLoading: boolean;
  isDetailsChanged: boolean;
  getChannelFilters: (name?: string, filters?: any) => void;
  getChannels: (search?: string, filters?: any, sort?: string, page?: number) => void;
  getSuggestedChannels: (id?: number, isNew?: boolean) => void;
  change: (string, any) => void;
  updateCampaignChannels: (
    id: number,
    selected: IChannel[],
    redirectUrl: string,
    campaignChanged?: object
  ) => void;
  setDetailsChange: (isDetailsChanged: boolean) => void;
  match: any;
  location: any;
  getChannelTypes: () => void;
  getSuggestedChannelsNew: (id?: number, isNew?: boolean, name?: string, filters?: any) => void;
  getAllChannels: (id?: number, isNew?: boolean, name?: string, filters?: any) => void;
  isLoaded: boolean;
  removeCampaignChannel: (campaignId, channelId, campaignChannels, campaign) => void;
  addCampaignChannel: (campaignId, channelId, campaignChannels, campaign) => void;
  status: any;
  addingChannel: boolean;
  isRemovingChannel: boolean;
  isChannelAdded: boolean;
  isChannelRemoved: boolean;
  setInitAddRemoveState: () => void;
  isTourOpen: boolean;
  closeTour: () => void;
}

interface IState {
  filters: any;
  page: number;
  search: string;
  sort: string;
  selected: IChannel[];
  statisticsChannels: IChannel[];
  selectedChannel: IChannel | null;
  isMobile: boolean;
}

class CampaignChannels extends React.Component<IProps, IState> {
  private fetch;

  constructor(props) {
    super(props);

    this.state = {
      selected: [],
      statisticsChannels: [],
      filters: {},
      search: "",
      sort: CHANNEL_SORT.A_Z,
      page: 1,
      selectedChannel: null,
      isMobile: window.innerWidth < 1200
    };
  }

  componentWillReceiveProps(nextProps) {
    const {
      channelsState: { allChannelsLoaded },
      campaignWizard,
      addingChannel,
      isRemovingChannel,
      isChannelRemoved,
      isChannelAdded,
      setInitAddRemoveState
    } = nextProps;

    if (allChannelsLoaded && !this.props.channelsState.allChannelsLoaded) {
      const { educations = [], regions = [], sector = [] } = campaignWizard;
      this.setState(() => ({
        filters: {
          educations: educations.map(id => +id),
          regions: regions.map(id => +id),
          sectors: sector.map(id => +id)
        }
      }));
    }

    if (
      (addingChannel === false && isChannelAdded === true) ||
      (isRemovingChannel === false && isChannelRemoved === true)
    ) {
      setInitAddRemoveState();
      this.setState({
        selectedChannel: null
      });
    }
  }

  private initFilters = campaignWizard => {
    const { educations = [], regions = [], sector = [] } = campaignWizard;
    this.setState(
      {
        filters: {
          educations: educations.map(id => +id),
          regions: regions.map(id => +id),
          sectors: sector.map(id => +id)
        }
      },
      this.fetchData
    );
  };

  private initAllChannels = id => {
    const { getAllChannels } = this.props;
    getAllChannels(id);
  };

  private fetchData = () => {
    if (!this.fetch) {
      this.fetch = _.debounce(() => {
        const { getChannels, getChannelFilters } = this.props;
        const { search, filters, sort, page } = this.state;
        getChannels(search, filters, sort, page);
        getChannelFilters(search, filters);
      }, 500);
    }
    this.fetch();
  };

  private toggleSelectedChannel = channel => {
    const { selectedChannel } = this.state;
    if (_.isEmpty(selectedChannel)) {
      const {
        campaignWizard,
        addCampaignChannel,
        channelsState: { campaignChannels },
        removeCampaignChannel
      } = this.props;
      const isExist = campaignChannels.some(({ id }) => id === channel.id);
      this.setState(
        {
          selectedChannel: channel
        },
        () => {
          isExist
            ? removeCampaignChannel(campaignWizard.id, channel.id, campaignChannels, campaignWizard)
            : addCampaignChannel(campaignWizard.id, channel, campaignChannels, campaignWizard);
        }
      );
    }
  };

  private showStatisticsModal = (channels: IChannel[]) => {
    if (channels && channels.length) {
      this.setState({ statisticsChannels: filterAddons(channels) });
    }
  };

  private onFilterChange = (key, ids) => {
    this.setState(
      prev => ({
        filters: { ...prev.filters, [key]: ids },
        page: 1
      }),
      this.fetchData
    );
  };

  private getMoreData = () => {
    this.setState(prev => ({ page: prev.page + 1 }), this.fetchData);
  };

  private onSearch = ({ field, value }) => {
    this.setState({ [field]: value, page: 1 }, this.fetchData);
  };

  private onNext = () => {
    const {
      history,
      match: {
        params: { campaignId }
      },
      channelsState: { suggestedChannels, campaignChannels: selectedChannels },
      updateCampaignChannels,
      campaignWizard
    } = this.props;
    const { isMobile } = this.state;

    const { CAMPAIGN_SOCIAL_MEDIA, CAMPAIGN_BANNERS, CAMPAIGN_ADD_ONS } = NAVIGATION_URLS;
    const hasSocialMedia = selectedChannels.some(
      ({ channelType, name }) => channelType === SOCIAL_MEDIA_ID && name.indexOf("Facebook") > -1
    );
    const hasBanners = selectedChannels.some(({ channelType }) => channelType === BANNERS_ID);
    const redirectUrl =
      hasSocialMedia && !isMobile
        ? CAMPAIGN_SOCIAL_MEDIA
        : hasBanners && !isMobile
        ? CAMPAIGN_BANNERS
        : CAMPAIGN_ADD_ONS;

    !suggestedChannels.length
      ? updateCampaignChannels(campaignWizard.id, selectedChannels, redirectUrl)
      : redirect(history)(redirectUrl, campaignId);
  };

  render() {
    const { statisticsChannels, filters, search, selectedChannel, page } = this.state;
    const {
      campaignWizard,
      isLoading,
      channelFilters,
      channelsState: { noMoreData, allChannelsLoaded, suggestedChannelsLoaded, campaignChannels },
      isDetailsChanged,
      setDetailsChange,
      getSuggestedChannelsNew,
      channelsState,
      status,
      addingChannel,
      isTourOpen,
      match: {
        params: { campaignId }
      },
      location
    } = this.props;
    const statusName = getStatusName(status);

    return (
      <div id="campaign-channels">
        <PageLayout
          page={NAVIGATION_URLS.CAMPAIGN_CHANNELS}
          campaignHeader={{ breadcrumbStep: NAVIGATION_URLS.CAMPAIGN_CHANNELS }}
          cWizard={campaignWizard}
          isLoading={!(allChannelsLoaded || suggestedChannelsLoaded) && isLoading}
          pageTour={NAVIGATION_URLS.CAMPAIGN_CHANNELS}
          tourSteps={STEPS_CAMPAIGN_CHANNELS(
            addingChannel,
            campaignChannels.length > 0,
            location.pathname.endsWith("suggested")
          )}
        >
          <ChannelStatistics
            channels={statisticsChannels}
            visible={statisticsChannels.length > 0}
            onClose={() => this.setState({ statisticsChannels: [] })}
          />

          <div className="campaign-channels-tab">
            <NavLink
              className="menu-item"
              to={`${NAVIGATION_URLS.CAMPAIGN_CHANNELS +
                "/" +
                campaignId +
                NAVIGATION_URLS.SUGGESTED_CHANNELS}`}
            >
              <FormattedMessage id="SUGGESTED_CHANNELS" />
            </NavLink>
            <NavLink
              className="menu-item"
              to={`${NAVIGATION_URLS.CAMPAIGN_CHANNELS +
                "/" +
                campaignId +
                NAVIGATION_URLS.ALL_CHANNELS}`}
            >
              <FormattedMessage id="ALL_CHANNELS" />
            </NavLink>
          </div>

          <div className="channel-container">
            <Switch>
              <Route
                path={
                  NAVIGATION_URLS.CAMPAIGN_CHANNELS +
                  CAMPAIGN_ID_PARAMETER +
                  NAVIGATION_URLS.SUGGESTED_CHANNELS
                }
                render={props => {
                  return (
                    <SuggestedChannels
                      {...props}
                      statusName={statusName}
                      channelsState={this.props.channelsState}
                      onNext={this.onNext}
                      toggleSelectedChannel={this.toggleSelectedChannel}
                      showStatisticsModal={this.showStatisticsModal}
                      campaign={campaignWizard}
                      isDetailsChanged={isDetailsChanged}
                      setDetailsChange={setDetailsChange}
                      getSuggestedChannelsNew={getSuggestedChannelsNew}
                      addingChannel={addingChannel}
                      selectedChannel={selectedChannel}
                      isTourOpen={isTourOpen}
                    />
                  );
                }}
              />
              <Route
                path={
                  NAVIGATION_URLS.CAMPAIGN_CHANNELS +
                  CAMPAIGN_ID_PARAMETER +
                  NAVIGATION_URLS.ALL_CHANNELS
                }
                render={props => {
                  return (
                    <AllChannels
                      {...props}
                      statusName={statusName}
                      showLoadMore={!noMoreData && !(page === 1 && !allChannelsLoaded)}
                      onSearch={this.onSearch}
                      filters={filters}
                      search={search}
                      channelsState={channelsState}
                      onFilterChange={this.onFilterChange}
                      channelFilters={channelFilters}
                      onNext={this.onNext}
                      toggleSelectedChannel={this.toggleSelectedChannel}
                      showStatisticsModal={this.showStatisticsModal}
                      getMoreData={this.getMoreData}
                      campaign={campaignWizard}
                      initFilters={this.initFilters}
                      initAllChannels={this.initAllChannels}
                      addingChannel={addingChannel}
                      selectedChannel={selectedChannel}
                      isTourOpen={isTourOpen}
                      page={page}
                    />
                  );
                }}
              />
              <Redirect
                to={
                  NAVIGATION_URLS.CAMPAIGN_CHANNELS +
                  CAMPAIGN_ID_PARAMETER +
                  NAVIGATION_URLS.SUGGESTED_CHANNELS
                }
              />
            </Switch>
          </div>
        </PageLayout>
      </div>
    );
  }
}

export default compose(
  injectIntl,
  campaignForm(),
  connect(
    state => ({
      campaignWizard: getFormValues("campaignWizard")(state) || {},
      channelFilters: state.channels.channelFilters,
      channelsState: state.channels,
      isLoading:
        state.campaigns.isLoading ||
        state.channels.isLoading ||
        state.channels.suggestedChannelsIsLoading ||
        state.channels.channelFiltersIsLoading,
      suggestedChannelsLoaded: state.channels.suggestedChannelsLoaded,
      isDetailsChanged: state.campaigns.isDetailsChanged,
      allChannelsLoaded: state.channels.allChannelsLoaded,
      status: state.campaigns.campaignStatus,
      addingChannel: state.channels.addingChannel,
      isRemovingChannel: state.channels.isRemovingChannel,
      isChannelAdded: state.channels.isChannelAdded,
      isChannelRemoved: state.channels.isChannelRemoved,
      isTourOpen: state.global.isTourOpen
    }),
    {
      getChannelFilters: ChannelsActions.getChannelFilters,
      getChannels: ChannelsActions.getChannels,
      updateCampaignChannels: ChannelsActions.updateCampaignChannels,
      getSuggestedChannels: ChannelsActions.getSuggestedChannels,
      setDetailsChange: CampaignOverviewActions.setDetailsChange,
      getChannelTypes: ChannelsActions.getChannelTypes,
      getSuggestedChannelsNew: ChannelsActions.getSuggestedChannelsNew,
      getAllChannels: ChannelsActions.getAllChannels,
      removeCampaignChannel: ChannelsActions.removeCampaignChannel,
      addCampaignChannel: ChannelsActions.addCampaignChannel,
      setInitAddRemoveState: ChannelsActions.setInitAddRemoveState
    }
  )
)(CampaignChannels);
