import React from "react";
import classnames from "classnames";

import SummaryItem from "../summary-item";

import "./Summary.scss";

interface IProps {
  className?: string;
}

const channels = [10, 11, 12, 13];

const Summary: React.StatelessComponent<IProps> = ({ className = "" }) => (
  <div className={classnames("template-summary", className)}>
    <div className="summary-wrapper">{channels.map(channel => <SummaryItem key={channel} />)}</div>
  </div>
);

export default Summary;
