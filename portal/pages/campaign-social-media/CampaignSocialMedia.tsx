import React from "react";
import { getFormValues } from "redux-form";

import { KeyboardArrowRight } from "components/icons";
import ChannelsActions from "../campaign-channels/ChannelsActions";
import FacebookCard from "./FacebookCard";
import { BANNERS_ID } from "constants/constants";
import { connect } from "../../reduxConnector";
import { NAVIGATION_URLS } from "constants/URIConstants";
import { PageLayout } from "components/.";
import Button from "components/button/Button";
import { redirect } from "helpers/common";
import { STEPS_SOCIAL_MEDIA } from "constants/constants";

import "./CampaignSocialMedia.scss";
import "../../styles/global.scss";

interface IProps {
  campaignWizard: any;
  history: any;
  getCampaignChannels: (id: number) => void;
  campaignChannels: any;
  isTourOpen: boolean;
}

interface IState {
  isLoading: boolean;
  selectedTab: number;
}

class CampaignSocialMedia extends React.Component<IProps, IState> {
  constructor(props: any) {
    super(props);

    this.state = {
      isLoading: false,
      selectedTab: 0
    };
  }

  componentDidUpdate(prevProps) {
    const { campaignWizard, getCampaignChannels } = this.props;
    if (!prevProps.campaignWizard.id && campaignWizard.id) {
      getCampaignChannels(campaignWizard.id);
    }
  }

  private onNext = () => {
    const {
      history,
      campaignChannels,
      campaignWizard: { id: campaignId }
    } = this.props;
    const hasBanners = campaignChannels.some(({ channelType }) => channelType === BANNERS_ID);
    const url = hasBanners ? NAVIGATION_URLS.CAMPAIGN_BANNERS : NAVIGATION_URLS.CAMPAIGN_ADD_ONS;
    redirect(history)(url, campaignId);
  };

  render() {
    const { campaignWizard, isTourOpen } = this.props;
    const { selectedTab, isLoading } = this.state;
    const { jobTitle, companyName } = campaignWizard;

    return (
      <div id="campaign-social-media">
        <PageLayout
          page={NAVIGATION_URLS.CAMPAIGNS}
          pageTour={NAVIGATION_URLS.CAMPAIGN_SOCIAL_MEDIA}
          campaignHeader={{ breadcrumbStep: NAVIGATION_URLS.CAMPAIGN_SOCIAL_MEDIA }}
          isLoading={isLoading}
          cWizard={campaignWizard}
          tourSteps={STEPS_SOCIAL_MEDIA()}
        >
          <div className="title-bar">
            <div className="page-title">Social media</div>
          </div>
          <FacebookCard
            companyName={companyName}
            jobTitle={jobTitle}
            onClick={index => this.setState({ selectedTab: index })}
            selectedTab={selectedTab}
            isTourOpen={isTourOpen}
          />
          <div className="footer">
            <Button
              icon={KeyboardArrowRight}
              iconPosition="right"
              className="next-btn"
              onClick={this.onNext}
              btnColorType="primary"
            >
              NEXT
            </Button>
          </div>
        </PageLayout>
      </div>
    );
  }
}

export default connect(
  state => ({
    campaignWizard: getFormValues("campaignWizard")(state) || {},
    campaignChannels: state.channels.campaignChannels,
    isTourOpen: state.global.isTourOpen
  }),
  { getCampaignChannels: ChannelsActions.getCampaignChannels }
)(CampaignSocialMedia);
