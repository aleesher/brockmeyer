import React from "react";

import { parseQuery } from "helpers/common";
import api from "../../api";
import CustomerForm from "./partial/CustomerForm";
import CustomersActions from "./CustomersActions";
import { connect } from "../../reduxConnector";
import { NAVIGATION_URLS } from "constants/URIConstants";
import { PageLayout } from "components/.";

import "./NewCustomer.scss";

interface IProps {
  countries: any;
  isLoading: boolean;
  location: any;
  getCountries: () => void;
  addCustomer: (data: any, url: any) => void;
}

class NewCustomer extends React.Component<IProps> {
  async componentDidMount() {
    const { countries, getCountries } = this.props;
    if (!countries.length) {
      getCountries();
    }
  }

  render() {
    const { addCustomer, location, countries, isLoading } = this.props;
    const { campaignWizard } = parseQuery(location.search);
    const campaign = api.getCampaign();

    let initialValues = {};
    if (campaignWizard && campaign.companyId) {
      initialValues = { name: campaign.companyId };
    }

    return (
      <div id="new-customer">
        <PageLayout page={NAVIGATION_URLS.CUSTOMERS} isLoading={isLoading}>
          <CustomerForm
            title="NEW_CUSTOMER"
            nextButtonText="SAVE"
            initialValues={initialValues}
            countries={countries}
            onSubmit={data =>
              addCustomer(
                data,
                campaignWizard ? NAVIGATION_URLS.CAMPAIGN_DETAILS : NAVIGATION_URLS.CUSTOMERS
              )
            }
          />
        </PageLayout>
      </div>
    );
  }
}

export default connect(
  ({ customers }) => ({ countries: customers.countries, isLoading: customers.isLoading }),
  {
    addCustomer: CustomersActions.addCustomer,
    getCountries: CustomersActions.getCountries
  }
)(NewCustomer);
