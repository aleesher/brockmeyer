import React from "react";
import _ from "lodash";
import { initialize, getFormValues, change, isDirty } from "redux-form";
import { FormattedMessage } from "react-intl";
import { compose } from "recompose";
import { withRouter } from "react-router";

import { IBreadcrump } from "models/.";
import Breadcrumbs from "./breadcrumbs/Breadcrumbs";
import CampaignOverviewActions from "../pages/campaigns/CampaignOverviewActions";
import ChannelsActions from "../pages/campaign-channels/ChannelsActions";
import InputWithEditIcon from "./inputs/InputWithEditIcon";
import Popconfirm from "./popconfirm/Popconfirm";
import { CAMPAIGN_BREADCRUMBS, NAVIGATION_URLS } from "constants/URIConstants";
import { connect } from "../reduxConnector";
import { SOCIAL_MEDIA_ID, BANNERS_ID, NETHERLANDS_PROVINCE } from "constants/constants";
import Button from "./button/Button";
import { KeyboardArrowLeft } from "components/icons";
import { redirect } from "helpers/common";
import { getMainBreadcrump } from "helpers/breadcrump";
import Status from "./status";
import HeaderTemplate from "./page-template/header-template";
import ModalTemplate from "components/modals/ModalTemplate";
import ShareCampaignModal from "../pages/shared-campaign/partial/ShareCampaignModal";

import "./HeaderCampaign.scss";

interface IProps {
  addCampaign: any;
  breadcrumbStep: string;
  campaignChannels: any;
  campaignWizard: any;
  hideBreadcrumbs?: boolean;
  changeFormValue: any;
  history: any;
  initializeForm: (any) => void;
  removeCampaign: (id: string) => void;
  getCampaignChannels: (id) => void;
  statusTypes: any;
  match: any;
  getCampaign: (id: number) => void;
  cWizard?: any;
  toggleBreadcrumpModal: any;
  status: any;
  isLoading: boolean;
  campaignChannelsLoading: boolean;
  campaignChannelsLoaded: boolean;
  breadcrumb: IBreadcrump;
  setBreadcrumb: (breadcrump: IBreadcrump | {}) => void;
  resetCampaignChannelsState: () => void;
  postSharedCampaign: (id: number, date: string) => void;
  getShareCampaign: (id: number) => void;
  hashcode: any;
  page: string;
  setDetailsChange: (isDetailsChanged: boolean) => void;
}

interface IState {
  loaded: boolean;
  breadcrumpIsSet: boolean;
  showShareModal: boolean;
}

class Header extends React.Component<IProps, IState> {
  constructor(props) {
    super(props);
    this.state = {
      loaded: false,
      breadcrumpIsSet: false,
      showShareModal: false
    };
  }

  componentDidMount() {
    const {
      getCampaign,
      match: {
        params: { campaignId },
        url
      },
      history,
      getCampaignChannels,
      campaignWizard,
      getShareCampaign
    } = this.props;

    getShareCampaign(campaignId);

    if (_.isEmpty(campaignWizard) && campaignId !== "new") {
      if (!url.includes("/campaign-channels") && !url.includes("/campaign-add-ons")) {
        getCampaign(campaignId);
        getCampaignChannels(campaignId);
      }
      return;
    }

    // should be refactored
    if (campaignId === "new" && _.isEmpty(campaignWizard)) {
      redirect(history)(NAVIGATION_URLS.CAMPAIGNS);
    }
  }

  componentWillReceiveProps(nextProps) {
    const { campaignWizard } = nextProps;
    const { campaignWizard: campaign } = this.props;

    if (_.isEmpty(campaignWizard) && _.isEmpty(campaign)) {
      this.initCampaignChannels();
    }
  }

  private getBreadcrumbs() {
    const { CAMPAIGN_SOCIAL_MEDIA, CAMPAIGN_BANNERS, CAMPAIGN_MARKET_ANALYSIS } = NAVIGATION_URLS;
    const {
      campaignWizard: { regions = [], occupation },
      campaignChannels
    } = this.props;
    const pick = url => ({ channelType }) => channelType === url;
    const hasSocialMedia = campaignChannels.some(
      ({ channelType, name }) => channelType === SOCIAL_MEDIA_ID && name.indexOf("Facebook") > -1
    );
    const hasBanners = campaignChannels.some(pick(BANNERS_ID));
    const hasMarketAnalysis =
      !_.isEmpty(regions) &&
      _.every(regions, region => NETHERLANDS_PROVINCE.includes(region)) &&
      occupation;
    return CAMPAIGN_BREADCRUMBS.filter(
      breadcrumb =>
        (hasSocialMedia || breadcrumb.url !== CAMPAIGN_SOCIAL_MEDIA) &&
        (hasBanners || breadcrumb.url !== CAMPAIGN_BANNERS) &&
        (hasMarketAnalysis || breadcrumb.url !== CAMPAIGN_MARKET_ANALYSIS)
    );
  }

  private removeCampaign = () => {
    const {
      campaignWizard: { id },
      removeCampaign
    } = this.props;

    removeCampaign(id);
  };

  private openShareModal = async () => {
    this.setState(prevState => ({ showShareModal: !prevState.showShareModal }));
  };

  private getStatusName = status => {
    const {
      history,
      match: {
        params: { campaignId }
      }
    } = this.props;

    if (!_.isEmpty(status)) {
      if (status.name !== "order_new" && status.name !== "order_open") {
        return history.push(`${NAVIGATION_URLS.CAMPAIGN}/${campaignId}`);
      }

      return status.name;
    }

    return "order_new";
  };

  private initCampaignChannels = () => {
    const {
      campaignChannels,
      getCampaignChannels,
      match: {
        params: { campaignId },
        url
      },
      campaignChannelsLoading
    } = this.props;

    if (
      _.isEmpty(campaignChannels) &&
      !url.includes("/campaign-add-ons") &&
      !url.includes("/campaign-channels") &&
      !campaignChannelsLoading
    ) {
      getCampaignChannels(campaignId);
    }
  };

  private getCampaignBreadcrumps = () => {
    const {
      breadcrumbStep,
      setBreadcrumb,
      campaignChannelsLoading,
      breadcrumb,
      campaignChannelsLoaded,
      status,
      campaignChannels,
      resetCampaignChannelsState
    } = this.props;

    let mainBreadcrump;
    let visitedBreadcrumbs = [] as string[];
    const campaignBreadrumbs = this.getBreadcrumbs();
    const currentBreadcrumb = campaignBreadrumbs.find(
      ({ url }: IBreadcrump) => url === breadcrumbStep
    );

    mainBreadcrump = breadcrumb;

    if (!campaignChannelsLoading && campaignChannelsLoaded) {
      mainBreadcrump = getMainBreadcrump(campaignBreadrumbs, status, campaignChannels);

      const breadcrumbOrder = _.max([
        _.get(mainBreadcrump, "order", 1),
        _.get(currentBreadcrumb, "order")
      ]);

      if (breadcrumbOrder !== _.get(mainBreadcrump, "order")) {
        mainBreadcrump = currentBreadcrumb;
      }

      setBreadcrumb(mainBreadcrump);
      resetCampaignChannelsState();
    }

    if (mainBreadcrump) {
      visitedBreadcrumbs = campaignBreadrumbs.reduce((acc, { order, url }: IBreadcrump) => {
        if (order <= mainBreadcrump.order) {
          return [...acc, url];
        }
        return acc;
      }, []);
    }

    return {
      campaignBreadrumbs,
      visitedBreadcrumbs
    };
  };

  render() {
    const {
      campaignWizard,
      addCampaign,
      changeFormValue,
      breadcrumbStep,
      hideBreadcrumbs,
      toggleBreadcrumpModal,
      status,
      isLoading,
      hashcode,
      match: { params },
      page,
      setDetailsChange
    } = this.props;

    const { showShareModal } = this.state;
    const { jobTitle = "", companyName, id } = campaignWizard;
    const statusName = this.getStatusName(status);
    const { visitedBreadcrumbs, campaignBreadrumbs } = this.getCampaignBreadcrumps();

    return (
      <div id="header-campaign">
        {isLoading && !showShareModal ? (
          <HeaderTemplate />
        ) : (
          <div className="header">
            <div
              className="header-row-back"
              onClick={() => toggleBreadcrumpModal(NAVIGATION_URLS.CAMPAIGNS)}
            >
              <img src="/assets/images/curled-arrow.svg" />
              <p className="back-to-campaigns">
                <FormattedMessage id="CAMPAIGNS" />
              </p>
            </div>
            <div className="subheader">
              <div className="campaign-info">
                <div className="header-row-campaign-name">
                  <KeyboardArrowLeft
                    className="mobile-back-btn"
                    onClick={() => toggleBreadcrumpModal(NAVIGATION_URLS.CAMPAIGNS)}
                  />
                  <InputWithEditIcon
                    value={jobTitle}
                    className="campaign-name"
                    onSave={value => changeFormValue("jobTitle", value)}
                    readOnly={!["order_new", "order_open"].includes(statusName)}
                  />
                </div>
                {page !== NAVIGATION_URLS.SHARED_CAMPAIGN && (
                  <div className="share-campaign-btn mobile">
                    <Button
                      onClick={() => this.openShareModal()}
                      className="share-campaign-button button-retract"
                      id="share-capaign"
                      btnColorType="shared"
                    >
                      SHARE
                    </Button>
                  </div>
                )}
                <div className="header-row-company">
                  <Status />
                  <div className="company-name-container">{companyName}</div>
                </div>
              </div>
              <div>
                <div className="buttons-container">
                  <Popconfirm
                    title="SURE_TO_REMOVE"
                    okText="YES_DELETE"
                    onConfirm={this.removeCampaign}
                    visible={statusName === "order_new"}
                  >
                    <Button btnColorType="secondary">REMOVE</Button>
                  </Popconfirm>
                  {["order_new", "order_open"].includes(statusName) && (
                    <Button
                      onClick={() => {
                        setDetailsChange(true);
                        addCampaign(this.props.campaignWizard);
                      }}
                      btnColorType="secondary"
                    >
                      SAVE
                    </Button>
                  )}
                  {(page === NAVIGATION_URLS.CAMPAIGN_REVIEW ||
                    page === NAVIGATION_URLS.VACANCY_IMPROVER ||
                    page === NAVIGATION_URLS.CAMPAIGN_VACANCY) && (
                    <div className="share-campaign-btn">
                      <Button
                        onClick={this.openShareModal}
                        className="button-retract share-campaign-button"
                        id="share-capaign"
                        btnColorType="shared"
                      >
                        SHARE
                      </Button>
                    </div>
                  )}
                </div>
              </div>
            </div>
            <ModalTemplate
              open={this.state.showShareModal}
              onClose={() => this.setState({ showShareModal: false })}
              alignCenter
            >
              <ShareCampaignModal
                onClose={() => this.openShareModal()}
                campaignHash={hashcode}
                id={params.campaignId}
                statusName={statusName}
              />
            </ModalTemplate>
          </div>
        )}
        <Breadcrumbs
          items={campaignBreadrumbs}
          visitedBreadcrumbs={visitedBreadcrumbs}
          loaded={this.state.loaded}
          selectedItem={breadcrumbStep}
          visible={!hideBreadcrumbs}
          id={id}
          toggleBreadcrumpModal={toggleBreadcrumpModal}
        />
      </div>
    );
  }
}

export default compose(
  withRouter,
  connect(
    state => ({
      campaignChannels: state.channels.campaignChannels,
      statusTypes: state.campaigns.statusTypes,
      campaignWizard: getFormValues("campaignWizard")(state) || {},
      isFormDirty: isDirty("campaignWizard")(state),
      status: state.campaigns.campaignStatus,
      campaignChannelsLoading:
        state.channels.campaignChannelsLoading ||
        state.channels.addOnsIsLoading ||
        state.channels.suggestedChannelsIsLoading ||
        state.channels.allChannelsIsLoading,
      campaignChannelsLoaded:
        state.channels.campaignChannelsLoaded ||
        state.channels.addOnsIsLoaded ||
        state.channels.suggestedChannelsLoaded ||
        state.channels.allChannelsLoaded,
      breadcrumb: state.campaigns.breadcrumb,
      hashcode: state.campaigns.hashcode
    }),
    {
      addCampaign: CampaignOverviewActions.addCampaign,
      setDetailsChange: CampaignOverviewActions.setDetailsChange,
      removeCampaign: CampaignOverviewActions.removeCampaign,
      getCampaignChannels: ChannelsActions.getCampaignChannels,
      changeFormValue: (name, value) => change("campaignWizard", name, value),
      initializeForm: campaign => initialize("campaignWizard", campaign),
      getCampaign: CampaignOverviewActions.getCampaign,
      setBreadcrumb: CampaignOverviewActions.setBreadcrumb,
      resetCampaignChannelsState: ChannelsActions.resetCampaignChannelsState,
      postSharedCampaign: CampaignOverviewActions.postSharedCampaign,
      getShareCampaign: CampaignOverviewActions.getShareCampaign
    }
  )
)(Header);
