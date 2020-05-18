import React from "react";
import { FormattedMessage, injectIntl, InjectedIntlProps } from "react-intl";
import classnames from "classnames";
import _ from "lodash";

import { Search, FilterList } from "components/icons";
import Button from "components/button/Button";

import "./FiltersBar.scss";

interface IProps {
  onChange: (any) => void;
  searchPlaceholder: string;
  selectors?: any;
  search?: string;
  showFilters?: boolean;
  onChangeShowFilters?: () => void;
  showFiltersButton?: boolean;
  filterChanged?: boolean;
  className?: string;
  view?: string;
  onToggleView?: (option: string) => void;
}

class FiltersBar extends React.Component<IProps & InjectedIntlProps> {
  private renderView = () => {
    const { onToggleView, view } = this.props;

    if (_.isEmpty(view)) {
      return;
    }

    return (
      <div className="tile-wrapper">
        <label className="tile-label">View</label>
        <div className="tile-container">
          <div
            className={classnames("tile-item", { active: view === "card" })}
            onClick={() => onToggleView("card")}
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
              <path d="M3 17h18v2H3zm0-7h18v5H3zm0-4h18v2H3z" />
              <path fill="none" d="M0 0h24v24H0z" />
            </svg>
          </div>
          <div
            className={classnames("tile-item", { active: view === "tile" })}
            onClick={() => onToggleView("tile")}
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
              <path d="M4 11h5V5H4v6zm0 7h5v-6H4v6zm6 0h5v-6h-5v6zm6 0h5v-6h-5v6zm-6-7h5V5h-5v6zm6-6v6h5V5h-5z" />
              <path d="M0 0h24v24H0z" fill="none" />
            </svg>
          </div>
        </div>
      </div>
    );
  };

  render() {
    const {
      searchPlaceholder,
      selectors = [],
      onChange,
      search,
      intl: { formatMessage },
      showFilters,
      onChangeShowFilters,
      showFiltersButton,
      filterChanged,
      className = ""
    } = this.props;
    const isChanged =
      filterChanged || !_.every(selectors, selector => selector.value === selector.defaultValue);

    return (
      <div className={classnames("filters-bar", className)}>
        <div className={classnames("search-wrapper", { fullWidth: !showFiltersButton })}>
          <Search
            className="search-icon"
            onClick={() => (this.refs.search as HTMLInputElement).focus()}
          />
          <input
            id="search-query"
            ref="search"
            placeholder={formatMessage({ id: searchPlaceholder })}
            type="text"
            value={search}
            onChange={e => onChange({ field: "search", value: e.target.value })}
          />
        </div>
        <div
          className={classnames("select-wrapper", {
            showFilters: showFilters || !showFiltersButton
          })}
        >
          {this.renderView()}

          {selectors.map(selector => (
            <div key={selector.key} className="filter-select">
              <label>
                <FormattedMessage id={selector.label} defaultMessage={selector.label} />
              </label>
              <div className="select-style">
                <select
                  value={selector.value}
                  onChange={e => onChange({ field: selector.key, value: e.target.value })}
                >
                  {selector.options.map(option => (
                    <FormattedMessage
                      key={option.value}
                      id={option.label}
                      defaultMessage={option.label}
                    >
                      {txt => <option value={option.value}>{txt}</option>}
                    </FormattedMessage>
                  ))}
                </select>
              </div>
            </div>
          ))}
        </div>

        {showFiltersButton && (
          <Button
            onClick={onChangeShowFilters}
            icon={FilterList}
            className={classnames("open-filter", { isChanged })}
          >
            {showFilters ? "HIDE_FILTERS" : "FILTERS"}
          </Button>
        )}
      </div>
    );
  }
}

export default injectIntl(FiltersBar);
