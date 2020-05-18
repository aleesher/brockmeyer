import React from "react";
import classnames from "classnames";

import "./ContentLine.scss";

interface IProps {
  width?: string;
  className?: string;
}

const ContentLine: React.StatelessComponent<IProps> = ({ width = "100%", className = "" }) => (
  <div className={classnames("content-line wave", className)} style={{ width }} />
);

export default ContentLine;
