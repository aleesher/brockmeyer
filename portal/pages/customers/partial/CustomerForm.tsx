import React from "react";
import classnames from "classnames";
import AsyncSelect from "react-select/async";
import { compose } from "recompose";
import { Field, reduxForm } from "redux-form";
import { FormattedMessage, injectIntl, InjectedIntlProps } from "react-intl";

import { KeyboardArrowRight } from "components/icons";
import Button from "components/button/Button";
import constants from "constants/URIConstants";
import Input from "components/inputs/input";
import TextArea from "components/inputs/text-area";
import { required, phoneNumber, email } from "helpers/validations";
import * as mockApi from "../../../mockApi";

import "./CustomerForm.scss";

const { REMOTE_RESOURCES_URI } = constants;

interface IState {
  file?: any;
  imagePreviewUrl?: string;
}

interface IProps {
  buttonHasArrow: string;
  handleSubmit: any;
  hasLeftMargin: boolean;
  initialValues: any;
  nextButtonText: string;
  onSubmit: any;
  submitting: any;
  title: string;
}

const getTextArea = ({ input }) => (
  <TextArea rows={4} value={input.value} onChange={event => input.onChange(event.target.value)} />
);

const getCountriesList = ({ input: { onBlur, ...restInput }, ...props }) => (
  <div id="country-input" className="bro-input-wrapper">
    <AsyncSelect classNamePrefix="select" isClearable {...restInput} {...props} />
  </div>
);

class CustomerForm extends React.Component<IProps & InjectedIntlProps, IState> {
  constructor(props: any) {
    super(props);

    this.state = {
      imagePreviewUrl: undefined
    };
  }

  componentWillReceiveProps(props) {
    const { initialValues } = props;
    if (initialValues && initialValues.logo) {
      const imagePreviewUrl = `${REMOTE_RESOURCES_URI}${initialValues.logo}`;
      this.setState({ imagePreviewUrl });
    }
  }

  private loadCountries = inputValue => {
    return mockApi.getCountries(inputValue).then(res => {
      return res.map(({ name, id }) => ({
        label: name,
        value: id
      }));
    });
  };

  render() {
    const {
      title,
      nextButtonText,
      buttonHasArrow = false,
      onSubmit,
      handleSubmit,
      hasLeftMargin,
      submitting,
      intl: { formatMessage }
    } = this.props;
    const { imagePreviewUrl } = this.state;
    const formCss = classnames("customer-form vertical", { submitting });

    return (
      <form className={formCss} onSubmit={handleSubmit(onSubmit)}>
        {title && (
          <div className="title-bar">
            <div className="page-title">
              <FormattedMessage id={title} />
            </div>
          </div>
        )}
        <div className={classnames({ "edit-form": hasLeftMargin })}>
          <div className="input-group">
            <label>
              <FormattedMessage id="NAME" />*
            </label>
            <Field
              name="name"
              component={Input}
              placeholder={formatMessage({ id: "NAME" })}
              validate={required}
            />
          </div>
          <div className="input-group">
            <label>
              <FormattedMessage id="ADDRESS" />*
            </label>
            <div className="address-inputs">
              <div className="address-row-first">
                <Field
                  name="addressStreet"
                  component={Input}
                  placeholder={formatMessage({ id: "STREET" })}
                  validate={required}
                />
                <Field
                  name="addressNumber"
                  component={Input}
                  placeholder={formatMessage({ id: "HOUSE_NO" })}
                  validate={required}
                />
              </div>
              <div className="address-row-secnd">
                <Field
                  name="postalCode"
                  component={Input}
                  placeholder={formatMessage({ id: "POSTAL_CODE" })}
                  validate={required}
                />
                <Field
                  name="city"
                  component={Input}
                  placeholder={formatMessage({ id: "CITY" })}
                  validate={required}
                />
              </div>
              <Field
                name="countryId"
                component={getCountriesList}
                placeholder={formatMessage({ id: "COUNTRY" })}
                validate={required}
                loadOptions={this.loadCountries}
              />
            </div>
          </div>
          <div className="input-group">
            <label>
              <FormattedMessage id="PHONE" />*
            </label>
            <Field
              name="phoneNumber"
              component={Input}
              maxLength="10"
              placeholder={formatMessage({ id: "PHONE_NUMBER" })}
              validate={[required, phoneNumber]}
            />
          </div>
          <div className="input-group">
            <label>
              <FormattedMessage id="EMAIL" />*
            </label>
            <Field
              name="email"
              component={Input}
              placeholder={formatMessage({ id: "EMAIL" })}
              validate={[required, email]}
            />
          </div>
          <div className="input-group">
            <label>
              <FormattedMessage id="WEBSITE" />*
            </label>
            <Field
              name="url"
              component={Input}
              placeholder={formatMessage({ id: "WEBSITE" })}
              validate={required}
            />
          </div>
          <div className="input-group">
            <label>
              <FormattedMessage id="YOUR_REFERENCE" />
            </label>
            <Field
              name="yourReference"
              component={Input}
              placeholder={formatMessage({ id: "YOUR_REFERENCE" })}
            />
          </div>
          {imagePreviewUrl && (
            <div className="input-group">
              <label>
                <FormattedMessage id="LOGO" />
              </label>
              <img src={imagePreviewUrl} />
            </div>
          )}
          <div className="input-group">
            <label>
              <FormattedMessage id="DESCRIPTION" />
            </label>
            <Field
              name="description"
              component={getTextArea}
              placeholder={formatMessage({ id: "DESCRIPTION" })}
            />
          </div>
        </div>
        <div className="footer">
          <Button
            icon={buttonHasArrow && KeyboardArrowRight}
            iconPosition={buttonHasArrow && "right"}
            loading={submitting}
            loadingText="SAVING_CHANGES"
            btnColorType="primary"
          >
            {nextButtonText}
          </Button>
        </div>
      </form>
    );
  }
}

export default compose(
  injectIntl,
  reduxForm({ form: "customerForm", touchOnChange: true })
)(CustomerForm);
