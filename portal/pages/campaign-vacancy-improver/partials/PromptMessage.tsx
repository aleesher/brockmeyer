import React from "react";
import { FormattedMessage } from "react-intl";

import { CheckCircle } from "components/icons";
import "./PromptMessage.scss";

interface IProps {
  status: string | null;
}

const PromptMessage = ({ status }: IProps) => {
  return (
    <div className="propmt-wrapper">
      <div className="prompt-message">
        <div className="each-message">
          {status === "sending" ? <div className="processing" /> : <CheckCircle />}
          <FormattedMessage id="TEXT_IS_BEING_SENT" tagName="span" />
        </div>
        <div className="each-message">
          {status === "preparing" ? <CheckCircle /> : <div className="processing" />}
          <FormattedMessage id="TEXT_IS_BEING_CHECKED" tagName="span" />
        </div>
        <div className="each-message">
          {status ? <div className="processing" /> : <CheckCircle />}
          <FormattedMessage id="TEXT_IS_BEING_PREPARED" tagName="span" />
        </div>
      </div>
    </div>
  );
};

export default PromptMessage;
