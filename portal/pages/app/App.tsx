import React from "react";
import { ToastContainer } from "react-toastify";
import { withRouter } from "react-router";
import { Switch, Redirect, Route } from "react-router-dom";
import { IntlProvider } from "react-intl";
import { compose } from "recompose";

import Campaign from "../campaigns/CampaignOverview";
import CampaignBanners from "../campaign-banners/CampaignBanners";
import CampaignChannels from "../campaign-channels/CampaignChannels";
import CampaignDetails from "../campaign-details/CampaignDetails";
import SharedCampaign from "../shared-campaign/SharedCampaign";
import CampaignAddOns from "../campaign-add-ons/CampaignAddOns";
import CampaignReview from "../campaign-review/CampaignReview";
import CampaignSocialMedia from "../campaign-social-media/CampaignSocialMedia";
import CampaignVacancy from "../campaign-vacancy/CampaignVacancy";
import CampaignVacancyImprover from "../campaign-vacancy-improver/CampaignVacancyImprover";
import CampaignDetailSummary from "../campaign-detail-summary/CampaignDetailSummary";
import CampaignMarketAnalysis from "../campaign-market-analysis/CampaignMarketAnalysis";
import Channels from "../campaign-channels/Channels";
import CustomerContacts from "../customers/CustomerContacts";
import Customers from "../customers/Customers";
import EditContactPerson from "../customers/EditContactPerson";
import EditCustomer from "../customers/EditCustomer";
import NewContactPerson from "../customers/NewContactPerson";
import NewCustomer from "../customers/NewCustomer";
import ColorScheme from "../color-theme/ColorTheme";
import SharedCampaignMarketAnalysis from "../shared-campaign/SharedCampaignMarketAnalysis";

import AppActions from "./AppActions";
import messages from "constants/locales";
import { connect } from "../../reduxConnector";
import { NAVIGATION_URLS as URLS, CAMPAIGN_ID_PARAMETER } from "constants/URIConstants";

import "../../styles/global.scss";

interface IProps {
  getUserInfo: () => void;
  lang: string;
  logged: boolean;
  location: any;
}

interface IState {
  isTourOpen: boolean;
}

class App extends React.Component<IProps, IState> {
  componentWillMount() {
    const { location, getUserInfo } = this.props;
    if (!location.pathname.includes(URLS.SHARED_CAMPAIGN)) {
      getUserInfo();
    }
  }

  render() {
    const { lang, logged, location } = this.props;
    if (!logged && !location.pathname.includes(URLS.SHARED_CAMPAIGN)) {
      return <div className="loading" />;
    }
    let language = "nl";
    if (!lang) {
      language = navigator.language.slice(0, 2);
      if (language !== "en" && language !== "nl") {
        language = "en";
      }
    } else {
      language = lang;
    }

    return (
      <IntlProvider
        key={language}
        locale={language}
        messages={messages[language]}
        textComponent={React.Fragment}
      >
        <div>
          <Switch>
            <Route exact path="/" component={Campaign} />
            <Route
              path={URLS.CAMPAIGN_BANNERS + CAMPAIGN_ID_PARAMETER}
              component={CampaignBanners}
            />
            <Route
              path={URLS.CAMPAIGN_CHANNELS + CAMPAIGN_ID_PARAMETER}
              component={CampaignChannels}
            />
            <Route
              path={URLS.CAMPAIGN_DETAILS + CAMPAIGN_ID_PARAMETER}
              component={CampaignDetails}
            />
            <Route
              path={URLS.CAMPAIGN_ADD_ONS + CAMPAIGN_ID_PARAMETER}
              component={CampaignAddOns}
            />
            <Route path={URLS.CAMPAIGN_REVIEW + CAMPAIGN_ID_PARAMETER} component={CampaignReview} />
            <Route
              path={URLS.CAMPAIGN_SOCIAL_MEDIA + CAMPAIGN_ID_PARAMETER}
              component={CampaignSocialMedia}
            />
            <Route exact path={URLS.CAMPAIGNS} component={Campaign} />
            <Route
              path={URLS.CAMPAIGN_VACANCY + CAMPAIGN_ID_PARAMETER}
              component={CampaignVacancy}
            />
            <Route
              path={URLS.CAMPAIGN_MARKET_ANALYSIS + CAMPAIGN_ID_PARAMETER}
              component={CampaignMarketAnalysis}
            />
            <Route path={`${URLS.CAMPAIGN}/:id`} component={CampaignDetailSummary} />
            <Route path={URLS.CHANNELS} component={Channels} />
            <Route path={URLS.CUSTOMERS} component={Customers} />
            <Route
              path={`${URLS.CUSTOMER_CONTACTS}/:id/edit/:contactId`}
              component={EditContactPerson}
            />
            <Route path={`${URLS.CUSTOMER_CONTACTS}/:id/new`} component={NewContactPerson} />
            <Route path={`${URLS.CUSTOMER_CONTACTS}/:id`} component={CustomerContacts} />
            <Route path={`${URLS.EDIT_CUSTOMER}/:id`} component={EditCustomer} />
            <Route path={URLS.NEW_CUSTOMER} component={NewCustomer} />
            <Route
              path={URLS.VACANCY_IMPROVER + CAMPAIGN_ID_PARAMETER}
              component={CampaignVacancyImprover}
            />
            <Route path={`${URLS.SHARED_CAMPAIGN}/:id`} component={SharedCampaign} />
            <Route
              path={`${URLS.SHARED_CAMPAIGN_MARKET_ANALYSIS}/:id`}
              component={SharedCampaignMarketAnalysis}
            />
            <Route path={`${URLS.EDIT_COLOR_SCHEME}/:id`} component={ColorScheme} />
            <Redirect to="/" />
          </Switch>
          <ToastContainer
            className="toast"
            toastClassName="toast-head"
            bodyClassName="toast-body"
            position="top-right"
          />
        </div>
      </IntlProvider>
    );
  }
}

export default compose(
  withRouter,
  connect(
    ({ global }) => ({
      lang: global.currentUser.lang,
      logged: global.logged
    }),
    { getUserInfo: AppActions.getUserInfo }
  )
)(App);
