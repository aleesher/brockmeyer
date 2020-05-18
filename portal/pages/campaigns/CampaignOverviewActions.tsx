import React from "react";
import { push } from "connected-react-router";
import _ from "lodash";
import { FormattedMessage } from "react-intl";
import { initialize, destroy } from "redux-form";
import { toast } from "react-toastify";
import moment from "moment";

import * as mockApi from "../../mockApi";
import { ICampaign } from "models/.";
import readOnlyFields from "./read-only-fields";
import { NAVIGATION_URLS } from "constants/URIConstants";

export const campaignOverviewConstants = {
  CAMPAIGN_ADD_REQUEST: "CAMPAIGN_ADD_REQUEST",
  CAMPAIGN_UPDATE_REQUEST: "CAMPAIGN_UPDATE_REQUEST",
  CAMPAIGN_UPDATE_FILTERS: "CAMPAIGN_UPDATE_FILTERS",
  GET_CAMPAIGN_STATUS_TYPES_SUCCESS: "GET_CAMPAIGN_STATUS_TYPES_SUCCESS",
  GET_CAMPAIGN_SUCCESS: "GET_CAMPAIGN_SUCCESS",
  GET_CAMPAIGNS_SUCCESS: "GET_CAMPAIGNS_SUCCESS",
  GET_DETAILS_OPTIONS_SUCCESS: "GET_CAMPAIGNS_DETAILS_OPTIONS_SUCCESS",
  REMOVE_CAMPAIGN_SUCCESS: "REMOVE_CAMPAIGN_SUCCESS",
  REQUEST_FAILURE: "CAMPAIGNS_REQUEST_FAILURE",
  REQUEST_PUSHED: "CAMPAIGNS_REQUEST_PUSHED",
  GET_USER_CONTACTS: "GET_USER_CONTACTS",
  CAMPAIGN_DETAILS_CHANGED: "CAMPAIGN_DETAILS_CHANGED",
  CAMPAIGN_SET_STATUS: "CAMPAIGN_SET_STATUS",
  GET_HASHCODE_SUCCESS: "GET_HASHCODE_SUCCESS",
  GET_SHARED_CAMPAIGN_SUCCESS: "GET_SHARED_CAMPAIGN_SUCCESS",
  GET_SHARED_CAMPAIGN_REQUEST: "GET_SHARED_CAMPAIGN_REQUEST",
  CAMPAIGN_SET_BREADCRUMB: "CAMPAIGN_SET_BREADCRUMB",
  POST_HASHCODE_SUCCESS: "POST_HASHCODE_SUCCESS",
  SHARED_REQUEST_PUSHED: "SHARED_REQUEST_PUSHED",
  GET_SHARED_CAMPAIGN_TOKEN: "GET_SHARED_CAMPAIGN_TOKEN",
  PUT_HASHCODE_SUCCESS: "PUT_HASHCODE_SUCCESS",
  GET_SHARE_CAMPAIGN_SUCCESS: "GET_SHARE_CAMPAIGN",
  DELETE_SHARE_CAMPAIGN_SUCCESS: "DELETE_SHARE_CAMPAIGN_SUCCESS",
  SHARED_REQUEST_FAILURE: "SHARED_REQUEST_FAILURE"
};

const HIGHLIGHT_REGEX = /background-color: rgb\(89, 181, 92\);|background-color: rgb\(11, 107, 153\);|color: white;/gi;

function request() {
  return { type: campaignOverviewConstants.REQUEST_PUSHED };
}

function sharedCampaignrequest() {
  return { type: campaignOverviewConstants.SHARED_REQUEST_PUSHED };
}

function failure({ response, request, message }) {
  const target = response || request || message || {};
  const error = (target.data && target.data.error) || target;
  if (error !== "Previous operation canceled") {
    toast.error(error, { autoClose: 10000 });
  }
  return { type: campaignOverviewConstants.REQUEST_FAILURE };
}

function sharedCampaignFailure({ response, request, message }) {
  const target = response || request || message || {};
  const error = (target.data && target.data.error) || target;
  if (error !== "Previous operation canceled") {
    toast.error(error, { autoClose: 10000 });
  }
  return { type: campaignOverviewConstants.SHARED_REQUEST_FAILURE };
}

export default class CampaignOverviewActions {
  static addCampaign(
    newItem: ICampaign,
    redirectUrl = "",
    silentUpdate = false,
    needsRequest = true
  ) {
    return async dispatch => {
      try {
        if (needsRequest) {
          dispatch(request());
        }
        let result;
        const data: any = _.omit(newItem, readOnlyFields);
        if (data.dateEndPreferred) {
          data.dateEndPreferred = moment(data.dateEndPreferred).format("YYYY-MM-DD");
        }

        if (data.dateStartPreferred) {
          data.dateStartPreferred = moment(data.dateStartPreferred).format("YYYY-MM-DD");
        }

        if (data.jobDescription) {
          // removing highlights of vacancy improver result
          data.jobDescription = data.jobDescription.replace(HIGHLIGHT_REGEX, "");
        }
        if (data.id) {
          result = await mockApi.updateCampaign(data);
          dispatch(successUpdate(result, silentUpdate));
        } else {
          result = await mockApi.addCampaign(data);
          dispatch(success(result));
        }

        if (data.channels && data.channels.length) {
          result = { ...result, channels: data.channels };
        }

        result = {
          ...result,
          status: _.get(newItem, "status"),
          customer: _.get(newItem, "customer")
        };

        dispatch(initialize("campaignWizard", result));

        const headerLinks = [
          "/",
          NAVIGATION_URLS.CAMPAIGNS,
          NAVIGATION_URLS.CHANNELS,
          NAVIGATION_URLS.CUSTOMERS
        ];

        if (redirectUrl) {
          headerLinks.some(link => link === redirectUrl)
            ? dispatch(push(redirectUrl))
            : dispatch(push(`${redirectUrl}/${result.id}`));
        }
      } catch (error) {
        dispatch(failure(error));
      }
    };

    function success(payload) {
      toast(<FormattedMessage id="CAMPAIGN_SAVED" />, { type: "success", autoClose: 3500 });

      return { type: campaignOverviewConstants.CAMPAIGN_ADD_REQUEST, payload };
    }

    function successUpdate(payload, silentUpdate) {
      if (!silentUpdate) {
        toast(<FormattedMessage id="CAMPAIGN_SAVED" />, { type: "success", autoClose: 3500 });
      }

      return { type: campaignOverviewConstants.CAMPAIGN_UPDATE_REQUEST, payload };
    }
  }

  static getCampaign(id: number) {
    return async dispatch => {
      dispatch(request());
      try {
        const campaign = await mockApi.getCampaign(id);
        const payload = { ...campaign };
        dispatch(initialize("campaignWizard", payload));
        dispatch(success(payload));
      } catch (error) {
        dispatch(failure(error));
      }
    };

    function success(payload) {
      return { type: campaignOverviewConstants.GET_CAMPAIGN_SUCCESS, payload };
    }
  }

  static getCampaigns(search?: string, statusId?: string, sort?: string, page?: number) {
    return async dispatch => {
      dispatch(request());
      try {
        const result = await mockApi.getCampaigns(search, statusId, sort, page);
        const append = !(page === undefined || page === 1);
        dispatch(success(result, append));
      } catch (error) {
        dispatch(failure(error));
      }
    };
    function success(payload, append) {
      return { type: campaignOverviewConstants.GET_CAMPAIGNS_SUCCESS, payload, append };
    }
  }

  static getDetailsOptions() {
    return async dispatch => {
      dispatch(request());
      try {
        const result = await mockApi.getDetailsOptions();
        dispatch(success(result));
      } catch (error) {
        dispatch(failure(error));
      }
    };

    function success(data) {
      const payload = Object.keys(data).reduce((acc, key) => {
        acc[key] = data[key].map(item => ({ label: item.name, value: item.id }));
        return acc;
      }, {});
      return { type: campaignOverviewConstants.GET_DETAILS_OPTIONS_SUCCESS, payload };
    }
  }

  static removeCampaign(id: number, redirectUrl = NAVIGATION_URLS.CAMPAIGNS) {
    return async dispatch => {
      dispatch(request());
      try {
        await mockApi.cancelCampaign(id);
        await mockApi.removeCampaign(id);
        dispatch(success());
        dispatch(destroy("campaignWizard"));
        dispatch(push(redirectUrl));
      } catch (error) {
        dispatch(failure(error));
      }
    };

    function success() {
      return { type: campaignOverviewConstants.REMOVE_CAMPAIGN_SUCCESS };
    }
  }

  static getCampaignStatusTypes() {
    return async dispatch => {
      try {
        const payload = await mockApi.getCampaignStatusTypes();
        dispatch(success(payload));
      } catch (error) {
        dispatch(failure(error));
      }
    };

    function success(payload) {
      return { type: campaignOverviewConstants.GET_CAMPAIGN_STATUS_TYPES_SUCCESS, payload };
    }
  }

  static changeCampaignStatus(newItem: ICampaign, statusType, redirectUrl = "") {
    return async dispatch => {
      dispatch(request());
      try {
        const { id } = newItem;
        const data: any = _.omit(newItem, readOnlyFields);
        if (data.dateEndPreferred) {
          data.dateEndPreferred = moment(data.dateEndPreferred).format("YYYY-MM-DD");
        }
        if (data.dateStartPreferred) {
          data.dateStartPreferred = moment(data.dateStartPreferred).format("YYYY-MM-DD");
        }

        // need to check/discuss
        let updatedCampaign = data;
        if (statusType !== "retract") {
          updatedCampaign = await mockApi.updateCampaign(data);
        }

        try {
          let payload;
          if (statusType === "approve") {
            payload = await mockApi.approveCampaign(id);
          } else if (statusType === "publish") {
            payload = await mockApi.publishCampaign(id);
          } else if (statusType === "retract") {
            payload = await mockApi.retractCampaign(id);
          } else {
            payload = await mockApi.cancelCampaign(id);
          }
          payload = { ...payload, customer: _.get(newItem, "customer") };
          dispatch(initialize("campaignWizard", payload));
          dispatch(success(payload));
          const redirectLink =
            redirectUrl && redirectUrl !== NAVIGATION_URLS.CAMPAIGNS
              ? `${redirectUrl}/${id}`
              : redirectUrl;
          redirectLink && dispatch(push(redirectLink));
        } catch (err) {
          dispatch(success(updatedCampaign));
          dispatch(failure(err));
        }
      } catch (error) {
        dispatch(failure(error));
      }
    };

    function success(payload) {
      return { type: campaignOverviewConstants.CAMPAIGN_UPDATE_REQUEST, payload };
    }
  }

  static updateCampaignFilters(filters?: any) {
    return async dispatch => {
      dispatch({
        type: campaignOverviewConstants.CAMPAIGN_UPDATE_FILTERS,
        payload: filters
      });
    };
  }

  static getUserContacts() {
    return async (dispatch, getState) => {
      dispatch(request());
      try {
        const contacts = (await mockApi.getContacts(getState().global.currentUser.companyId)) || [];
        dispatch(success(contacts));
      } catch (error) {
        dispatch(failure(error));
      }
    };

    function success(payload) {
      return { type: campaignOverviewConstants.GET_USER_CONTACTS, payload };
    }
  }

  static setDetailsChange(isDetailsChanged: boolean) {
    return async dispatch => {
      dispatch({
        type: campaignOverviewConstants.CAMPAIGN_DETAILS_CHANGED,
        payload: isDetailsChanged
      });
    };
  }

  static setCampaignStatus(status) {
    return dispatch => {
      dispatch({
        type: campaignOverviewConstants.CAMPAIGN_SET_STATUS,
        payload: status
      });
    };
  }

  static getSharedCampaign(id: string) {
    return async dispatch => {
      dispatch(sharedCampaignrequest());
      try {
        const shared_campaign = await mockApi.getSharedCampaign(id);
        dispatch(success(shared_campaign));
      } catch (error) {
        dispatch(sharedCampaignFailure(error));
      }
    };

    function success(payload) {
      return { type: campaignOverviewConstants.GET_SHARED_CAMPAIGN_SUCCESS, payload };
    }
  }

  static getShareCampaign(id: number) {
    return async dispatch => {
      dispatch(sharedCampaignrequest());
      try {
        const hash = await mockApi.getShareCampaign(id);
        dispatch(success(hash));
      } catch (error) {
        dispatch(sharedCampaignFailure(error));
      }
    };

    function success(payload) {
      return { type: campaignOverviewConstants.GET_SHARE_CAMPAIGN_SUCCESS, payload };
    }
  }

  static deleteShareCampaign(id: number) {
    return async dispatch => {
      dispatch(sharedCampaignrequest());
      try {
        const hash = await mockApi.deleteShareCampaign(id);
        dispatch(success(hash));
      } catch (error) {
        dispatch(sharedCampaignFailure(error));
      }
    };

    function success(payload) {
      return { type: campaignOverviewConstants.DELETE_SHARE_CAMPAIGN_SUCCESS, payload };
    }
  }

  static putShareCampaign(id: number, date: string) {
    return async dispatch => {
      dispatch(sharedCampaignrequest());
      try {
        const hash = await mockApi.putShareCampaign(id, date);
        dispatch(success(hash));
      } catch (error) {
        dispatch(sharedCampaignFailure(error));
      }
    };

    function success(payload) {
      return { type: campaignOverviewConstants.PUT_HASHCODE_SUCCESS, payload };
    }
  }

  static postSharedCampaign(id: number, date: string) {
    return async dispatch => {
      dispatch(sharedCampaignrequest());
      try {
        const hash = await mockApi.postSharedCampaign(id, date);
        dispatch(success(hash));
      } catch (error) {
        dispatch(sharedCampaignFailure(error));
      }
    };

    function success(payload) {
      return { type: campaignOverviewConstants.POST_HASHCODE_SUCCESS, payload };
    }
  }

  static setBreadcrumb(breadcrumb) {
    return dispatch => {
      dispatch({
        type: campaignOverviewConstants.CAMPAIGN_SET_BREADCRUMB,
        payload: breadcrumb
      });
    };
  }
}
