import { push } from "connected-react-router";
import { initialize, change } from "redux-form";
import { toast } from "react-toastify";
import _ from "lodash";

import readOnlyFields from "../campaigns/read-only-fields";
import * as mockApi from "../../mockApi";
import { campaignOverviewConstants } from "../campaigns/CampaignOverviewActions";
import { appConstants } from "../app/AppActions";
import { customersConstants } from "../customers/CustomersActions";

export const channelsConstants = {
  GET_CAMPAIGN_CHANNELS_REQUEST: "GET_CAMPAIGN_CHANNELS_REQUEST",
  GET_CAMPAIGN_CHANNELS_SUCCESS: "GET_CAMPAIGN_CHANNELS_SUCCESS",
  GET_CHANNEL_FILTERS_SUCCESS: "GET_CHANNEL_FILTERS_SUCCESS",
  GET_CHANNEL_FILTERS_REQUEST: "GET_CHANNEL_FILTERS_REQUEST",
  GET_CHANNELS_SUCCESS: "GET_CHANNELS_SUCCESS",
  GET_CHANNELS_REQUEST: "GET_CHANNELS_REQUEST",
  REQUEST_FAILURE: "CAMPAIGN_CHANNELS_FAILURE",
  REQUEST_PUSHED: "CAMPAIGN_CHANNELS_PUSHED",
  UPDATE_CAMPAIGN_CHANNELS_SUCCESS: "UPDATE_CAMPAIGN_CHANNELS_SUCCESS",
  GET_SUGGESTED_CHANNELS_REQUEST: "GET_SUGGESTED_CHANNELS_REQUEST",
  GET_SUGGESTED_CHANNELS_SUCCESS: "GET_SUGGESTED_CHANNELS_SUCCESS",
  GET_CHANNEL_TYPES_SUCCESS: "GET_CHANNEL_TYPES_SUCCESS",
  GET_CHANNEL_TYPES_REQUEST: "GET_CHANNEL_TYPES_REQUEST",
  GET_SUGGESTED_CHANNELS_STATE_SUCCESS: "GET_SUGGESTED_CHANNELS_STATE_SUCCESS",
  GET_ALL_CHANNELS_SUCCESS: "GET_ALL_CHANNELS_SUCCESS",
  GET_ALL_CHANNELS_REQUEST: "GET_ALL_CHANNELS_REQUEST",
  GET_ADD_ONS_INFO_REQUEST: "GET_ADD_ONS_INFO_REQUEST",
  GET_ADD_ONS_INFO_SUCCESS: "GET_ADD_ONS_INFO_SUCCESS",
  ADD_CAMPAIGN_CHANNEL_REQUEST: "ADD_CAMPAIGN_CHANNEL_REQUEST",
  ADD_CAMPAIGN_CHANNEL_SUCCESS: "ADD_CAMPAIGN_CHANNEL_SUCCESS",
  REMOVE_CAMPAIGN_CHANNEL_REQUEST: "REMOVE_CAMPAIGN_CHANNEL_REQUEST",
  REMOVE_CAMPAIGN_CHANNEL_SUCCESS: "REMOVE_CAMPAIGN_CHANNEL_SUCCESS",
  SET_INITIAL_ADD_REMOVE_STATE: "SET_INITIAL_ADD_REMOVE_STATE",
  RESET_FILTERS: "RESET_FILTERS",
  RESET_CAMPAIGN_CHANNELS_STATE: "RESET_CAMPAIGN_CHANNELS_STATE"
};

function request() {
  return { type: channelsConstants.REQUEST_PUSHED };
}

function failure({ response, request, message }) {
  const target = response || request || message || {};
  const error = (target.data && target.data.error) || target;
  if (error !== "Previous operation canceled") {
    if (typeof error === "string" && !error.includes("Resource of type campaign_suggestions")) {
      toast.error(error, { autoClose: 10000 });
    }
    return { type: channelsConstants.REQUEST_FAILURE };
  }

  return { type: "" };
}

export default class ChannelsActions {
  static getChannels(search?: string, filters?: any, sort?: string, page?: number) {
    return async dispatch => {
      dispatch(request());
      try {
        const payload = await mockApi.getChannels(search, filters, sort, page);
        const append = !(page === undefined || page === 1);
        dispatch(success(payload, append));
      } catch (error) {
        dispatch(failure(error));
      }
    };

    function request() {
      return { type: channelsConstants.GET_CHANNELS_REQUEST };
    }

    function success(payload, append) {
      return { type: channelsConstants.GET_CHANNELS_SUCCESS, payload, append };
    }
  }

  static getSuggestedChannels(id, isNew = false) {
    return async dispatch => {
      dispatch(request());

      try {
        const result = await mockApi.getSuggestedChannels(id, isNew);
        dispatch(success(result, false));
      } catch (error) {
        dispatch(failure(error));
      }
    };

    function success(payload, append) {
      return { type: channelsConstants.GET_SUGGESTED_CHANNELS_SUCCESS, payload, append };
    }

    function request() {
      return { type: channelsConstants.GET_SUGGESTED_CHANNELS_REQUEST };
    }
  }

  static getSuggestedChannelsNew(id, isNew = false) {
    return async dispatch => {
      dispatch(request());

      try {
        const {
          campaign,
          suggestedChannels,
          channelTypes,
          campaignChannels
        } = await mockApi.getSuggestedChannelsNew(id, isNew);

        dispatch(initialize("campaignWizard", campaign));
        dispatch(successCampaign(campaign));
        dispatch(successSuggestedChannels(suggestedChannels, false));
        dispatch(
          successChannelsState({
            channelTypes,
            campaignChannels
          })
        );
      } catch (error) {
        dispatch(failure(error));
      }
    };

    function successCampaign(payload) {
      return { type: campaignOverviewConstants.GET_CAMPAIGN_SUCCESS, payload };
    }

    function successSuggestedChannels(payload, append) {
      return { type: channelsConstants.GET_SUGGESTED_CHANNELS_SUCCESS, payload, append };
    }

    function successChannelsState(payload) {
      return { type: channelsConstants.GET_SUGGESTED_CHANNELS_STATE_SUCCESS, payload };
    }

    function request() {
      return { type: channelsConstants.GET_SUGGESTED_CHANNELS_REQUEST };
    }
  }

  static getAllChannels(id) {
    return async dispatch => {
      dispatch(request());

      try {
        const {
          campaign,
          channelFilters,
          channelTypes,
          channelItems,
          campaignChannels
        } = await mockApi.getAllChannels(id);
        dispatch(initialize("campaignWizard", campaign));
        dispatch(successCampaign(campaign));
        dispatch(
          successAllChannels({
            channelTypes,
            channelItems,
            campaignChannels,
            channelFilters
          })
        );
      } catch (error) {
        dispatch(failure(error));
      }
    };

    function successAllChannels(payload) {
      return { type: channelsConstants.GET_ALL_CHANNELS_SUCCESS, payload };
    }

    function successCampaign(payload) {
      return { type: campaignOverviewConstants.GET_CAMPAIGN_SUCCESS, payload };
    }

    function request() {
      return { type: channelsConstants.GET_ALL_CHANNELS_REQUEST };
    }
  }

  static getCampaignChannels(campaignId?: number) {
    return async dispatch => {
      dispatch(request());
      try {
        const result = await mockApi.getCampaignChannels(campaignId);
        dispatch(success(result));
      } catch (error) {
        dispatch(failure(error));
      }
    };

    function request() {
      return { type: channelsConstants.GET_CAMPAIGN_CHANNELS_REQUEST };
    }

    function success(payload) {
      return { type: channelsConstants.GET_CAMPAIGN_CHANNELS_SUCCESS, payload };
    }
  }

  static updateCampaignChannels(campaignId, selected, redirectUrl?, changedCampaign?, status?) {
    return async (dispatch, getState) => {
      dispatch(request());
      try {
        let campaign;
        const campaignChannelIds = getState().channels.campaignChannels.map(({ id }) => id);
        const currentSelectedIds = selected.map(({ id }) => id);
        const removedId = campaignChannelIds.find(id => !currentSelectedIds.includes(id));
        const newIds = currentSelectedIds.filter(id => !campaignChannelIds.includes(id));

        if (newIds && newIds.length > 0) {
          await mockApi.addCampaignChannel({ campaignId, channelIds: newIds });
        }

        if (typeof removedId === "number") {
          await mockApi.removeCampaignChannel(campaignId, removedId);
        }

        if (changedCampaign) {
          const data = _.omit(changedCampaign, readOnlyFields);
          campaign = await mockApi.updateCampaign(data);
        } else {
          campaign = await mockApi.getCampaign(campaignId);
        }

        campaign.channels = selected;

        dispatch(success(selected));
        dispatch(initialize("campaignWizard", campaign));

        if (redirectUrl) {
          dispatch(push(`${redirectUrl}/${campaign.id}`));
        }
      } catch (error) {
        dispatch(failure(error));
      }
    };

    function success(payload) {
      return { type: channelsConstants.UPDATE_CAMPAIGN_CHANNELS_SUCCESS, payload };
    }
  }

  static removeCampaignChannel(campaignId, channelId, campaignChannels, changedCampaign) {
    return async dispatch => {
      dispatch(request());
      try {
        if (typeof channelId === "number") {
          await mockApi.removeCampaignChannel(campaignId, channelId);
        }
        const selected = campaignChannels.filter(channel => channel.id !== channelId);

        const data = _.omit(changedCampaign, readOnlyFields);
        const campaign = await mockApi.updateCampaign(data);

        dispatch(success(selected));
        dispatch(change("channels", selected));
        dispatch(initialize("campaignWizard", campaign));
      } catch (error) {
        dispatch(failure(error));
      }
    };

    function request() {
      return { type: channelsConstants.REMOVE_CAMPAIGN_CHANNEL_REQUEST };
    }

    function success(payload) {
      return { type: channelsConstants.REMOVE_CAMPAIGN_CHANNEL_SUCCESS, payload };
    }
  }

  static addCampaignChannel(campaignId, channel, campaignChannels, changedCampaign) {
    return async dispatch => {
      dispatch(request());
      try {
        if (channel && typeof channel.id === "number") {
          await mockApi.addCampaignChannelNew({ campaignId, channelId: channel.id });
        }
        const data = _.omit(changedCampaign, readOnlyFields);
        const campaign = await mockApi.updateCampaign(data);
        const selected = [...campaignChannels, channel];
        dispatch(success(selected));
        dispatch(change("channels", channel));
        dispatch(initialize("campaignWizard", campaign));
      } catch (error) {
        dispatch(failure(error));
      }
    };

    function request() {
      return { type: channelsConstants.ADD_CAMPAIGN_CHANNEL_REQUEST };
    }

    function success(payload) {
      return { type: channelsConstants.ADD_CAMPAIGN_CHANNEL_SUCCESS, payload };
    }
  }

  static setInitAddRemoveState() {
    return dispatch => {
      dispatch({ type: channelsConstants.SET_INITIAL_ADD_REMOVE_STATE });
    };
  }

  static getChannelFilters(search?: string, filters?: any) {
    return async dispatch => {
      dispatch(request());
      try {
        const result = await mockApi.getChannelFilters(search, filters);
        dispatch(success(result));
      } catch (error) {
        dispatch(failure(error));
      }
    };

    function request() {
      return { type: channelsConstants.GET_CHANNEL_FILTERS_REQUEST };
    }

    function success(payload) {
      return { type: channelsConstants.GET_CHANNEL_FILTERS_SUCCESS, payload };
    }
  }

  static getChannelTypes() {
    return async dispatch => {
      dispatch(request());
      try {
        const result = await mockApi.getChannelTypes();
        dispatch(success(result));
      } catch (error) {
        dispatch(failure(error));
      }
    };

    function request() {
      return { type: channelsConstants.GET_CHANNEL_TYPES_REQUEST };
    }

    function success(payload) {
      return { type: channelsConstants.GET_CHANNEL_TYPES_SUCCESS, payload };
    }
  }

  static getAddOnsInfo(id, name, filters) {
    return async dispatch => {
      dispatch(request());
      try {
        const {
          campaign,
          campaignChannels,
          contactTypes,
          customerContacts,
          languages,
          channelItems
        } = await mockApi.getAddOnsInfo(id, name, filters);

        dispatch(initialize("campaignWizard", campaign));
        dispatch(successCampaign(campaign));
        dispatch(successCustomerContacts(customerContacts));
        dispatch(successLanguages(languages));
        dispatch(successContactTypes(contactTypes));
        dispatch(successAddOnsInfo({ campaignChannels, channelItems }));
      } catch (error) {
        dispatch(failure(error));
      }
    };

    function request() {
      return { type: channelsConstants.GET_ADD_ONS_INFO_REQUEST };
    }

    function successAddOnsInfo(payload) {
      return { type: channelsConstants.GET_ADD_ONS_INFO_SUCCESS, payload };
    }

    function successCampaign(payload) {
      return { type: campaignOverviewConstants.GET_CAMPAIGN_SUCCESS, payload };
    }

    function successLanguages(payload) {
      return { type: appConstants.FETCH_LANGUAGES, payload };
    }

    function successContactTypes(payload) {
      return { type: customersConstants.GET_CONTACT_TYPES_SUCCESS, payload };
    }

    function successCustomerContacts(payload) {
      return { type: customersConstants.GET_CONTACTS_SUCCESS, payload };
    }
  }

  static resetFilters() {
    return dispatch => {
      dispatch({
        type: channelsConstants.RESET_FILTERS
      });
    };
  }

  static resetCampaignChannelsState() {
    return dispatch => {
      dispatch({
        type: channelsConstants.RESET_CAMPAIGN_CHANNELS_STATE
      });
    };
  }
}
