import React from "react";
import { FormattedMessage } from "react-intl";

import CustomersActions from "./CustomersActions";
import CustomerTab from "./partial/CustomerTab";
import Popconfirm from "components/popconfirm/Popconfirm";
import { connect } from "../../reduxConnector";
import { NAVIGATION_URLS } from "constants/URIConstants";
import { PageLayout } from "components/.";
import { getUserName, redirect } from "helpers/common";
import Button from "components/button/Button";
import FloatingActionButton from "components/speed-dial/FloatingActionButton";
import { MoreVert, PersonAdd, Delete } from "components/icons";
import RemoveContactModal from "./partial/RemoveContactModal";

import "./CustomerContacts.scss";

interface IProps {
  customers: any[];
  contacts: any[];
  contactTypes: any[];
  customerId: string;
  getCustomers: () => void;
  getCustomerContacts: (id: string) => void;
  getContactTypes: () => void;
  selectedIds: string[];
  history: any;
  removeContacts: (ids: string[]) => void;
  selectContact: (id: string) => void;
  items: any[];
  isLoading: boolean;
  user: any;
}

interface IState {
  isMenuOpened: boolean;
  isRemoveModalOpened: boolean;
}

class CustomerContacts extends React.Component<IProps, IState> {
  constructor(props: any) {
    super(props);

    this.state = {
      isMenuOpened: false,
      isRemoveModalOpened: false
    };
  }

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

  private getButtons() {
    const { CUSTOMER_CONTACTS: URL } = NAVIGATION_URLS;
    const { selectedIds, history, customerId, removeContacts } = this.props;

    return (
      <div className="buttons-container">
        <Popconfirm
          key={`remove-btn-${Math.random()}`}
          title="SURE_TO_REMOVE"
          okText="YES_DELETE"
          onConfirm={() => removeContacts(selectedIds)}
          visible={!!selectedIds.length}
        >
          <Button btnColorType="secondary">REMOVE_CONTACT</Button>
        </Popconfirm>
        <Button
          key="create-btn"
          onClick={() => redirect(history)(URL, `${customerId}/new`)}
          btnColorType="primary"
        >
          ADD_CONTACT
        </Button>
      </div>
    );
  }

  private onClickContact = contactId => event => {
    const { CUSTOMER_CONTACTS: URL } = NAVIGATION_URLS;
    const { history, customerId } = this.props;
    redirect(history)(URL, `${customerId}/edit/${contactId}`);
  };

  private renderContact = item => {
    const { selectedIds, contactTypes = [], selectContact } = this.props;
    const contactType = contactTypes
      .filter(type => item.contactTypes.includes(type.id.toString()))
      .map(({ name }) => name);
    const onClick = this.onClickContact(item.id);

    return (
      <div key={item.id} className="card contact-item">
        <label className="checkbox">
          <input
            type="checkbox"
            checked={selectedIds.includes(item.id)}
            onChange={() => selectContact(item.id)}
          />
          <span className="checkmark" />
        </label>
        <div className="name" onClick={onClick}>
          {getUserName(item)}
        </div>
        <div className="phone" onClick={onClick}>
          {item.phoneNumber}
        </div>
        <div className="email" onClick={onClick}>
          {item.email}
        </div>
        <div className="contact" onClick={onClick}>
          {contactType.join(", ")}
        </div>
      </div>
    );
  };

  render() {
    const {
      customerId,
      items,
      isLoading,
      customers,
      history,
      selectedIds,
      removeContacts,
      user
    } = this.props;
    const { isMenuOpened } = this.state;
    const customer = customers.find(customer => customer.id === customerId);
    const title = customer ? customer.name : "";
    const backTo = { text: "CUSTOMER", url: "/customers" };

    const actions = [
      {
        icon: <PersonAdd />,
        name: <FormattedMessage id="ADD_CONTACT" />,
        action: () => redirect(history)(NAVIGATION_URLS.CUSTOMER_CONTACTS, `${customerId}/new`)
      },
      {
        icon: <Delete />,
        name: <FormattedMessage id="REMOVE_CONTACT" />,
        action: () => this.setState({ isRemoveModalOpened: true }),
        disabled: selectedIds.length === 0
      }
    ];

    return (
      <div id="customer-contacts">
        <PageLayout
          page={NAVIGATION_URLS.CUSTOMERS}
          subHeader={{ title, backTo, buttons: this.getButtons() }}
          isLoading={isLoading}
        >
          <CustomerTab
            customerId={customerId}
            tabIndex={1}
            usersCompany={user.companyId}
            userRole={user.roleName}
          />
          <div className="content">
            {items && items.length > 0 && (
              <div className="contact-item header">
                <div className="checkbox" />
                <div className="name">
                  <FormattedMessage id="NAME" />
                </div>
                <div className="phone">
                  <FormattedMessage id="PHONE" />
                </div>
                <div className="email">
                  <FormattedMessage id="EMAIL" />
                </div>
                <div className="contact">
                  <FormattedMessage id="TYPE" />
                </div>
              </div>
            )}
            {items.map(this.renderContact)}
            {(!items || items.length === 0) && (
              <div className="no-contacts">
                <FormattedMessage id="NO_CONTACTS" />
              </div>
            )}
          </div>

          <FloatingActionButton
            onClick={() => this.setState({ isMenuOpened: !isMenuOpened })}
            icon={<MoreVert />}
            open={isMenuOpened}
            actions={actions}
          />

          <RemoveContactModal
            isOpen={this.state.isRemoveModalOpened}
            onClose={() => this.setState({ isRemoveModalOpened: false })}
            onRemove={() => removeContacts(selectedIds)}
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
    contacts: customers.contacts,
    isLoading: customers.isLoading,
    items: customers.contacts,
    selectedIds: customers.selectedContactIds,
    customerId: parseInt(params.id, 10),
    user: global.currentUser
  }),
  {
    getContactTypes: CustomersActions.getContactTypes,
    getCustomerContacts: CustomersActions.getCustomerContacts,
    getCustomers: CustomersActions.getCustomers,
    removeContacts: CustomersActions.removeContacts,
    selectContact: CustomersActions.selectContact
  }
)(CustomerContacts);
