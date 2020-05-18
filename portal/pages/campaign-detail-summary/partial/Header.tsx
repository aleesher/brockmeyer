import React from "react";
import { FormattedMessage } from "react-intl";
import { Link } from "react-router-dom";
import _ from "lodash";
import { compose } from "recompose";
import { withRouter } from "react-router";

import InputWithEditIcon from "components/inputs/InputWithEditIcon";
import { NAVIGATION_URLS } from "constants/URIConstants";
import { KeyboardArrowLeft } from "components/icons";
import Popconfirm from "components/popconfirm/Popconfirm";
import Button from "components/button/Button";
import ModalTemplate from "components/modals/ModalTemplate";
import ShareCampaignModal from "../../../pages/shared-campaign/partial/ShareCampaignModal";
import { connect } from "../../../reduxConnector";
import CampaignOverviewActions from "../../../pages/campaigns/CampaignOverviewActions";

import "./Header.scss";

interface IProps {
  campaignWizard: any;
  status: any;
  onRetractCamapaign?: () => void;
  page?: string;
  getHashCode?: () => void;
  postSharedCampaign?: (id: number, date: string) => void;
  hashcode: any;
  match: any;
  getShareCampaign: (id: number) => void;
}
interface IState {
  showShareModal: boolean;
}

class Header extends React.Component<IProps, IState> {
  constructor(props) {
    super(props);
    this.state = {
      showShareModal: false
    };
  }

  componentDidMount() {
    const {
      match: {
        params: { id }
      },
      page,
      getShareCampaign
    } = this.props;

    if (page !== NAVIGATION_URLS.SHARED_CAMPAIGN) {
      getShareCampaign(id);
    }
  }

  private retrieveRedirectLink = () => {
    const {
      campaignWizard: { campaignStatus, id, campaignChannels },
      campaignWizard
    } = this.props;

    const url = window.location.href
      .split("/")
      .slice(0, 3)
      .join("/");

    const name = _.get(campaignStatus, "name", "");

    if (name === "order_new" || name === "order_open") {
      const isDetailsEmpty = _.some(
        _.pick(campaignWizard, ["educations", "sector", "regions", "jobProfiles"]),
        _.isEmpty
      );

      if (isDetailsEmpty) {
        return `${url}${NAVIGATION_URLS.CAMPAIGN_DETAILS}/${id}`;
      } else if (campaignChannels.length === 0) {
        return `${url}${NAVIGATION_URLS.CAMPAIGN_CHANNELS}/${id}/suggested`;
      } else {
        if (name === "order_open") {
          return `${url}${NAVIGATION_URLS.CAMPAIGN_VACANCY}/${id}`;
        }
        return `${url}${NAVIGATION_URLS.CAMPAIGN_REVIEW}/${id}`;
      }
    } else {
      return `${url}${NAVIGATION_URLS.CAMPAIGN}/${id}`;
    }
  };

  private openShareModal = async () => {
    this.setState(prevState => ({ showShareModal: !prevState.showShareModal }));
  };

  render() {
    const {
      campaignWizard: { jobTitle, companyName, company },
      status,
      onRetractCamapaign,
      page,
      match: { params },
      hashcode
    } = this.props;

    const statusName = status ? status.name : "order_new";
    const customerName = company ? company.name : companyName;
    return (
      <div id="header-campaign">
        <div className="header pos-relative">
          {page !== NAVIGATION_URLS.SHARED_CAMPAIGN && (
            <Link to={NAVIGATION_URLS.CAMPAIGNS} className="header-row-back">
              <img src="/assets/images/curled-arrow.svg" />
              <div className="back-to-campaigns">
                <FormattedMessage id="CAMPAIGNS" tagName="p" />
              </div>
            </Link>
          )}
          <div className="header-row-campaign-name">
            <Link to={NAVIGATION_URLS.CAMPAIGNS} className="mobile-back-btn">
              <KeyboardArrowLeft />
            </Link>
            <InputWithEditIcon
              value={jobTitle}
              className="campaign-name"
              onSave={() => console.log("jobTitle")}
              originalUrl={this.retrieveRedirectLink()}
              page={page}
              readOnly
            />
          </div>
          {page !== NAVIGATION_URLS.SHARED_CAMPAIGN && (
            <div className="share-campaign-btn mobile">
              <Button
                onClick={() => this.openShareModal()}
                className="share-campaign-button button-retract"
                id="share-capaign"
                btnColorType="shared"
              >
                SHARE
              </Button>
            </div>
          )}
          <div className="header-row-company">
            <div className={`status-container ${statusName}`}>
              <FormattedMessage id={statusName.toUpperCase()} tagName="p" />
            </div>
            <div className="company-name-container">
              <p>{customerName}</p>
            </div>
          </div>
          <div className="buttons-container container-retract">
            {page !== NAVIGATION_URLS.SHARED_CAMPAIGN && onRetractCamapaign && (
              <Popconfirm
                key={Math.random()}
                title="SURE_TO_RETRACT"
                okText="YES"
                onConfirm={onRetractCamapaign}
                visible={statusName === "order_online"}
                width="370px"
                textPadding="20px"
                buttonsPadding="0 24px 20px"
              >
                <Button className="button-retract" btnColorType="secondary">
                  RETRACT_CAMPAIGN
                </Button>
              </Popconfirm>
            )}
            {page !== NAVIGATION_URLS.SHARED_CAMPAIGN && (
              <div className="share-campaign-btn">
                <Button
                  onClick={() => this.openShareModal()}
                  className="share-campaign-button button-retract"
                  id="share-capaign"
                  btnColorType="shared"
                >
                  SHARE
                </Button>
              </div>
            )}
          </div>
        </div>
        <ModalTemplate
          open={this.state.showShareModal}
          onClose={() => this.setState({ showShareModal: false })}
          alignCenter
        >
          <ShareCampaignModal
            onClose={() => this.openShareModal()}
            campaignHash={hashcode}
            id={params.campaignId}
            statusName={statusName}
          />
        </ModalTemplate>
      </div>
    );
  }
}

export default compose(
  withRouter,
  connect(
    state => ({
      hashcode: state.campaigns.hashcode
    }),
    {
      getShareCampaign: CampaignOverviewActions.getShareCampaign
    }
  )
)(Header);
