import React from "react";
import { FormattedMessage, injectIntl, InjectedIntlProps } from "react-intl";
import { compose } from "recompose";
import _ from "lodash";
import { connect } from "../../reduxConnector";
import { PageLayout } from "components/.";
import { NAVIGATION_URLS } from "constants/URIConstants";
import CampaignOverviewActions from "../campaigns/CampaignOverviewActions";
import CustomersActions from "../customers/CustomersActions";
import VacancyCard from "../campaign-detail-summary/partial/VacancyCard";
import EducationCard from "../campaign-detail-summary/partial/EducationCard";
import JobDescriptionCard from "./partial/JobDescriptionCard";
import ChartCard from "../campaign-detail-summary/partial/ChartCard";
import Header from "../campaign-detail-summary/partial/Header";
import CampaignTab from "./partial/CampaignTab";
import ChannelCardList from "./partial/ChannelCardList";

import { ThemeConsumer } from "constants/themes/theme-context";
import { DEFAULT_COLOR_SCHEME_SETTINGS } from "constants/constants";
import { hasMarketAnalysis as marketAnalysisExists, getDownloadData } from "helpers/common";
import CampaignCard from "../campaign-review/CampaignCard";
import TotalCard from "../campaign-review/TotalCard";
import ChannelStatistics from "../campaign-channels/partial/ChannelStatistics";
import DownloadSummary from "../campaign-review/DownloadSummary";
import { IChannel } from "models/Channel";
import {
  selectedlItems,
  addOnsItems,
  bannerItems,
  socialItems,
  otherItems,
  filterAddons
} from "helpers/common";

import "./SharedCampaign.scss";

interface IProps {
  campaignWizard: any;
  isLoading: boolean;
  educationOptions: any;
  campaignChannels: any;
  contacts: any;
  statusTypes: any;
  match: any;
  getOptions: () => void;
  getCampaignStatusTypes: () => void;
  getCustomerContacts: (id) => void;
  getUserContacts: () => void;
  getSharedCampaign: (hash) => void;
  currentUser: any;
  userContacts: any[];
  retractCampaign: any;
  jobDescription: string;
  hashcode: any;
  shared_campaign: any;
  isSharedCampaignLoading: boolean;
  sharedCampaignChannels: any;
}

interface IState {
  statisticsChannels: IChannel[];
}

class SharedCampaign extends React.Component<IProps & InjectedIntlProps, IState> {
  constructor(props) {
    super(props);

    this.state = {
      statisticsChannels: []
    };
  }

  componentDidMount() {
    const {
      match: { params },
      getSharedCampaign
    } = this.props;

    getSharedCampaign(params.id);
  }

  private handleRetractCampaign = () => {
    const { retractCampaign, campaignWizard } = this.props;
    retractCampaign(campaignWizard, "retract", "");
  };

  private showStats = () => {
    const { campaignWizard } = this.props;
    const channels = !_.isEmpty(campaignWizard.campaignChannels)
      ? campaignWizard.campaignChannels
      : [];
    if (channels && channels.length) {
      this.setState({ statisticsChannels: filterAddons(channels) });
    }
  };

  render() {
    const {
      campaignWizard,
      isLoading,
      educationOptions,
      contacts,
      jobDescription,
      match: { params },
      isSharedCampaignLoading,
      intl: { formatMessage }
    } = this.props;
    const { statisticsChannels } = this.state;

    let lang = navigator.language.slice(0, 2);

    if (lang !== "en" && lang !== "nl") {
      lang = "nl";
    }
    const textColor = _.get(
      campaignWizard,
      "partner.portalSettings.secondaryTextColor",
      DEFAULT_COLOR_SCHEME_SETTINGS.secondaryTextColor
    );

    const { listPrice = 0, targetPrice = 0 } = campaignWizard;
    const isMobile = window.innerWidth < 768;
    const channels = !_.isEmpty(campaignWizard.campaignChannels)
      ? campaignWizard.campaignChannels
      : [];
    const otherChannels = channels.filter(otherItems);
    const plainChannels = channels.filter(selectedlItems);
    const addOnsChannels = channels.filter(addOnsItems);
    const socialChannels = channels.filter(socialItems);
    const bannersChannels = channels.filter(bannerItems);
    const hasMarketAnalysis = marketAnalysisExists(campaignWizard);
    const statusID = _.get(campaignWizard, "campaignStatus.id", "60");
    const statusNew = statusID === "60";
    const companyName = _.get(campaignWizard, "company.name", "");
    const { jobTitle = "", id = "" } = campaignWizard;
    const settings = JSON.parse(_.get(campaignWizard.partner, "portalSettings", "{}"));
    const font = _.get(settings, "font", "Raleway");

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
      targetPrice,
      textColor
    };

    return (
      <div id="shared-campaign-detail-summary">
        <PageLayout
          page={NAVIGATION_URLS.SHARED_CAMPAIGN}
          isLoading={isSharedCampaignLoading}
          renderHeader={
            <Header
              onRetractCamapaign={this.handleRetractCampaign}
              campaignWizard={campaignWizard}
              status={campaignWizard.campaignStatus}
              page={NAVIGATION_URLS.SHARED_CAMPAIGN}
              isLoading={isLoading}
            />
          }
        >
          <ChannelStatistics
            channels={statisticsChannels}
            visible={statisticsChannels.length > 0}
            onClose={() => this.setState({ statisticsChannels: [] })}
          />
          <CampaignTab
            sharedCampaignId={params.id}
            tabIndex={statusNew ? 1 : 0}
            hasMarketAnalysis={hasMarketAnalysis}
            statusNew={statusNew}
          />

          <div className="title-bar">
            <div className="page-title">
              {!statusNew ? (
                <FormattedMessage id="CAMPAIGN_DETAILS" />
              ) : (
                <FormattedMessage id="PROPOSAL_DETAILS" />
              )}
            </div>
          </div>
          <div id="print-area">
            {statusNew && (
              <ThemeConsumer>
                {theme => (
                  <CampaignCard
                    title="VACANCY_TITLE"
                    url={NAVIGATION_URLS.CAMPAIGN_DETAILS}
                    campaign={campaignWizard}
                    idProps="vacancy-review"
                    isLoading={isLoading}
                  >
                    <h1 style={{ color: theme.primary_color }}>{jobTitle}</h1>
                    <h4>
                      <FormattedMessage id="FOR" /> {companyName}
                    </h4>
                    <div className="proposal-id-title">
                      <FormattedMessage id="PROPOSAL_ID" />: {campaignWizard.id}
                    </div>
                  </CampaignCard>
                )}
              </ThemeConsumer>
            )}
            {!statusNew && (
              <VacancyCard
                campaignWizard={campaignWizard}
                allContacts={[...contacts]}
                isPartnerJobHolder={false}
                isPartnerJobContact={false}
                sharedJobContact={campaignWizard.jobContact}
                sharedJobHolder={campaignWizard.jobHolder}
              />
            )}

            {!isMobile && !statusNew && <ChartCard campaignWizard={campaignWizard} />}
            <EducationCard campaignWizard={campaignWizard} educationOptions={educationOptions} />
            {jobDescription && !statusNew && (
              <JobDescriptionCard job_description={jobDescription} />
            )}

            {!isLoading && (
              <>
                <ChannelCardList
                  channels={plainChannels}
                  title="CHANNEL_TITLE"
                  page={NAVIGATION_URLS.SHARED_CAMPAIGN}
                  onClickStats={this.showStats}
                  status={statusID}
                  images
                />

                <ChannelCardList
                  channels={addOnsChannels}
                  title="ADD_ONS"
                  page={NAVIGATION_URLS.SHARED_CAMPAIGN}
                  status={statusID}
                  images
                />

                <ChannelCardList
                  channels={socialChannels}
                  title="SOCIAL_MEDIA"
                  page={NAVIGATION_URLS.SHARED_CAMPAIGN}
                  status={statusID}
                  onClickStats={this.showStats}
                  images
                />

                <ChannelCardList
                  channels={bannersChannels}
                  title="BANNERS"
                  page={NAVIGATION_URLS.SHARED_CAMPAIGN}
                  onClickStats={this.showStats}
                  status={statusID}
                  images
                />

                <ChannelCardList
                  isOtherChannel={true}
                  channels={otherChannels}
                  title="OTHERS"
                  page={NAVIGATION_URLS.SHARED_CAMPAIGN}
                  onClickStats={this.showStats}
                  status={statusID}
                  images
                />
              </>
            )}
            <ThemeConsumer>
              {theme => (
                <div>
                  <TotalCard
                    listPrice={listPrice}
                    theme={theme}
                    targetPrice={targetPrice}
                    textColor={textColor}
                    isLoading={isLoading}
                  />
                  <div className="pdfs">
                    {!isLoading && font && (
                      <DownloadSummary
                        mainCardData={mainCardData}
                        channelsCardData={downloadData}
                        totalCardData={totalCardData}
                        theme={theme}
                        formatMessage={formatMessage}
                        customer
                        // settings={settings}
                        text="DOWNLOAD_SUMMARY"
                      />
                    )}
                  </div>
                </div>
              )}
            </ThemeConsumer>
          </div>
        </PageLayout>
      </div>
    );
  }
}

export default compose(
  injectIntl,
  connect(
    state => ({ campaigns, channels, customers, global }, { match: { params } }) => {
      return {
        isLoading: channels.isLoading || campaigns.isLoading || campaigns.isSharedCampaignLoading,
        campaignChannels: channels.campaignChannels,
        sharedCampaignChannels: channels.sharedCampaignChannels,
        campaignWizard: campaigns.shared_campaign || {},
        educationOptions: campaigns.sharedCampaignDetailOptions,
        jobDescription: (campaigns.shared_campaign || {}).jobDescription,
        statusTypes: campaigns.statusTypes,
        contacts: customers.contacts,
        currentUser: global.currentUser,
        userContacts: campaigns.userContacts,
        hashcode: campaigns.hashcode,
        shared_campaign: campaigns.shared_campaign,
        isSharedCampaignLoading: campaigns.isSharedCampaignLoading
      };
    },
    {
      getOptions: CampaignOverviewActions.getDetailsOptions,
      getCampaignStatusTypes: CampaignOverviewActions.getCampaignStatusTypes,
      getCustomerContacts: CustomersActions.getCustomerContacts,
      getUserContacts: CampaignOverviewActions.getUserContacts,
      retractCampaign: CampaignOverviewActions.changeCampaignStatus,
      getSharedCampaign: CampaignOverviewActions.getSharedCampaign
    }
  )
)(SharedCampaign);
