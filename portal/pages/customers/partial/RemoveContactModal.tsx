import React from "react";
import { FormattedMessage } from "react-intl";

import ModalTemplate from "components/modals/ModalTemplate";
import Button from "components/button/Button";

import "./RemoveContactModal.scss";

const RemoveContactModal: React.StatelessComponent<any> = ({ isOpen, onClose, onRemove }) => (
  <ModalTemplate open={isOpen} onClose={onClose} alignCenter className="remove-modal-container">
    <div className="remove-modal">
      <div className="confirm-text">
        <div className="icon" />
        <p>
          <FormattedMessage id="SURE_TO_REMOVE" />
        </p>
      </div>

      <div className="modal-buttons">
        <Button className="cancel" onClick={onClose} btnColorType="secondary">
          NO
        </Button>
        <Button
          className="confirm"
          btnColorType="primary"
          onClick={() => {
            onRemove();
            onClose();
          }}
        >
          YES_DELETE
        </Button>
      </div>
    </div>
  </ModalTemplate>
);

export default RemoveContactModal;
