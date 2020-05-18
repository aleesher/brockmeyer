import React from "react";
import { FormattedMessage, injectIntl } from "react-intl";
import classnames from "classnames";
import { Field } from "redux-form";

import { PersonAdd } from "components/icons";
import DropList from "components/drop-list";
import { JOB_HOLDER } from "constants/constants";
import { required } from "helpers/validations";
import { getUserName } from "helpers/common";
import Tooltip from "components/tooltip";

import "./MandatoryFields.scss";

const MandatoryFields = props => {
  const {
    campaignWizard: { jobContact, lang, companyId },
    contacts,
    languages,
    handleCreateContact,
    currentUser
  } = props;
  const langOptions = languages.map(({ name, description }) => ({
    label: description,
    value: name
  }));
  const jobContacts = contacts
    .filter(contact => contact.contactTypes.includes(`${JOB_HOLDER}`))
    .map(({ id, ...rest }) => ({
      value: id,
      label: getUserName(
        rest,
        Number(currentUser.companyId) === rest.companyId &&
          currentUser.companyId !== companyId &&
          currentUser.companyName
      )
    }));

  return (
    <div className="mandatory-fields">
      <div className={classnames("input-group", { error: !lang })}>
        <label>
          <FormattedMessage id="LANGUAGE" />
        </label>
        <Field
          name="lang"
          component={DropList}
          placeholder="LANGUAGE"
          options={langOptions}
          validate={required}
        />
      </div>
      <div className={classnames("input-group", { error: !jobContact })}>
        <label>
          <FormattedMessage id="JOB_HOLDER_HOLDER" />
          <Tooltip id="JOB_HOLDER_DESC" />
        </label>
        <Field
          name="jobHolder"
          component={DropList}
          placeholder="JOB_HOLDER_HOLDER"
          options={jobContacts}
        />
        <div className="add-contact" onClick={handleCreateContact}>
          <PersonAdd /> <FormattedMessage id="ADD_CONTACT" />
        </div>
      </div>
    </div>
  );
};

export default injectIntl(MandatoryFields);
