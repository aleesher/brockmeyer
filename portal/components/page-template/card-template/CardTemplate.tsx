import React from "react";
import classnames from "classnames";

import Line from "../content-line";

import "./CardTemplate.scss";

interface IProps {
  className?: string;
}

const CardTemplate: React.StatelessComponent<IProps> = ({ className = "" }) => {
  return (
    <div className={classnames("template-card", className)}>
      <div className="template-card-img wave" />
      <div className="template-card-info">
        <Line width="30%" />
        <Line width="55%" />
        <Line width="60%" />
        <Line width="35%" />
      </div>
    </div>
  );
};

export default CardTemplate;
