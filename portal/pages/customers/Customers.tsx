import React from "react";
import _ from "lodash";
import { CSSTransition, TransitionGroup } from "react-transition-group";
import { FormattedMessage } from "react-intl";
import { Link } from "react-router-dom";

import Button from "components/button/Button";
import CustomersActions from "./CustomersActions";
import URIConstants, { NAVIGATION_URLS } from "constants/URIConstants";
import { PARTNER_ADMIN } from "constants/constants";
import { connect } from "../../reduxConnector";
import { ICustomersState } from "./CustomersReducer";
import { PageLayout, CardItem, FiltersBar } from "components/.";
import FloatingActionButton from "components/speed-dial/FloatingActionButton";
import { redirect } from "helpers/common";
import EmptyMessage from "components/empty-message";
import PageTemplate from "components/page-template";

import "./Customers.scss";

interface IProps {
  history: any;
  customers: ICustomersState;
  getCustomers: (search?: string, sort?: string, page?: number) => void;
  currentUser: any;
}

interface IState {
  search: string;
  sort: string;
  page: number;
}

class Customers extends React.Component<IProps, IState> {
  private fetch;

  constructor(props: any) {
    super(props);

    this.state = {
      search: "",
      sort: "asc",
      page: 1
    };
  }

  componentWillMount() {
    this.props.getCustomers();
  }

  private fetchData = () => {
    if (!this.fetch) {
      this.fetch = _.debounce(() => {
        const { getCustomers } = this.props;
        const { search, sort, page } = this.state;
        getCustomers(search, sort, page);
      }, 500);
    }
    this.fetch();
  };

  private getMoreData = () => {
    this.setState(prev => ({ page: prev.page + 1 }), this.fetchData);
  };

  private onChangeFilters = ({ field, value }) => {
    this.setState({ [field]: value, page: 1 }, this.fetchData);
  };

  private renderCardItem = customer => {
    const url = `${NAVIGATION_URLS.EDIT_CUSTOMER}/${customer.id}`;
    const { history } = this.props;
    return (
      <CSSTransition key={customer.id} classNames="fade" timeout={300}>
        <CardItem onClick={() => redirect(history)(url)}>
          <div className="card-item-content">
            <div className="customer-logo">
              <img src={`${URIConstants.REMOTE_RESOURCES_URI}${customer.logo}`} />
            </div>
            <h3>{customer.name}</h3>
          </div>
        </CardItem>
      </CSSTransition>
    );
  };

  private renderEmptyMessage = () => {
    const values = {
      button: (
        <Link to={NAVIGATION_URLS.NEW_CUSTOMER}>
          <FormattedMessage id="ADD_CUSTOMER" />
        </Link>
      )
    };

    return (
      <EmptyMessage>
        <FormattedMessage id="NO_CUSTOMERS_TEXT" values={values} />
      </EmptyMessage>
    );
  };

  private renderPageTemplate = className => {
    return <PageTemplate page={NAVIGATION_URLS.CUSTOMERS} listClassName={className} />;
  };

  render() {
    const {
      customers: { customerItems, isLoaded, isLoading, noMoreData },
      history,
      currentUser
    } = this.props;
    const globalLoading = isLoading && this.state.page === 1;
    const selectors = [
      {
        key: "sort",
        label: "SORT",
        options: [
          { label: "ALPHABET", value: "asc" },
          { label: "ALPHABET_DESC", value: "desc" }
        ]
      }
    ];

    return (
      <div id="customers-page">
        <PageLayout page={NAVIGATION_URLS.CUSTOMERS} isLoading={globalLoading}>
          <div className="title-bar">
            <div className="page-title">
              <FormattedMessage id="MENU_CUSTOMERS" />
            </div>
            {_.get(currentUser, "roleName", "") === PARTNER_ADMIN && (
              <Button
                onClick={() => redirect(history)(NAVIGATION_URLS.NEW_CUSTOMER)}
                btnColorType="primary"
              >
                ADD_CUSTOMER
              </Button>
            )}
          </div>

          <div className="filters-wrapper">
            <FiltersBar
              searchPlaceholder="SEARCH_CUSTOMER"
              selectors={selectors}
              onChange={this.onChangeFilters}
            />
          </div>

          {globalLoading ? (
            this.renderPageTemplate("customers-list")
          ) : customerItems.length === 0 ? (
            this.renderEmptyMessage()
          ) : (
            <TransitionGroup className="customers-list">
              {customerItems.map(this.renderCardItem)}
            </TransitionGroup>
          )}

          <div className="footer">
            <Button
              onClick={this.getMoreData}
              loading={isLoading}
              loadingText="DATA_LOADING"
              visible={!noMoreData && isLoaded}
              btnColorType="primary"
            >
              LOAD_MORE_DATA
            </Button>
          </div>
        </PageLayout>
        <FloatingActionButton onClick={() => redirect(history)(NAVIGATION_URLS.NEW_CUSTOMER)} />
      </div>
    );
  }
}

export default connect(state => ({ customers: state.customers, currentUser: state.currentUser }), {
  getCustomers: CustomersActions.getCustomers
})(Customers);
