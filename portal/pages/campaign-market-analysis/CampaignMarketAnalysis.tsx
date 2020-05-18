import React from "react";
import { FormattedMessage, injectIntl } from "react-intl";
import { getFormValues } from "redux-form";
import { compose } from "recompose";

import { KeyboardArrowRight } from "components/icons";
import { PageLayout } from "components/.";
import { NAVIGATION_URLS } from "constants/URIConstants";
import { connect } from "../../reduxConnector";
import LaborMarketActivity from "./partial/LaborMarketActivity";
import ScarcityProvince from "./partial/ScarcityProvince";
import RecruitmentPressure from "./partial/RecruitmentPressure";
import MarketAnalysisActions from "./MarketAnalysisActions";
import Button from "components/button/Button";
import { redirect } from "helpers/common";
import Tooltip from "components/tooltip";

import "./CampaignMarketAnalysis.scss";

const LOGO_PATH = "/assets/images/ig_logo.svg";

interface IProps {
  marketAnalysis: any;
  history: any;
  campaignWizard: any;
  fetchMarketAnalysis: (provinces: string[], occupationId: number) => void;
  match: any;
}

class CampaignMarketAnalysis extends React.Component<IProps> {
  componentDidMount() {
    this.fetchMarketAnalysis(this.props, true);
  }

  componentWillReceiveProps(nextProps) {
    this.fetchMarketAnalysis(nextProps);
  }

  private fetchMarketAnalysis(props, forceUpdate = false) {
    const {
      campaignWizard,
      fetchMarketAnalysis,
      marketAnalysis: { isLoaded, isLoading }
    } = props;
    if (campaignWizard && !isLoading && (!isLoaded || forceUpdate)) {
      fetchMarketAnalysis(campaignWizard.regions, campaignWizard.occupation);
    }
  }

  private onNext = () => {
    const {
      match: {
        params: { campaignId }
      },
      history
    } = this.props;

    redirect(history)(NAVIGATION_URLS.CAMPAIGN_CHANNELS, campaignId);
  };

  render() {
    const {
      marketAnalysis: { isLoading, analysis },
      campaignWizard
    } = this.props;
    return (
      <div id="campaign-market-analysis">
        <PageLayout
          page={NAVIGATION_URLS.CAMPAIGN_MARKET_ANALYSIS}
          campaignHeader={{ breadcrumbStep: NAVIGATION_URLS.CAMPAIGN_MARKET_ANALYSIS }}
          isLoading={isLoading}
          cWizard={campaignWizard}
        >
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

          <div className="footer">
            <Button
              className="next-btn"
              onClick={this.onNext}
              icon={KeyboardArrowRight}
              iconPosition="right"
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

export default compose(
  injectIntl,
  connect(
    state => ({
      campaignWizard: getFormValues("campaignWizard")(state),
      marketAnalysis: state.marketAnalysis
    }),
    {
      fetchMarketAnalysis: MarketAnalysisActions.fetchMarketAnalysis
    }
  )
)(CampaignMarketAnalysis);
