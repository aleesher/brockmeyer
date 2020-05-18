import React from "react";
import _ from "lodash";
import classnames from "classnames";
import { CSSTransition, TransitionGroup } from "react-transition-group";
import { FormattedMessage } from "react-intl";
import { initialize } from "redux-form";

import AddNewCampaign from "../campaigns/partial/AddNewCampaign";
import Button from "components/button/Button";
import ChannelCard from "./partial/ChannelCard";
import ChannelsActions from "./ChannelsActions";
import ChannelStatistics from "./partial/ChannelStatistics";
import ChannelSummary from "./partial/ChannelSummary";
import Filters from "./partial/Filters";
import { connect } from "../../reduxConnector";
import { IChannel } from "../../models/Channel";
import { IChannelsState, IChannelFilters } from "./ChannelsReducer";
import ModalTemplate from "components/modals/ModalTemplate";
import { NAVIGATION_URLS } from "constants/URIConstants";
import { CHANNEL_SORT } from "constants/constants";
import { filterAddons, redirect } from "helpers/common";
import { PageLayout, FiltersBar } from "components/.";
import EmptyMessage from "components/empty-message";
import PageTemplate from "components/page-template";

import "./Channels.scss";

const selectors = [
  {
    key: "sort",
    label: "SORT",
    options: [
      { label: "A_Z", value: CHANNEL_SORT.A_Z },
      { label: "Z_A", value: CHANNEL_SORT.Z_A },
      { label: "RANKING_DESC", value: CHANNEL_SORT.RANKING }
    ],
    defaultValue: CHANNEL_SORT.A_Z
  }
];

interface IProps {
  campaignWizard: any;
  channelFilters: IChannelFilters;
  history: any;
  channels: IChannelsState;
  isLoading: boolean;
  getChannelFilters: (name?: string, filters?: any) => void;
  getChannels: (search?: string, filters?: any, sort?: string, page?: number) => void;
  initializeForm: (any) => void;
  resetFilters: () => void;
}

interface IState {
  filters: any;
  page: number;
  search: string;
  sort: string;
  selectedSort: any;
  selected: IChannel[];
  showModalCreateCampaign: boolean;
  statisticsChannels: IChannel[];
  showFilters: boolean;
  isMobile: boolean;
  view: string;
}

class Channels extends React.Component<IProps, IState> {
  private fetch;

  constructor(props: any) {
    super(props);

    this.state = {
      selected: [],
      showModalCreateCampaign: false,
      statisticsChannels: [],
      filters: {},
      sort: CHANNEL_SORT.A_Z,
      search: "",
      page: 1,
      showFilters: false,
      selectedSort: "",
      isMobile: window.innerWidth < 1200,
      view: "card"
    };
  }

  componentWillMount() {
    this.props.getChannelFilters();
    this.props.getChannels();
    window.addEventListener("resize", this.handleWindowResize);
  }

  componentWillUnmount() {
    window.removeEventListener("resize", this.handleWindowResize);
  }

  private handleWindowResize = () => {
    this.setState({ isMobile: window.innerWidth < 1200 });
  };

  private fetchData = () => {
    if (!this.fetch) {
      this.fetch = _.debounce(() => {
        const { getChannels, getChannelFilters } = this.props;
        const { search, filters, page, sort } = this.state;
        getChannels(search, filters, sort, page);
        getChannelFilters(search, filters);
      }, 500);
    }
    this.fetch();
  };

  showCampaignModal(open: boolean) {
    this.setState({ showModalCreateCampaign: open });
  }

  private navigateToNewCampaign(data) {
    const { history, initializeForm, resetFilters } = this.props;
    const campaign = { ...data, channels: this.state.selected };
    resetFilters();
    initializeForm(campaign);
    // need to be refactored
    const redirectLink = campaign.isNewClient
      ? `${NAVIGATION_URLS.NEW_CUSTOMER}?campaignWizard=true`
      : `${NAVIGATION_URLS.CAMPAIGN_DETAILS}/new`;
    redirect(history)(redirectLink);
  }

  private toggleSelectedChannel(channel) {
    const selected = this.state.selected;
    const newSelected = selected.some(({ id }) => id === channel.id)
      ? selected.filter(({ id }) => id !== channel.id)
      : [...selected, channel];

    this.setState({ selected: newSelected });
  }

  private showStatisticsModal(channels: IChannel[]) {
    if (channels && channels.length) {
      this.setState({ statisticsChannels: channels });
    }
  }

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
    const selectedSort =
      field === "sort"
        ? selectors[0].options.find(opt => opt.value === value)
        : this.state.selectedSort;
    this.setState({ [field]: value, page: 1, selectedSort }, this.fetchData);
  };

  private onSortChange = selectedSort => {
    this.setState({ selectedSort, sort: selectedSort.value, page: 1 }, this.fetchData);
  };

  private renderCardItem = selected => channel => {
    const { view } = this.state;
    return (
      <CSSTransition key={channel.id} classNames="fade" timeout={300}>
        <ChannelCard
          channel={channel}
          selected={selected}
          onChannelToggle={channel => this.toggleSelectedChannel(channel)}
          onShowStatistics={channel => this.showStatisticsModal([channel])}
          view={view}
        />
      </CSSTransition>
    );
  };

  private renderEmptyMessage = channelsList => {
    if (channelsList.length === 0) {
      return (
        <EmptyMessage>
          <FormattedMessage id="CHANNELS_NO_DATA" />
        </EmptyMessage>
      );
    }

    return null;
  };

  private renderPageTemplate = (listClassName, className) => {
    return (
      <PageTemplate
        page={NAVIGATION_URLS.CHANNELS}
        listClassName={listClassName}
        className={className}
      />
    );
  };

  private handleToggleView = (view: string) => this.setState({ view });
  private handleChangeShowFilters = () => this.setState({ showFilters: !this.state.showFilters });
  render() {
    const { selected, statisticsChannels, filters, view, isMobile, search, page } = this.state;

    const {
      channels: { channelItems, isLoading, noMoreData, channelFilters, channelFiltersIsLoading },
      campaignWizard
    } = this.props;
    const channelsList = filterAddons(channelItems);
    const globalLoading = isLoading || channelFiltersIsLoading;
    const filterChanged = !_.isEmpty(filters) && _.some(filters, item => item.length > 0);
    const firstLoading = page === 1 && globalLoading;

    return (
      <div id="channels">
        <PageLayout page={NAVIGATION_URLS.CHANNELS} isLoading={globalLoading}>
          <ChannelStatistics
            channels={statisticsChannels}
            visible={statisticsChannels.length > 0}
            onClose={() => this.setState({ statisticsChannels: [] })}
          />
          <ModalTemplate
            open={this.state.showModalCreateCampaign}
            onClose={() => this.setState({ showModalCreateCampaign: false })}
            alignCenter
          >
            <AddNewCampaign
              onClose={() => this.showCampaignModal(false)}
              onAdd={campaign => this.navigateToNewCampaign(campaign)}
            />
          </ModalTemplate>

          <div className="title-bar">
            <div className="page-title">
              <FormattedMessage id="CHANNEL_TITLE" />
            </div>
          </div>

          <div className="channel-container">
            {!isMobile && (
              <Filters
                filters={channelFilters}
                onChange={this.onFilterChange}
                initialValue={filters}
                show={this.state.showFilters}
                globalLoading={globalLoading}
              />
            )}
            <div className="result-container">
              <FiltersBar
                searchPlaceholder="CHANNEL_SEARCH_PLACEHOLDER"
                onChange={this.onSearch}
                selectors={[{ ...selectors[0], value: this.state.sort }]}
                showFilters={this.state.showFilters}
                onChangeShowFilters={this.handleChangeShowFilters}
                showFiltersButton
                filterChanged={filterChanged}
                className="channels-bar"
                view={view}
                onToggleView={this.handleToggleView}
                search={search}
              />
              {isMobile && (
                <Filters
                  filters={channelFilters}
                  onChange={this.onFilterChange}
                  initialValue={filters}
                  sortValue={this.state.selectedSort}
                  sortObj={selectors[0]}
                  onSortChange={this.onSortChange}
                  show={this.state.showFilters}
                />
              )}
              {firstLoading ? (
                this.renderPageTemplate("channels-list", {
                  "tile-list": view === "tile"
                })
              ) : channelsList.length === 0 ? (
                this.renderEmptyMessage(channelsList)
              ) : (
                <TransitionGroup
                  className={classnames(
                    "channels-list",
                    {
                      hideChannelsList: this.state.showFilters
                    },
                    {
                      "tile-list": view === "tile"
                    }
                  )}
                >
                  {channelsList.map(this.renderCardItem(selected))}
                </TransitionGroup>
              )}

              <div className={classnames("footer", { hideFooter: this.state.showFilters })}>
                <Button
                  onClick={this.getMoreData}
                  loading={isLoading}
                  loadingText="DATA_LOADING"
                  visible={!noMoreData && !firstLoading}
                  btnColorType="primary"
                >
                  LOAD_MORE_DATA
                </Button>
              </div>
            </div>

            <ChannelSummary
              nextButtonText="START_CAMPAIGN"
              onNext={() => this.showCampaignModal(true)}
              onRemove={channel => this.toggleSelectedChannel(channel)}
              onShowStatistics={() => this.showStatisticsModal(selected)}
              readOnly={false}
              selected={selected}
              campaign={campaignWizard}
              globalLoading={globalLoading}
            />
          </div>
        </PageLayout>
      </div>
    );
  }
}

export default connect(
  ({ channels }) => ({ channels }),
  {
    getChannels: ChannelsActions.getChannels,
    getChannelFilters: ChannelsActions.getChannelFilters,
    initializeForm: campaign => initialize("campaignWizard", campaign),
    resetFilters: ChannelsActions.resetFilters
  }
)(Channels);
