import React from "react";
import classnames from "classnames";
import { injectIntl } from "react-intl";
import { FormattedMessage } from "react-intl";

import { KeyboardArrowDown } from "components/icons";

import "./DropList.scss";

interface IOption {
  value: string;
  label: string;
}

interface IProps {
  autoFocus?: boolean;
  className?: string;
  disabled?: boolean;
  input?: any;
  intl: any;
  meta?: any;
  name?: string;
  onBlur?: React.FormEventHandler<HTMLInputElement>;
  onChange?: React.ChangeEventHandler<HTMLInputElement>;
  onClick?: React.FormEventHandler<HTMLInputElement>;
  onFocus?: React.FormEventHandler<HTMLInputElement>;
  options: IOption[];
  placeholder?: string;
  ref?: string;
  value?: string | number;
  width?: string;
}

const css = (className, gray, meta) =>
  classnames("bro-select", className, { gray }, { error: meta.touched && meta.error });

const loop = (placeholder, options) => {
  const list = [{ value: "", label: placeholder }, ...options];
  return list.map(({ value, label }, index) => (
    <option key={index} value={value} hidden={!value}>
      {label}
    </option>
  ));
};

const DropList = ({
  className,
  input = {},
  width,
  meta = {},
  options,
  placeholder,
  intl: { formatMessage }
}: IProps) => (
  <div className="bro-droplist">
    <div className="select">
      <select className={css(className, !input.value, meta)} style={{ width }} {...input}>
        {loop(placeholder && formatMessage({ id: placeholder }), options)}
      </select>
      <KeyboardArrowDown className="arrow" />
    </div>
    {meta.touched && meta.error && <FormattedMessage id={meta.error} tagName="span" />}
  </div>
);

export default injectIntl(DropList);
