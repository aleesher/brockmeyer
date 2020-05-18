import React from "react";
import { FormattedMessage } from "react-intl";
import { isPristine, getFormValues, change, destroy } from "redux-form";
import { compose } from "recompose";
import { withRouter } from "react-router";
import Tour from "reactour";
import { disableBodyScroll, enableBodyScroll } from "body-scroll-lock";
import _ from "lodash";
import classnames from "classnames";

import CampaignOverviewActions from "../pages/campaigns/CampaignOverviewActions";
import { connect } from "../reduxConnector";
import { Header, HeaderCampaign, SubHeader, Footer } from "./";
import { redirect } from "helpers/common";
import ModalTemplate from "./modals/ModalTemplate";
import { Info } from "./icons";
import Button from "./button/Button";
import AppActions from "../pages/app/AppActions";
import URIConstants, { NAVIGATION_URLS as URLS } from "constants/URIConstants";
import { defaultTheme, ThemeProvider } from "constants/themes/theme-context";

import "../styles/global.scss";

const BRO_LOGO_PATH = "/assets/images/logo_icon.png";

interface IProps {
  page: string;
  isLoading?: boolean;
  campaignHeader?: any;
  subHeader?: any;
  renderHeader?: any;
  cWizard?: any;
  match: any;
  setDetailsChange: (isDetailsChanged: boolean) => void;
  isFormPristine: boolean;
  history: any;
  campaignWizard: any;
  updateCampaign: (campaign: any, redirectUrl: string, silentUpdate?: boolean) => void;
  changeFormValue: (name: string, value: any) => void;
  destroyForm: () => void;
  setStatus: (status: any) => void;
  campaignStatus: any;
  isRedirecting?: boolean;
  setBreadcrumpsImmediately?: boolean;
  toggleTour: () => void;
  isTourOpen: boolean;
  isTourEnabled: boolean;
  pageTour?: string;
  tourSteps?: any;
  toggleTourStatus: () => void;
  campaignChannels?: any;
  user: any;
  sharedCampaign: any;
}

interface IState {
  showBreadcrumpModal: boolean;
  redirectUrl: string;
  statusName: string;
  tourCounter: number;
  currentCounter: number;
  theme: any;
}

class PageLayout extends React.Component<IProps, IState> {
  constructor(props) {
    super(props);
    const settings = !_.isEmpty(_.get(props.user, "portalSettings", {}))
      ? JSON.parse(props.user.portalSettings)
      : props.sharedCampaign
      ? JSON.parse(_.get(props.sharedCampaign, "company.portalSettings", "{}"))
      : {};

    this.state = {
      showBreadcrumpModal: false,
      redirectUrl: "",
      statusName: "",
      tourCounter: 0,
      currentCounter: 0,
      theme: _.get(settings, "color_scheme", defaultTheme)
    };
  }

  componentWillReceiveProps(nextProps) {
    const { theme } = this.state;
    const { user = {}, sharedCampaign } = nextProps;

    if (user.portalSettings) {
      const { portalSettings = "{}" } = user;
      const { color_scheme = {} } = JSON.parse(portalSettings);
      if (theme !== color_scheme && !_.isEmpty(color_scheme)) {
        this.setState({
          theme: color_scheme
        });
      }
    } else if (sharedCampaign) {
      const portalSettings = _.get(sharedCampaign, "partner.portalSettings", "{}");
      if (portalSettings) {
        const { color_scheme = {} } = JSON.parse(portalSettings);
        if (theme !== color_scheme && !_.isEmpty(color_scheme)) {
          this.setState({
            theme: color_scheme
          });
        }
      }
    }
  }

  private renderBreadcrumpModal = () => {
    const { showBreadcrumpModal } = this.state;

    if (showBreadcrumpModal) {
      return (
        <ModalTemplate
          open={showBreadcrumpModal}
          onClose={() => null}
          alignCenter
          className="breadcrump-modal"
        >
          <div className="confirm-modal-title">
            <Info className="confirm-modal-icon" />
            <FormattedMessage id="POPUP_SAVE" tagName="span" />
          </div>
          <div className="confirm-modal-buttons">
            <Button onClick={() => this.toggleBreadcrumpModal("")} btnColorType="secondary">
              CANCEL
            </Button>
            <Button onClick={this.onSaveCampaign(false)}>NO</Button>
            <Button onClick={this.onSaveCampaign(true)} btnColorType="primary">
              YES
            </Button>
          </div>
        </ModalTemplate>
      );
    }

    return;
  };

  private toggleBreadcrumpModal = url => {
    if (_.isEmpty(url)) {
      this.setState({
        redirectUrl: "",
        showBreadcrumpModal: false
      });

      return;
    }

    const { showBreadcrumpModal: show } = this.state;
    const {
      isFormPristine,
      match: { url: currentUrl },
      history,
      campaignWizard: { id },
      campaignStatus: status
    } = this.props;
    const isReadOnly = status.name !== "order_new";
    const showBreadcrumpModal = !show;
    const redirectUrl = url;

    if (
      currentUrl.includes("/campaign-channels") ||
      currentUrl.includes("/campaign-add-ons") ||
      currentUrl.includes("/campaign-review") ||
      isFormPristine ||
      (isReadOnly && !currentUrl.includes("/campaign-vacancy"))
    ) {
      this.redirectUser(history, redirectUrl, id);
      return;
    }

    this.setState({
      showBreadcrumpModal,
      redirectUrl
    });
  };

  private onSaveCampaign = (shouldSave: boolean) => () => {
    const {
      updateCampaign,
      campaignWizard: campaign,
      setDetailsChange,
      match: {
        url: currentUrl,
        params: { campaignId }
      },
      history,
      campaignStatus: status,
      setStatus
    } = this.props;

    const { redirectUrl } = this.state;
    if (shouldSave) {
      const isReadOnly = status.name !== "order_new";
      if (currentUrl.includes("/campaign-details") && !isReadOnly) {
        setDetailsChange(true);
      }
      setStatus({});
      updateCampaign(campaign, redirectUrl, true);
    } else {
      this.redirectUser(history, redirectUrl, campaignId);
    }
  };

  private redirectUser = (history, url, campaignId) => {
    const headerLinks = ["/", URLS.CAMPAIGNS, URLS.CHANNELS, URLS.CUSTOMERS];
    const { setStatus } = this.props;
    if (headerLinks.some(link => link === url)) {
      setStatus({});
      redirect(history)(url);
    } else {
      redirect(history)(url, campaignId);
    }
  };

  private renderContent = () => {
    const { isLoading, page, isRedirecting } = this.props;
    const pages = [
      URLS.CHANNELS,
      URLS.CAMPAIGN_ADD_ONS,
      URLS.CAMPAIGN_CHANNELS,
      URLS.CAMPAIGNS,
      URLS.CUSTOMERS
    ];

    if ((!isLoading || _.includes(pages, page)) && !isRedirecting) {
      return <div className="page-content">{this.props.children}</div>;
    }
    return (
      <div className="page-content">
        {(isLoading || isRedirecting) && <div className="loading" />}

        {this.props.children}
      </div>
    );
  };

  private getSteps = (fields, isMandatory, steps) => {
    let slicedSteps = [];
    let step = 0;
    let nextStep = 0;
    fields.map((f, index) => {
      if (f) {
        step = index + 1;
        const ind = isMandatory.slice(step, isMandatory.length).findIndex((m, index) => {
          return m || index === isMandatory.length - step - 1;
        });
        nextStep = step;
        if (ind > 0) {
          step += ind;
        }
      }
    });

    if (this.state.tourCounter !== nextStep) {
      this.setState({ tourCounter: nextStep });
    }
    slicedSteps = steps.slice(0, Math.min(step + 1, isMandatory.length));
    return slicedSteps;
  };

  private detectStep = (fields, isMandatory) => {
    const { history } = this.props;
    const { tourCounter } = this.state;
    let step = 0;

    if (history.location.pathname === `${URLS.CAMPAIGN_DETAILS}/new`) {
      step = fields.findIndex((f, index) => {
        return !f && index >= tourCounter;
      });
      if (step === -1) {
        return isMandatory.length - 1;
      }
    }
    return step;
  };

  private currentStep = curr => {
    if (this.state.currentCounter !== curr) {
      this.setState({ currentCounter: curr });
    }
  };

  private getOffset = () => {
    const { pageTour, page } = this.props;
    const { currentCounter } = this.state;
    if (
      (page === URLS.CAMPAIGN_CHANNELS && currentCounter === 1) ||
      pageTour === URLS.CAMPAIGN_SOCIAL_MEDIA ||
      pageTour === URLS.CAMPAIGN_BANNERS ||
      pageTour === URLS.CAMPAIGN_ADD_ONS
    ) {
      return -150;
    }
    return 0;
  };

  private getInViewThreshold = () => {
    const { pageTour } = this.props;
    return pageTour === URLS.CAMPAIGN_DETAILS ? 400 : 0;
  };

  private toggleTour = () => {
    const { toggleTour, toggleTourStatus } = this.props;
    enableBodyScroll(document.body);
    toggleTour();
    toggleTourStatus();
  };

  render() {
    const {
      campaignHeader,
      subHeader,
      isLoading,
      renderHeader,
      cWizard,
      match,
      history,
      setBreadcrumpsImmediately = true,
      isTourOpen,
      isTourEnabled,
      pageTour,
      campaignWizard,
      campaignChannels,
      user,
      page,
      sharedCampaign
    } = this.props;

    const settings = !_.isEmpty(user)
      ? JSON.parse(user.portalSettings || "{}")
      : sharedCampaign
      ? JSON.parse(_.get(sharedCampaign, "company.portalSettings", "{}"))
      : {};
    const logo = _.get(settings, "logo", BRO_LOGO_PATH);
    const logoSetting =
      logo !== BRO_LOGO_PATH ? `${URIConstants.REMOTE_RESOURCES_URI}${logo}` : BRO_LOGO_PATH;
    const font = _.get(settings, "font", "Raleway");

    let tourSteps = this.props.tourSteps;
    let startStep = 0;

    if (pageTour === URLS.CAMPAIGN_DETAILS) {
      const options = [
        "educations",
        "jobLevel",
        "regions",
        "jobProfiles",
        "sector",
        "contractType",
        "jobCompetence"
      ];
      const fields = options.reduce(
        (acc, field) =>
          campaignWizard[field] ? [...acc, campaignWizard[field]] : [...acc, undefined],
        []
      );
      const isMandatory = [true, false, true, true, true, false, false, false];
      tourSteps = this.getSteps(fields, isMandatory, tourSteps);
      startStep = this.detectStep(fields, isMandatory);
    }
    if (pageTour === URLS.CAMPAIGN_CHANNELS) {
      const fields = [
        true,
        campaignChannels.length > 0,
        campaignChannels.length > 0,
        campaignChannels.length > 0
      ];
      const isMandatory = [false, true, true, true];
      tourSteps = this.getSteps(fields, isMandatory, tourSteps);
    }

    if (isTourOpen && isTourEnabled) {
      disableBodyScroll(document.body);
    } else {
      enableBodyScroll(document.body);
    }

    return (
      <div className={classnames("page-container", font)}>
        <ThemeProvider value={this.state.theme}>
          {this.renderBreadcrumpModal()}
          {!isLoading && (
            <Tour
              steps={tourSteps}
              isOpen={isTourOpen && isTourEnabled}
              onRequestClose={this.toggleTour}
              maskSpace={3}
              closeWithMask={false}
              rounded={10}
              scrollOffset={this.getOffset()}
              startAt={startStep}
              getCurrentStep={curr => this.currentStep(curr)}
              inViewThreshold={this.getInViewThreshold()}
            />
          )}
          {page !== URLS.SHARED_CAMPAIGN && (
            <Header
              selectedMenu={page}
              toggleBreadcrumpModal={this.toggleBreadcrumpModal}
              isLoading={isLoading}
              match={match}
              history={history}
              companyLogo={logoSetting}
              page={page}
            />
          )}
          {campaignHeader && (
            <HeaderCampaign
              hideBreadcrumbs={campaignHeader.hideBreadcrumbs}
              breadcrumbStep={campaignHeader.breadcrumbStep}
              cWizard={cWizard}
              toggleBreadcrumpModal={this.toggleBreadcrumpModal}
              isLoading={isLoading}
              setBreadcrumpsImmediately={setBreadcrumpsImmediately}
              page={page}
            />
          )}
          {renderHeader}
          {subHeader && <SubHeader {...subHeader} />}
          {this.renderContent()}
          <Footer />
        </ThemeProvider>
      </div>
    );
  }
}

const mapStateToProps = state => ({
  user: state.global.currentUser,
  campaignWizard: getFormValues("campaignWizard")(state) || {},
  campaignChannels: state.channels.campaignChannels,
  isFormPristine: isPristine("campaignWizard")(state),
  campaignStatus: state.campaigns.campaignStatus,
  isTourOpen: state.global.isTourOpen,
  isTourEnabled: state.global.isTourEnabled,
  sharedCampaign: state.campaigns.shared_campaign
});

const mapDispatchToProps = {
  updateCampaign: CampaignOverviewActions.addCampaign,
  setDetailsChange: CampaignOverviewActions.setDetailsChange,
  changeFormValue: (name, value) => change("campaignWizard", name, value),
  destroyForm: () => destroy("campaignWizard"),
  setStatus: CampaignOverviewActions.setCampaignStatus,
  toggleTour: AppActions.toggleTour,
  toggleTourStatus: AppActions.toggleTourStatus
};

export default compose(withRouter, connect(mapStateToProps, mapDispatchToProps))(PageLayout);
