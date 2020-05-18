import React from "react";
import classnames from "classnames";

import CardTemplate from "./card-template/CardTemplate";
import CampaignCardTemplate from "./card-template/CampaignCardTemplate";
import CampaignCardTemplateMobile from "./card-template/CampaignCardTemplateMobile";
import OrganisationsCardTemplate from "./card-template/OrganizationsCardTemplate";

import { NAVIGATION_URLS as URLS } from "constants/URIConstants";
import "./PageTemplate.scss";

interface IProps {
  className?: string;
  isMobile?: boolean;
  page?: string;
  listClassName?: string;
}

interface IState {
  cards: number[];
}

class PageTemplate extends React.PureComponent<IProps, IState> {
  state = {
    cards: [0, 1, 2, 3, 4]
  };

  private renderCards = (className, page) => {
    const { cards } = this.state;
    const { isMobile } = this.props;
    let Template = CardTemplate;

    if (page === URLS.CAMPAIGNS) {
      if (!isMobile) {
        Template = CampaignCardTemplate;
      } else {
        Template = CampaignCardTemplateMobile;
      }
    } else if (page === URLS.CUSTOMERS) {
      Template = OrganisationsCardTemplate;
    }

    return cards.map(card => <Template className={className} key={card} />);
  };

  render() {
    const { className = "", page = "", listClassName = "" } = this.props;

    return (
      <div id="page-template" className={listClassName}>
        <div className={classnames("template-channels", className)}>
          {this.renderCards(className, page)}
        </div>
      </div>
    );
  }
}

export default PageTemplate;
