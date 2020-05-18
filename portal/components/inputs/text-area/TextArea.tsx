import React from "react";
import classnames from "classnames";

import "./TextArea.scss";

interface IProps {
  className?: string;
  onChange?: any;
  rows?: number;
  value: string;
}

export default ({ className = "", ...rest }: IProps) => (
  <textarea className={classnames("bro-textarea", className)} {...rest} />
);
