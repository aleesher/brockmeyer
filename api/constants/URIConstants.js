const { REDIRECT_URL, API_URL, NODE_ENV, IG_API } = process.env;
const isProduction = NODE_ENV === "production";

const redirect =
  REDIRECT_URL || (isProduction ? "https://brockmeyer.secondcompany.nl" : "http://lvh.me:8080");
const apiUrl =
  API_URL || (isProduction ? "https://api.acc.brockmeyer.nl" : "https://api.dev.brockmeyer.nl");
const igApiEndpoint = IG_API || "https://controlcenter.intelligence-group.nl/api/ig_dev_dd";
const igTokenEndpoint = "https://controlcenter.intelligence-group.nl/api/auth/login";
const vacancyImproverApi = "https://vacatureverbeteraar.intelligence-group.nl/rest/v1/vacancy";

const baseUrl = `${apiUrl}/api/v1.7`;

const URI = {
  AUTHORIZE_URI: `${apiUrl}/authorize.php`,
  TOKEN_URL: `${apiUrl}/token.php`,
  IMAGE_URL: `${apiUrl}/img`,
  BASE_URL: baseUrl,
  CAMPAIGN_CHANNELS_URI: `${baseUrl}/campaign_channels`,
  CAMPAIGN_STATUS_TYPES_URI: `${baseUrl}/campaign_status_types`,
  CAMPAIGNS_URI: `${baseUrl}/campaigns`,
  SHARE_CAMPAIGN: `${baseUrl}/share_campaign`,
  SHARED_CAMPAIGN: `${baseUrl}/shared_campaign`,
  CHANNEL_TYPES_URI: `${baseUrl}/channel_types`,
  CHANNELS_URI: `${baseUrl}/channels`,
  CONTACT_TYPES_URI: `${baseUrl}/contact_types`,
  CONTACTS_URI: `${baseUrl}/contacts`,
  CONTRACT_TYPES_URI: `${baseUrl}/contract_types`,
  COUNTRIES_URI: `${baseUrl}/countries`,
  CUSTOMERS_URI: `${baseUrl}/companies`,
  EDUCATIONS_URI: `${baseUrl}/educations`,
  JOB_LEVELS_URI: `${baseUrl}/job_levels`,
  JOB_PROFILES_URI: `${baseUrl}/job_profiles`,
  JOB_COMPETENCES_URI: `${baseUrl}/job_competences`,
  REDIRECT_URI: `${redirect}/auth`,
  REGIONS_URI: `${baseUrl}/regions`,
  SECTORS_URI: `${baseUrl}/sectors`,
  SUGGEST_CHANNELS_URI: `${baseUrl}/suggest_channels`,
  CAMPAIGN_SUGGESTIONS_URI: "campaign_suggestions",
  CURRENT_USER_URI: `${baseUrl}/current_user`,
  DATA_LANGUAGES_URI: `${baseUrl}/data_languages`,
  IG_TOKEN_URI: igTokenEndpoint,
  MARKET_ANALYSIS_URI: igApiEndpoint,
  OCCUPATIONS_URI: `${baseUrl}/occupations`,
  VACANCY_IMPROVER_URI: `${redirect}/vacancy-improver`,
  ADD_VACANCY_IMPROVER_URI: `${vacancyImproverApi}/add`,
  CHECK_VACANCY_IMPROVER_URI: `${vacancyImproverApi}/check`,
  GET_VACANCY_IMPROVER_URI: `${vacancyImproverApi}/optimized`
};

module.exports = { URI };
