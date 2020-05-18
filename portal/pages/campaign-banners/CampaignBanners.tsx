import React from "react";

import classnames from "classnames";

import { NAVIGATION_URLS } from "constants/URIConstants";
import { PageLayout } from "components/.";
import Button from "components/button/Button";
import { KeyboardArrowRight } from "components/icons";
import { redirect } from "helpers/common";
import { connect } from "../../reduxConnector";
import { BANNER_STEPS } from "constants/constants";

import "./CampaignBanners.scss";
import "../../styles/global.scss";

interface IProps {
  history: any;
  match: any;
  isTourOpen: boolean;
  closeTour: () => void;
}

interface IState {
  selectedTab: number;
}

const tabs = ["Banner 1", "Banner 2", "Banner 3"];

class CampaignBanners extends React.Component<IProps, IState> {
  constructor(props) {
    super(props);

    this.state = {
      selectedTab: 0
    };
  }

  private renderBanners(selectedTab) {
    return selectedTab === 2 ? (
      <div className={`google-block tab-${selectedTab + 1}`}>
        <div style={{ marginBottom: 32, width: "64%" }} />
        <div style={{ height: 94, width: "64%" }} />
        <div style={{ marginBottom: 8, width: "64%" }} />
        <div style={{ marginBottom: 32, width: "64%" }} />
        <div style={{ width: "75%" }} />
        <div style={{ marginBottom: 8 }} />
        <div style={{ marginRight: 64, marginBottom: 32 }} />
        <div style={{ width: "50%" }} />
        <div style={{ height: 64 }} />
        <div style={{ marginBottom: 8, marginRight: 56, marginTop: 32 }} />
        <div style={{ marginBottom: 32, marginRight: 88 }} />
      </div>
    ) : (
      <div className={`google-block tab-${selectedTab + 1}`}>
        <div style={{ marginBottom: 32 }} />
        <div style={{ height: 86 }} />
        <div style={{ marginBottom: 8, marginRight: 32 }} />
        <div style={{ marginBottom: 32 }} />
        <div style={{ width: "75%" }} />
        <div style={{ marginBottom: 8 }} />
        <div style={{ marginRight: 64, marginBottom: 32 }} />
        <div style={{ width: "50%" }} />
        <div style={{ height: 64 }} />
      </div>
    );
  }

  private onNext = () => {
    const {
      match: {
        params: { campaignId }
      },
      history
    } = this.props;
    redirect(history)(NAVIGATION_URLS.CAMPAIGN_ADD_ONS, campaignId);
  };

  render() {
    const { selectedTab } = this.state;
    const { isTourOpen } = this.props;

    const scrollClass = isTourOpen ? "tour-scroll" : "";

    return (
      <div id="campaign-banners">
        <PageLayout
          page={NAVIGATION_URLS.CAMPAIGNS}
          campaignHeader={{ breadcrumbStep: NAVIGATION_URLS.CAMPAIGN_BANNERS }}
          isLoading={false}
          tourSteps={BANNER_STEPS()}
          pageTour={NAVIGATION_URLS.CAMPAIGN_BANNERS}
        >
          <div className="title-bar">
            <div className="page-title">Google AdWords Banners</div>
          </div>
          <div className={classnames("content", scrollClass)}>
            <ul>
              {tabs.map((tabName, index) => (
                <li
                  key={index}
                  onClick={() => this.setState({ selectedTab: index })}
                  className={selectedTab === index ? "active" : ""}
                >
                  {tabName}
                </li>
              ))}
            </ul>
            <div className="google-header">
              <span>{`http://www.website.com`}</span>
            </div>
            <div className={`google-content tab-${selectedTab + 1}`}>
              <div className={`google-title tab-${selectedTab + 1}`}>{tabs[selectedTab]}</div>
              {this.renderBanners(selectedTab)}
            </div>
          </div>
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

export default connect(
  state => ({
    isTourOpen: state.global.isTourOpen
  }),
  {}
)(CampaignBanners);
