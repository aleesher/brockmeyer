import React from "react";
import { connect as reduxConnect } from "react-redux";
import { reduxForm } from "redux-form";

export function connect<T extends React.ComponentClass<{}>>(
  mapStateToProps: any,
  mapDispatchToProps: any
) {
  return (target: any) => {
    return reduxConnect(mapStateToProps, mapDispatchToProps)(target);
  };
}

export function campaignForm<T extends React.ComponentClass<{}>>(validate?: any) {
  return (target: any) => {
    return reduxForm({
      form: "campaignWizard",
      validate,
      touchOnChange: true,
      destroyOnUnmount: false,
      forceUnregisterOnUnmount: true
    })(target);
  };
}

export function sharedCampaignForm<T extends React.ComponentClass<{}>>(validate?: any) {
  return (target: any) => {
    return reduxForm({
      form: "sharedCampaign",
      validate,
      touchOnChange: true,
      destroyOnUnmount: false,
      forceUnregisterOnUnmount: true
    })(target);
  };
}
