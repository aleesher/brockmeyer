import React from "react";

import { KeyboardArrowRight } from "components/icons";

import "./CardItem.scss";

const CardItem: React.StatelessComponent<{ onClick?: any }> = ({
  children,
  onClick = () => null
}) => (
  <div className="card-item card" onClick={onClick}>
    <div className="content">{children}</div>
    <div className="expander">
      <KeyboardArrowRight />
    </div>
  </div>
);

export default CardItem;
