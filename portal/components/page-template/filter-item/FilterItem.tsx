import React from "react";

import Line from "../content-line";
import "./FilterItem.scss";

const FilterItem: React.StatelessComponent = () => (
  <div className="filter-item">
    <div className="line1">
      <Line width="50%" />
    </div>
    <div>
      <Line width="95%" />
    </div>
  </div>
);

export default FilterItem;
