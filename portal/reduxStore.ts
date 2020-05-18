import thunk from "redux-thunk";
import { composeWithDevTools } from "redux-devtools-extension";
import { createStore, applyMiddleware, combineReducers, Reducer } from "redux";
import { reducer as formReducer, FormReducer } from "redux-form";
import { routerMiddleware, connectRouter, RouterState } from "connected-react-router";
import { createBrowserHistory } from "history";

import campaigns, { ICampaignOverviewState } from "./pages/campaigns/CampaignOverviewReducer";
import channels, { IChannelsState } from "./pages/campaign-channels/ChannelsReducer";
import customers, { ICustomersState } from "./pages/customers/CustomersReducer";
import marketAnalysis, {
  IMarketAnalysisState
} from "./pages/campaign-market-analysis/MarketAnalysisReducer";
import global, { IGlobalState } from "./pages/app/AppReducer";
import vacancyImprover, {
  IVacancyImproverState
} from "./pages/campaign-vacancy-improver/VacancyImproverReducer";

const middlewares = [thunk];

const history = createBrowserHistory();
const historyMiddleware = routerMiddleware(history);

export interface IAppState {
  global: IGlobalState;
  campaigns: ICampaignOverviewState;
  customers: ICustomersState;
  channels: IChannelsState;
  marketAnalysis: IMarketAnalysisState;
  router: RouterState;
  form: FormReducer;
  vacancyImprover: IVacancyImproverState;
}

const reducers: Reducer<IAppState> = combineReducers<IAppState>({
  global,
  campaigns,
  customers,
  channels,
  marketAnalysis,
  router: connectRouter(history),
  form: formReducer,
  vacancyImprover
});

const store = createStore(
  reducers,
  composeWithDevTools(applyMiddleware(...middlewares, historyMiddleware))
);

export { store, history };
