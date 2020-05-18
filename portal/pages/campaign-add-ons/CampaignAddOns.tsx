import React from "react";
import _ from "lodash";
import { getFormValues, change } from "redux-form";
import { FormattedMessage, injectIntl } from "react-intl";
import { compose } from "recompose";
import classnames from "classnames";

import { NAVIGATION_URLS } from "constants/URIConstants";
import { ADD_ONS_ID, JOB_HOLDER } from "constants/constants";
import { connect, campaignForm } from "../../reduxConnector";
import CustomersActions from "../customers/CustomersActions";
import ChannelsActions from "../campaign-channels/ChannelsActions";
import ChannelCard from "../campaign-channels/partial/ChannelCard";
import ChannelSummary from "../campaign-channels/partial/ChannelSummary";
import MandatoryFields from "./partial/MandatoryFields";
import { PageLayout } from "components/.";
import ModalTemplate from "components/modals/ModalTemplate";
import ContactPersonForm from "../customers/partial/ContactPersonForm";
import CampaignActions from "../campaigns/CampaignOverviewActions";
import { sortContacts, redirect, getStatusName } from "helpers/common";
import { IChannel } from "models/Channel";
import CardTemplate from "components/page-template/card-template/CardTemplate";
import PageTemplate from "components/page-template";
import { STEPS_CAMPAIGN_ADD_ONS } from "constants/constants";

import "./CampaignAddOns.scss";
import "../../styles/global.scss";

interface IProps {
  isLoading: boolean;
  campaignWizard: any;
  contacts: any;
  languages: any;
  firstChannel: any;
  mainChannel: any;
  invalid: boolean;
  campaignChannels: any;
  contactTypes: any;
  userContacts: any;
  currentUser: any;
  addContact: (data: any) => void;
  getUserContacts: () => void;
  changeFormValue: (name, value) => void;
  history: any;
  getAddOnsInfo: (any, name, filters) => void;
  match: any;
  channelItems: any[];
  addCampaignChannel: (campaignId, channel, campaignChannels, campaign) => void;
  removeCampaignChannel: (campaignId, channelId, campaignChannels, campaign) => void;
  getChannels: (search?, filters?) => void;
  status: any;
  addingChannel: boolean;
  isRemovingChannel: boolean;
  setInitAddRemoveState: () => void;
  isTourOpen: boolean;
  closeTour: () => void;
}

interface IState {
  channelId: number | null;
  showCreateContactModal: boolean;
  selectedChannel: IChannel | null;
  isFirstChannelAdded: boolean;
}

class CampaignAddOns extends React.Component<IProps, IState> {
  constructor(props) {
    super(props);

    this.state = {
      channelId: null,
      showCreateContactModal: false,
      selectedChannel: null,
      isFirstChannelAdded: false
    };
  }

  componentWillMount() {
    const {
      getAddOnsInfo,
      getChannels,
      match: {
        params: { campaignId }
      }
    } = this.props;

    if (this.needRequest()) {
      getAddOnsInfo(campaignId, _, { channelTypes: [ADD_ONS_ID] });
    } else {
      getChannels(_, { channelTypes: [ADD_ONS_ID] });
    }
  }

  componentWillReceiveProps(nextProps) {
    const {
      campaignWizard,
      userContacts,
      currentUser,
      getUserContacts,
      contacts,
      addingChannel,
      isRemovingChannel,
      isChannelRemoved,
      isChannelAdded,
      setInitAddRemoveState
    } = nextProps;

    const { campaignWizard: prevWizard, contacts: prevContacts } = this.props;

    if (!_.isEmpty(campaignWizard) && !_.isEmpty(prevWizard)) {
      this.setDefaultLang();
    }

    if (!_.isEmpty(contacts) && _.isEmpty(prevContacts)) {
      const isPartner = campaignWizard.companyId !== currentUser.companyId;
      const isEmptyPartnerContacts = !userContacts || userContacts.length === 0;

      if (isPartner && isEmptyPartnerContacts) {
        getUserContacts();
      }
    }

    if (
      (addingChannel === false && isChannelAdded === true) ||
      (isRemovingChannel === false && isChannelRemoved === true)
    ) {
      setInitAddRemoveState();
      this.setState({
        selectedChannel: null
      });
    }
  }

  private needRequest = () => {
    const { campaignWizard, contacts, languages, channelItems, campaignChannels } = this.props;
    if (campaignWizard && !campaignWizard.id) {
      return true;
    }
    const arr = [campaignWizard, contacts, languages, channelItems, campaignChannels];
    return arr.some(element => _.isEmpty(element));
  };

  private onNext = () => {
    const { history, campaignWizard } = this.props;

    redirect(history)(NAVIGATION_URLS.CAMPAIGN_REVIEW, campaignWizard.id);
  };

  private toggleSelectedChannel = channel => {
    const { selectedChannel } = this.state;
    if (_.isEmpty(selectedChannel)) {
      const {
        campaignWizard,
        addCampaignChannel,
        campaignChannels,
        removeCampaignChannel
      } = this.props;
      const hasChannel = campaignChannels.find(
        campaignChannel => channel.id === campaignChannel.id
      );
      this.setState(
        {
          selectedChannel: channel
        },
        () => {
          hasChannel
            ? removeCampaignChannel(campaignWizard.id, channel.id, campaignChannels, campaignWizard)
            : addCampaignChannel(campaignWizard.id, channel, campaignChannels, campaignWizard);
        }
      );
    }
  };

  private closeCreateContactModal = () => this.setState({ showCreateContactModal: false });

  private createContact = data => {
    this.props.addContact(data);
    this.closeCreateContactModal();
  };

  private setDefaultLang = () => {
    const {
      campaignWizard: { lang },
      changeFormValue
    } = this.props;
    if (!lang) {
      changeFormValue("lang", "nl_nl");
    }
  };

  private initSummaryChannels = () => {
    const {
      campaignChannels,
      firstChannel,
      campaignWizard,
      isLoading,
      addCampaignChannel
    } = this.props;
    const { isFirstChannelAdded } = this.state;

    const hasChannel = campaignChannels.find(
      campaignChannel => firstChannel.id === campaignChannel.id
    );
    if (
      !(
        hasChannel ||
        _.isEmpty(campaignWizard) ||
        _.isEmpty(firstChannel) ||
        isLoading ||
        isFirstChannelAdded
      )
    ) {
      this.setState({ isFirstChannelAdded: true }, () => {
        addCampaignChannel(campaignWizard.id, firstChannel, campaignChannels, campaignWizard);
      });
    }

    if (_.isEmpty(campaignChannels)) {
      return !_.isEmpty(firstChannel) ? [firstChannel] : [];
    }

    return !_.isEmpty(firstChannel)
      ? _.unionBy([firstChannel], campaignChannels, "id")
      : campaignChannels;
  };

  private renderChannelItem = (statusName, summaryChannels) => channel => {
    const { channelId, selectedChannel } = this.state;

    if (selectedChannel && selectedChannel.id === channel.id) {
      return <CardTemplate key="template-card" />;
    }

    return (
      <div
        key={channel.id}
        className={classnames("channel-wrapper", { open: channel.id === channelId })}
      >
        <ChannelCard
          channel={channel}
          selected={summaryChannels}
          onChannelToggle={this.toggleSelectedChannel}
          disabled={channel.channelType === _.toNumber(ADD_ONS_ID) && channel.price === 0}
          onShowStatistics={() =>
            this.setState(prev => ({
              channelId: prev.channelId === channel.id ? null : channel.id
            }))
          }
          buttonText={channel.id === channelId ? "LESS" : "MORE"}
          readOnly={"order_new" !== statusName}
        />
        {channel.id === channelId && (
          <div className="channel-desc-wrapper">
            <div className="popper-arrow" />
            <span
              className="channel-desc"
              dangerouslySetInnerHTML={{
                __html: channel.description || "No description"
              }}
            />
          </div>
        )}
      </div>
    );
  };

  private renderPageTemplate = () => {
    return <PageTemplate page={NAVIGATION_URLS.CAMPAIGN_ADD_ONS} />;
  };

  render() {
    const { showCreateContactModal, selectedChannel } = this.state;
    const {
      isLoading,
      campaignWizard,
      contacts,
      languages,
      mainChannel,
      invalid,
      contactTypes,
      userContacts,
      currentUser,
      channelItems,
      campaignChannels,
      status,
      addingChannel,
      isTourOpen
    } = this.props;

    const isMainChannelSelected = !!_.find(campaignChannels, ["id", mainChannel.id]);
    const summaryChannels = this.initSummaryChannels();
    const statusName = getStatusName(status);

    const scrollClass = isTourOpen ? "tour-scroll" : "";

    return (
      <div id="campaign-add-ons">
        <PageLayout
          page={NAVIGATION_URLS.CAMPAIGN_ADD_ONS}
          pageTour={NAVIGATION_URLS.CAMPAIGN_ADD_ONS}
          campaignHeader={{ breadcrumbStep: NAVIGATION_URLS.CAMPAIGN_ADD_ONS }}
          cWizard={campaignWizard}
          isLoading={isLoading}
          setBreadcrumpsImmediately={!this.needRequest()}
          tourSteps={STEPS_CAMPAIGN_ADD_ONS(campaignChannels.length > 0)}
        >
          <div className="add-ons-wrapper">
            <div className={classnames("add-ons-channels", scrollClass)}>
              <label className="title">
                <FormattedMessage id="ADD_ONS" />
              </label>
              {isLoading
                ? this.renderPageTemplate()
                : channelItems.map(this.renderChannelItem(statusName, summaryChannels))}
              {isMainChannelSelected && "order_new" === statusName && (
                <MandatoryFields
                  campaignWizard={campaignWizard}
                  languages={languages}
                  contacts={[...sortContacts(contacts), ...sortContacts(userContacts)]}
                  handleCreateContact={() => this.setState({ showCreateContactModal: true })}
                  currentUser={currentUser}
                />
              )}
            </div>
            <ChannelSummary
              title="SELECTED_CHANNELS_AND_ADD_ONS"
              nextButtonText="NEXT"
              onNext={() => this.onNext()}
              onRemove={channel => this.toggleSelectedChannel(channel)}
              readOnly={true}
              disabled={invalid}
              selected={summaryChannels}
              campaign={campaignWizard}
              selectedChannel={selectedChannel}
              addingAddOns={addingChannel}
              isLoading={isLoading}
            />
            <ModalTemplate
              open={showCreateContactModal}
              onClose={this.closeCreateContactModal}
              alignCenter
              className="add-ons"
              // usxer={currentUser}
            >
              <FormattedMessage id="ADD_CONTACT" tagName="h1" />
              <ContactPersonForm
                buttonHasArrow={false}
                contactTypes={contactTypes}
                initialValues={{
                  companyId: campaignWizard.companyId,
                  contactTypes: [JOB_HOLDER.toString()]
                }}
                nextButtonText="SAVE"
                onSubmit={this.createContact}
              />
            </ModalTemplate>
          </div>
        </PageLayout>
      </div>
    );
  }
}

export default compose(
  injectIntl,
  campaignForm(),
  connect(
    state => ({
      campaignWizard: getFormValues("campaignWizard")(state) || {},
      firstChannel:
        state.channels.channelItems.find(
          ({ price, channelType }) => channelType === ADD_ONS_ID && price === 0
        ) || {},
      mainChannel:
        state.channels.channelItems.find(
          ({ price, channelType }) => channelType === ADD_ONS_ID && price !== 0
        ) || {},
      campaignChannels: state.channels.campaignChannels,
      contacts: state.customers.contacts,
      languages: state.global.languages,
      isLoading:
        state.channels.isLoading ||
        state.campaigns.isLoading ||
        state.global.isLoading ||
        state.channels.addOnsIsLoading,
      contactTypes: state.customers.contactTypes,
      userContacts: state.campaigns.userContacts,
      currentUser: state.global.currentUser,
      channelItems: state.channels.channelItems,
      status: state.campaigns.campaignStatus,
      addingChannel: state.channels.addingChannel,
      isRemovingChannel: state.channels.isRemovingChannel,
      isChannelAdded: state.channels.isChannelAdded,
      isChannelRemoved: state.channels.isChannelRemoved
    }),
    {
      addContact: CustomersActions.addCustomerContact,
      getUserContacts: CampaignActions.getUserContacts,
      changeFormValue: (name, value) => change("campaignWizard", name, value),
      getAddOnsInfo: ChannelsActions.getAddOnsInfo,
      addCampaignChannel: ChannelsActions.addCampaignChannel,
      removeCampaignChannel: ChannelsActions.removeCampaignChannel,
      getChannels: ChannelsActions.getChannels,
      setInitAddRemoveState: ChannelsActions.setInitAddRemoveState
    }
  )
)(CampaignAddOns);
