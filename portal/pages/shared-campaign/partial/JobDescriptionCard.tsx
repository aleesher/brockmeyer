import React from "react";
import { FormattedMessage } from "react-intl";

import "./JobDescriptionCard.scss";

interface IProps {
  job_description: string;
}

const renderHTML = (rawHTML: string) =>
  React.createElement("div", { dangerouslySetInnerHTML: { __html: rawHTML } });

const JobDescriptionCard: React.StatelessComponent<IProps> = ({ job_description }) => {
  if (!job_description) {
    return null;
  }

  return (
    <div className="job-item card ql-editor">
      <div className="label">
        <span className="title">
          <FormattedMessage id="JOB_DESCRIPTION" />
        </span>
      </div>
      <div className="content">{renderHTML(job_description)}</div>
    </div>
  );
};

export default JobDescriptionCard;
