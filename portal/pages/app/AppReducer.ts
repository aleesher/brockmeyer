import { appConstants } from "./AppActions";
import { ENGLISH_LANGUAGE } from "constants/constants";

export interface IGlobalState {
  isLoading: boolean;
  logged: boolean;
  currentUser: any;
  languages: any;
  isTourOpen: boolean;
  isTourEnabled: boolean;
}

const initialState: IGlobalState = {
  isLoading: false,
  logged: false,
  currentUser: {},
  languages: [],
  isTourOpen: false,
  isTourEnabled: false
};

export default (state = initialState, action: any) => {
  switch (action.type) {
    case appConstants.LOGOUT: {
      return initialState;
    }
    case appConstants.PUSH_REQUEST: {
      return { ...state, isLoading: true };
    }
    case appConstants.UPDATE_LOCALE: {
      return {
        ...state,
        currentUser: {
          ...action.payload,
          lang: action.payload.lang === ENGLISH_LANGUAGE ? "en" : "nl"
        }
      };
    }
    case appConstants.UPDATE_USER_COLOR: {
      return {
        ...state,
        currentUser: {
          ...action.payload,
          lang: action.payload.lang === ENGLISH_LANGUAGE ? "en" : "nl",
          portalSettings: action.payload.portalSettings
        }
      };
    }
    case appConstants.GET_CURRENT_USER: {
      return {
        ...state,
        logged: true,
        currentUser: {
          ...action.payload,
          lang: action.payload.lang === ENGLISH_LANGUAGE ? "en" : "nl"
        }
      };
    }
    case appConstants.FETCH_LANGUAGES: {
      return { ...state, isLoading: false, languages: action.payload };
    }
    case appConstants.TOGGLE_TOUR: {
      return { ...state, isTourOpen: !state.isTourOpen };
    }
    case appConstants.TOGGLE_TOUR_STATUS: {
      return { ...state, isTourEnabled: !state.isTourEnabled };
    }
    case appConstants.DISABLE_TOUR_STATUS: {
      return { ...state, isTourEnabled: false };
    }
    case appConstants.ENABLE_TOUR_STATUS: {
      return { ...state, isTourEnabled: true };
    }
    default:
      return state;
  }
};
