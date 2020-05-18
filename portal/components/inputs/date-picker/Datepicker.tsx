import React from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import "./Datepicker.scss";

interface IProps {
  selected: boolean;
  onChange: (any) => void;
  minDate: any;
  disabled?: boolean;
  filterDate?: (any) => void;
  maxDate?: any;
}

const DatePickerStyled: React.StatelessComponent<IProps> = props => {
  return <DatePicker className="bro-datepicker" dateFormat="DD-MM-YYYY" {...props} />;
};

export default DatePickerStyled;
