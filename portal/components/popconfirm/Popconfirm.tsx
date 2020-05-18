import React from "react";
import ReactDOM from "react-dom";
import { FormattedMessage } from "react-intl";

import Button from "components/button/Button";

import "./Popconfirm.scss";

interface IProps {
  cancelText?: string;
  children: any;
  okText?: string;
  title: any;
  visible?: boolean;
  width?: string;
  onConfirm: () => void;
  hidePopup?: boolean;
  isTourOpen?: boolean;
  textPadding?: string;
  buttonsPadding?: string;
}

interface IState {
  position: any;
  visible: boolean;
}

const getPosition = ref => (ReactDOM.findDOMNode(ref) as Element).getBoundingClientRect();

class Popconfirm extends React.Component<IProps, IState> {
  constructor(props) {
    super(props);

    this.state = {
      position: {
        marginTop: "0px",
        marginLeft: "0px"
      },
      visible: false
    };
  }

  componentDidMount() {
    if (this.props.visible !== false) {
      const { height, width } = getPosition(this.refs.popup);
      const base = getPosition(this.refs.base);
      const scale = 1 / 0.85;
      const top = height * scale + 10;
      const left = 0 - (width * scale) / 2 + base.width / 2;
      this.setState({
        position: {
          marginTop: `-${top}px`,
          marginLeft: `${left}px`
        }
      });
    }
  }

  private onClick = () => {
    if (!this.state.visible && !this.props.hidePopup && !this.props.isTourOpen) {
      this.setState({ visible: true }, () => {
        const popup = this.refs.popup as HTMLInputElement;
        popup.focus();
      });
    } else {
      this.props.onConfirm();
    }
  };

  private onConfirm = () => {
    this.setState({ visible: false }, () => this.props.onConfirm());
  };

  private close = event => {
    const popup = ReactDOM.findDOMNode(this.refs.popup) as Element;
    const isChildElements = popup.contains(event.relatedTarget);
    if (this.state.visible && !isChildElements) {
      this.setState({ visible: false });
    }
  };

  private getTitle() {
    const { title } = this.props;
    if (title.values) {
      return <FormattedMessage id={title.text} values={title.values} />;
    }
    return <FormattedMessage id={title} />;
  }

  render() {
    const {
      children,
      visible,
      width,
      okText,
      cancelText,
      textPadding,
      buttonsPadding
    } = this.props;
    const { position, visible: popupVisible } = this.state;
    if (visible === false) {
      return null;
    }

    return (
      <div ref="base" className="bro-confirm">
        <div
          ref="popup"
          className={popupVisible ? "popup" : "popup hide"}
          style={position}
          tabIndex={0}
          onBlur={this.close}
        >
          <div className="confirm-text" style={{ width, padding: textPadding }}>
            <div className="icon" />
            <p>{this.getTitle()}</p>
          </div>

          <div className="popup-buttons" style={{ padding: buttonsPadding }}>
            <Button className="cancel" onClick={this.close} btnColorType="secondary">
              {cancelText || "NO"}
            </Button>
            <Button className="confirm" onClick={this.onConfirm} btnColorType="primary">
              {okText || "YES"}
            </Button>
          </div>
        </div>
        {React.cloneElement(children, { onClick: this.onClick })}
      </div>
    );
  }
}

export default Popconfirm;
