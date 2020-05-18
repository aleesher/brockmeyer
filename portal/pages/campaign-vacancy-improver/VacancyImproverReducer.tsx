import { vacancyImproverConstants } from "./VacancyImproverActions";

export interface IVacancyImproverState {
  vacancyResult: any;
  isLoading: boolean;
  isLoaded: boolean;
  error: string;
  vacancyImproverStatus: string | null;
  resultUrl: string;
}

const initialState: IVacancyImproverState = {
  vacancyResult: {},
  isLoading: false,
  isLoaded: false,
  error: "",
  vacancyImproverStatus: null,
  resultUrl: ""
};

export default (state = initialState, action: any) => {
  switch (action.type) {
    case vacancyImproverConstants.ADD_VACANCY_IMPROVER_REQUEST: {
      return {
        ...state,
        isLoading: true,
        vacancyImproverStatus: "sending"
      };
    }
    case vacancyImproverConstants.ADD_VACANCY_IMPROVER_SUCCESS: {
      return {
        ...state,
        resultUrl: action.payload,
        vacancyImproverStatus: "processing"
      };
    }
    case vacancyImproverConstants.CHECK_VACANCY_IMPROVER_SUCCESS: {
      return {
        ...state,
        vacancyImproverStatus: "preparing"
      };
    }
    case vacancyImproverConstants.GET_VACANCY_IMPROVER_SUCCESS: {
      return {
        ...state,
        vacancyResult: action.payload,
        vacancyImproverStatus: null,
        isLoading: false,
        isLoaded: true
      };
    }
    case vacancyImproverConstants.SET_DEFAULT_VACANCY_IMPROVER: {
      return initialState;
    }
    case vacancyImproverConstants.ADD_VACANCY_IMPROVER_FAILURE: {
      return { ...state, isLoading: false, error: action.error };
    }
    default:
      return state;
  }
};
