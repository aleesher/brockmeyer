import { channelsConstants } from "./ChannelsActions";
import { IChannel } from "../../models";
import { PAGE_SIZE } from "constants/constants";

export interface IChannelFilterItem {
  id: number;
  name: string;
  count: number;
}

export interface IChannelFilters {
  channelTypes?: IChannelFilterItem;
  educations?: IChannelFilterItem;
  regions?: IChannelFilterItem;
  sectors?: IChannelFilterItem;
}

export interface IChannelsState {
  channelItems: IChannel[];
  campaignChannels: any;
  suggestedChannels: IChannel[];
  campaignChannelsLoading: boolean;
  campaignChannelsLoaded: boolean;
  suggestedChannelsLoaded: boolean;
  suggestedChannelsIsLoading: boolean;
  channelFilters: IChannelFilters;
  channelFiltersLoaded: boolean;
  channelFiltersIsLoading: boolean;
  isLoading: boolean;
  isLoaded: boolean;
  noMoreData: boolean;
  error: string;
  channelTypes: any;
  channelTypesLoaded: boolean;
  channelTypesIsLoading: boolean;
  allChannelsIsLoading: boolean;
  allChannelsLoaded: boolean;
  addingChannel: boolean;
  isChannelAdded: boolean;
  isRemovingChannel: boolean;
  isChannelRemoved: boolean;
  addOnsIsLoading: boolean;
  addOnsIsLoaded: boolean;
}

const initialState: IChannelsState = {
  channelItems: [],
  campaignChannels: [],
  suggestedChannels: [],
  campaignChannelsLoading: false,
  campaignChannelsLoaded: false,
  suggestedChannelsLoaded: false,
  suggestedChannelsIsLoading: false,
  channelFilters: {},
  channelFiltersLoaded: false,
  channelFiltersIsLoading: false,
  isLoading: false,
  isLoaded: false,
  noMoreData: false,
  error: "",
  channelTypes: [],
  channelTypesLoaded: false,
  channelTypesIsLoading: false,
  allChannelsIsLoading: false,
  allChannelsLoaded: false,
  addingChannel: false,
  isChannelAdded: false,
  isRemovingChannel: false,
  isChannelRemoved: false,
  addOnsIsLoading: false,
  addOnsIsLoaded: false
};

export default (state = initialState, action: any) => {
  switch (action.type) {
    case channelsConstants.REQUEST_PUSHED: {
      return { ...state, isLoading: true };
    }
    case channelsConstants.GET_CAMPAIGN_CHANNELS_REQUEST: {
      return {
        ...state,
        campaignChannelsLoading: true,
        campaignChannelsLoaded: false,
        isLoading: true
      };
    }
    case channelsConstants.GET_CAMPAIGN_CHANNELS_SUCCESS: {
      return {
        ...state,
        campaignChannels: action.payload,
        campaignChannelsLoaded: true,
        campaignChannelsLoading: false,
        isLoading: false
      };
    }
    case channelsConstants.GET_CHANNEL_FILTERS_REQUEST: {
      return { ...state, channelFiltersIsLoading: true, channelFiltersLoaded: false };
    }
    case channelsConstants.GET_CHANNEL_FILTERS_SUCCESS: {
      return {
        ...state,
        channelFiltersIsLoading: false,
        channelFiltersLoaded: true,
        channelFilters: action.payload
      };
    }
    case channelsConstants.GET_CHANNELS_REQUEST: {
      return {
        ...state,
        isLoading: true,
        isLoaded: false
      };
    }
    case channelsConstants.GET_CHANNELS_SUCCESS: {
      const { channelItems } = state;
      const { payload, append } = action;
      const items = append ? [...channelItems, ...payload] : payload;

      return {
        ...state,
        channelItems: items,
        isLoading: false,
        isLoaded: true,
        noMoreData: payload.length < PAGE_SIZE
      };
    }
    case channelsConstants.GET_SUGGESTED_CHANNELS_REQUEST: {
      return {
        ...state,
        suggestedChannelsLoaded: false,
        suggestedChannelsIsLoading: true,
        suggestedChannels: [],
        isLoading: true,
        isLoaded: false
      };
    }
    case channelsConstants.GET_SUGGESTED_CHANNELS_SUCCESS: {
      const { channelItems } = state;
      const { payload, append } = action;
      const items = append ? [...channelItems, ...payload] : payload;
      return {
        ...state,
        suggestedChannels: items,
        isLoaded: true,
        suggestedChannelsIsLoading: false,
        suggestedChannelsLoaded: true,
        isLoading: false
      };
    }
    case channelsConstants.UPDATE_CAMPAIGN_CHANNELS_SUCCESS: {
      return { ...state, campaignChannels: action.payload, isLoading: false };
    }
    case channelsConstants.REQUEST_FAILURE: {
      return {
        ...state,
        isLoading: false,
        suggestedChannelsIsLoading: false,
        channelFiltersIsLoading: false,
        error: action.error
      };
    }
    case channelsConstants.GET_CHANNEL_TYPES_REQUEST: {
      return {
        ...state,
        channelTypesIsLoading: true,
        channelTypesLoaded: false
      };
    }
    case channelsConstants.GET_CHANNEL_TYPES_SUCCESS: {
      return {
        ...state,
        channelTypesIsLoading: false,
        channelTypesLoaded: true,
        channelTypes: action.payload
      };
    }
    case channelsConstants.GET_SUGGESTED_CHANNELS_STATE_SUCCESS: {
      return {
        ...state,
        ...action.payload
      };
    }
    case channelsConstants.GET_ALL_CHANNELS_REQUEST: {
      return {
        ...state,
        isLoading: true,
        isLoaded: false,
        allChannelsIsLoading: true,
        allChannelsLoaded: false
      };
    }
    case channelsConstants.GET_ALL_CHANNELS_SUCCESS: {
      const { channelItems: channels } = action.payload;

      return {
        ...state,
        isLoading: false,
        isLoaded: true,
        allChannelsIsLoading: false,
        allChannelsLoaded: true,
        ...action.payload,
        noMoreData: channels.length < PAGE_SIZE
      };
    }
    case channelsConstants.GET_ADD_ONS_INFO_REQUEST: {
      return {
        ...state,
        addOnsIsLoading: true,
        addOnsIsLoaded: false
      };
    }
    case channelsConstants.GET_ADD_ONS_INFO_SUCCESS: {
      return {
        ...state,
        addOnsIsLoading: false,
        addOnsIsLoaded: true,
        ...action.payload
      };
    }
    case channelsConstants.ADD_CAMPAIGN_CHANNEL_REQUEST: {
      return {
        ...state,
        addingChannel: true,
        isChannelAdded: false
      };
    }
    case channelsConstants.ADD_CAMPAIGN_CHANNEL_SUCCESS: {
      return {
        ...state,
        addingChannel: false,
        isChannelAdded: true,
        campaignChannels: action.payload
      };
    }
    case channelsConstants.REMOVE_CAMPAIGN_CHANNEL_REQUEST: {
      return {
        ...state,
        isRemovingChannel: true,
        isChannelRemoved: false
      };
    }
    case channelsConstants.REMOVE_CAMPAIGN_CHANNEL_SUCCESS: {
      return {
        ...state,
        isRemovingChannel: false,
        isChannelRemoved: true,
        campaignChannels: action.payload
      };
    }
    case channelsConstants.SET_INITIAL_ADD_REMOVE_STATE: {
      return {
        ...state,
        isRemovingChannel: false,
        isChannelRemoved: false,
        addingChannel: false,
        isChannelAdded: false
      };
    }
    case channelsConstants.RESET_FILTERS: {
      return {
        ...state,
        channelFilters: {}
      };
    }
    case channelsConstants.RESET_CAMPAIGN_CHANNELS_STATE: {
      return {
        ...state,
        campaignChannelsLoading: false,
        campaignChannelsLoaded: false,
        addOnsIsLoaded: false,
        addOnsIsLoading: false,
        suggestedChannelsLoaded: false,
        suggestedChannelsIsLoading: false,
        allChannelsIsLoading: false,
        allChannelsLoaded: false,
        isLoading: false
      };
    }
    default:
      return state;
  }
};
