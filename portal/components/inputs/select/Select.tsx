import React from "react";
import _ from "lodash";
import { FormattedMessage } from "react-intl";

import { Add, Close } from "components/icons";

import "./Select.scss";

interface IProps {
  options: any[];
  value?: any;
  values?: any[];
  max: number;
  input?: any;
  meta?: any;
  readOnly?: boolean;
  label: string;
}

interface IState {
  values: any[];
  isListVisible: boolean;
}

export default class Select extends React.Component<IProps, IState> {
  private list: any;

  constructor(props) {
    super(props);

    this.state = {
      values: this.returnValues(props),
      isListVisible: false
    };
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.options !== this.props.options) {
      this.setState({ values: this.returnValues(nextProps) });
    }
  }

  componentDidMount() {
    document.addEventListener("mousedown", event => this.hideOnClickOutside(event));
  }

  componentWillUnmount() {
    document.removeEventListener("mousedown", event => this.hideOnClickOutside(event));
  }

  returnValues(props) {
    let values = [];

    if (props.input && props.input.value) {
      values = _.compact(props.input.value.map(value => _.find(props.options, ["value", value])));
    }

    return values;
  }

  render() {
    const {
      meta: { error, touched },
      options,
      max,
      readOnly,
      label
    } = this.props;
    const { values, isListVisible } = this.state;
    const hasError = touched && error;

    return (
      <div id={"select-container"}>
        <div className="select-wrapper">
          {values.map((value, index) => (
            <div key={`${index}-${value}`} className="selected-value">
              <p>{value.label}</p>
              {!readOnly && <Close onClick={event => this.deleteValue(index)} />}
            </div>
          ))}

          {values.length < max &&
            !readOnly && (
              <div className="add-new-button">
                <Add onClick={event => this.showOptionList()} />
                <p onClick={event => this.showOptionList()}>{label}</p>
                {isListVisible && (
                  <div className={"select-list"} ref={ref => (this.list = ref)}>
                    {_.differenceBy(options, values, "value").map((option, index) => (
                      <div
                        className={"select-list-option"}
                        key={index}
                        onClick={event => this.valueChanged(option)}
                      >
                        <p>{option.label}</p>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
        </div>
        {hasError && (
          <span className="error">
            <FormattedMessage id={error} tagName="span" />
          </span>
        )}
      </div>
    );
  }

  private hideOnClickOutside(event) {
    if (this.list && !this.list.contains(event.target)) {
      this.setState({ isListVisible: false });
    }
  }

  private valueChanged(option) {
    const { input } = this.props;
    const { values } = this.state;

    values.push(option);
    this.setState({ values, isListVisible: false });

    if (input && _.isFunction(input.onChange)) {
      input.onChange(_.map(values, "value"));
    }
  }

  private showOptionList() {
    this.setState({ isListVisible: true });
  }

  private deleteValue(selectedValueIndex) {
    const { input } = this.props;
    const { values } = this.state;

    values.splice(selectedValueIndex, 1);
    this.setState({ isListVisible: false });

    if (input && _.isFunction(input.onChange)) {
      input.onChange(_.map(values, "value"));
    }
  }
}
