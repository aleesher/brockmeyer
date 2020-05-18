import React from "react";
import classnames from "classnames";

import FilterItem from "../filter-item";

interface IProps {
  className?: string;
}

const filters = [1, 2, 3, 4];

const Filters: React.StatelessComponent<IProps> = ({ className = "" }) => (
  <div className={classnames(className)}>
    {filters.map(filter => <FilterItem key={`filter-${filter}`} />)}
  </div>
);

export default Filters;
