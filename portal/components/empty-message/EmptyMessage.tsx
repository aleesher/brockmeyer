import React from "react";
import classnames from "classnames";

import "./EmptyMessage.scss";

interface IProps {
  className?: string;
}

const EmptyMessage: React.StatelessComponent<IProps> = ({ className = "", children }) => (
  <div className={classnames("empty-message", className)}>
    <div className="empty-message-text">{children}</div>
    <img className="empty-message-img" src="/assets/images/nothing-found.svg" alt="Nothing found" />
  </div>
);

export default EmptyMessage;
