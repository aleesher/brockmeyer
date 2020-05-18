import React from "react";
import classnames from "classnames";
import { compose } from "recompose";
import { Field, reduxForm } from "redux-form";
import { FormattedMessage, injectIntl, InjectedIntlProps } from "react-intl";

import { KeyboardArrowRight as IconArrow } from "components/icons";
import Button from "components/button/Button";
import DropList from "components/drop-list";
import Input from "components/inputs/input";
import Select from "components/select/Select";
import { required, phoneNumber, email } from "helpers/validations";
import { ThemeConsumer } from "constants/themes/theme-context";

import "./ContactPersonForm.scss";

interface IProps {
  buttonHasArrow: boolean;
  submitting: boolean;
  handleSubmit: (data: any) => void;
  nextButtonText: string;
  title: string;
  hasLeftMargin: boolean;
  contactTypes;
}

const ContactPersonForm: React.StatelessComponent<IProps & InjectedIntlProps> = props => {
  const {
    handleSubmit,
    submitting,
    intl: { formatMessage },
    contactTypes,
    title,
    nextButtonText,
    buttonHasArrow = false,
    hasLeftMargin
  } = props;

  const formCss = classnames("contact-person-form vertical", { submitting });
  const typeOptions = contactTypes.map(({ id, name }) => ({ value: `${id}`, label: name }));
  const genderOptions = [
    { value: "m", label: formatMessage({ id: "MALE" }) },
    { value: "f", label: formatMessage({ id: "FEMALE" }) }
  ];

  return (
    <form className={formCss} onSubmit={handleSubmit}>
      {title && (
        <div className="title-bar">
          <div className="page-title">{title}</div>
        </div>
      )}
      <div className={classnames({ "edit-form": hasLeftMargin })}>
        <div className="input-group">
          <label>
            <FormattedMessage id="INITIALS" />*
          </label>
          <Field
            name="initials"
            component={Input}
            placeholder={formatMessage({ id: "INITIALS" })}
            validate={required}
          />
        </div>
        <div className="input-group">
          <label>
            <FormattedMessage id="FIRST_NAME" />*
          </label>
          <Field
            name="firstName"
            component={Input}
            placeholder={formatMessage({ id: "FIRST_NAME" })}
            validate={required}
          />
        </div>
        <div className="input-group">
          <label>
            <FormattedMessage id="INSERTION" />
          </label>
          <Field
            name="infixSurname"
            component={Input}
            placeholder={formatMessage({ id: "INSERTION" })}
          />
        </div>
        <div className="input-group">
          <label>
            <FormattedMessage id="LAST_NAME" />*
          </label>
          <Field
            name="surname"
            component={Input}
            placeholder={formatMessage({ id: "LAST_NAME" })}
            validate={required}
          />
        </div>
        <div className="input-group">
          <label>
            <FormattedMessage id="GENDER" />*
          </label>
          <Field
            name="gender"
            component={DropList}
            placeholder="GENDER"
            options={genderOptions}
            validate={required}
          />
        </div>
        <div className="input-group">
          <label>
            <FormattedMessage id="PHONE_NUMBER" />*
          </label>
          <Field
            name="phoneNumber"
            maxLength="10"
            component={Input}
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
            <FormattedMessage id="TYPE" />*
          </label>
          <ThemeConsumer>
            {theme => (
              <Field
                component={Select}
                name="contactTypes"
                options={typeOptions}
                placeholder="TYPE"
                isMulti
                validate={required}
                normalize={val => val.map(({ value }) => value)}
                format={val => typeOptions.filter(opt => val && val.includes(opt.value))}
                theme={theme}
              />
            )}
          </ThemeConsumer>
        </div>
      </div>
      <div className="footer">
        <Button
          icon={buttonHasArrow && IconArrow}
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
};

export default compose(
  injectIntl,
  reduxForm({ form: "contactPersonForm", touchOnChange: true })
)(ContactPersonForm);
