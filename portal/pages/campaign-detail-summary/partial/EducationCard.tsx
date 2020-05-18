import React from "react";
import _ from "lodash";
import { FormattedMessage } from "react-intl";

import "./EducationCard.scss";

interface IProps {
  campaignWizard: any;
  educationOptions: any;
}

const EducationCard: React.StatelessComponent<IProps> = ({ campaignWizard, educationOptions }) => {
  if (_.isEmpty(campaignWizard)) {
    return null;
  }

  const filteredData = (filterArray = [], inlcudesArray) =>
    filterArray
      .filter(({ value }) => (inlcudesArray || []).includes(value))
      .map(({ label }) => label)
      .join(", ");

  const features = [
    {
      labelId: "EDUCATIONS",
      data: filteredData(educationOptions.educations, campaignWizard.educations)
    },
    {
      labelId: "LEVEL",
      data: filteredData(educationOptions.jobLevel || [], campaignWizard.jobLevel)
    },
    { labelId: "REGIONS", data: filteredData(educationOptions.regions, campaignWizard.regions) },
    {
      labelId: "PROFILES",
      data: filteredData(educationOptions.jobProfiles, campaignWizard.jobProfiles)
    },
    {
      labelId: "SECTORS",
      data: filteredData(educationOptions.sector || [], campaignWizard.sector)
    },
    {
      labelId: "CONTRACT_TYPE",
      data: filteredData(educationOptions.contractType || [], campaignWizard.contractType)
    },
    {
      labelId: "JOB_COMPETENCY",
      data: filteredData(educationOptions.jobCompetence || [], campaignWizard.jobCompetence)
    }
  ];

  return (
    <div className="education-item card">
      <div className="label">
        <span className="title">
          <FormattedMessage id="CHARACTERISTICS" />
        </span>
      </div>
      <div className="content">
        {features.map(feature => (
          <div key={feature.labelId} className="item-row">
            <span className="item-title">
              <FormattedMessage id={feature.labelId} />
            </span>
            <span className="item-text">{feature.data}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default EducationCard;
