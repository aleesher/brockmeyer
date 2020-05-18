import * as React from "react";
import { toast } from "react-toastify";
import { change } from "redux-form";
import { FormattedMessage } from "react-intl";
import * as _ from "lodash";

import * as mockApi from "../../mockApi";

export const vacancyImproverConstants = {
  ADD_VACANCY_IMPROVER_SUCCESS: "ADD_VACANCY_IMPROVER_SUCCESS",
  CHECK_VACANCY_IMPROVER_SUCCESS: "CHECK_VACANCY_IMPROVER_SUCCESS",
  GET_VACANCY_IMPROVER_SUCCESS: "GET_VACANCY_IMPROVER_SUCCESS",
  ADD_VACANCY_IMPROVER_REQUEST: "ADD_VACANCY_IMPROVER_REQUEST",
  ADD_VACANCY_IMPROVER_FAILURE: "ADD_VACANCY_IMPROVER_FAILURE",
  SET_DEFAULT_VACANCY_IMPROVER: "SET_DEFAULT_VACANCY_IMPROVER"
};

function failure({ response, request, message }) {
  const target = response || request || message || {};
  const error = (target.data && target.data.error) || target;
  if (error !== "Previous operation canceled") {
    const errorText = _.includes(error, "vacancy can not be scanned") ? (
      <FormattedMessage id="VACANCY_IMPROVER_ERROR" />
    ) : (
      error
    );
    toast.error(errorText, { autoClose: 10000 });
  }
  return { type: vacancyImproverConstants.ADD_VACANCY_IMPROVER_FAILURE };
}

export default class VacancyImproverActions {
  static addVacancyImprover(data: any) {
    return async dispatch => {
      dispatch(request());

      try {
        const hashUrl = await mockApi.addVacancyImprover(data);
        const result = hashUrl.split("=")[1];
        setTimeout(() => {
          dispatch(success(result));
          dispatch(VacancyImproverActions.checkVacancyImprover());
        }, 2000);
      } catch (error) {
        dispatch(failure(error));
      }
    };

    function request() {
      return { type: vacancyImproverConstants.ADD_VACANCY_IMPROVER_REQUEST };
    }

    function success(payload) {
      return { type: vacancyImproverConstants.ADD_VACANCY_IMPROVER_SUCCESS, payload };
    }
  }

  static checkVacancyImprover() {
    return async (dispatch, getState) => {
      try {
        await mockApi.checkVacancyImprover(getState().vacancyImprover.resultUrl);
        dispatch(success());
        dispatch(VacancyImproverActions.getVacancyImprover());
      } catch (error) {
        dispatch(failure(error));
      }
    };

    function success() {
      return { type: vacancyImproverConstants.CHECK_VACANCY_IMPROVER_SUCCESS };
    }
  }

  static getVacancyImprover() {
    return async (dispatch, getState) => {
      try {
        const result = await mockApi.getVacancyImprover(getState().vacancyImprover.resultUrl);
        setTimeout(() => {
          const jobDescription = _.get(result, "vacancy.sections[0].content");
          if (jobDescription) {
            dispatch(change("campaignWizard", "jobDescription", jobDescription));
          }
          dispatch(success(result));
        }, 2000);
      } catch (error) {
        dispatch(failure(error));
      }
    };

    function success(payload) {
      return { type: vacancyImproverConstants.GET_VACANCY_IMPROVER_SUCCESS, payload };
    }
  }

  static setDefaultVacancyImprover() {
    return { type: vacancyImproverConstants.SET_DEFAULT_VACANCY_IMPROVER };
  }
}
