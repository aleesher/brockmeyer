import React from "react";
import classnames from "classnames";
import Select from "react-select";
import { FormattedMessage, injectIntl } from "react-intl";

import "./Select.scss";

interface IOption {
  value: string;
  label: string;
}

interface IProps {
  autoFocus?: boolean;
  className?: string;
  classNamePrefix?: string;
  isDisabled?: boolean;
  isSearchable?: boolean;
  input?: any;
  intl: any;
  meta?: any;
  isMulti?: boolean;
  max?: number;
  name?: string;
  options: IOption[];
  placeholder?: string;
  onMenuClose?: () => void;
  onMenuOpen?: () => void;
  theme?: any;
}

const css = (className, gray, meta) =>
  classnames(className, { gray }, { error: meta.touched && meta.error });

class ReactSelect extends React.PureComponent<IProps> {
  state = { inputValue: "" };

  onChange = option => {
    const { input, max, ...rest } = this.props;

    if (rest.isMulti && max && max < option.length) {
      return null;
    }
    return rest.isMulti ? input.onChange(option) : input.onChange(option && option.value);
  };

  onInputChange = (inputValue, { action }) => {
    // Prevents resetting our input after option has been selected
    if (action !== "set-value") {
      this.setState({ inputValue });
    }
  };

  render() {
    const {
      input = {},
      meta = {},
      max,
      className,
      placeholder,
      onMenuClose,
      onMenuOpen,
      intl: { formatMessage },
      theme,
      ...rest
    } = this.props;

    const colourStyles = {
      multiValue: styles => {
        return {
          ...styles,
          backgroundColor: theme.secondary_color
        };
      }
    };

    return (
      <div className="bro-multi-select">
        <Select
          {...input}
          {...rest}
          className={css(className, !input.value || rest.isMulti, meta)}
          styles={colourStyles}
          classNamePrefix="select"
          onChange={this.onChange}
          onBlur={() => {
            this.setState({ inputValue: "" });
            input.onBlur(input.value);
          }}
          blurInputOnSelect={false}
          placeholder={placeholder && formatMessage({ id: placeholder })}
          onInputChange={this.onInputChange}
          inputValue={this.state.inputValue}
          onMenuClose={onMenuClose}
          onMenuOpen={onMenuOpen}
        />
        {meta.touched && meta.error && <FormattedMessage id={meta.error} tagName="span" />}
      </div>
    );
  }
}

export default injectIntl(ReactSelect);
