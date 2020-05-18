import React from "react";
import _ from "lodash";

import Actions from "./CustomersActions";
import ContactPersonForm from "./partial/ContactPersonForm";
import CustomerTab from "./partial/CustomerTab";
import { connect } from "../../reduxConnector";
import { NAVIGATION_URLS } from "constants/URIConstants";
import { PageLayout } from "components/.";

import "./NewContactPerson.scss";

class NewContactPerson extends React.Component<any> {
  componentWillMount() {
    const { customers, contactTypes, getCustomers, getContactTypes } = this.props;
    if (!customers.length) {
      getCustomers();
    }
    if (!contactTypes.length) {
      getContactTypes();
    }
  }

  render() {
    const { addContact, customerId, isLoading, customer, contactTypes, user } = this.props;
    const url = `${NAVIGATION_URLS.CUSTOMER_CONTACTS}/${customerId}`;
    const backTo = { text: "CONTACTS", url };

    return (
      <div id="new-contact">
        <PageLayout
          page={NAVIGATION_URLS.CUSTOMERS}
          subHeader={{ title: customer.name, backTo, visible: true }}
          isLoading={isLoading}
        >
          <CustomerTab
            customerId={customerId}
            tabIndex={1}
            usersCompany={_.get(user, "companyId", -1)}
            userRole={_.get(user, "roleName", "")}
          />
          <ContactPersonForm
            buttonHasArrow={false}
            contactTypes={contactTypes}
            initialValues={{ companyId: customerId }}
            nextButtonText={"SAVE"}
            onSubmit={data => addContact(data, url)}
          />
        </PageLayout>
      </div>
    );
  }
}

export default connect(
  ({ customers, global }, { match: { params } }) => ({
    contactTypes: customers.contactTypes,
    customers: customers.customerItems,
    customerId: parseInt(params.id, 10),
    customer: customers.customerItems.find(({ id }) => id === parseInt(params.id, 10)) || {
      name: ""
    },
    user: global.currentUser
  }),
  {
    addContact: Actions.addCustomerContact,
    getContactTypes: Actions.getContactTypes,
    getCustomers: Actions.getCustomers
  }
)(NewContactPerson);
