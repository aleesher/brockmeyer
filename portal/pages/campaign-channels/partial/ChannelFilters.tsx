import React from "react";
import { FormattedMessage } from "react-intl";

import { Info } from "components/icons";

import "./ChannelFilters.scss";

const child = (key, onChange) => ({ id, name, count }) => (
  <li key={id}>
    <label className="checkbox label" htmlFor={`${key}-${id}`}>
      <input
        id={`${key}-${id}`}
        type="checkbox"
        onChange={({ target: { checked } }) => onChange({ key, value: id, checked })}
      />
      <span className="checkmark" />
      {`${name} (${count})`}
    </label>
  </li>
);

const section = onChange => ([key, value]) => (
  <div key={key}>
    <h3>
      <FormattedMessage id={key.toUpperCase()} />
    </h3>
    <ul>{value.map(child(key, onChange))}</ul>
  </div>
);

const ChannelsFilters = ({ filters, onChange }) => (
  <div className="filter-container">
    <h2>
      <FormattedMessage id="FILTERS" /> <Info className="info-icon" />
    </h2>
    <div className="filter-box">{Object.entries(filters).map(section(onChange))}</div>
  </div>
);

export default ChannelsFilters;
