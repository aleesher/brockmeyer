import { toast } from "react-toastify";

import * as mockApi from "../../mockApi";

export const analysisConstants = {
  LOGOUT: "APP_LOGOUT",
  REQUEST_PUSHED: "REQUEST_MARKET_ANALYSIS",
  FETCH_MARKET_ANALYSIS: "FETCH_MARKET_ANALYSIS",
  REQUEST_FAILURE: "REQUEST_MARKET_ANALYSIS_FAILURE"
};

function request() {
  return { type: analysisConstants.REQUEST_PUSHED };
}

function failure({ response, request, message }) {
  const target = response || request || message || {};
  const error = (target.data && target.data.error) || target;
  if (error !== "Previous operation canceled") {
    toast.error(error, { autoClose: 10000 });
  }
  return { type: analysisConstants.REQUEST_FAILURE };
}

export default class MarketAnalysisActions {
  static fetchMarketAnalysis(regions: string[], occupationId, iscoGroupId?) {
    return async dispatch => {
      try {
        dispatch(request());
        const result = await mockApi.fetchMarketAnalysis(regions, occupationId, iscoGroupId);
        dispatch(success(result));
      } catch (err) {
        dispatch(failure(err));
      }
    };

    function success(payload) {
      return { type: analysisConstants.FETCH_MARKET_ANALYSIS, payload };
    }
  }
}
