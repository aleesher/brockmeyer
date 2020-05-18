import React from "react";
import _ from "lodash";
import { getFormValues, isDirty } from "redux-form";
import { FormattedMessage, injectIntl, InjectedIntlProps } from "react-intl";
import { compose } from "recompose";
import { History } from "history";

import { ICampaign, ICampaignDetail, ICampaignDetailOptions } from "../../models";
import CampaignOverviewActions from "../campaigns/CampaignOverviewActions";
import AppActions from "../app/AppActions";
import { connect, campaignForm } from "../../reduxConnector";
import { NAVIGATION_URLS } from "constants/URIConstants";
import { PageLayout } from "components/.";
import { required } from "helpers/validations";
import CampaignDetail from "./partial/CampaignDetail";
import { NETHERLANDS_PROVINCE } from "constants/constants";
import Button from "components/button/Button";
import { KeyboardArrowRight } from "components/icons";
import Popconfirm from "components/popconfirm/Popconfirm";
import { redirect, getStatusName } from "helpers/common";
import { CAMPAIGN_DETAILS_STEPS } from "constants/constants";
import Tooltip from "components/tooltip";

import "./CampaignDetails.scss";

const campaignDetails: ICampaignDetail[] = [
  { label: "EDUCATIONS", maxValues: 2, option: "educations", validations: required },
  { label: "LEVEL", maxValues: 1, option: "jobLevel" },
  { label: "REGIONS", maxValues: 3, option: "regions", validations: required },
  { label: "PROFILES", maxValues: 5, option: "jobProfiles", validations: required },
  { label: "SECTORS", maxValues: 1, option: "sector", validations: required },
  { label: "CONTRACT_TYPE", maxValues: 1, option: "contractType" },
  { label: "JOB_COMPETENCY", maxValues: 1, option: "jobCompetence" }
];

interface IProps {
  options: ICampaignDetailOptions;
  isLoading: boolean;
  invalid: boolean;
  getOptions: () => void;
  addCampaign: (campaign: ICampaign) => void;
  campaignWizard: any;
  history: History;
  setDetailsChange: (isDetailsChanged: boolean) => void;
  isFormDirty: boolean;
  status: any;
  isTourOpen: boolean;
  closeTour: () => void;
  enableTourStatus: () => void;
  disableTourStatus: () => void;
}

interface IState {
  jobProfiles?: string;
  sector?: string;
  educations?: string;
  regions?: string;
  jobLevel?: string;
  isMobile: boolean;
}

class CampaignDetails extends React.Component<IProps & InjectedIntlProps, IState> {
  constructor(props: any) {
    super(props);

    this.state = {
      jobProfiles: "",
      sector: "",
      educations: "",
      regions: "",
      jobLevel: "",
      isMobile: window.innerWidth < 1200
    };
  }

  componentDidMount() {
    const { options, getOptions } = this.props;
    if (!options.educations.length) {
      getOptions();
    }
  }

  private onNextClick(readOnly) {
    const { isMobile } = this.state;
    const { addCampaign, campaignWizard, history, setDetailsChange, isFormDirty } = this.props;
    const hasMarketAnalysis =
      _.every(campaignWizard.regions, region => NETHERLANDS_PROVINCE.includes(region)) &&
      campaignWizard.occupation;
    const url =
      hasMarketAnalysis && !isMobile
        ? NAVIGATION_URLS.CAMPAIGN_MARKET_ANALYSIS
        : NAVIGATION_URLS.CAMPAIGN_CHANNELS;

    if (readOnly || !isFormDirty) {
      redirect(history)(url, campaignWizard.id);
    } else {
      addCampaign(campaignWizard, url);
      setDetailsChange(true);
    }
  }

  private openMenu = () => {
    const { disableTourStatus } = this.props;
    disableTourStatus();
  };

  private closeMenu = () => {
    const { enableTourStatus } = this.props;
    enableTourStatus();
  };

  render() {
    const {
      campaignWizard,
      options,
      isLoading,
      invalid,
      intl: { formatMessage },
      isFormDirty,
      status,
      isTourOpen
    } = this.props;

    const statusName = getStatusName(status);
    const readOnly = "order_new" !== statusName;

    return (
      <div id="campaign-details">
        <PageLayout
          pageTour={NAVIGATION_URLS.CAMPAIGN_DETAILS}
          page={NAVIGATION_URLS.CAMPAIGN_DETAILS}
          campaignHeader={{ breadcrumbStep: NAVIGATION_URLS.CAMPAIGN_DETAILS }}
          isLoading={isLoading}
          cWizard={campaignWizard}
          tourSteps={CAMPAIGN_DETAILS_STEPS()}
        >
          <div className="title-bar">
            <div className="page-title">
              <FormattedMessage id="VACANCY_DETAILS" />
              <Tooltip id="VACANCY_INFO" />
            </div>
          </div>
          {campaignDetails.map(campaignDetail => (
            <CampaignDetail
              key={campaignDetail.option}
              campaignDetail={campaignDetail}
              options={options}
              label={formatMessage({ id: campaignDetail.label })}
              value={_.get(campaignWizard, campaignDetail.option, [])}
              readOnly={readOnly}
              onMenuClose={this.closeMenu}
              onMenuOpen={() => this.openMenu()}
              tooltip={`${campaignDetail.label}_INFO`}
            />
          ))}
          <div className="footer">
            <Popconfirm
              title="POPUP_SAVE"
              onConfirm={() => this.onNextClick(readOnly)}
              hidePopup={!isFormDirty || readOnly}
              isTourOpen={isTourOpen}
            >
              <Button
                className="next-btn"
                disabled={invalid}
                icon={KeyboardArrowRight}
                iconPosition="right"
                btnColorType="primary"
              >
                NEXT
              </Button>
            </Popconfirm>
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
      campaignWizard: getFormValues("campaignWizard")(state),
      isLoading: state.campaigns.isLoading,
      options: state.campaigns.detailOptions,
      isFormDirty: isDirty("campaignWizard")(state),
      status: state.campaigns.campaignStatus,
      isTourOpen: state.global.isTourOpen,
      isTourEnabled: state.global.isTourEnabled
    }),
    {
      getOptions: CampaignOverviewActions.getDetailsOptions,
      addCampaign: CampaignOverviewActions.addCampaign,
      setDetailsChange: CampaignOverviewActions.setDetailsChange,
      toggleTour: AppActions.toggleTour,
      toggleTourStatus: AppActions.toggleTourStatus,
      enableTourStatus: AppActions.enableTourStatus,
      disableTourStatus: AppActions.disableTourStatus
    }
  )
)(CampaignDetails);
