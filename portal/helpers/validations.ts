import _ from "lodash";

export const required = value =>
  (_.isArray(value) && _.isEmpty(value)) || !value ? "MANDATORY_FIELD" : undefined;

export const email = value =>
  value && !/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(value) ? "WRONG_EMAIL" : undefined;

export const phoneNumber = value => {
  if (value && value[0] !== "0") {
    return "PHONE_MUST_START_WITH_ZERO";
  }
  if (value && value.length !== 10) {
    return "PHONE_LENGTH_INCORRECT";
  }
  return undefined;
};
