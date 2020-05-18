import React from "react";
import _ from "lodash";
import { push } from "connected-react-router";
import { FormattedMessage } from "react-intl";
import { change } from "redux-form";
import { toast } from "react-toastify";

import * as mockApi from "../../mockApi";
import { NAVIGATION_URLS } from "constants/URIConstants";

export const customersConstants = {
  ADD_CONTACT_SUCCESS: "ADD_CONTACT_SUCCESS",
  ADD_CUSTOMER_SUCCESS: "ADD_CUSTOMER_SUCCESS",
  GET_CONTACT_TYPES_SUCCESS: "GET_CONTACT_TYPES_SUCCESS",
  GET_CONTACTS_SUCCESS: "GET_CONTACTS_SUCCESS",
  GET_COUNTRIES_SUCCESS: "GET_COUNTRIES_SUCCESS",
  GET_CUSTOMERS_SUCCESS: "GET_CUSTOMERS_SUCCESS",
  REMOVE_CONTACTS_SUCCESS: "REMOVE_CONTACTS_SUCCESS",
  REQUEST_FAILURE: "CUSTOMER_REQUEST_FAILURE",
  REQUEST_PUSHED: "CUSTOMER_REQUEST_PUSHED",
  SELECT_CONTACT: "SELECT_CUSTOMER_CONTACT",
  UPDATE_CONTACT_SUCCESS: "UPDATE_CONTACT_SUCCESS",
  UPDATE_CUSTOMER_SUCCESS: "UPDATE_CUSTOMER_SUCCESS",
  UPDATE_COLOR: "UPDATE_COLOR_THEME"
};

function request() {
  return { type: customersConstants.REQUEST_PUSHED };
}

function failure({ response, request, message }) {
  const target = response || request || message || {};
  const error = (target.data && target.data.error) || target;
  if (error !== "Previous operation canceled") {
    toast.error(error, { autoClose: 10000 });
  }
  return { type: customersConstants.REQUEST_FAILURE };
}

export default class CustomersActions {
  static addCustomer(data, redirectUrl) {
    return async dispatch => {
      dispatch(request());
      try {
        let newCustomer = {
          ...data,
          name: _.get(data, "name", ""),
          countryId: _.get(data, "countryId.value")
        };
        if (!_.has(data, "logo")) {
          newCustomer = { ...newCustomer, logo: "/assets/images/no_image.png" };
        }
        const result = await mockApi.addCustomer(newCustomer);
        dispatch(success(result));

        if (redirectUrl === NAVIGATION_URLS.CAMPAIGN_DETAILS) {
          dispatch(change("campaignWizard", "companyId", _.get(result, "id")));
        }

        dispatch(push(redirectUrl));
        toast(<FormattedMessage id="NEW_CUSTOMER_ADDED" />, { type: "success", autoClose: 3500 });
      } catch (error) {
        dispatch(failure(error));
      }
    };

    function success(payload) {
      return { type: customersConstants.ADD_CUSTOMER_SUCCESS, payload };
    }
  }

  static addCustomerContact(data, redirectUrl?) {
    return async dispatch => {
      dispatch(request());
      try {
        const result = await mockApi.addCustomerContact(data);
        dispatch(success(result));
        if (redirectUrl) {
          dispatch(push(redirectUrl));
        } else {
          dispatch(change("campaignWizard", "jobContact", _.get(result, "id")));
        }

        toast(<FormattedMessage id="NEW_CONTACT_ADDED" />, { type: "success", autoClose: 3500 });
      } catch (error) {
        dispatch(failure(error));
      }
    };

    function success(payload) {
      return { type: customersConstants.ADD_CONTACT_SUCCESS, payload };
    }
  }

  static getContactTypes() {
    return async dispatch => {
      dispatch(request());
      try {
        const payload = await mockApi.getContactTypes();
        dispatch(success(payload));
      } catch (error) {
        dispatch(failure(error));
      }
    };

    function success(payload) {
      return { type: customersConstants.GET_CONTACT_TYPES_SUCCESS, payload };
    }
  }

  static getCountries() {
    return async dispatch => {
      dispatch(request());
      try {
        const payload = await mockApi.getCountries();
        dispatch(success(payload));
      } catch (error) {
        dispatch(failure(error));
      }
    };

    function success(data) {
      const payload = data.map(({ id, name }) => ({ value: parseInt(id, 10), label: name }));
      return { type: customersConstants.GET_COUNTRIES_SUCCESS, payload };
    }
  }

  static getCustomerContacts(customerId: number) {
    return async dispatch => {
      dispatch(request());
      try {
        const contacts = (await mockApi.getContacts(customerId)) || [];
        dispatch(success(contacts));
      } catch (error) {
        dispatch(failure(error));
      }
    };

    function success(payload) {
      return { type: customersConstants.GET_CONTACTS_SUCCESS, payload };
    }
  }

  static getCustomers(search?: string, sort?: string, page?: number) {
    return async dispatch => {
      dispatch(request());
      try {
        const payload = await mockApi.getCustomers(search, sort, page);
        const append = !(page === undefined || page === 1);
        dispatch(success(payload, append));
      } catch (error) {
        dispatch(failure(error));
      }
    };

    function success(payload, append) {
      return { type: customersConstants.GET_CUSTOMERS_SUCCESS, payload, append };
    }
  }

  static changeColorScheme = data => dispatch => {
    return mockApi
      .updateColorScheme(data)
      .then(res => dispatch({ type: customersConstants.UPDATE_COLOR, payload: res }));
  };

  static removeContacts(ids) {
    return async (dispatch, getState) => {
      dispatch(request());
      const result = await Promise.all(
        ids.map(async id => {
          try {
            await mockApi.removeCustomerContact(id);
            return { id, error: false };
          } catch (error) {
            return { id, error: true };
          }
        })
      );
      const isThereError = _.filter(result, ["error", true]);
      const isThereSuccess = _.filter(result, ["error", false]);
      if (isThereError && isThereError.length > 0) {
        const contacts = _.filter(getState().customers.contacts, item =>
          _.includes(_.map(isThereError, "id"), item.id)
        );
        const names = contacts.map(item => `${item.firstName} ${item.surname}`).join(", ");
        toast.warn(<FormattedMessage id="ERROR_REMOVE_CONTACT" values={{ names }} />, {
          autoClose: 3500
        });
      }
      if (isThereSuccess && isThereSuccess.length > 0) {
        dispatch(success(_.map(isThereSuccess, "id")));
        toast.success(
          <FormattedMessage id="CONTACTS_REMOVED" values={{ count: isThereSuccess.length }} />,
          { autoClose: 3500 }
        );
      }
      dispatch(success([]));
    };

    function success(payload) {
      return { type: customersConstants.REMOVE_CONTACTS_SUCCESS, payload };
    }
  }

  static selectContact(id) {
    return async dispatch => dispatch({ type: customersConstants.SELECT_CONTACT, payload: id });
  }

  static updateCustomer(data, redirectUrl) {
    return async dispatch => {
      dispatch(request());
      try {
        const result = await mockApi.updateCustomer({
          ...data,
          countryId: _.get(data, "countryId.value")
        });
        dispatch(success(result));
        dispatch(push(redirectUrl));
        toast(<FormattedMessage id="CHANGES_APPLIED" />, { type: "success", autoClose: 3500 });
      } catch (error) {
        dispatch(failure(error));
      }
    };

    function success(payload) {
      return { type: customersConstants.UPDATE_CUSTOMER_SUCCESS, payload };
    }
  }

  static updateCustomerContact(data, redirectUrl) {
    return async dispatch => {
      dispatch(request());
      try {
        const requiredData = _.omit(data, ["isDefaultContact", "defaultContact"]);
        const result = await mockApi.updateCustomerContact(requiredData);
        dispatch(success(result));
        dispatch(push(redirectUrl));
        toast(<FormattedMessage id="CHANGES_APPLIED" />, { type: "success", autoClose: 3500 });
      } catch (error) {
        dispatch(failure(error));
      }
    };

    function success(payload) {
      return { type: customersConstants.UPDATE_CONTACT_SUCCESS, payload };
    }
  }
}
