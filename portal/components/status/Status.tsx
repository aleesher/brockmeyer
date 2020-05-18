import React from "react";
import { FormattedMessage } from "react-intl";
import _ from "lodash";
import { getFormValues } from "redux-form";

import CampaignOverviewActions from "../../pages/campaigns/CampaignOverviewActions";
import { connect } from "../../reduxConnector";

import "./Status.scss";

interface IProps {
  getCampaignStatusTypes: () => void;
  campaignWizard: any;
  statusTypes: any;
  setStatus: (any) => void;
  status: any;
}

class Status extends React.Component<IProps> {
  componentWillMount() {
    const { getCampaignStatusTypes, statusTypes } = this.props;

    if (_.isEmpty(statusTypes)) {
      getCampaignStatusTypes();
    }
  }

  private initStatus = (statusTypes, status, statusId) => {
    if (_.isEmpty(statusId)) {
      return "order_new";
    }

    if (!_.isEmpty(status) && status.id === statusId) {
      return status.name;
    }
    const result = statusTypes.length && statusTypes.find(s => s.id === statusId);
    const campaignStatus = result ? result : { name: "order_new" };
    const { setStatus } = this.props;
    setStatus(campaignStatus);
    return campaignStatus.name;
  };

  render() {
    const {
      statusTypes,
      campaignWizard: { campaignStatus },
      status
    } = this.props;
    const statusName = this.initStatus(statusTypes, status, campaignStatus);
    return (
      <div className={`status-container ${statusName}`}>
        {statusName && <FormattedMessage id={statusName.toUpperCase()} />}
      </div>
    );
  }
}

const mapStateToProps = state => ({
  campaignWizard: getFormValues("campaignWizard")(state) || {},
  statusTypes: state.campaigns.statusTypes,
  status: state.campaigns.campaignStatus
});

const mapDispatchToProps = {
  getCampaignStatusTypes: CampaignOverviewActions.getCampaignStatusTypes,
  setStatus: CampaignOverviewActions.setCampaignStatus
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Status);
