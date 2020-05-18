import React from "react";
import classnames from "classnames";
import { FormattedMessage } from "react-intl";

import "./Input.scss";

interface IProps {
  placeholder?: string;
  value?: string | number;
  className?: string;
  ref?: string;
  name?: string;
  disabled?: boolean;
  onChange?: React.ChangeEventHandler<HTMLInputElement>;
  onClick?: React.FormEventHandler<HTMLInputElement>;
  onFocus?: React.FormEventHandler<HTMLInputElement>;
  onBlur?: React.FormEventHandler<HTMLInputElement>;
  autoFocus?: boolean;
  input?: any;
  meta?: any;
  width?: string;
}

const Input: React.StatelessComponent<IProps> = props => {
  const { className, input = {}, width, meta = {}, ...inputProps } = props;
  const hasError = meta.touched && meta.error;

  return (
    <div className="bro-input-wrapper" style={{ width }}>
      <input
        className={classnames("bro-input", { error: hasError }, className)}
        {...input}
        {...inputProps}
      />
      {hasError && <FormattedMessage id={meta.error} tagName="span" />}
    </div>
  );
};

export default Input;
