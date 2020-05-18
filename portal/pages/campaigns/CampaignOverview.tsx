import React from "react";
import _ from "lodash";
import classnames from "classnames";
import { initialize, destroy } from "redux-form";
import { FormattedMessage } from "react-intl";

import AddNewCampaign from "./partial/AddNewCampaign";
import Button from "components/button/Button";
import Tooltip from "components/tooltip";
import FloatingActionButton from "components/speed-dial/FloatingActionButton";
import CampaignActions from "../campaigns/CampaignOverviewActions";
import { ICampaignOverviewState } from "./CampaignOverviewReducer";
import ModalTemplate from "components/modals/ModalTemplate";
import { NAVIGATION_URLS, CAMPAIGN_BREADCRUMBS } from "constants/URIConstants";
import { CAMPAIGN_SORT, SORT_DEFAULT } from "constants/constants";
import { PageLayout, FiltersBar } from "components/.";
import { connect } from "../../reduxConnector";
import CampaignList from "./partial/CampaignList";
import { redirect } from "helpers/common";
import EmptyMessage from "components/empty-message";
import ChannelsActions from "../campaign-channels/ChannelsActions";
import { STEPS } from "constants/constants";
import AppActions from "../app/AppActions";
import { IChannel, IBreadcrump } from "models/.";
import { getMainBreadcrump } from "helpers/breadcrump";

import "./CampaignOverview.scss";

interface IProps {
  campaignsState: ICampaignOverviewState;
  filters: any;
  history: any;
  getCampaign: (id: number, saveLocally?: boolean) => void;
  getCampaigns: (search?: string, statusId?: string, sort?: string, page?: number) => void;
  getCampaignStatusTypes: () => void;
  updateCampaignFilters: (filters?: any) => void;
  initializeForm: (any) => void;
  resetFilters: () => void;
  destroyForm: () => void;
  isTourOpen: boolean;
  openTour: () => void;
  closeTour: () => void;
  toggleTour: () => void;
  toggleTourStatus: () => void;
  getCampaignChannels: (id: number) => void;
  campaignChannels: IChannel[];
  campaignChannelsLoaded: boolean;
  campaignChannelsLoading: boolean;
  isChannelsLoading: boolean;
  resetCampaignChannelsState: () => void;
  setBreadcrumb: (breadcrumb: IBreadcrump | {}) => void;
}

interface IState {
  showModalCreateCampaign: boolean;
  showFilters: boolean;
  toggledCampaign: any;
}

const sortOptions = [
  { value: CAMPAIGN_SORT.DATE_END_ASC, label: "DATE_END" },
  { value: CAMPAIGN_SORT.DATE_END_DESC, label: "DATE_END_DESC" },
  { value: CAMPAIGN_SORT.DATE_START_ASC, label: "DATE_START" },
  { value: CAMPAIGN_SORT.DATE_START_DESC, label: "DATE_START_DESC" }
];

class Campaign extends React.Component<IProps, IState> {
  private fetch;
  isMobile = window.innerWidth < 768;

  constructor(props: any) {
    super(props);
    this.state = {
      showModalCreateCampaign: false,
      showFilters: false,
      toggledCampaign: null
    };

    const { getCampaigns, getCampaignStatusTypes, campaignsState } = props;
    const { search, filter, sort, page } = campaignsState.filters;
    const statusId = filter !== "0" ? filter : undefined;
    const defaultSort = sort !== "" ? sort : CAMPAIGN_SORT.DATE_END_DESC;
    getCampaigns(search, statusId, defaultSort, page);
    if (!campaignsState.statusTypes.length) {
      getCampaignStatusTypes();
    }
  }

  componentWillReceiveProps(nextProps) {
    const {
      campaignChannelsLoaded,
      campaignChannelsLoading,
      isChannelsLoading,
      campaignChannels
    } = nextProps;

    if (!_.isEqual(this.props.campaignsState.filters, nextProps.campaignsState.filters)) {
      this.fetchData();
    }

    if (campaignChannelsLoaded && !campaignChannelsLoading && !isChannelsLoading) {
      this.redirectToStep(campaignChannels);
    }

    return nextProps;
  }

  private fetchData = () => {
    if (!this.fetch) {
      this.fetch = _.debounce(() => {
        const {
          getCampaigns,
          campaignsState: {
            filters: { search, filter, sort, page }
          }
        } = this.props;
        const statusId = filter !== "0" ? filter : undefined;
        getCampaigns(search, statusId, sort, page);
      }, 500);
    }
    this.fetch();
  };

  showCampaignModal(open: boolean) {
    const { isTourOpen, toggleTourStatus } = this.props;
    if (isTourOpen) {
      toggleTourStatus();
    }
    this.setState({ showModalCreateCampaign: open });
  }

  private navigateToNewCampaign(campaign) {
    const { initializeForm, history, resetFilters } = this.props;
    resetFilters();
    initializeForm(campaign);

    const redirectLink = campaign.isNewClient
      ? `${NAVIGATION_URLS.NEW_CUSTOMER}?campaignWizard=true`
      : `${NAVIGATION_URLS.CAMPAIGN_DETAILS}/new`;

    history.push(redirectLink);
  }

  private onCampaignClick(campaign) {
    const {
      campaignsState: { statusTypes },
      history,
      resetFilters,
      destroyForm
    } = this.props;

    resetFilters();
    destroyForm();

    const status = statusTypes.find(status => status.id === campaign.campaignStatus) || {
      name: ""
    };
    const data = { ...campaign, status };

    if (status.name === "order_new" || status.name === "order_open") {
      const isDetailsEmpty = _.some(
        _.pick(data, ["educations", "sector", "regions", "jobProfiles"]),
        _.isEmpty
      );

      if (isDetailsEmpty) {
        this.initBreadcrump(NAVIGATION_URLS.CAMPAIGN_DETAILS);
        redirect(history)(NAVIGATION_URLS.CAMPAIGN_DETAILS, campaign.id);
      } else {
        this.setState(
          {
            toggledCampaign: data
          },
          () => {
            const { getCampaignChannels } = this.props;
            getCampaignChannels(campaign.id);
          }
        );
      }
    } else {
      this.initBreadcrump("");
      redirect(history)(NAVIGATION_URLS.CAMPAIGN, campaign.id);
    }
  }

  private redirectToStep = (channels: IChannel[]) => {
    const { history, resetCampaignChannelsState, setBreadcrumb } = this.props;
    const { toggledCampaign: campaign } = this.state;

    if (campaign) {
      const { status } = campaign;
      const breadcrump = getMainBreadcrump(CAMPAIGN_BREADCRUMBS, status, channels);
      const redirectUrl = _.get(breadcrump, "url", NAVIGATION_URLS.CAMPAIGN_CHANNELS);

      setBreadcrumb(breadcrump);
      resetCampaignChannelsState();
      redirect(history)(redirectUrl, campaign.id);
    }
  };

  private initBreadcrump(redirectUrl: string) {
    const { setBreadcrumb } = this.props;
    const breadcrumb = CAMPAIGN_BREADCRUMBS.find(({ url }: IBreadcrump) => url === redirectUrl);
    setBreadcrumb(breadcrumb || {});
  }

  private onChangeFilters = ({ field, value }) => {
    const { updateCampaignFilters } = this.props;
    let filters = {};
    if (field === "filter") {
      const sort = SORT_DEFAULT[value] && SORT_DEFAULT[value].sort;
      filters = { [field]: value, page: 1, sort };
    } else {
      filters = { [field]: value, page: 1 };
    }

    updateCampaignFilters(filters);
  };

  private getMoreData = () => {
    const {
      campaignsState: {
        filters: { page }
      },
      updateCampaignFilters
    } = this.props;
    updateCampaignFilters({ page: page + 1 });
  };

  render() {
    const {
      campaignsState: {
        campaignItems,
        isLoaded,
        isLoading,
        noMoreData,
        statusTypes,
        filters: { search, sort, page, filter }
      },
      campaignChannelsLoading
    } = this.props;
    const { showModalCreateCampaign, showFilters } = this.state;

    const globalLoading = isLoading && page === 1;
    const statusOptions = [{ id: 0, name: "order_all" }, ...statusTypes].map(({ id, name }) => ({
      label: name.toUpperCase(),
      value: id
    }));

    const selectors = [
      { key: "filter", label: "TYPE", options: statusOptions, defaultValue: "0", value: filter },
      {
        key: "sort",
        label: "SORT",
        options: sortOptions,
        defaultValue: CAMPAIGN_SORT.DATE_END_DESC,
        value: sort
      }
    ];

    return (
      <div id="campaign-page">
        <PageLayout
          page={NAVIGATION_URLS.CAMPAIGNS}
          pageTour={NAVIGATION_URLS.CAMPAIGNS}
          tourSteps={STEPS(this.isMobile)}
          isRedirecting={campaignChannelsLoading}
          isLoading={globalLoading}
        >
          <div className="title-bar">
            <div className="page-title">
              <FormattedMessage id="CAMPAIGN_TITLE" />
              <Tooltip id="CAMPAIGNS_INFO" />
            </div>
            <div className="tour">
              <Button
                onClick={() => this.showCampaignModal(true)}
                id="create-campaign"
                btnColorType="primary"
              >
                CAMPAIGN_CREATE
              </Button>
            </div>
          </div>

          <ModalTemplate
            open={showModalCreateCampaign}
            onClose={() => this.setState({ showModalCreateCampaign: false })}
            alignCenter
          >
            <AddNewCampaign
              onClose={() => this.showCampaignModal(false)}
              onAdd={campaign => this.navigateToNewCampaign(campaign)}
            />
          </ModalTemplate>

          <div className="tour-button-wrapper">
            <Button
              onClick={() => this.showCampaignModal(true)}
              id="create-campaign"
              className="tour-button-mobile"
              btnColorType="primary"
            >
              CAMPAIGN_CREATE
            </Button>
          </div>

          <FiltersBar
            searchPlaceholder="CAMPAIGN_SEARCH_PLACEHOLDER"
            selectors={selectors}
            onChange={this.onChangeFilters}
            search={search}
            showFilters={showFilters}
            onChangeShowFilters={() => this.setState({ showFilters: !showFilters })}
            showFiltersButton
          />

          {!isLoading && !search && campaignItems.length === 0 && (
            <EmptyMessage
              className={classnames({
                shiftErrorMessage: showFilters
              })}
            >
              <FormattedMessage id="CAMPAIGN_NO_DATA" />
            </EmptyMessage>
          )}

          {!isLoading && search && campaignItems.length === 0 && (
            <EmptyMessage
              className={classnames({
                shiftErrorMessage: showFilters
              })}
            >
              <FormattedMessage id="CAMPAIGN_FOUND_NO_DATA" />
            </EmptyMessage>
          )}

          <CampaignList
            campaigns={campaignItems}
            statuses={statusTypes}
            onClick={item => this.onCampaignClick(item)}
            className={classnames({ shiftCampaignList: showFilters })}
            isLoading={isLoading}
            isMobile={this.isMobile}
            globalLoading={isLoading && page === 1}
          />

          <div className="footer">
            <Button
              onClick={this.getMoreData}
              loading={isLoading}
              loadingText="DATA_LOADING"
              visible={!noMoreData && isLoaded}
              btnColorType="primary"
            >
              LOAD_MORE_DATA
            </Button>
          </div>

          {!this.isMobile && <FloatingActionButton onClick={() => this.showCampaignModal(true)} />}
        </PageLayout>
      </div>
    );
  }
}

export default connect(
  state => ({
    campaignsState: state.campaigns,
    isTourOpen: state.global.isTourOpen,
    campaignChannels: state.channels.campaignChannels,
    campaignChannelsLoaded: state.channels.campaignChannelsLoaded,
    campaignChannelsLoading: state.channels.campaignChannelsLoading,
    isChannelsLoading: state.channels.isLoading
  }),
  {
    getCampaign: CampaignActions.getCampaign,
    getCampaigns: CampaignActions.getCampaigns,
    getCampaignStatusTypes: CampaignActions.getCampaignStatusTypes,
    updateCampaignFilters: CampaignActions.updateCampaignFilters,
    initializeForm: campaign => initialize("campaignWizard", campaign),
    resetFilters: ChannelsActions.resetFilters,
    destroyForm: () => destroy("campaignWizard"),
    toggleTour: AppActions.toggleTour,
    toggleTourStatus: AppActions.toggleTourStatus,
    getCampaignChannels: ChannelsActions.getCampaignChannels,
    resetCampaignChannelsState: ChannelsActions.resetCampaignChannelsState,
    setBreadcrumb: CampaignActions.setBreadcrumb
  }
)(Campaign);
