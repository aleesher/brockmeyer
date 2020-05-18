import React from "react";
import Line from "../content-line";

import "./SummaryItem.scss";

const SummaryItem: React.StatelessComponent<any> = () => (
  <div className="summary-item">
    <Line />
    <Line width="70%" />
    <Line width="50%" />
  </div>
);

export default SummaryItem;
