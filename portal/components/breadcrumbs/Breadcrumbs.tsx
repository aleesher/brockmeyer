import React from "react";
import _ from "lodash";
import classnames from "classnames";
import { FormattedMessage } from "react-intl";

import { KeyboardArrowRight } from "components/icons";
import { IBreadcrump } from "models/.";
import { NAVIGATION_URLS as URLS } from "constants/URIConstants";

import "./Breadcrumbs.scss";

interface IProps {
  items: IBreadcrump[];
  loaded: boolean;
  selectedItem: string;
  visible: boolean;
  visitedBreadcrumbs: string[];
  id: any;
  toggleBreadcrumpModal: (url) => void;
}

interface IState {
  isMobile: boolean;
}

class Breadcrumbs extends React.Component<IProps, IState> {
  private selectedItem;

  constructor(props: any) {
    super(props);

    this.state = {
      isMobile: window.innerWidth < 1200
    };
  }

  private scrollToElement = () => {
    if (this.selectedItem) {
      const breadcrumb = document.getElementById("breadcrumbs");
      if (breadcrumb) {
        breadcrumb.scrollTo({
          left: this.selectedItem.offsetLeft - 30,
          behavior: "smooth"
        });
      }
    }
  };

  render() {
    const { items, selectedItem, visible, visitedBreadcrumbs, toggleBreadcrumpModal } = this.props;
    const { isMobile } = this.state;
    this.scrollToElement();
    return visible ? (
      <div className="breadcrumbs" id="breadcrumbs">
        {items.map(
          ({ text, url }, index) =>
            (!isMobile ||
              (url !== URLS.CAMPAIGN_MARKET_ANALYSIS &&
                url !== URLS.VACANCY_IMPROVER &&
                url !== URLS.CAMPAIGN_BANNERS &&
                url !== URLS.CAMPAIGN_SOCIAL_MEDIA)) && (
              <div
                className="breadcrumb-container"
                key={index}
                ref={node => (selectedItem === url ? (this.selectedItem = node) : null)}
              >
                {visitedBreadcrumbs.includes(url) ? (
                  <div
                    onClick={() => toggleBreadcrumpModal(url)}
                    className={classnames({ selected: selectedItem === url })}
                  >
                    <FormattedMessage id={text} />
                  </div>
                ) : (
                  <FormattedMessage id={text} tagName="span" />
                )}
                {index < items.length - 1 && <KeyboardArrowRight />}
              </div>
            )
        )}
      </div>
    ) : null;
  }
}

export default Breadcrumbs;
