import React from "react";
import { FormattedMessage } from "react-intl";
import { Link } from "react-router-dom";

import { KeyboardArrowLeft } from "components/icons";
import { ThemeConsumer } from "constants/themes/theme-context";

import "./HeaderCampaign.scss";

interface IUrl {
  text: string;
  url: string;
}

interface IProps {
  backTo: IUrl;
  buttons?: any;
  history: any;
  title: string;
  visible?: boolean;
}

class SubHeader extends React.Component<IProps> {
  render() {
    const { title, backTo, buttons } = this.props;
    const { visible = true } = this.props;
    if (!visible) {
      return null;
    }

    return (
      <ThemeConsumer>
        {theme => (
          <div id="header-campaign">
            <div className="header">
              <Link to={backTo.url} className="header-row-back">
                <img src="/assets/images/curled-arrow.svg" />
                <div className="back-to-campaigns">
                  <FormattedMessage id={backTo.text} tagName="p" />
                </div>
              </Link>
              <div className="header-row-campaign-name">
                <Link to={backTo.url} className="mobile-back-btn">
                  <KeyboardArrowLeft />
                </Link>
                <div className="campaign-name">
                  <p style={{ color: theme.primary_color }}>{title}</p>
                </div>
                {buttons}
              </div>
            </div>
          </div>
        )}
      </ThemeConsumer>
    );
  }
}

export default SubHeader;
