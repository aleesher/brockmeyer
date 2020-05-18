import React from "react";
import _ from "lodash";

import Actions from "./CustomersActions";
import CustomerForm from "./partial/CustomerForm";
import CustomerTab from "./partial/CustomerTab";
import { connect } from "../../reduxConnector";
import { NAVIGATION_URLS } from "constants/URIConstants";
import { ICustomer, ICountry } from "models/.";
import { PageLayout } from "components/.";

import "./EditCustomer.scss";

interface IProps {
  getCountries: () => void;
  getCustomers: () => void;
  countries: ICountry[];
  isLoading: boolean;
  customer: ICustomer;
  customerId: number;
  customers: any;
  customerItems: ICustomer[];
  updateCustomer: (data: any, url: string) => void;
  user: any;
}

class EditCustomer extends React.Component<IProps> {
  componentWillMount() {
    const { customerItems, countries, getCustomers, getCountries } = this.props;
    if (!customerItems.length) {
      getCustomers();
    }
    if (!countries.length) {
      getCountries();
    }
  }

  render() {
    const { countries, isLoading, updateCustomer, customer, customerId, user } = this.props;

    if (!customer || _.isEmpty(countries)) {
      return <PageLayout isLoading={true} />;
    }

    const customerCountry = _.find(countries, ["value", customer.countryId]);
    const initialValues = { ...customer, countryId: customerCountry };
    const subHeader = {
      title: customer ? customer.name : "",
      backTo: { text: "CUSTOMER", url: "/customers" }
    };

    return (
      <div id="edit-customer">
        <PageLayout page={NAVIGATION_URLS.CUSTOMERS} subHeader={subHeader} isLoading={isLoading}>
          <CustomerTab
            customerId={customerId}
            tabIndex={0}
            usersCompany={user.companyId}
            userRole={user.roleName}
          />
          <div className="customer-form-wrapper">
            <CustomerForm
              hasLeftMargin
              nextButtonText="SAVE"
              initialValues={initialValues}
              countries={countries}
              onSubmit={data => updateCustomer(data, NAVIGATION_URLS.CUSTOMERS)}
            />
          </div>
        </PageLayout>
      </div>
    );
  }
}

export default connect(
  ({ customers, global }, { match: { params } }) => ({
    customerItems: customers.customerItems,
    countries: customers.countries,
    isLoading: customers.isLoading,
    customer: customers.customerItems.find(customer => customer.id === parseInt(params.id, 10)),
    customerId: parseInt(params.id, 10),
    user: global.currentUser
  }),
  {
    updateCustomer: Actions.updateCustomer,
    getCountries: Actions.getCountries,
    getCustomers: Actions.getCustomers
  }
)(EditCustomer);
