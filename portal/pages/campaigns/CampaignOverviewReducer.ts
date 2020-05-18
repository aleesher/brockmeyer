import { campaignOverviewConstants } from "./CampaignOverviewActions";
import { ICampaign, ICampaignDetailOptions, IBreadcrump } from "models/.";
import { PAGE_SIZE } from "constants/constants";
import { CAMPAIGN_SORT } from "constants/constants";

export interface ICampaignOverviewState {
  campaignItems: ICampaign[];
  detailOptions: ICampaignDetailOptions;
  statusTypes: any;
  filters: any;
  isLoading: boolean;
  isLoaded: boolean;
  noMoreData: boolean;
  error: string;
  userContacts: any[];
  isDetailsChanged: boolean;
  campaignStatus: any;
  isSharedCampaignLoading: boolean;
  isSharedCampaignLoaded: boolean;
  breadcrumb: IBreadcrump | {};
}

const initialState: ICampaignOverviewState = {
  campaignItems: [],
  detailOptions: {
    educations: [],
    jobLevels: [],
    regions: [],
    jobProfiles: [],
    sectors: []
  },
  statusTypes: [],
  filters: {
    search: "",
    filter: "0",
    sort: CAMPAIGN_SORT.DATE_END_DESC,
    page: 1
  },
  isLoading: false,
  isLoaded: false,
  noMoreData: false,
  error: "",
  userContacts: [],
  isDetailsChanged: false,
  campaignStatus: {},
  isSharedCampaignLoading: false,
  isSharedCampaignLoaded: false,
  breadcrumb: {}
};

export default (state = initialState, action: any) => {
  switch (action.type) {
    case campaignOverviewConstants.CAMPAIGN_ADD_REQUEST: {
      return {
        ...state,
        isLoading: false,
        campaignItems: [...state.campaignItems, action.payload]
      };
    }
    case campaignOverviewConstants.CAMPAIGN_UPDATE_REQUEST: {
      return {
        ...state,
        isLoading: false,
        campaignItems: state.campaignItems.map(item =>
          item.id === action.payload.id ? { ...item, ...action.payload } : item
        )
      };
    }
    case campaignOverviewConstants.CAMPAIGN_UPDATE_FILTERS: {
      return { ...state, filters: { ...state.filters, ...action.payload } };
    }
    case campaignOverviewConstants.GET_CAMPAIGN_SUCCESS: {
      const exist = state.campaignItems.some(({ id }) => id === action.payload.id);
      return {
        ...state,
        isLoading: false,
        isLoaded: true,
        campaignItems: exist
          ? state.campaignItems.map(item => (item.id === action.payload.id ? action.payload : item))
          : state.campaignItems.concat(action.payload)
      };
    }
    case campaignOverviewConstants.GET_CAMPAIGNS_SUCCESS: {
      const { campaignItems } = state;
      const { payload, append } = action;
      const items = append ? [...campaignItems, ...payload] : payload;
      return {
        ...state,
        isLoading: false,
        isLoaded: true,
        noMoreData: payload.length < PAGE_SIZE,
        campaignItems: items
      };
    }
    case campaignOverviewConstants.SHARED_REQUEST_PUSHED: {
      return {
        ...state,
        isSharedCampaignLoading: true,
        isSharedCampaignLoaded: false
        // hashcode: action.payload
      };
    }
    case campaignOverviewConstants.POST_HASHCODE_SUCCESS: {
      return {
        ...state,
        isSharedCampaignLoading: false,
        isSharedCampaignLoaded: true,
        hashcode: action.payload
      };
    }
    case campaignOverviewConstants.DELETE_SHARE_CAMPAIGN_SUCCESS: {
      return {
        ...state,
        isSharedCampaignLoading: false,
        isSharedCampaignLoaded: true,
        hashcode: null
      };
    }
    case campaignOverviewConstants.PUT_HASHCODE_SUCCESS: {
      return {
        ...state,
        isSharedCampaignLoading: false,
        isSharedCampaignLoaded: true,
        hashcode: action.payload
      };
    }
    case campaignOverviewConstants.GET_SHARE_CAMPAIGN_SUCCESS: {
      return {
        ...state,
        isSharedCampaignLoading: false,
        isSharedCampaignLoaded: true,
        hashcode: action.payload
      };
    }

    case campaignOverviewConstants.GET_SHARED_CAMPAIGN_TOKEN: {
      return {
        ...state,
        isSharedCampaignLoading: false,
        isSharedCampaignLoaded: true,
        hashcode: action.payload
      };
    }

    case campaignOverviewConstants.GET_SHARED_CAMPAIGN_REQUEST: {
      return {
        ...state,
        isSharedCampaignLoaded: false,
        isSharedCampaignLoading: true
      };
    }

    case campaignOverviewConstants.GET_SHARED_CAMPAIGN_SUCCESS: {
      return {
        ...state,
        isSharedCampaignLoading: false,
        isSharedCampaignLoaded: true,
        shared_campaign: action.payload.sharedCampaign,
        sharedCampaignDetailOptions: action.payload.detailOptions
      };
    }

    case campaignOverviewConstants.GET_CAMPAIGN_STATUS_TYPES_SUCCESS: {
      return { ...state, statusTypes: action.payload };
    }
    case campaignOverviewConstants.GET_DETAILS_OPTIONS_SUCCESS: {
      return {
        ...state,
        isLoading: false,
        isLoaded: true,
        detailOptions: action.payload
      };
    }
    case campaignOverviewConstants.REMOVE_CAMPAIGN_SUCCESS: {
      return { ...state, isLoading: false };
    }
    case campaignOverviewConstants.REQUEST_PUSHED: {
      return { ...state, isLoading: true };
    }
    case campaignOverviewConstants.REQUEST_FAILURE: {
      return { ...state, isLoading: false, error: action.error };
    }
    case campaignOverviewConstants.SHARED_REQUEST_FAILURE: {
      return {
        ...state,
        hashcode: null,
        isSharedCampaignLoading: false,
        isSharedCampaignLoaded: true,
        shared_campaign: null,
        error: action.error
      };
    }
    case campaignOverviewConstants.GET_USER_CONTACTS: {
      return { ...state, isLoading: false, userContacts: action.payload };
    }
    case campaignOverviewConstants.CAMPAIGN_DETAILS_CHANGED: {
      return { ...state, isDetailsChanged: action.payload };
    }
    case campaignOverviewConstants.CAMPAIGN_SET_STATUS: {
      return { ...state, campaignStatus: action.payload };
    }
    case campaignOverviewConstants.CAMPAIGN_SET_BREADCRUMB: {
      return { ...state, breadcrumb: action.payload };
    }
    default:
      return state;
  }
};
