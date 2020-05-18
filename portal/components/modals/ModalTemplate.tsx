import React from "react";
import Modal from "react-modal";
import classnames from "classnames";
import _ from "lodash";

import { Close } from "components/icons";
import { connect } from "../../reduxConnector";

import "./ModalTemplate.scss";
import "../../styles/global.scss";

const CLOSE_TIMEOUT_MS = 200;

interface IProps {
  open: boolean;
  onClose: () => void;
  alignCenter?: boolean;
  className?: string;
  user: any;
}

class ModalTemplate extends React.Component<IProps> {
  constructor(props) {
    super(props);

    Modal.setAppElement("#application");
  }

  render() {
    const { open, onClose, children, alignCenter, className, user } = this.props;
    const settings = JSON.parse(user.portalSettings || "{}");
    const font = _.get(settings, "font", "Raleway");

    return (
      <Modal
        className={classnames("full-screen", className, font)}
        overlayClassName="modal"
        closeTimeoutMS={CLOSE_TIMEOUT_MS}
        isOpen={open}
      >
        <Close className="close" onClick={onClose} />

        <div className={classnames("container", { "container-center": alignCenter })}>
          {children}
        </div>
      </Modal>
    );
  }
}

const mapStateToProps = state => ({
  user: state.global.currentUser
});

export default connect(
  mapStateToProps,
  {}
)(ModalTemplate) as any;
