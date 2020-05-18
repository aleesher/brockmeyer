import { analysisConstants } from "./MarketAnalysisActions";

export interface IMarketAnalysisState {
  analysis: any;
  isLoading: boolean;
  isLoaded: boolean;
  error: string;
}

const initialState: IMarketAnalysisState = {
  analysis: [],
  isLoading: false,
  isLoaded: false,
  error: ""
};

export default (state = initialState, action: any) => {
  switch (action.type) {
    case analysisConstants.REQUEST_PUSHED: {
      return { ...initialState, isLoading: true };
    }
    case analysisConstants.FETCH_MARKET_ANALYSIS: {
      return { ...state, isLoading: false, isLoaded: true, analysis: action.payload };
    }
    case analysisConstants.REQUEST_FAILURE: {
      return { ...state, isLoading: false, isLoaded: true };
    }
    default:
      return state;
  }
}
