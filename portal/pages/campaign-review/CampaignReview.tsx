import React, { Fragment } from "react";
import _ from "lodash";
import { compose } from "recompose";
import { getFormValues } from "redux-form";
import { FormattedMessage, injectIntl, InjectedIntlProps } from "react-intl";
import { STEPS_CAMPAIGN_REVIEW } from "constants/constants";

import { KeyboardArrowRight } from "components/icons";
import Button from "components/button/Button";
import CampaignCard from "./CampaignCard";
import CampaignOverviewActions from "../campaigns/CampaignOverviewActions";
import ChannelStatistics from "../campaign-channels/partial/ChannelStatistics";

import Popconfirm from "components/popconfirm/Popconfirm";
import TotalCard from "./TotalCard";
import { IChannel } from "models/.";
import { NAVIGATION_URLS } from "constants/URIConstants";
import { PageLayout } from "components/.";
import { connect } from "../../reduxConnector";
import { ThemeConsumer } from "constants/themes/theme-context";
import {
  formatPrice,
  selectedlItems,
  addOnsItems,
  bannerItems,
  socialItems,
  filterAddons,
  redirect,
  getStatusName,
  otherItems,
  getDownloadData
} from "helpers/common";
import {
  DEFAULT_COLOR_SCHEME_SETTINGS,
  PARTNER_ADMIN,
  COMPANY_ADMIN_ROLE
} from "constants/constants";
import DownloadSummary from "./DownloadSummary";

import "./CampaignReview.scss";

interface IProps {
  approveCampaign: any;
  campaignChannels: any;
  campaignChannelsLoaded: boolean;
  campaignWizard: any;
  channelItems: IChannel[];
  isLoading: boolean;
  status: any;
  isTourOpen: boolean;
  currentUser: any;
}

interface IState {
  brockmeyerAgreement: boolean;
  campaignAgreement: boolean;
  statisticsIsVisible: boolean;
  isMobile: boolean;
}

class CampaignReview extends React.Component<IProps & InjectedIntlProps, IState> {
  constructor(props) {
    super(props);

    this.state = {
      statisticsIsVisible: false,
      campaignAgreement: false,
      brockmeyerAgreement: false,
      isMobile: window.innerWidth < 1200
    };
  }

  componentWillReceiveProps(props) {
    const { status } = props;

    if (!_.isEmpty(status) && status.name !== "order_new") {
      this.setState({ campaignAgreement: true, brockmeyerAgreement: true });
    }
  }

  private onCheckAgree = ({ target }) => {
    const campaignAgreement = !this.state.campaignAgreement;
    const brockmeyerAgreement = !this.state.brockmeyerAgreement;
    target.id === "agree-campaign" && this.setState({ campaignAgreement });
    target.id === "agree-brockmeyer" && this.setState({ brockmeyerAgreement });
  };

  private onNext = () => {
    const { campaignWizard, status, approveCampaign, history } = this.props;
    const { isMobile } = this.state;
    const statusName = getStatusName(status);
    if (statusName === "order_new") {
      approveCampaign(campaignWizard, "approve", NAVIGATION_URLS.VACANCY_IMPROVER);
    } else if (!isMobile) {
      redirect(history)(NAVIGATION_URLS.VACANCY_IMPROVER, campaignWizard.id);
    } else {
      redirect(history)(NAVIGATION_URLS.CAMPAIGN_VACANCY, campaignWizard.id);
    }
  };

  private get selectedChannels() {
    const { campaignChannels } = this.props;
    return campaignChannels;
  }

  private showStats = () => {
    this.setState({ statisticsIsVisible: !!this.selectedChannels.length });
  };

  private getAddOnsChannels = () => {
    const defaultAddOn = {
      addedToCampaign: false,
      channelType: 19,
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

    const items = this.selectedChannels.filter(addOnsItems);
    return items.length ? items : [defaultAddOn];
  };

  render() {
    const { statisticsIsVisible, campaignAgreement, brockmeyerAgreement } = this.state;
    const {
      campaignWizard,
      isLoading,
      status,
      isTourOpen,
      currentUser,
      intl: { formatMessage }
    } = this.props;
    const {
      jobTitle = "",
      companyName = "",
      listPrice = 0,
      targetPrice = 0,
      partnerPrice,
      id = ""
    } = campaignWizard;
    const otherChannels = this.selectedChannels.filter(otherItems);
    const plainChannels = this.selectedChannels.filter(selectedlItems);
    const addOnsChannels = this.getAddOnsChannels();
    const socialChannels = this.selectedChannels.filter(socialItems);
    const bannersChannels = this.selectedChannels.filter(bannerItems);
    const statisticsChannels = filterAddons(this.selectedChannels);
    const statusName = getStatusName(status);
    const statusID = _.get(status, "id", "60");
    const buttonText = statusName === "order_new" ? "AGREEMENT" : "NEXT";
    const totalPayment = formatPrice(partnerPrice || targetPrice);
    const settings = JSON.parse(currentUser.portalSettings || "{}");
    const textColor = _.get(
      settings,
      "color_scheme.secondaryTextColor",
      DEFAULT_COLOR_SCHEME_SETTINGS.secondaryTextColor
    );
    const approvementAllowed =
      _.get(currentUser, "roleName", "") === PARTNER_ADMIN ||
      _.get(currentUser, "roleName", "") === COMPANY_ADMIN_ROLE;

    const mainCardData = {
      companyName,
      jobTitle,
      id,
      statusID
    };

    const downloadData = getDownloadData({
      plainChannels,
      addOnsChannels,
      socialChannels,
      bannersChannels,
      otherChannels,
      formatMessage
    });

    const totalCardData = {
      listPrice,
      partnerPrice,
      targetPrice,
      textColor
    };

    return (
      <div className="campaign-review">
        <PageLayout
          page={NAVIGATION_URLS.CAMPAIGN_REVIEW}
          campaignHeader={{ breadcrumbStep: NAVIGATION_URLS.CAMPAIGN_REVIEW }}
          isLoading={isLoading}
          cWizard={campaignWizard}
          tourSteps={STEPS_CAMPAIGN_REVIEW(
            plainChannels.length > 0,
            addOnsChannels.length > 0,
            socialChannels.length > 0,
            bannersChannels.length > 0,
            otherChannels.length > 0,
            campaignAgreement,
            brockmeyerAgreement
          )}
        >
          <ChannelStatistics
            channels={statisticsChannels}
            visible={statisticsIsVisible}
            onClose={() => this.setState({ statisticsIsVisible: false })}
          />
          <div className="title-bar">
            <div className="page-title">
              <FormattedMessage id="REVIEW" />
            </div>
            <div className="page-subtitle">
              <FormattedMessage id="CAMPAIGN_REVIEW_TEXT" />
            </div>
          </div>
          <ThemeConsumer>
            {theme => (
              <Fragment>
                <div id="print-area">
                  <CampaignCard
                    title="YOUR_VACANCY"
                    url={NAVIGATION_URLS.CAMPAIGN_DETAILS}
                    readonly={statusName === "order_new"}
                    campaign={campaignWizard}
                    idProps="vacancy-review"
                  >
                    <h1 style={{ color: theme.primary_color }}>{jobTitle}</h1>
                    <h4>
                      <FormattedMessage id="FOR" /> {companyName}
                    </h4>
                    <div className="proposal-id-title">
                      {statusID === "60" ? (
                        <FormattedMessage id="PROPOSAL_ID" />
                      ) : (
                        <FormattedMessage id="CAMPAIGN_ID" />
                      )}
                      : {campaignWizard.id}
                    </div>
                  </CampaignCard>

                  <CampaignCard
                    title="CHANNEL_TITLE"
                    items={plainChannels}
                    url={NAVIGATION_URLS.CAMPAIGN_CHANNELS}
                    onClickStats={this.showStats}
                    readonly={statusName === "order_new"}
                    campaign={campaignWizard}
                    idProps="channel-review"
                    isLoading={isLoading}
                  />

                  <CampaignCard
                    title="ADD_ONS"
                    items={addOnsChannels}
                    url={NAVIGATION_URLS.CAMPAIGN_ADD_ONS}
                    withoutInfo
                    readonly={statusName === "order_new"}
                    campaign={campaignWizard}
                    idProps="add-ons-review"
                    isLoading={isLoading}
                  />

                  <CampaignCard
                    title="SOCIAL_MEDIA"
                    items={socialChannels}
                    url={NAVIGATION_URLS.CAMPAIGN_SOCIAL_MEDIA}
                    onClickStats={this.showStats}
                    readonly={statusName === "order_new"}
                    campaign={campaignWizard}
                    idProps="social-media-review"
                    isLoading={isLoading}
                  />

                  <CampaignCard
                    title="BANNERS"
                    items={bannersChannels}
                    url={NAVIGATION_URLS.CAMPAIGN_BANNERS}
                    onClickStats={this.showStats}
                    readonly={statusName === "order_new"}
                    campaign={campaignWizard}
                    idProps="banners-review"
                    isLoading={isLoading}
                  />

                  <CampaignCard
                    title="OTHERS"
                    items={otherChannels}
                    url={NAVIGATION_URLS.CAMPAIGN_CHANNELS}
                    onClickStats={this.showStats}
                    readonly={statusName === "order_new"}
                    campaign={campaignWizard}
                    idProps="others-review"
                    isLoading={isLoading}
                  />

                  <TotalCard
                    listPrice={listPrice}
                    partnerPrice={partnerPrice}
                    targetPrice={targetPrice}
                    isLoading={isLoading}
                    theme={theme}
                    textColor={textColor}
                  />
                </div>
                <div className="pdfs">
                  {!isLoading && (
                    <DownloadSummary
                      mainCardData={mainCardData}
                      channelsCardData={downloadData}
                      totalCardData={totalCardData}
                      theme={theme}
                      formatMessage={formatMessage}
                      // settings={settings}
                      text="DOWNLOAD_ORIGINAL_SUMMARY"
                    />
                  )}
                </div>
                <div className="pdfs">
                  {partnerPrice && !isLoading && (
                    <DownloadSummary
                      mainCardData={mainCardData}
                      channelsCardData={downloadData}
                      totalCardData={totalCardData}
                      theme={theme}
                      formatMessage={formatMessage}
                      // settings={settings}
                      text="DOWNLOAD_SUMMARY_CUSTOMER"
                      customer
                    />
                  )}
                </div>
              </Fragment>
            )}
          </ThemeConsumer>
          {approvementAllowed && (
            <div className="agrees">
              {statusName === "order_new" && (
                <>
                  <div className="agree-block first-node">
                    <label htmlFor="agree-campaign" className="checkbox agree-text">
                      <input
                        id="agree-campaign"
                        type="checkbox"
                        checked={campaignAgreement}
                        onChange={this.onCheckAgree}
                      />
                      <span className="checkmark" />
                      <FormattedMessage id="AGREE_WITH_CONTENT" />
                    </label>
                  </div>
                  <div className="agree-block">
                    <label className="checkbox agree-text" htmlFor="agree-brockmeyer">
                      <input
                        id="agree-brockmeyer"
                        type="checkbox"
                        checked={brockmeyerAgreement}
                        onChange={this.onCheckAgree}
                      />
                      <span className="checkmark" />
                      <FormattedMessage id="AGREE_WITH_BROCKMEYER" />
                    </label>
                  </div>
                </>
              )}
            </div>
          )}
          <div className="footer">
            {statusName === "order_new" ? (
              approvementAllowed && (
                <Popconfirm
                  key={Math.random()}
                  title={{ text: "ACCEPT_AGREEMENT", values: { money: totalPayment } }}
                  okText="OK"
                  cancelText="CANCEL"
                  onConfirm={this.onNext}
                  width="285px"
                  isTourOpen={isTourOpen}
                >
                  <Button
                    icon={KeyboardArrowRight}
                    iconPosition="right"
                    disabled={!campaignAgreement || !brockmeyerAgreement}
                    btnColorType="primary"
                  >
                    {buttonText}
                  </Button>
                </Popconfirm>
              )
            ) : (
              <Button
                icon={KeyboardArrowRight}
                iconPosition="right"
                onClick={this.onNext}
                btnColorType="primary"
              >
                {buttonText}
              </Button>
            )}
          </div>
        </PageLayout>
      </div>
    );
  }
}

export default compose(
  injectIntl,
  connect(
    state => ({
      campaignChannels: state.channels.campaignChannels,
      campaignChannelsLoaded: state.channels.campaignChannelsLoaded,
      campaignWizard: getFormValues("campaignWizard")(state) || {},
      isLoading:
        state.channels.isLoading ||
        state.campaigns.isLoading ||
        state.campaigns.isSharedCampaignLoading,
      status: state.campaigns.campaignStatus,
      isTourOpen: state.global.isTourOpen,
      currentUser: state.global.currentUser
    }),
    {
      approveCampaign: CampaignOverviewActions.changeCampaignStatus
    }
  )
)(CampaignReview);
