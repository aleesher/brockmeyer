import React from "react";
import ReactDOM from "react-dom";

import { Edit, Save } from "components/icons";
import { ThemeConsumer } from "constants/themes/theme-context";
import { NAVIGATION_URLS as URLS } from "constants/URIConstants";
import Tooltip from "components/tooltip";

enum Mode {
  EDIT = "EDIT",
  READ = "READ"
}

interface IProps {
  value: string;
  className: string;
  onSave: (string) => void;
  readOnly?: boolean;
  page?: string;
  originalUrl?: string;
}

interface IState {
  mode: Mode;
  value;
}

export default class InputWithEditIcon extends React.Component<IProps, IState> {
  private span: any;

  constructor(props) {
    super(props);

    this.state = {
      mode: Mode.READ,
      value: props.value
    };
  }

  componentWillReceiveProps(newProps) {
    if (newProps.value) {
      this.setState({ value: newProps.value });
    }
  }

  private renderRead(theme) {
    const { page, originalUrl, className, readOnly } = this.props;

    return page !== URLS.SHARED_CAMPAIGN ? (
      <div className={className}>
        <p style={{ color: theme.primary_color }}>{this.state.value}</p>
        {!readOnly && <Edit className="icon" onClick={() => this.editButtonPressed()} />}
        {/* {!readOnly && <MoreVert className="mobile-more-btn" />} */}
      </div>
    ) : (
      <div className={this.props.className}>
        <a href={originalUrl} style={{ textDecorationColor: theme.primary_color }}>
          <p style={{ color: theme.primary_color }}>{this.state.value}</p>
        </a>
        <Tooltip id="SHARED_CAMPAIGN_TOOLTIP" />
      </div>
    );
  }

  private renderEdit(theme) {
    return (
      <div className={this.props.className}>
        <span
          className="editable"
          ref={ref => (this.span = ref)}
          onKeyDown={event => {
            if (event.keyCode === 13) {
              this.saveButtonPressed(event);
            }
          }}
          contentEditable={true}
          style={{ color: theme.primary_color }}
        >
          {this.state.value}
        </span>
        <Save className="icon" onClick={event => this.saveButtonPressed(event)} />
      </div>
    );
  }

  private editButtonPressed() {
    this.setState({ mode: Mode.EDIT }, () => {
      this.span.focus();
      this.selectTextIn(ReactDOM.findDOMNode(this.span));
    });
  }

  private selectTextIn(domElement) {
    const range = document.createRange();
    range.selectNodeContents(domElement);
    const sel = window.getSelection();
    if (sel && sel.removeAllRanges) {
      sel.removeAllRanges();
    }
    if (sel && sel.addRange) {
      sel.addRange(range);
    }
  }

  private saveButtonPressed(event) {
    event.preventDefault();
    const currentSpanValue = ReactDOM.findDOMNode(this.span)
      ? (ReactDOM.findDOMNode(this.span) as Element).textContent
      : "";
    this.setState({ mode: Mode.READ, value: currentSpanValue });
    this.props.onSave(currentSpanValue);
  }

  render() {
    const { mode } = this.state;

    return (
      <ThemeConsumer>
        {theme => {
          return mode === Mode.READ ? this.renderRead(theme) : this.renderEdit(theme);
        }}
      </ThemeConsumer>
    );
  }
}
