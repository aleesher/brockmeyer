import React from "react";
import { FormattedMessage, injectIntl } from "react-intl";
import { Field, destroy, getFormValues, change } from "redux-form";
import { compose } from "recompose";
import moment from "moment";
import momentTZ from "moment-timezone";
import { addDays } from "date-fns";

import { KeyboardArrowRight } from "../../components/icons";
import CampaignActions from "../campaigns/CampaignOverviewActions";
import CustomersActions from "../customers/CustomersActions";
import DatePickerStyled from "../../components/inputs/date-picker";
import DropList from "../../components/drop-list";
import Input from "../../components/inputs/input";
import { connect, campaignForm } from "../../reduxConnector";
import { NAVIGATION_URLS } from "../../constants/URIConstants";
import { PageLayout } from "../../components/.";
import { required } from "../../helpers/validations";
import { getUserName, sortContacts, redirect } from "../../helpers/common";
import { JOB_HOLDER, JOB_CONTACT } from "../../constants/constants";
import Button from "../../components/button/Button";
import Tooltip from "components/tooltip";

import "./CampaignVacancy.scss";

class CampaignVacancy extends React.Component<any, any> {
  private addNewCampaign(readOnly) {
    const { history, publishCampaign, destroyForm, campaignWizard } = this.props;

    if (!readOnly) {
      publishCampaign(campaignWizard);
    }

    destroyForm();
    redirect(history)(NAVIGATION_URLS.CAMPAIGNS);
  }

  componentWillMount() {
    const {
      campaignWizard,
      getCustomerContacts,
      getUserContacts,
      userContacts,
      currentUser
    } = this.props;
    if (campaignWizard && campaignWizard.companyId) {
      getCustomerContacts(campaignWizard.companyId);

      const isPartner = campaignWizard.companyId !== currentUser.companyId;
      const isEmptyPartnerContacts = !userContacts || userContacts.length === 0;

      if (isPartner && isEmptyPartnerContacts) {
        getUserContacts();
      }
    }
  }

  private filterDate = date => {
    const day = date.day();
    const timeCET = parseInt(moment(momentTZ().tz("Europe/Amsterdam")).format("HH"), 10);
    const isWeekday = day !== 0 && day !== 6;
    const isToday = date.format("l") === moment().format("l");
    const isBelowCET = timeCET <= 11;

    if (isWeekday && isToday && isBelowCET) {
      return true;
    } else if (isWeekday && !isToday) {
      return true;
    } else {
      return false;
    }
  };

  private handleInputChange = input => value => input && input.onChange(value);

  private datePicker = (isEndDate, minDate, defaultValue?, filterDate?) => ({ input }) => {
    const {
      campaignWizard: { dateEndPreferred },
      changeFormValue
    } = this.props;
    const maxDate = isEndDate ? moment(addDays(minDate as Date, 60)) : undefined;

    if (maxDate && dateEndPreferred) {
      const dateEnd = moment(dateEndPreferred);
      const result = this.calcRange(maxDate, minDate, dateEnd);
      if (!result) {
        changeFormValue("dateEndPreferred", "");
      }
    }

    return (
      <DatePickerStyled
        selected={(input && input.value ? moment(input.value) : defaultValue) as boolean}
        onChange={this.handleInputChange(input)}
        minDate={minDate as Date}
        filterDate={filterDate}
        maxDate={maxDate}
      />
    );
  };

  private calcRange = (maxDate, minDate: Date, dateEnd): boolean => {
    return dateEnd.isBetween(minDate, maxDate, "days", "[]");
  };

  render() {
    const {
      campaignWizard,
      invalid,
      isLoading,
      contacts,
      userContacts,
      intl: { formatMessage },
      currentUser,
      status
    } = this.props;

    const { dateStartPreferred, companyId } = campaignWizard;
    const statusName = status ? status.name : "order_new";
    const readOnly = !["order_new", "order_open"].includes(statusName);
    const getContacts = contactTypeId =>
      [...sortContacts(contacts), ...sortContacts(userContacts)]
        .filter(contact => contact.contactTypes.includes(`${contactTypeId}`))
        .map(({ id, ...rest }) => ({
          value: id,
          label: getUserName(
            rest,
            Number(currentUser.companyId) === rest.companyId &&
              currentUser.companyId !== companyId &&
              currentUser.companyName
          )
        }));
    const jobHolders = getContacts(JOB_HOLDER);
    const jobContacts = getContacts(JOB_CONTACT);

    return (
      <div id="campaign-vacancy">
        <PageLayout
          page={NAVIGATION_URLS.CAMPAIGN_VACANCY}
          campaignHeader={{ breadcrumbStep: NAVIGATION_URLS.CAMPAIGN_VACANCY }}
          isLoading={isLoading}
          cWizard={campaignWizard}
        >
          <div className="title-bar">
            <div className="page-title">
              <FormattedMessage id="VACANCY_TEXT_SCHEDULING" />
            </div>
            <div className="page-subtitle">
              <FormattedMessage id="VACANCY_PLANNED_TEXT" />
            </div>
          </div>
          <form className="vertical">
            <div className="input-group">
              <label>
                <FormattedMessage id="JOB_TITLE" />
              </label>
              <Field
                name="jobTitle"
                component={Input}
                placeholder={formatMessage({ id: "EG_JOB_TITLE" })}
                validate={required}
                readOnly={readOnly}
              />
            </div>
            <div className="input-group">
              <label>
                <FormattedMessage id="JOB_LOCATION" />
              </label>
              <Field name="jobLocation" component={Input} readOnly={readOnly} />
            </div>
            <div className="input-group">
              <label>
                <FormattedMessage id="JOB_APPLICATION_URL" />
                <Tooltip id="JOB_APPLICATION_URL_INFO" />
              </label>
              <Field name="jobApplicationUrl" component={Input} readOnly={readOnly} />
            </div>
            <div className="input-group">
              <label>
                <FormattedMessage id="JOB_HOLDER_HOLDER" />
                <Tooltip id="JOB_HOLDER_DESC" />
              </label>
              <Field
                name="jobHolder"
                component={DropList}
                placeholder="JOB_HOLDER_HOLDER"
                readOnly={readOnly}
                options={jobHolders}
              />
            </div>
            <div className="input-group">
              <label>
                <FormattedMessage id="JOB_CONTACT" />
                <Tooltip id="JOB_CONTACT_DESC" />
              </label>
              <Field
                name="jobContact"
                component={DropList}
                placeholder="JOB_CONTACT"
                readOnly={readOnly}
                options={jobContacts}
              />
            </div>
            <div className="input-group">
              <label>
                <FormattedMessage id="YOUR_REFERENCE" />
                <Tooltip id="YOUR_REFERENCE_INFO" />
              </label>
              <Field name="yourReference" component={Input} readOnly={readOnly} />
            </div>
            <div className="input-group start-date">
              <label>
                <FormattedMessage id="DESIRED_START_DATE" />
              </label>
              <Field
                name="dateStartPreferred"
                component={this.datePicker(false, moment(), moment(), this.filterDate)}
                disabled={readOnly}
              />
            </div>
            <div className="input-group">
              <label>
                <FormattedMessage id="DESIRED_END_DATE" />
              </label>
              <Field
                name="dateEndPreferred"
                component={this.datePicker(
                  true,
                  dateStartPreferred ? moment(dateStartPreferred) : moment()
                )}
                disabled={readOnly}
              />
            </div>
          </form>
          <div className="footer">
            <Button
              className="next-btn"
              onClick={() => this.addNewCampaign(readOnly)}
              disabled={invalid}
              icon={KeyboardArrowRight}
              iconPosition="right"
              btnColorType="primary"
              id="schedule-campaign"
            >
              SCHEDULE
            </Button>
          </div>
        </PageLayout>
      </div>
    );
  }
}

export default compose(
  injectIntl,
  campaignForm(),
  connect(
    state => ({
      campaignWizard: getFormValues("campaignWizard")(state) || {},
      contacts: state.customers.contacts,
      isLoading:
        state.channels.isLoading ||
        state.campaigns.isLoading ||
        state.campaigns.isSharedCampaignLoading,
      userContacts: state.campaigns.userContacts,
      currentUser: state.global.currentUser,
      status: state.campaigns.campaignStatus
    }),
    {
      getCampaign: CampaignActions.getCampaign,
      getCustomerContacts: CustomersActions.getCustomerContacts,
      getUserContacts: CampaignActions.getUserContacts,
      destroyForm: () => destroy("campaignWizard"),
      publishCampaign: campaign => CampaignActions.changeCampaignStatus(campaign, "publish"),
      changeFormValue: (name, value) => change("campaignWizard", name, value)
    }
  )
)(CampaignVacancy);
