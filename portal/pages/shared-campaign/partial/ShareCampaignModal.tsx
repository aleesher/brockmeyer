import React from "react";
import _ from "lodash";
import { FormattedMessage, injectIntl, InjectedIntlProps } from "react-intl";
import { Field, getFormValues } from "redux-form";
import moment from "moment";
import { addDays } from "date-fns";
import { NAVIGATION_URLS as URLS } from "constants/URIConstants";
import { compose } from "recompose";
import ReactTooltip from "react-tooltip";

import Button from "components/button/Button";
import { connect, campaignForm } from "../../../reduxConnector";
import DatePickerStyled from "../../../components/inputs/date-picker";
import CampaignOverviewActions from "../../campaigns/CampaignOverviewActions";
import { hasMarketAnalysis } from "helpers/common";

import "./ShareCampaignModal.scss";

interface IProps {
  deleteCampaign: (id: string) => void;
  onClose: () => void;
  campaignHash: any;
  putSharedCampaign: (id: number, date: string) => void;
  id: string;
  campaignWizard: any;
  statusName: string;
}

interface IState {
  action: string;
  expiredToken: boolean;
}

class ShareCampaignModal extends React.Component<IProps & InjectedIntlProps, IState> {
  constructor(props) {
    super(props);

    this.state = {
      action: "",
      expiredToken: false
    };
  }

  private extendCampaign = event => {
    const {
      campaignWizard: { id, expirationDate },
      putCampaign,
      campaignHash
    } = this.props;

    event.preventDefault();
    const expired = campaignHash && moment() > moment(campaignHash.expirationTime);
    this.setState({ action: "extend", expiredToken: expired }, async () => {
      const date = expirationDate
        ? expirationDate
        : campaignHash
        ? expired
          ? moment().add(14, "days")
          : moment(campaignHash.expirationTime)
        : moment();
      await putCampaign(id, date.format("YYYY-MM-DD hh:mm:ss").toString());
      ReactTooltip.hide(this.refs.sharedTooltipCopy);
      ReactTooltip.rebuild();
      ReactTooltip.show(this.refs.sharedTooltipPost);
    });
  };

  private getURL = () => {
    const { campaignHash: hashcode, statusName, campaignWizard } = this.props;
    let res = "";

    if (hashcode) {
      const url = window.location.href
        .split("/")
        .slice(0, 3)
        .join("/");

      if (statusName === "order_new" && hasMarketAnalysis(campaignWizard)) {
        res = `${url}${URLS.SHARED_CAMPAIGN_MARKET_ANALYSIS}/${hashcode.token}`;
      } else {
        res = `${url}${URLS.SHARED_CAMPAIGN}/${hashcode.token}`;
      }
    }

    return res;
  };

  private copyToClipboard = () => {
    const { campaignHash: hashcode, statusName, campaignWizard } = this.props;

    if (hashcode) {
      const url = window.location.href
        .split("/")
        .slice(0, 3)
        .join("/");
      const textarea = document.createElement("textarea");
      textarea.setAttribute("type", "hidden");
      if (statusName === "order_new" && hasMarketAnalysis(campaignWizard)) {
        textarea.textContent = `${url}${URLS.SHARED_CAMPAIGN_MARKET_ANALYSIS}/${hashcode.token}`;
      } else {
        textarea.textContent = `${url}${URLS.SHARED_CAMPAIGN}/${hashcode.token}`;
      }
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand("copy");
      document.body.removeChild(textarea);
    }
  };

  private copyURL = async event => {
    event.preventDefault();

    this.setState({ action: "copy" }, async () => {
      await this.copyToClipboard();
      ReactTooltip.hide(this.refs.sharedTooltipPost);
      ReactTooltip.rebuild();
      ReactTooltip.show(this.refs.sharedTooltipCopy);
    });
  };

  private deleteCampaign = async event => {
    const {
      campaignWizard: { id },
      deleteCampaign
    } = this.props;

    event.preventDefault();
    this.setState({ action: "stop" }, async () => {
      await deleteCampaign(id);
    });
  };

  private postCampaign = async event => {
    const {
      campaignWizard: { id, expirationDate },
      postCampaign,
      campaignHash
    } = this.props;

    event.preventDefault();
    this.setState({ action: "post" }, async () => {
      const date = expirationDate
        ? expirationDate
        : campaignHash
        ? moment(campaignHash.expirationTime)
        : moment().add(14, "days");
      await postCampaign(id, date.format("YYYY-MM-DD hh:mm:ss").toString());
    });
  };

  private handleInputChange = input => value => input && input.onChange(value);

  private datePicker = (isEndDate, minDate, defaultValue?, filterDate?) => ({ input }) => {
    const maxDate = isEndDate ? moment(addDays(minDate as Date, 60)) : undefined;

    return (
      <DatePickerStyled
        selected={(input && input.value ? moment(input.value) : defaultValue) as boolean}
        onChange={this.handleInputChange(input)}
        minDate={minDate as Date}
        filterDate={filterDate}
        maxDate={maxDate}
      />
    );
  };

  private getTooltipText = () => {
    const { action, expiredToken } = this.state;
    const { statusName } = this.props;

    if (action === "copy") {
      return (
        <div>
          <FormattedMessage id="COPIED_TO_CLIPBOARD" />
        </div>
      );
    } else if (statusName === "order_new") {
      return (
        <div>
          <FormattedMessage id="SHARED_PROPOSAL_EXTEND" />
        </div>
      );
    } else if (!expiredToken) {
      return (
        <div>
          <FormattedMessage id="SHARED_CAMPAIGN_EXTEND" />
        </div>
      );
    } else {
      return "";
    }
  };

  render() {
    const { campaignHash, isSharedCampaignLoading, statusName } = this.props;
    const initialExpirationDate =
      campaignHash && moment() < moment(campaignHash.expirationTime)
        ? moment(campaignHash.expirationTime)
        : moment().add(14, "days");
    const expired = campaignHash && moment() > moment(campaignHash.expirationTime);
    const btnText = (campaignHash && !expired) || isSharedCampaignLoading ? "EXTEND" : "SHARE";

    return (
      <div id="share-campaign-modal">
        {isSharedCampaignLoading && <div className="loading" />}
        {(!campaignHash || expired) && !isSharedCampaignLoading ? (
          <h1 className="title">
            <FormattedMessage id="CHOOSE_EXPIRATION_DATE" />
          </h1>
        ) : (
          <div>
            {statusName === "order_new" ? (
              <div>
                <h1 className="title">
                  <FormattedMessage id="HASHCODE_INFO_NEW" />
                </h1>
                <p className="description">
                  <FormattedMessage id="SHARED_PROPOSAL_DESCRIPTION" />
                </p>
              </div>
            ) : (
              <div>
                <h1 className="title">
                  <FormattedMessage id="HASHCODE_INFO" />
                </h1>
                <p className="description">
                  <FormattedMessage id="SHARED_CAMPAIGN_DESCRIPTION" />
                </p>
              </div>
            )}
          </div>
        )}

        <form className="vertical">
          <div className="vertical input-group">
            <label>
              <FormattedMessage id="EXPIRATION_DATE" />
            </label>
            <div className="date-container">
              <Field
                name="expirationDate"
                component={this.datePicker(true, moment().add(1, "days"), initialExpirationDate)}
              />

              {((campaignHash && !expired) || isSharedCampaignLoading) && (
                <div>
                  <Button className="presets secondary stop-button" onClick={this.deleteCampaign}>
                    STOP
                  </Button>
                </div>
              )}
              {((campaignHash && !expired) || isSharedCampaignLoading) && (
                <div className="share-buton-container">
                  <p ref="sharedTooltipPost" className="share-campaign-btn" data-tip="" />
                  <Button
                    className="presets primary"
                    onClick={
                      campaignHash || isSharedCampaignLoading
                        ? this.extendCampaign
                        : this.postCampaign
                    }
                    btnColorType="primary"
                  >
                    {btnText}
                  </Button>
                  <ReactTooltip
                    globalEventOff="click"
                    getContent={this.getTooltipText}
                    // isCapture={true}
                  />
                </div>
              )}
            </div>
          </div>

          {!((campaignHash && !expired) || isSharedCampaignLoading) && (
            <div className="not-shared-buton-container">
              <p ref="sharedTooltipPost" className="share-campaign-btn" data-tip="" />
              <Button
                className="presets primary"
                onClick={
                  campaignHash || isSharedCampaignLoading ? this.extendCampaign : this.postCampaign
                }
                btnColorType="primary"
              >
                {btnText}
              </Button>
              <ReactTooltip globalEventOff="click" getContent={this.getTooltipText} />
            </div>
          )}

          <div className="btn-container">
            {((campaignHash && !expired) || isSharedCampaignLoading) && (
              <input
                type="text"
                id="shared-link"
                name="shared-link"
                value={this.getURL()}
                readOnly
                className="shared-link-container"
              />
            )}
            {((campaignHash && !expired) || isSharedCampaignLoading) && (
              <div className="share-buton-container">
                <p ref="sharedTooltipCopy" className="share-campaign-btn" data-tip="" />
                <Button className="presets primary" onClick={this.copyURL} btnColorType="primary">
                  COPY
                </Button>
                <ReactTooltip
                  globalEventOff="click"
                  getContent={this.getTooltipText}
                  isCapture={true}
                />
              </div>
            )}
          </div>
        </form>
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
      isSharedCampaignLoading: state.campaigns.isSharedCampaignLoading,
      isSharedCampaignLoaded: state.campaigns.isSharedCampaignLoaded
    }),
    {
      deleteCampaign: CampaignOverviewActions.deleteShareCampaign,
      putCampaign: CampaignOverviewActions.putShareCampaign,
      postCampaign: CampaignOverviewActions.postSharedCampaign
    }
  )
)(ShareCampaignModal);
