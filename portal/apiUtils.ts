import axios from "axios";
import _ from "lodash";

import URIConstants, { NAVIGATION_URLS } from "constants/URIConstants";

export const CancelToken = axios.CancelToken;

export const request = (timeout = 30000): any =>
  axios.create({
    baseURL: URIConstants.MOCKAPI_URI,
    timeout
  });

export const bindRequest = req => {
  const { interceptors } = req;
  const { response: res, ...rest } = interceptors;
  const response = res.use(
    response => {
      return _.get(response, "data", response);
    },
    error => {
      if (error.response && error.response.status === 403 && error.response.data) {
        window.location = error.response.data;
      } else if (error.response && error.response.status === 401) {
        window.location.href = NAVIGATION_URLS.LOGOUT;
      }
      return Promise.reject(error);
    }
  );
  return { ...req, interceptors: { ...rest, response } };
};
