import React from "react";
import classnames from "classnames";

import Line from "../content-line";

import "./CardTemplate.scss";

interface IProps {
  className?: string;
}

const CampaignCardTemplateMobile: React.StatelessComponent<IProps> = ({ className = "" }) => {
  return (
    <div className={classnames("template-card", "long-template-card-mobile", className)}>
      <div className="template-card-info">
        <div className="row">
          <Line width="25%" />
          <Line width="15%" />
        </div>
        <Line width="30%" />
        <Line width="100%" />
      </div>
    </div>
  );
};

export default CampaignCardTemplateMobile;
