import React from "react";
import { FormattedMessage } from "react-intl";
import classnames from "classnames";
import ReactTooltip from "react-tooltip";

import { Info } from "components/icons";

import "./Tooltip.scss";

interface IProps {
  id: string;
  classname?: string;
  event?: string;
}

const Tooltip: React.StatelessComponent<IProps> = ({ id, classname, event }) => {
  return (
    <div className={classnames("tooltip", classname)}>
      <FormattedMessage id={id}>
        {text => <Info className="tooltip-icon" data-tip={text} data-event={event} />}
      </FormattedMessage>
      <ReactTooltip multiline={true} className={"tip"} globalEventOff="click" />
    </div>
  );
};

export default Tooltip;
