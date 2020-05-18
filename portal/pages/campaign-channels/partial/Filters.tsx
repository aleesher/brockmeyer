import React from "react";
import classnames from "classnames";
import { FormattedMessage } from "react-intl";
import Select from "react-select";

import { Info } from "components/icons";
import Filter from "components/page-template/filters";

import "./Filters.scss";

const renderSection = (onChange, initialValue) => ([key, value]) => {
  const selectOptions = value.map(opt => ({ value: opt.id, label: `${opt.name} (${opt.count})` }));
  const newInitialValue = value
    .filter(({ id }) => initialValue && initialValue[key] && initialValue[key].includes(id))
    .map(opt => ({ value: opt.id, label: `${opt.name} (${opt.count})` }));

  return (
    <div key={key}>
      <FormattedMessage id={key.toUpperCase()} tagName="h3" />
      <Select
        name={key}
        options={selectOptions}
        classNamePrefix="select-filter"
        isMulti
        value={newInitialValue}
        onChange={option => onChange(key, option.map(({ value }) => value))}
      />
    </div>
  );
};

const renderFilters = (isLoading, globalLoading, filters, onChange, initialValue) => {
  return globalLoading || isLoading ? (
    <Filter />
  ) : (
    Object.entries(filters).map(renderSection(onChange, initialValue))
  );
};

const renderSortSelect = (onChange, data, value) => {
  const selectOptions = data.options.map(opt => ({
    value: opt.value,
    label: <FormattedMessage id={opt.label} defaultMessage={opt.label} />
  }));

  return (
    <div className="channels-sort">
      <FormattedMessage id={data.label} tagName="h3" />
      <Select
        name={data.key}
        options={selectOptions}
        classNamePrefix="select-filter"
        value={value}
        onChange={onChange}
      />
    </div>
  );
};

const Filters: React.StatelessComponent<any> = ({
  filters,
  onChange,
  initialValue,
  onSortChange,
  sortObj,
  sortValue,
  show,
  globalLoading,
  isLoading
}) => (
  <div className={classnames("filter-container", { show })}>
    <h2>
      <FormattedMessage id="FILTERS" /> <Info className="info-icon" />
    </h2>
    <div className="filter-box">
      {sortObj && renderSortSelect(onSortChange, sortObj, sortValue)}
      {renderFilters(isLoading, globalLoading, filters, onChange, initialValue)}
    </div>
  </div>
);

export default Filters;
