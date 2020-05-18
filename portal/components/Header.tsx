import React from "react";
import { FormattedMessage } from "react-intl";

import { ExitToApp, Language, KeyboardArrowDown } from "components/icons";
import { NAVIGATION_URLS as URLS } from "constants/URIConstants";
import { getUserName, redirect } from "helpers/common";
import AppActions from "../pages/app/AppActions";
import { connect } from "../reduxConnector";

import "../styles/_header.scss";

const options = [
  { text: "MENU_CAMPAIGNS", url: URLS.CAMPAIGNS },
  { text: "MENU_CHANNELS", url: URLS.CHANNELS },
  { text: "MENU_CUSTOMERS", url: URLS.CUSTOMERS }
];

interface IProps {
  global: any;
  selectedMenu?: string;
  changeLocale: (lang: string) => void;
  toggleBreadcrumpModal: any;
  match: any;
  history: any;
  companyLogo: string;
}

const Header: React.StatelessComponent<IProps> = props => {
  const {
    global: { currentUser },
    selectedMenu,
    changeLocale,
    toggleBreadcrumpModal,
    match,
    history,
    companyLogo
  } = props;

  const renderLangToggle = () => {
    const switchTo = currentUser.lang === "nl" ? "en" : "nl";
    return (
      <a className="dropdown-content-item" onClick={() => changeLocale(switchTo)}>
        <Language />
        <span>{currentUser.lang === "nl" ? "English" : "Nederlands"}</span>
      </a>
    );
  };

  const selectedItemCss = url => (selectedMenu === url ? "selected menu-item" : "menu-item");

  const toggleHeaderLink = url => {
    const {
      params: { campaignId }
    } = match;

    if (campaignId) {
      toggleBreadcrumpModal(url);
    } else {
      redirect(history)(url);
    }
  };

  return (
    <div id="header">
      <div className="header-container">
        <div className="logo-container">
          <div onClick={() => toggleHeaderLink("/")}>
            <img src={companyLogo} className="logo" />
          </div>
        </div>
        <div className="header-nav">
          {options.map(({ url, text }) => (
            <div key={url} className={selectedItemCss(url)}>
              <div onClick={() => toggleHeaderLink(url)}>
                <FormattedMessage id={text} />
              </div>
            </div>
          ))}
        </div>
        <div className="account-container">
          <div className="dropdown">
            <div className="dropdown-button">
              <div className="user-info">
                <span className="username">{getUserName(currentUser)}</span>
                <span className="company-name">{currentUser.companyName || ""}</span>
              </div>
              <KeyboardArrowDown />
            </div>
            <div className="dropdown-content">
              {renderLangToggle()}
              <a
                className="dropdown-content-item"
                onClick={() => (window.location.href = URLS.LOGOUT)}
              >
                <ExitToApp />
                <span>
                  <FormattedMessage id="MENU_LOGOUT" />
                </span>
              </a>
            </div>
          </div>
        </div>
      </div>
      <div className="mobile-header-nav">
        {options.map(({ url, text }) => (
          <div key={url} className={selectedItemCss(url)}>
            <div onClick={() => toggleHeaderLink(url)}>
              <FormattedMessage id={text} />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default connect(
  ({ global }) => ({ global }),
  {
    changeLocale: AppActions.changeLocale
  }
)(Header) as any;
