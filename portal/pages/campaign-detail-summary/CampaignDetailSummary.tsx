import React from "react";
import { FormattedMessage, injectIntl } from "react-intl";
import { compose } from "recompose";
import _ from "lodash";
import moment from "moment";

import { connect } from "../../reduxConnector";
import { PageLayout } from "components/.";
import { NAVIGATION_URLS } from "constants/URIConstants";
import TotalCard from "../campaign-review/TotalCard";
import CampaignOverviewActions from "../campaigns/CampaignOverviewActions";
import ChannelsActions from "../campaign-channels/ChannelsActions";
import CustomersActions from "../customers/CustomersActions";
import VacancyCard from "./partial/VacancyCard";
import EducationCard from "./partial/EducationCard";
import ChannelCard from "./partial/ChannelCard";
import ChartCard from "./partial/ChartCard";
import Header from "./partial/Header";
import { selectedlItems, addOnsItems, bannerItems, socialItems, otherItems } from "helpers/common";
import { ThemeConsumer } from "constants/themes/theme-context";
import { DEFAULT_COLOR_SCHEME_SETTINGS } from "constants/constants";

import "./CampaignDetailSummary.scss";

interface IProps {
  campaignWizard: any;
  isLoading: boolean;
  educationOptions: any;
  campaignChannels: any;
  contacts: any;
  statusTypes: any;
  match: any;
  getOptions: () => void;
  getCampaignChannels: (campaignId?: number) => void;
  getCampaign: (id: number) => void;
  getCampaignStatusTypes: () => void;
  getCustomerContacts: (id) => void;
  currentUser: any;
  getUserContacts: () => void;
  userContacts: any[];
  retractCampaign: any;
  hashcode: any;
  putSharedCampaign: (id: number, date: string) => void;
  postSharedCampaign: (id: number, date: string) => void;
}

class CampaignDetailSummary extends React.Component<IProps> {
  componentWillMount() {
    const {
      getOptions,
      getCampaign,
      match: { params },
      getCampaignChannels,
      getCampaignStatusTypes,
      statusTypes
    } = this.props;

    getCampaignChannels(params.id);

    if (!statusTypes.length) {
      getCampaignStatusTypes();
    }

    getCampaign(params.id);
    getOptions();
  }

  componentWillReceiveProps(nextProps) {
    const { campaignWizard, getCustomerContacts, getUserContacts } = nextProps;

    if (campaignWizard.companyId && !this.props.campaignWizard.companyId) {
      getCustomerContacts(campaignWizard.companyId);
      getUserContacts();
    }
  }

  private handleRetractCampaign = () => {
    const { retractCampaign, campaignWizard } = this.props;
    retractCampaign(campaignWizard, "retract", "");
  };

  private getHash = async () => {
    const {
      match: { params },
      postSharedCampaign
    } = this.props;

    await postSharedCampaign(
      params.id,
      moment()
        .add(59, "d")
        .format("YYYY-MM-DD hh:mm:ss")
        .toString()
    );
  };

  render() {
    const {
      campaignWizard,
      isLoading,
      educationOptions,
      campaignChannels,
      contacts,
      statusTypes,
      currentUser,
      userContacts,
      postSharedCampaign
    } = this.props;

    const settings = JSON.parse(currentUser.portalSettings || "{}");
    const textColor = _.get(
      settings,
      "color_scheme.secondaryTextColor",
      DEFAULT_COLOR_SCHEME_SETTINGS.secondaryTextColor
    );
    const { listPrice = 0, targetPrice = 0, partnerPrice } = campaignWizard;
    const channels = _.isEmpty(campaignWizard.channels)
      ? campaignChannels
      : campaignWizard.channels;

    const status = statusTypes.find(status => status.id === campaignWizard.campaignStatus);
    const isPartnerJobHolder =
      campaignWizard.companyId !== currentUser.companyId &&
      _.find(userContacts, ["id", +campaignWizard.jobHolder]);
    const isPartnerJobContact =
      campaignWizard.companyId !== currentUser.companyId &&
      _.find(userContacts, ["id", +campaignWizard.jobContact]);
    const otherChannels = channels.filter(otherItems);
    const plainChannels = channels.filter(selectedlItems);
    const addOnsChannels = channels.filter(addOnsItems);
    const socialChannels = channels.filter(socialItems);
    const bannersChannels = channels.filter(bannerItems);

    const isMobile = window.innerWidth < 768;

    return (
      <div id="campaign-detail-summary">
        <PageLayout
          page={NAVIGATION_URLS.CAMPAIGN}
          isLoading={isLoading}
          renderHeader={
            <Header
              onRetractCamapaign={this.handleRetractCampaign}
              campaignWizard={campaignWizard}
              status={status}
              page={NAVIGATION_URLS.CAMPAIGNS}
              getHashCode={this.getHash}
              postSharedCampaign={postSharedCampaign}
            />
          }
        >
          <div className="title-bar">
            <div className="page-title">
              <FormattedMessage id="CAMPAIGN_DETAILS" />
            </div>
          </div>
          <div id="print-area">
            <VacancyCard
              campaignWizard={campaignWizard}
              allContacts={[...contacts, ...userContacts]}
              isPartnerJobHolder={isPartnerJobHolder}
              isPartnerJobContact={isPartnerJobContact}
              companyName={currentUser.companyName}
            />

            {!isMobile && <ChartCard campaignWizard={campaignWizard} />}

            <EducationCard campaignWizard={campaignWizard} educationOptions={educationOptions} />

            {!isLoading && (
              <>
                <ChannelCard channels={plainChannels} title="CHANNEL_TITLE" />

                <ChannelCard channels={addOnsChannels} title="ADD_ONS" />

                <ChannelCard channels={socialChannels} title="SOCIAL_MEDIA" />

                <ChannelCard channels={bannersChannels} title="BANNERS" />

                <ChannelCard isOtherChannel={true} channels={otherChannels} title="OTHERS" />
              </>
            )}
            <ThemeConsumer>
              {theme => (
                <TotalCard
                  listPrice={listPrice}
                  targetPrice={targetPrice}
                  partnerPrice={partnerPrice}
                  theme={theme}
                  textColor={textColor}
                />
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
    ({ campaigns, channels, customers, global }, { match: { params } }) => ({
      isLoading: channels.isLoading || campaigns.isLoading || campaigns.isSharedCampaignLoading,
      campaignChannels: channels.campaignChannels,
      campaignWizard: campaigns.campaignItems.find(item => item.id === params.id) || {},
      educationOptions: campaigns.detailOptions,
      statusTypes: campaigns.statusTypes,
      contacts: customers.contacts,
      currentUser: global.currentUser,
      userContacts: campaigns.userContacts,
      hashcode: campaigns.hashcode
    }),
    {
      getOptions: CampaignOverviewActions.getDetailsOptions,
      getCampaignChannels: ChannelsActions.getCampaignChannels,
      getCampaign: CampaignOverviewActions.getCampaign,
      getCampaignStatusTypes: CampaignOverviewActions.getCampaignStatusTypes,
      getCustomerContacts: CustomersActions.getCustomerContacts,
      getUserContacts: CampaignOverviewActions.getUserContacts,
      retractCampaign: CampaignOverviewActions.changeCampaignStatus,
      putSharedCampaign: CampaignOverviewActions.putShareCampaign,
      postSharedCampaign: CampaignOverviewActions.postSharedCampaign
    }
  )
)(CampaignDetailSummary);
