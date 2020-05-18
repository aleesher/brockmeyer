import React from "react";
import { compose } from "recompose";
import { FormattedMessage, injectIntl } from "react-intl";
import { getFormValues, Field, isDirty } from "redux-form";
import _ from "lodash";

import { KeyboardArrowRight } from "components/icons";
import { PageLayout } from "components/.";
import { NAVIGATION_URLS } from "constants/URIConstants";
import { connect, campaignForm } from "../../reduxConnector";

import TextArea from "./partials/TextArea";
import SettingsArea from "./partials/SettingsArea";
import VacancyImproverActions from "./VacancyImproverActions";
import CampaignOverviewActions from "../campaigns/CampaignOverviewActions";
import { NETHERLANDS_PROVINCE } from "constants/constants";
import PromptMessage from "./partials/PromptMessage";
import Button from "components/button/Button";
import Popconfirm from "components/popconfirm/Popconfirm";
import { redirect } from "helpers/common";

import "./CampaignVacancyImprover.scss";

const LOGO_PATH = "/assets/images/ig_logo.svg";

interface IProps {
  campaignWizard: any;
  intl: any;
  isLoading: boolean;
  addVacancyImprover: (data: any) => void;
  vacancyResult: any;
  updateCampaign: (data: any, url: string, silentUpdate: boolean) => void;
  setDefaultVacancyImprover: () => void;
  vacancyImproverStatus: string | null;
  currentUser: any;
  isFormDirty: boolean;
  history: any;
}

interface IState {
  isNetherlands: boolean;
}

class CampaignVacancyImprover extends React.Component<IProps, IState> {
  constructor(props: any) {
    super(props);

    this.state = {
      isNetherlands: false
    };
  }

  componentWillMount() {
    const { campaignWizard, setDefaultVacancyImprover } = this.props;
    const isNetherlands =
      !_.isEmpty(campaignWizard.regions) &&
      _.every(campaignWizard.regions, region => NETHERLANDS_PROVINCE.includes(region)) &&
      campaignWizard.occupation;
    setDefaultVacancyImprover();
    this.setState({ isNetherlands });
  }

  componentWillReceiveProps(nextProps) {
    const { campaignWizard, setDefaultVacancyImprover } = nextProps;
    const { campaignWizard: prevCampaign } = this.props;

    if (_.isEmpty(prevCampaign) && !_.isEmpty(campaignWizard)) {
      const isNetherlands =
        !_.isEmpty(campaignWizard.regions) &&
        _.every(campaignWizard.regions, region => NETHERLANDS_PROVINCE.includes(region)) &&
        campaignWizard.occupation;
      setDefaultVacancyImprover();
      this.setState({ isNetherlands });
    }
  }

  private sendVacancyImprover = () => {
    const { campaignWizard, addVacancyImprover } = this.props;

    addVacancyImprover(campaignWizard);
  };

  private updateCampaign = () => {
    const { campaignWizard, updateCampaign, isFormDirty, history } = this.props;
    if (isFormDirty) {
      updateCampaign(campaignWizard, NAVIGATION_URLS.CAMPAIGN_VACANCY, true);
    } else {
      redirect(history)(NAVIGATION_URLS.CAMPAIGN_VACANCY, campaignWizard.id);
    }
  };

  render() {
    const {
      isLoading,
      vacancyResult,
      intl: { formatMessage },
      vacancyImproverStatus,
      currentUser,
      isFormDirty,
      campaignWizard
    } = this.props;
    const { isNetherlands } = this.state;

    return (
      <div id="campaign-vacancy-improver">
        <PageLayout
          page={NAVIGATION_URLS.VACANCY_IMPROVER}
          campaignHeader={{ breadcrumbStep: NAVIGATION_URLS.VACANCY_IMPROVER }}
          isLoading={isLoading}
          cWizard={campaignWizard}
        >
          {isLoading && <PromptMessage status={vacancyImproverStatus} />}
          <div className="vacancy-improver-container">
            <div className="title-bar">
              <div className="page-title">
                <FormattedMessage id="JOB_DESCRIPTION" />
              </div>
              <div className="page-subtitle">
                <FormattedMessage id="VACANCY_IMPROVER_REVIEW_SHORT" />{" "}
                <a href={formatMessage({ id: "VACANCY_IMPROVER_LINK" })} target="_blank">
                  <FormattedMessage id="VACANCY_IMPROVER_LINK_TEXT" />
                </a>
              </div>
            </div>
            <div className="empty-div" />
          </div>
          <div className="vacancy-improver-container">
            <div className="text-area-box">
              <Field
                name="jobDescription"
                component={TextArea}
                isNetherlands={isNetherlands}
                currentUser={currentUser}
              />
              {isNetherlands ? (
                <a
                  className="ig-logo"
                  href="https://intelligence-group.nl/nl/oplossingen/recruitment/vacatureverbeteraar"
                  target="_blank"
                >
                  <FormattedMessage id="IG_LOGO_TEXT" tagName="span" />
                  <img src={LOGO_PATH} />
                </a>
              ) : (
                <div className="footer">
                  <Popconfirm
                    title="POPUP_SAVE"
                    onConfirm={this.updateCampaign}
                    hidePopup={!isFormDirty}
                  >
                    <Button
                      className="next-btn"
                      icon={KeyboardArrowRight}
                      iconPosition="right"
                      btnColorType="primary"
                    >
                      NEXT
                    </Button>
                  </Popconfirm>
                </div>
              )}
            </div>
            {isNetherlands && (
              <SettingsArea
                vacancyResult={vacancyResult}
                sendVacancyImprover={this.sendVacancyImprover}
                updateCampaign={this.updateCampaign}
                isFormDirty={isFormDirty}
              />
            )}
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
      isLoading: state.vacancyImprover.isLoading || state.campaigns.isSharedCampaignLoading,
      vacancyResult: state.vacancyImprover.vacancyResult,
      vacancyImproverStatus: state.vacancyImprover.vacancyImproverStatus,
      currentUser: state.global.currentUser,
      isFormDirty: isDirty("campaignWizard")(state)
    }),
    {
      addVacancyImprover: VacancyImproverActions.addVacancyImprover,
      updateCampaign: CampaignOverviewActions.addCampaign,
      setDefaultVacancyImprover: VacancyImproverActions.setDefaultVacancyImprover
    }
  )
)(CampaignVacancyImprover);
