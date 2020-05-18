import React from "react";
import { Field } from "redux-form";

import Select from "components/select/Select";
import Tooltip from "components/tooltip";
import { ThemeConsumer } from "constants/themes/theme-context";

import "./CampaignDetail.scss";

interface IProps {
  campaignDetail: any;
  options: any;
  readOnly: boolean;
  label: string;
  value: string[];
  onMenuOpen: () => void;
  onMenuClose: () => void;
  tooltip?: string;
}

const CampaignDetail: React.StatelessComponent<IProps> = props => {
  const {
    campaignDetail,
    options,
    readOnly,
    label,
    value,
    onMenuOpen,
    onMenuClose,
    tooltip
  } = props;
  const closeMenuOnSelect =
    value &&
    (value.length + 1 === campaignDetail.maxValues || value.length >= campaignDetail.maxValues);

  return (
    <ThemeConsumer>
      {theme => (
        <div className="campaign-detail card">
          <div className="label">
            <div className="name">
              {label}
              {campaignDetail.validations && "*"}
              {tooltip && <Tooltip id={tooltip} />}
            </div>
            <div className="max-details">max {campaignDetail.maxValues}</div>
          </div>
          <div className="divider" />
          <div className={`card-input-container ${campaignDetail.option}`}>
            <Field
              name={campaignDetail.option}
              placeholder="ADD"
              component={Select}
              options={options[campaignDetail.option]}
              max={campaignDetail.maxValues}
              validate={campaignDetail.validations}
              isDisabled={readOnly}
              isMulti
              normalize={val => val.map(({ value }) => value)}
              format={val =>
                options[campaignDetail.option] &&
                options[campaignDetail.option].filter(opt => val && val.includes(opt.value))
              }
              closeMenuOnSelect={closeMenuOnSelect}
              onMenuOpen={onMenuOpen}
              onMenuClose={onMenuClose}
              theme={theme}
            />
          </div>
        </div>
      )}
    </ThemeConsumer>
  );
};

export default CampaignDetail;
