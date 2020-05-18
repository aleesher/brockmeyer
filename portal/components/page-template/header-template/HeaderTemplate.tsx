import React from "react";

import Line from "../content-line";

import "./HeaderTemplate.scss";

const HeaderTemplate: React.StatelessComponent = () => (
  <div id="campaign-header">
    <div className="header-status">
      <Line width="105px" />
      <Line width="150px" />
      <Line width="130px" />
    </div>
  </div>
);

export default HeaderTemplate;
