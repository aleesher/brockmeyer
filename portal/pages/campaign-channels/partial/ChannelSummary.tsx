import React from "react";
import classnames from "classnames";
import { FormattedMessage } from "react-intl";
import { TransitionGroup, CSSTransition } from "react-transition-group";
import _ from "lodash";

import { KeyboardArrowRight, Clear, ArrowDropUp } from "components/icons";
import Button from "components/button/Button";
import { formatPrice, getTotalChannelaClicks as getTotalClicks } from "helpers/common";
import Tooltip from "components/tooltip";
import { ADD_ON_DEFAULT_TEXT_CHECK } from "constants/constants";
import SummaryItem from "components/page-template/summary-item";
import Summary from "components/page-template/summary";
import { ThemeConsumer } from "constants/themes/theme-context";

import "./ChannelSummary.scss";

function getTotalPriceOfChannels(selected) {
  return formatPrice(selected.reduce((total, k) => total + k.price, 0));
}

function getTotalPriceOfCampaign(selected, campaign) {
  const total = selected.length ? campaign.partnerPrice || campaign.targetPrice : 0;
  return formatPrice(total);
}

function isCampaignExist(c) {
  return c && Object.keys(c).length > 0;
}

const empty = () => <FormattedMessage id="AT_LEAST_ONE_CHANNEL" tagName="p" />;

interface IProps {
  title?: string;
  selected: any;
  readOnly: boolean;
  disabled?: boolean;
  nextButtonText?: string;
  onShowStatistics?: (channel) => void;
  onRemove: (channel) => void;
  onNext: () => void;
  campaign?: any;
  addingChannel?: any;
  selectedChannel?: any;
  addingAddOns?: any;
  isLoading?: boolean;
  globalLoading?: boolean;
}

interface IState {
  expanded: boolean;
}

class ChannelSummary extends React.Component<IProps, IState> {
  constructor(props: any) {
    super(props);

    this.state = {
      expanded: false
    };
  }

  renderDiscount = color => {
    const listPrice = _.get(this.props, "campaign.listPrice", 0);
    const targetPrice = _.get(this.props, "campaign.targetPrice", 0);
    const partnerPrice = _.get(this.props, "campaign.partnerPrice", 0);

    return (
      <CSSTransition timeout={300} classNames="fade">
        <div className="card">
          <div className="order-line row">
            <FormattedMessage id="TOTAL_COSTS" tagName="h3" />
            <span style={{ color }} className="price">
              &euro;{formatPrice(listPrice)}
            </span>
          </div>
          <div className="order-line row">
            <div className="row-saving">
              <FormattedMessage id="PURCHASE_ADVANTAGE" tagName="h3" />
              <Tooltip id="SAVING_MESSAGE" />
            </div>
            <span style={{ color }} className="price">
              &euro;{formatPrice(listPrice - targetPrice)}
            </span>
          </div>
          {partnerPrice && (
            <div className="order-line row">
              <FormattedMessage id="PARTNER_PRICE" tagName="h3" />
              <span style={{ color }} className="price">
                &euro;{formatPrice(targetPrice - partnerPrice)}
              </span>
            </div>
          )}
        </div>
      </CSSTransition>
    );
  };

  renderTotal = color => {
    const { selected, campaign } = this.props;
    return (
      <div className="order-line row">
        <FormattedMessage id="TOTAL" tagName="h3" />
        <span className="price" style={{ color }}>
          &euro;
          {isCampaignExist(campaign)
            ? getTotalPriceOfCampaign(selected, campaign)
            : getTotalPriceOfChannels(selected)}
        </span>
      </div>
    );
  };

  message = () => {
    const { selected, onShowStatistics } = this.props;
    return (
      <div>
        <p>
          {getTotalClicks(selected)} <FormattedMessage id="EST_CLICKS" />
        </p>
        {onShowStatistics && (
          <a onClick={onShowStatistics}>
            <FormattedMessage id="VIEW_EXPECTED_RESULT" />
          </a>
        )}
      </div>
    );
  };

  private renderSummaryChannel = (channel, index, theme) => {
    const { readOnly, onRemove, selectedChannel, addingAddOns } = this.props;

    const isAddingAddOns = index === 0 && addingAddOns;

    const hasOnRemove =
      !readOnly && channel.id !== ADD_ON_DEFAULT_TEXT_CHECK && _.isEmpty(selectedChannel);

    if (isAddingAddOns && !_.isEmpty(selectedChannel) && selectedChannel.id !== 4863) {
      return (
        <React.Fragment key={`${channel.id}-${channel.price}`}>
          <CSSTransition timeout={300} classNames="fade">
            <div className="card">
              <h3>{channel.name}</h3>
              {hasOnRemove && <Clear className="remove" onClick={() => onRemove(channel)} />}
              <div className="order-line">
                <div>
                  {this.renderDays(channel.days)}
                  <p>
                    {channel.statistics.estimatedClicks} <FormattedMessage id="EST_CLICKS" />
                  </p>
                </div>
                <div className="price" style={{ color: theme.primary_color }}>
                  &euro;{formatPrice(channel.price)}
                </div>
              </div>
            </div>
          </CSSTransition>
          <CSSTransition key="processing-add-ons" timeout={300} classNames="fade">
            <SummaryItem />
          </CSSTransition>
        </React.Fragment>
      );
    }

    if (!_.isEmpty(selectedChannel) && selectedChannel.id === channel.id) {
      return (
        <CSSTransition key="processing-channel" timeout={300} classNames="fade">
          <SummaryItem />
        </CSSTransition>
      );
    }

    return (
      <CSSTransition key={`${channel.id}-${channel.price}`} timeout={300} classNames="fade">
        <div className="card">
          <h3>{channel.name}</h3>
          {hasOnRemove && <Clear className="remove" onClick={() => onRemove(channel)} />}
          <div className="order-line">
            <div>
              <div>{this.renderDays(channel.days)}</div>
              <p>
                {channel.statistics.estimatedClicks} <FormattedMessage id="EST_CLICKS" />
              </p>
            </div>
            <div className="price" style={{ color: theme.primary_color }}>
              &euro;{formatPrice(channel.price)}
            </div>
          </div>
        </div>
      </CSSTransition>
    );
  };

  private renderDays = days => {
    if (days) {
      return (
        <p>
          {Math.round(days)} <FormattedMessage id="DAYS" />
        </p>
      );
    }

    return;
  };

  private renderSummary = (className, theme) => {
    const { isLoading, globalLoading, selected, addingChannel, campaign } = this.props;
    const { expanded } = this.state;
    const firstChannel = _.find(selected, ["price", "0.00"]);
    const selectedWithOrder = !_.isEmpty(firstChannel)
      ? _.unionBy([firstChannel], selected, "id")
      : selected;

    return isLoading || globalLoading ? (
      <Summary className={className} />
    ) : (
      <TransitionGroup className={classnames("selected-list", { expanded })}>
        {selectedWithOrder.map((selected, index) =>
          this.renderSummaryChannel(selected, index, theme)
        )}
        {addingChannel && (
          <CSSTransition key="new-channel" timeout={300} classNames="fade">
            <SummaryItem />
          </CSSTransition>
        )}
        {isCampaignExist(campaign) &&
          selected.length > 0 &&
          this.renderDiscount(theme.primary_color)}
      </TransitionGroup>
    );
  };

  render() {
    const { title = "SELECTED_CHANNELS", nextButtonText, onNext, selected, disabled } = this.props;
    const { expanded } = this.state;

    return (
      <ThemeConsumer>
        {theme => (
          <div className="selected-container">
            <div
              className={classnames("expand-container", { expanded }, { hide: !selected.length })}
              onClick={() => this.setState({ expanded: !this.state.expanded })}
            >
              <ArrowDropUp />
            </div>
            <FormattedMessage id={title} tagName="h2" />
            {this.renderSummary("selected-list", theme)}
            <div className="mobile-discount">{this.renderDiscount(theme.primary_color)}</div>
            <div className="card total">
              {this.renderTotal(theme.primary_color)}
              {selected.length ? this.message() : empty()}
              <Button
                className="next-btn"
                onClick={onNext}
                disabled={!selected.length || disabled}
                icon={KeyboardArrowRight}
                iconPosition="right"
                btnColorType="primary"
                id="start-campaign"
              >
                {nextButtonText}
              </Button>
            </div>
          </div>
        )}
      </ThemeConsumer>
    );
  }
}

export default ChannelSummary;
