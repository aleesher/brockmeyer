import * as mockApi from "../../mockApi";
import { NAVIGATION_URLS } from "constants/URIConstants";
import { ENGLISH_LANGUAGE, DUTCH_LANGUAGE } from "constants/constants";

export const appConstants = {
  LOGOUT: "APP_LOGOUT",
  PUSH_REQUEST: "PUSH_APP_REQUEST",
  UPDATE_LOCALE: "CURRENT_USER_LANG_UPDATE",
  FETCH_LANGUAGES: "FETCH_LANGUAGES",
  GET_CURRENT_USER: "GET_CURRENT_USER",
  TOGGLE_TOUR: "TOGGLE_TOUR",
  TOGGLE_TOUR_STATUS: "TOGGLE_TOUR_STATUS",
  ENABLE_TOUR_STATUS: "ENABLE_TOUR_STATUS",
  DISABLE_TOUR_STATUS: "DISABLE_TOUR_STATUS",
  UPDATE_USER_COLOR: "UPDATE_USER_COLOR"
};

const getUserInfo = () => dispatch =>
  mockApi.getUserInfo().then(res => {
    if (Object.keys(res).length) {
      dispatch({ type: appConstants.GET_CURRENT_USER, payload: res });
    } else {
      window.location.href = NAVIGATION_URLS.LOGIN;
    }
  });

const changeLocale = lang => dispatch => {
  const data = { lang: lang === "en" ? ENGLISH_LANGUAGE : DUTCH_LANGUAGE };
  return mockApi
    .updateLanguage(data)
    .then(res => dispatch({ type: appConstants.UPDATE_LOCALE, payload: res }));
};

const changeUserColorScheme = data => dispatch => {
  return mockApi
    .updateUserColorScheme(data)
    .then(res => dispatch({ type: appConstants.UPDATE_USER_COLOR, payload: res }));
};

const fetchLanguages = () => dispatch => {
  dispatch({ type: appConstants.PUSH_REQUEST });
  return mockApi
    .fetchLanguages()
    .then(res => dispatch({ type: appConstants.FETCH_LANGUAGES, payload: res }));
};

const logout = () => dispatch => dispatch({ type: appConstants.LOGOUT });

const toggleTour = () => dispatch => {
  dispatch({ type: appConstants.TOGGLE_TOUR });
};

const toggleTourStatus = () => dispatch => {
  dispatch({ type: appConstants.TOGGLE_TOUR_STATUS });
};

const enableTourStatus = () => dispatch => {
  dispatch({ type: appConstants.ENABLE_TOUR_STATUS });
};

const disableTourStatus = () => dispatch => {
  dispatch({ type: appConstants.DISABLE_TOUR_STATUS });
};

export default {
  getUserInfo,
  changeLocale,
  fetchLanguages,
  logout,
  toggleTour,
  toggleTourStatus,
  enableTourStatus,
  disableTourStatus,
  changeUserColorScheme
};
