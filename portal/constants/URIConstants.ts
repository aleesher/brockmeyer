const URIConstants = {
  MOCKAPI_URI: "/api/",
  // temporarily images proxing from backend
  // REMOTE_RESOURCES_URI: "https://api.acc.brockmeyer.nl/img/"
  REMOTE_RESOURCES_URI: "/api/images/"
};

export const NAVIGATION_URLS = {
  CAMPAIGN_BANNERS: "/campaign-banners",
  CAMPAIGN_CHANNELS: "/campaign-channels",
  CAMPAIGN_DETAILS: "/campaign-details",
  CAMPAIGN_ADD_ONS: "/campaign-add-ons",
  CAMPAIGN_REVIEW: "/campaign-review",
  CAMPAIGN_SOCIAL_MEDIA: "/campaign-social-media",
  CAMPAIGNS: "/campaigns",
  CAMPAIGN_VACANCY: "/campaign-vacancy",
  CAMPAIGN: "/campaign",
  SHARED_CAMPAIGN: "/shared-campaign",
  SHARED_CAMPAIGN_MARKET_ANALYSIS: "/shared-campaign-market-analysis",
  CAMPAIGN_MARKET_ANALYSIS: "/campaign-market-analysis",
  CHANNELS: "/channels",
  CUSTOMER_CONTACTS: "/customer-contacts",
  CUSTOMERS: "/customers",
  EDIT_CUSTOMER: "/edit-customer",
  LOGIN: "/login",
  LOGOUT: "/logout",
  NEW_CUSTOMER: "/new-customer",
  REGISTRATION: "/registration",
  ALL_CHANNELS: "/all",
  SUGGESTED_CHANNELS: "/suggested",
  VACANCY_IMPROVER: "/campaign-vacancy-improver",
  EDIT_COLOR_SCHEME: "/edit-color-scheme"
};

export const CAMPAIGN_BREADCRUMBS = [
  { text: "DETAILS", url: NAVIGATION_URLS.CAMPAIGN_DETAILS, order: 1 },
  { text: "MARKET_ANALYSIS", url: NAVIGATION_URLS.CAMPAIGN_MARKET_ANALYSIS, order: 2 },
  { text: "CHANNELS", url: NAVIGATION_URLS.CAMPAIGN_CHANNELS, order: 3 },
  { text: "SOCIAL_MEDIA", url: NAVIGATION_URLS.CAMPAIGN_SOCIAL_MEDIA, order: 4 },
  { text: "BANNERS", url: NAVIGATION_URLS.CAMPAIGN_BANNERS, order: 5 },
  { text: "ADD_ONS", url: NAVIGATION_URLS.CAMPAIGN_ADD_ONS, order: 6 },
  { text: "REVIEW", url: NAVIGATION_URLS.CAMPAIGN_REVIEW, order: 7 },
  { text: "TEXT", url: NAVIGATION_URLS.VACANCY_IMPROVER, order: 8 },
  { text: "VACANCY", url: NAVIGATION_URLS.CAMPAIGN_VACANCY, order: 9 }
];

export const CAMPAIGN_ID_PARAMETER = "/:campaignId";

export default URIConstants;
