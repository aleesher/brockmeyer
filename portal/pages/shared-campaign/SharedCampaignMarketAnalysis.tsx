import React from "react";
import { FormattedMessage, injectIntl } from "react-intl";
import { compose } from "recompose";
import _ from "lodash";

import { PageLayout } from "components/.";
import { NAVIGATION_URLS } from "constants/URIConstants";
import { connect } from "../../reduxConnector";
import LaborMarketActivity from "../campaign-market-analysis/partial/LaborMarketActivity";
import ScarcityProvince from "../campaign-market-analysis/partial/ScarcityProvince";
import RecruitmentPressure from "../campaign-market-analysis/partial/RecruitmentPressure";
import MarketAnalysisActions from "../campaign-market-analysis/MarketAnalysisActions";
import Tooltip from "components/tooltip";
import CampaignOverviewActions from "../campaigns/CampaignOverviewActions";
import Header from "../campaign-detail-summary/partial/Header";
import CampaignTab from "./partial/CampaignTab";
import { hasMarketAnalysis as marketAnalysisExists } from "helpers/common";

import "../campaign-market-analysis/CampaignMarketAnalysis.scss";

const LOGO_PATH = "/assets/images/ig_logo.svg";

interface IProps {
  marketAnalysis: any;
  history: any;
  fetchMarketAnalysis: (provinces: string[], occupationId: number) => void;
  match: any;
  location: any;
  sharedCampaign: any;
  getSharedCampaign: (hash) => void;
}

class CampaignMarketAnalysis extends React.Component<IProps> {
  componentDidMount() {
    const {
      getSharedCampaign,
      match: { params }
    } = this.props;
    getSharedCampaign(params.id);
    this.fetchMarketAnalysis(this.props, true);
  }

  componentWillReceiveProps(nextProps) {
    this.fetchMarketAnalysis(nextProps);
  }

  private fetchMarketAnalysis(props, forceUpdate = false) {
    const {
      sharedCampaign,
      fetchMarketAnalysis,
      marketAnalysis: { isLoaded, isLoading }
    } = props;

    if (!_.isEmpty(sharedCampaign) && !isLoading && (!isLoaded || forceUpdate)) {
      fetchMarketAnalysis(
        sharedCampaign.regions,
        _.get(sharedCampaign, "occupation.id", ""),
        _.get(sharedCampaign, "occupation.iscoGroupId", "")
      );
    }
  }

  render() {
    const {
      marketAnalysis: { isLoading, analysis },
      sharedCampaign,
      match: { params }
    } = this.props;

    let lang = navigator.language.slice(0, 2);
    if (lang !== "en" && lang !== "nl") {
      lang = "nl";
    }
    const hasMarketAnalysis = marketAnalysisExists(sharedCampaign);

    return (
      <div id="campaign-market-analysis">
        <PageLayout
          page={NAVIGATION_URLS.SHARED_CAMPAIGN}
          isLoading={isLoading}
          renderHeader={
            <Header
              campaignWizard={sharedCampaign}
              status={sharedCampaign.campaignStatus}
              page={NAVIGATION_URLS.SHARED_CAMPAIGN}
            />
          }
        >
          <CampaignTab
            sharedCampaignId={params.id}
            tabIndex={_.get(sharedCampaign, "campaignStatus.id") === "60" ? 0 : 1}
            hasMarketAnalysis={hasMarketAnalysis}
            statusNew={_.get(sharedCampaign, "campaignStatus.id") === "60"}
          />
          <div className="title-bar">
            <div className="page-title">
              <FormattedMessage id="MARKET_ANALYSIS" />
              <Tooltip id="MARKET_ANALYSIS_INFO" />
            </div>
          </div>

          <RecruitmentPressure analysis={analysis} />

          <LaborMarketActivity analysis={analysis} />

          <ScarcityProvince analysis={analysis} />

          <a
            className="ig-logo"
            href="https://intelligence-group.nl/nl/doelgroepen-dashboard"
            target="_blank"
          >
            <FormattedMessage id="IG_LOGO_TEXT" tagName="span" />
            <img src={LOGO_PATH} />
          </a>
        </PageLayout>
      </div>
    );
  }
}

export default compose(
  injectIntl,
  connect(
    state => ({
      sharedCampaign: state.campaigns.shared_campaign || {},
      marketAnalysis: state.marketAnalysis
    }),
    {
      fetchMarketAnalysis: MarketAnalysisActions.fetchMarketAnalysis,
      getSharedCampaign: CampaignOverviewActions.getSharedCampaign
    }
  )
)(CampaignMarketAnalysis);
