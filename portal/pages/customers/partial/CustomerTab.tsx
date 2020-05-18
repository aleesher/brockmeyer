import React from "react";
import classnames from "classnames";
import { FormattedMessage } from "react-intl";
import { Link } from "react-router-dom";

import { NAVIGATION_URLS } from "constants/URIConstants";
import { PARTNER_ADMIN } from "constants/constants";

import "./CustomerTab.scss";

const CustomerTab: React.StatelessComponent<{
  customerId: any;
  tabIndex: number;
  usersCompany?: any;
  userRole: string;
}> = ({ customerId, tabIndex, usersCompany, userRole }) => (
  <div className="customet-tab">
    <Link to={`${NAVIGATION_URLS.EDIT_CUSTOMER}/${customerId}`} className="menu-item">
      <div className={classnames({ selected: tabIndex === 0 })}>
        <FormattedMessage id="GENERAL" />
      </div>
    </Link>
    <Link to={`${NAVIGATION_URLS.CUSTOMER_CONTACTS}/${customerId}`} className="menu-item">
      <div className={classnames({ selected: tabIndex === 1 })}>
        <FormattedMessage id="CONTACTS" />
      </div>
    </Link>
    {parseInt(usersCompany, 10) === customerId && userRole === PARTNER_ADMIN && (
      <Link to={`${NAVIGATION_URLS.EDIT_COLOR_SCHEME}/${customerId}`} className="menu-item">
        <div className={classnames({ selected: tabIndex === 2 })}>
          <FormattedMessage id="COLOR_SCHEME" />
        </div>
      </Link>
    )}
  </div>
);

export default CustomerTab;
