import React from "react";
import { FormattedMessage } from "react-intl";
import _ from "lodash";

import { KeyboardArrowRight } from "components/icons";
import Button from "components/button/Button";
import Popconfirm from "components/popconfirm/Popconfirm";
import Score from "./Score";

import "./SettingsArea.scss";

interface IProps {
  vacancyResult: any;
  sendVacancyImprover: () => void;
  updateCampaign: () => void;
  isFormDirty: boolean;
}

class SettingsArea extends React.PureComponent<IProps> {
  render() {
    const { updateCampaign, sendVacancyImprover, vacancyResult, isFormDirty } = this.props;

    return (
      <div className="settings-area">
        {_.isEmpty(vacancyResult) && (
          <div className="page-subtitle">
            <FormattedMessage id="VACANCY_IMPROVER_REVIEW" />
          </div>
        )}
        <div className="settings">
          {!_.isEmpty(vacancyResult) && <Score vacancyResult={vacancyResult} />}
        </div>
        <Button
          onClick={sendVacancyImprover}
          className="check-btn"
          btnColorType="secondary"
          id="vacancy-check"
        >
          CHECK
        </Button>
        <Popconfirm title="POPUP_SAVE" onConfirm={updateCampaign} hidePopup={!isFormDirty}>
          <Button
            className="vacancy-next-btn"
            icon={KeyboardArrowRight}
            iconPosition="right"
            btnColorType="primary"
          >
            NEXT
          </Button>
        </Popconfirm>
      </div>
    );
  }
}

export default SettingsArea;
