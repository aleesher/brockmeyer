import React from "react";
import classnames from "classnames";

import Line from "../content-line";

import "./CardTemplate.scss";

interface IProps {
  className?: string;
}

const CampaignCardTemplate: React.StatelessComponent<IProps> = ({ className = "" }) => {
  return (
    <div className={classnames("template-card", "long-template-card", className)}>
      <div className="template-card-info">
        <Line width="13%" />
        <Line width="20%" />
        <Line width="7%" />
        <Line width="45%" />
      </div>
    </div>
  );
};

export default CampaignCardTemplate;
