import React from "react";
import _ from "lodash";
import { FormattedMessage, injectIntl, InjectedIntlProps } from "react-intl";
import AsyncSelect from "react-select/async";
import AsyncCreatableSelect from "react-select/async-creatable";
import classnames from "classnames";
import Tour from "reactour";

import * as mockApi from "../../../mockApi";
import Button from "components/button/Button";
import AppActions from "../../app/AppActions";
import { STEPS_ADD_CAMPAIGN } from "constants/constants";
import { connect } from "../../../reduxConnector";
import Tooltip from "components/tooltip";
import { PAGE_SIZE } from "constants/constants";

import "./AddNewCampaign.scss";

interface IProps {
  onAdd: (campaign: any) => void;
  onClose: () => void;
  isTourOpen: boolean;
  toggleTour: () => void;
  toggleTourStatus: () => void;
  isTourEnabled: boolean;
}

interface IState {
  jobTitle: string;
  client: string | null;
  occupation: string | null;
  touched: boolean;
  customersPage: number;
  jobPage: number;
  customerOptions: any;
  jobOptions: any;
  isLocalTourOpen: boolean;
  noMoreData: boolean;
  step: number;
  input: string;
  jobInput: string;
  noMoreJobs: boolean;
  isLoading: boolean;
  isCustomersLoading: boolean;
}

class AddNewCampaign extends React.Component<IProps & InjectedIntlProps, IState> {
  constructor(props: IProps) {
    super(props);

    this.state = {
      jobTitle: "",
      touched: false,
      client: null,
      occupation: null,
      customersPage: 1,
      jobPage: 1,
      customerOptions: [],
      jobOptions: [],
      isLocalTourOpen: props.isTourOpen,
      noMoreData: false,
      step: 0,
      input: "",
      jobInput: "",
      noMoreJobs: false,
      isLoading: false,
      isCustomersLoading: false
    };
  }

  componentDidMount() {
    this.loadPage();
    this.loadJobPage();
  }

  private addCampaign = event => {
    event.preventDefault();
    const { jobTitle, client, occupation } = this.state;
    const { isTourOpen, toggleTourStatus, onAdd } = this.props;

    if (!jobTitle || !client) {
      this.setState({ touched: true });
      return;
    }

    this.setState({ isLocalTourOpen: false });
    onAdd({
      jobTitle,
      occupation,
      companyId: _.get(client, "value", client),
      isNewClient: _.has(client, "__isNew__"),
      companyName: _.get(client, "label", client)
    });

    if (isTourOpen) {
      toggleTourStatus();
    }
  };

  private handleInputChange = inputValue => {
    if (inputValue) {
      this.setState({ jobTitle: inputValue.label, occupation: inputValue.value });
    } else {
      this.setState({ jobTitle: "", occupation: null });
    }
    return inputValue;
  };

  private loadPage = async () => {
    const { noMoreData, input, customersPage } = this.state;

    if (!noMoreData) {
      _.set(this.refs, "selectCustomer.state.isLoading", true);
      this.setState({ isCustomersLoading: true });
      if (!(customersPage === 1 && input.length === 0)) {
        await this.loadCustomers(input);
      }
      this.setState({ customersPage: customersPage + 1 });
    }
  };

  private loadJobPage = async () => {
    const { noMoreJobs, jobInput, jobPage } = this.state;
    if (!noMoreJobs) {
      _.set(this.refs, "selectJobTitle.state.isLoading", true);
      this.setState({ isLoading: true });
      if (!(jobPage === 1 && jobInput.length === 0)) {
        await this.loadOptions(jobInput);
      }
      this.setState({ jobPage: jobPage + 1 });
    }
  };

  private handleCustomerInput = inputValue => {
    if (inputValue) {
      this.setState({ client: inputValue });
    } else {
      this.setState({ client: null });
    }
  };

  private inputChange = value => {
    if (!value) {
      this.setState(
        {
          jobInput: "",
          noMoreJobs: false
        },
        () => _.set(this.refs, "selectJobTitle.state.inputValue", null)
      );
    }
  };

  private customerInputChange = value => {
    if (!value) {
      this.setState(
        {
          input: "",
          noMoreData: false
        },
        () => _.set(this.refs, "selectCustomer.state.inputValue", null)
      );
    }
  };

  private loadOptions = async inputValue => {
    if (this.state.jobInput !== inputValue) {
      this.setState(
        {
          jobOptions: [],
          jobPage: 1,
          jobInput: inputValue,
          noMoreJobs: false
        },
        async () => await this.loadJobPage()
      );
    } else {
      const options = await mockApi
        .fetchOccupations(inputValue, this.state.jobPage * PAGE_SIZE)
        .then(res => {
          return res.map(({ id, preferredLabel }) => ({
            label: _.capitalize(preferredLabel),
            value: id
          }));
        });

      if (options.length < PAGE_SIZE) {
        this.setState({ noMoreJobs: true });
      }

      if (inputValue.length === 0) {
        _.set(this.refs, "selectJobTitle.state.defaultOptions", options);
      } else {
        _.set(this.refs, "selectJobTitle.state.loadedOptions", options);
      }

      _.set(this.refs, "selectJobTitle.state.isLoading", false);
      this.setState({ isLoading: false, jobOptions: options });
    }

    return this.state.jobOptions;
  };

  private loadCustomers = async inputValue => {
    if (this.state.input !== inputValue) {
      this.setState(
        {
          customerOptions: [],
          customersPage: 1,
          input: inputValue,
          noMoreData: false
        },
        async () => await this.loadPage()
      );
    } else {
      const options = await mockApi
        .getCustomers(inputValue, "asc", this.state.customersPage)
        .then(res => {
          return res.map(({ name, id }) => ({
            label: name,
            value: id
          }));
        });

      if (options.length < PAGE_SIZE) {
        this.setState({ noMoreData: true });
      }

      const newOptions = this.state.customerOptions.concat(options);

      if (inputValue.length === 0) {
        _.set(this.refs, "selectCustomer.state.defaultOptions", newOptions);
      } else {
        _.set(this.refs, "selectCustomer.state.loadedOptions", newOptions);
      }

      _.set(this.refs, "selectCustomer.state.isLoading", false);
      this.setState({ isCustomersLoading: false, customerOptions: newOptions });
    }

    return this.state.customerOptions;
  };

  private openMenu = () => {
    this.setState({ isLocalTourOpen: false });
  };

  private closeMenu = () => {
    this.setState({ isLocalTourOpen: true });
  };

  private transformList = (inputValue, __, selectOptions) => {
    const isNotDuplicated = !selectOptions.map(option => option.label).includes(inputValue);
    const isNotEmpty = inputValue !== "";

    return isNotEmpty && isNotDuplicated;
  };

  private detectStep = () => {
    const { jobTitle, client } = this.state;
    const step = !jobTitle ? 0 : !client ? 1 : 2;

    return step;
  };

  private getSteps = (jobTitle, client) => {
    return !jobTitle
      ? STEPS_ADD_CAMPAIGN().slice(0, 1)
      : !client
      ? STEPS_ADD_CAMPAIGN().slice(0, 2)
      : STEPS_ADD_CAMPAIGN().slice(0, 3);
  };

  render() {
    const {
      jobTitle,
      touched,
      client,
      isLocalTourOpen,
      isLoading,
      isCustomersLoading
    } = this.state;
    const {
      intl: { formatMessage },
      onClose,
      isTourOpen,
      toggleTour
    } = this.props;
    const clientError = touched && !client;
    const jobTitleError = touched && !jobTitle;

    return (
      <div id="add-new-campaign">
        {isTourOpen && (
          <Tour
            steps={this.getSteps(jobTitle, client)}
            isOpen={isLocalTourOpen}
            onRequestClose={toggleTour}
            maskSpace={3}
            rounded={10}
            startAt={this.detectStep()}
            closeWithMask={false}
          />
        )}

        <h1 className="title">
          <FormattedMessage id="CAMPAIGN_NEW_TITLE" />
        </h1>
        <p className="description">
          <FormattedMessage id="CAMPAIGN_NEW_DESCRIPTION" />
        </p>
        <form className="vertical">
          <div className={classnames("input-group", { error: jobTitleError })}>
            <label>
              <FormattedMessage id="JOB_TITLE" />
              <Tooltip id="ADD_CAMPAIGN_JOB_TITLE_INFO" />
            </label>
            <AsyncSelect
              ref="selectJobTitle"
              classNamePrefix="select"
              defaultOptions
              isClearable
              loadOptions={this.loadOptions}
              noOptionsMessage={() => formatMessage({ id: "NO_OPTIONS" })}
              onChange={this.handleInputChange}
              placeholder={formatMessage({ id: "CAMPAIGN_NAME_PLACEHOLDER" })}
              id="add-campaign-title"
              onMenuOpen={this.openMenu}
              onMenuClose={this.closeMenu}
              onMenuScrollToBottom={this.loadJobPage}
              onInputChange={this.inputChange}
              isLoading={isLoading}
            />
            {jobTitleError && (
              <span className="error-text">
                <FormattedMessage id="MANDATORY_FIELD" />
              </span>
            )}
          </div>

          <div className={classnames("input-group", { error: clientError })}>
            <label>
              <FormattedMessage id="CUSTOMER" />
              <Tooltip id="ADD_CAMPAIGN_ORGANISATION_INFO" />
            </label>
            <AsyncCreatableSelect
              ref="selectCustomer"
              allowCreateWhileLoading={true}
              classNamePrefix="select"
              defaultOptions
              formatCreateLabel={inputValue => `${formatMessage({ id: "CREATE" })} ` + inputValue}
              isClearable
              isValidNewOption={this.transformList}
              loadOptions={this.loadCustomers}
              noOptionsMessage={() => formatMessage({ id: "NO_OPTIONS_CLIENT" })}
              onChange={this.handleCustomerInput}
              placeholder={formatMessage({ id: "CUSTOMER" })}
              onMenuScrollToBottom={this.loadPage}
              id="add-campaign-organization"
              onMenuOpen={this.openMenu}
              onMenuClose={this.closeMenu}
              onInputChange={this.customerInputChange}
              isLoading={isCustomersLoading}
            />
            {clientError && (
              <span className="error-text">
                <FormattedMessage id="MANDATORY_FIELD" />
              </span>
            )}
          </div>

          <div className="btn-container">
            <Button
              className="presets secondary"
              onClick={e => {
                e.preventDefault();
                onClose();
              }}
            >
              CANCEL
            </Button>
            <Button
              className="presets primary"
              onClick={this.addCampaign}
              id="create-button"
              btnColorType="primary"
            >
              CAMPAIGN_CREATE
            </Button>
          </div>
        </form>
      </div>
    );
  }
}

export default injectIntl(
  connect(
    state => ({
      isTourOpen: state.global.isTourOpen,
      isTourEnabled: state.global.isTourEnabled
    }),
    {
      toggleTour: AppActions.toggleTour,
      toggleTourStatus: AppActions.toggleTourStatus
    }
  )(AddNewCampaign)
);
