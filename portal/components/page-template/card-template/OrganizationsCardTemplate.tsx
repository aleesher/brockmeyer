import React from "react";
import classnames from "classnames";

import Line from "../content-line";

import "./CardTemplate.scss";

interface IProps {
  className?: string;
}

const OrganizationsCardTemplate: React.StatelessComponent<IProps> = ({ className = "" }) => {
  return (
    <div className={classnames("organizations-card", "template-card", className)}>
      <div className="organizations-card-img wave" />
      <div className="template-card-info">
        <Line width="30%" />
      </div>
    </div>
  );
};

export default OrganizationsCardTemplate;
