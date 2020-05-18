import React from "react";

import Actions from "./CustomersActions";
import ContactPersonForm from "./partial/ContactPersonForm";
import CustomerTab from "./partial/CustomerTab";
import { connect } from "../../reduxConnector";
import { NAVIGATION_URLS } from "constants/URIConstants";
import { PageLayout } from "components/.";

import "./EditCustomer.scss";

class EditContactPerson extends React.Component<any> {
  componentWillMount() {
    const {
      customers,
      contacts,
      contactTypes,
      customerId,
      getCustomers,
      getCustomerContacts,
      getContactTypes
    } = this.props;

    if (!customers.length) {
      getCustomers();
    }
    if (!contacts.length || !contacts.some(c => c.companyId === customerId)) {
      getCustomerContacts(customerId);
    }
    if (!contactTypes.length) {
      getContactTypes();
    }
  }

  render() {
    const {
      updateContact,
      customerId,
      contact,
      isLoading,
      customers,
      contactTypes,
      user
    } = this.props;
    const customer = customers.find(customer => customer.id === customerId) || { name: "" };
    const url = `${NAVIGATION_URLS.CUSTOMER_CONTACTS}/${customerId}`;
    const backTo = { text: "CONTACTS", url };

    return (
      <div id="edit-customer">
        <PageLayout
          page={NAVIGATION_URLS.CUSTOMERS}
          subHeader={{ title: customer.name, backTo, visible: true }}
          isLoading={isLoading}
        >
          <CustomerTab
            customerId={customerId}
            tabIndex={1}
            usersCompany={user.companyId}
            userRole={user.roleName}
          />
          <ContactPersonForm
            buttonHasArrow={false}
            contactTypes={contactTypes}
            initialValues={contact}
            nextButtonText={"SAVE"}
            onSubmit={data => updateContact(data, url)}
          />
        </PageLayout>
      </div>
    );
  }
}

export default connect(
  ({ customers, global }, { match: { params } }) => ({
    contacts: customers.contacts,
    contactTypes: customers.contactTypes,
    customers: customers.customerItems,
    customerId: parseInt(params.id, 10),
    contact:
      customers && customers.contacts.find(({ id }) => id === parseInt(params.contactId, 10)),
    user: global.currentUser
  }),
  {
    getContactTypes: Actions.getContactTypes,
    getCustomerContacts: Actions.getCustomerContacts,
    getCustomers: Actions.getCustomers,
    updateContact: Actions.updateCustomerContact
  }
)(EditContactPerson);
