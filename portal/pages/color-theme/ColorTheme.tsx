import React from "react";
import _ from "lodash";
import { FormattedMessage, injectIntl, InjectedIntlProps } from "react-intl";
import { SketchPicker } from "react-color";
import { ColorExtractor } from "react-color-extractor";

import Button from "components/button/Button";
import CustomerActions from "../customers/CustomersActions";
import AppActions from "../app/AppActions";
import { connect } from "../../reduxConnector";
import { PageLayout } from "components/.";
import { NAVIGATION_URLS } from "constants/URIConstants";
import CustomerTab from "../customers/partial/CustomerTab";
import URIConstants from "constants/URIConstants";
import {
  fonts,
  DEFAULT_COLOR_SCHEME_SETTINGS,
  PREVIEW_CHANNEL,
  BLACK_COLOR,
  WHITE_COLOR
} from "constants/constants";
import ChannelCard from "../campaign-channels/partial/ChannelCard";

import "./ColorTheme.scss";
import "react-color-picker/index.css";

const BRO_LOGO_PATH = "/assets/images/logo_icon.png";

interface IProps {
  changeColorScheme: (data: any, id) => void;
  changeUserColorScheme: (data: any) => void;
  user: any;
  history: any;
  customerId: any;
}

interface IState {
  primaryColor: string;
  secondaryColor: string;
  logo: string;
  primaryColorAgreement: boolean;
  secondaryColorAgreement: boolean;
  primaryDarkColorAgreement: boolean;
  secondaryDarkColorAgreement: boolean;
  primaryTextColor: string;
  secondaryTextColor: string;
  font: string;
  channelSelected: any;
  logoColors: string[];
}

class ColorTheme extends React.Component<IProps & InjectedIntlProps, IState> {
  constructor(props: IProps) {
    super(props);

    const { user = {} } = props;
    const settings = JSON.parse(user.portalSettings || "{}");
    this.state = {
      primaryColor: _.get(
        settings,
        "color_scheme.primary_color",
        DEFAULT_COLOR_SCHEME_SETTINGS.primaryColor
      ),
      secondaryColor: _.get(
        settings,
        "color_scheme.secondary_color",
        DEFAULT_COLOR_SCHEME_SETTINGS.secondaryColor
      ),
      logo: _.get(settings, "logo", BRO_LOGO_PATH),
      primaryColorAgreement: false,
      secondaryColorAgreement: false,
      primaryTextColor: _.get(
        settings,
        "color_scheme.primaryTextColor",
        DEFAULT_COLOR_SCHEME_SETTINGS.primaryTextColor
      ),
      secondaryTextColor: _.get(
        settings,
        "color_scheme.secondaryTextColor",
        DEFAULT_COLOR_SCHEME_SETTINGS.secondaryTextColor
      ),
      primaryDarkColorAgreement: false,
      secondaryDarkColorAgreement: false,
      font: _.get(settings, "font", "Raleway"),
      channelSelected: [PREVIEW_CHANNEL],
      logoColors: []
    };
  }

  componentWillReceiveProps(nextProps) {
    const { primaryColor, secondaryColor } = this.state;
    const { user = {} } = nextProps;

    if (user.portalSettings) {
      const { portalSettings = "{}" } = user;
      const { color_scheme = {} } = JSON.parse(portalSettings);
      const { primary_color = "", secondary_color = "" } = color_scheme;

      if (
        !!primary_color &&
        !!secondary_color &&
        (primaryColor !== primary_color || secondaryColor !== secondary_color)
      ) {
        this.setState({
          primaryColor: primary_color,
          secondaryColor: secondary_color
        });
      }
    }
  }

  private toggle = channel => {
    const { channelSelected } = this.state;

    if (channelSelected.length) {
      this.setState({ channelSelected: [] });
    } else {
      this.setState({ channelSelected: [channel] });
    }
  };

  private changeColorTheme = async () => {
    const {
      primaryColor,
      secondaryColor,
      primaryTextColor,
      secondaryTextColor,
      logo,
      font
    } = this.state;
    const { changeColorScheme, customerId, changeUserColorScheme, user = {} } = this.props;

    this.setState(
      {
        primaryColorAgreement: false,
        primaryDarkColorAgreement: false,
        secondaryColorAgreement: false,
        secondaryDarkColorAgreement: false
      },
      () => {
        const newSettings = {
          ...JSON.parse(user.portalSettings || "{}"),
          color_scheme: {
            primary_color: primaryColor,
            secondary_color: secondaryColor,
            primaryTextColor,
            secondaryTextColor
          },
          logo,
          font
        };
        changeColorScheme({
          id: customerId,
          portalSettings: JSON.stringify(newSettings)
        });
        changeUserColorScheme(newSettings);
      }
    );
  };

  resetSettings = () => {
    this.setState(
      currentState => ({
        ...currentState,
        ...DEFAULT_COLOR_SCHEME_SETTINGS
      }),
      this.changeColorTheme
    );
  };

  handleLogoChange = event => {
    const { value } = event.target;
    this.setState({ logo: value });
  };

  handleFontChange = event => {
    const { value } = event.target;
    this.setState({ font: value });
  };

  changePrimaryColor = color => {
    this.setState({ primaryColor: color.hex });
  };

  changeSecondaryColor = color => {
    this.setState({ secondaryColor: color.hex });
  };

  hexToRgb = hex => {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);

    return result
      ? {
          r: parseInt(result[1], 16),
          g: parseInt(result[2], 16),
          b: parseInt(result[3], 16)
        }
      : null;
  };

  isLight = rgb => {
    const Y = 0.2126 * rgb.r + 0.7152 * rgb.g + 0.0722 * rgb.b;
    const c = Y < 170 ? false : true;

    return c;
  };

  onCheckAgree = ({ target }) => {
    if (target.id === "primary-light-text-color") {
      this.setState({
        primaryColorAgreement: !this.state.primaryColorAgreement,
        primaryTextColor: this.state.primaryTextColor === WHITE_COLOR ? BLACK_COLOR : WHITE_COLOR
      });
      if (this.state.primaryDarkColorAgreement) {
        this.setState({ primaryDarkColorAgreement: false });
      }
    } else if (target.id === "primary-dark-text-color") {
      this.setState({
        primaryDarkColorAgreement: !this.state.primaryDarkColorAgreement,
        primaryTextColor: this.state.primaryTextColor === WHITE_COLOR ? BLACK_COLOR : WHITE_COLOR
      });
      if (this.state.primaryColorAgreement) {
        this.setState({ primaryColorAgreement: false });
      }
    } else if (target.id === "secondary-light-text-color") {
      this.setState({
        secondaryColorAgreement: !this.state.secondaryColorAgreement,
        secondaryTextColor:
          this.state.secondaryTextColor === WHITE_COLOR ? BLACK_COLOR : WHITE_COLOR
      });
      if (this.state.secondaryDarkColorAgreement) {
        this.setState({ secondaryDarkColorAgreement: false });
      }
    } else {
      this.setState({
        secondaryDarkColorAgreement: !this.state.secondaryDarkColorAgreement,
        secondaryTextColor:
          this.state.secondaryTextColor === WHITE_COLOR ? BLACK_COLOR : WHITE_COLOR
      });
      if (this.state.secondaryColorAgreement) {
        this.setState({ secondaryColorAgreement: false });
      }
    }
  };

  isCheck = () => {
    const {
      primaryColorAgreement,
      primaryDarkColorAgreement,
      secondaryColorAgreement,
      secondaryDarkColorAgreement
    } = this.state;

    return (
      this.isPrimaryColorAgreement() ||
      (primaryColorAgreement && !this.isPrimaryDarkColorAgreement()) ||
      this.isSecondaryColorAgreement() ||
      (secondaryColorAgreement && !this.isSecondaryDarkColorAgreement()) ||
      this.isPrimaryDarkColorAgreement() ||
      (primaryDarkColorAgreement && !this.isPrimaryColorAgreement()) ||
      this.isSecondaryDarkColorAgreement() ||
      (secondaryDarkColorAgreement && !this.isSecondaryColorAgreement())
    );
  };

  isPrimaryColorAgreement = () => {
    const { primaryColor, primaryTextColor } = this.state;

    return primaryTextColor === WHITE_COLOR && this.isLight(this.hexToRgb(primaryColor));
  };

  isPrimaryDarkColorAgreement = () => {
    const { primaryColor, primaryTextColor } = this.state;

    return primaryTextColor === BLACK_COLOR && !this.isLight(this.hexToRgb(primaryColor));
  };

  isSecondaryColorAgreement = () => {
    const { secondaryColor, secondaryTextColor } = this.state;

    return secondaryTextColor === WHITE_COLOR && this.isLight(this.hexToRgb(secondaryColor));
  };

  isSecondaryDarkColorAgreement = () => {
    const { secondaryColor, secondaryTextColor } = this.state;

    return secondaryTextColor === BLACK_COLOR && !this.isLight(this.hexToRgb(secondaryColor));
  };

  colorCheckboxes = () => {
    const {
      primaryColorAgreement,
      secondaryColorAgreement,
      primaryDarkColorAgreement,
      secondaryDarkColorAgreement
    } = this.state;

    return (
      this.isCheck() && (
        <div className="button-color-agreements">
          {(this.isPrimaryColorAgreement() ||
            (primaryColorAgreement && !this.isPrimaryDarkColorAgreement())) && (
            <label className="checkbox agree-button-text">
              <input
                id="primary-light-text-color"
                type="checkbox"
                checked={primaryColorAgreement}
                onChange={this.onCheckAgree}
              />
              <span className="checkmark" />
              <FormattedMessage id="COLOR_SCHEME_PRIMARY_TEXT_COLOR" />
            </label>
          )}
          {(this.isSecondaryColorAgreement() ||
            (secondaryColorAgreement && !this.isSecondaryDarkColorAgreement())) && (
            <label className="checkbox agree-button-text">
              <input
                id="secondary-light-text-color"
                type="checkbox"
                checked={secondaryColorAgreement}
                onChange={this.onCheckAgree}
              />
              <span className="checkmark" />
              <FormattedMessage id="COLOR_SCHEME_SECONDARY_TEXT_COLOR" />
            </label>
          )}
          {(this.isPrimaryDarkColorAgreement() ||
            (primaryDarkColorAgreement && !this.isPrimaryColorAgreement())) && (
            <label className="checkbox agree-button-text">
              <input
                id="primary-dark-text-color"
                type="checkbox"
                checked={primaryDarkColorAgreement}
                onChange={this.onCheckAgree}
              />
              <span className="checkmark" />
              <FormattedMessage id="COLOR_SCHEME_PRIMARY_DARK_TEXT_COLOR" />
            </label>
          )}
          {(this.isSecondaryDarkColorAgreement() ||
            (secondaryDarkColorAgreement && !this.isSecondaryColorAgreement())) && (
            <label className="checkbox agree-button-text">
              <input
                id="secondary-dark-text-color"
                type="checkbox"
                checked={secondaryDarkColorAgreement}
                onChange={this.onCheckAgree}
              />
              <span className="checkmark" />
              <FormattedMessage id="COLOR_SCHEME_SECONDARY_DARK_TEXT_COLOR" />
            </label>
          )}
        </div>
      )
    );
  };

  fontItem = (value, text, index) => {
    const { font } = this.state;

    return (
      <div className="font-item" key={`font${index}`}>
        <input type="radio" value={value} name="font" defaultChecked={font === value} />
        <label style={{ fontFamily: text.replace(/\s+/g, "") }}>{text}</label>
      </div>
    );
  };

  fonts = () => (
    <div onChange={this.handleFontChange}>
      {fonts.map((font, index) => this.fontItem(font.value, font.text, index))}
    </div>
  );

  renderChannelCard = () => {
    const { primaryColor } = this.state;

    return (
      <ChannelCard
        channel={PREVIEW_CHANNEL}
        selected={this.state.channelSelected}
        onChannelToggle={this.toggle}
        disabled={false}
        buttonText={"MORE"}
        color={primaryColor}
      />
    );
  };

  handleColorExtractor = logoColors => {
    this.setState({
      logoColors
    });
  };

  render() {
    const { customers, customerId, user } = this.props;
    const {
      logo,
      primaryColor,
      secondaryColor,
      font,
      primaryTextColor,
      secondaryTextColor,
      logoColors
    } = this.state;
    const customer = customers.find(customer => customer.id === customerId);
    const title = customer ? customer.name : "";
    const backTo = { text: "CUSTOMER", url: "/customers" };
    const logoPath = `${URIConstants.REMOTE_RESOURCES_URI}${user.companyLogo}`;

    return (
      <div id="color-theme">
        <PageLayout page={NAVIGATION_URLS.CUSTOMERS} subHeader={{ title, backTo }}>
          <CustomerTab
            customerId={customerId}
            tabIndex={2}
            usersCompany={user.companyId}
            userRole={user.roleName}
          />
          <ColorExtractor src={logoPath} getColors={this.handleColorExtractor} />
          <div className="customer-form-wrapper">
            <h1 className="title">
              <FormattedMessage id="CHOOSE_COLORS" />
            </h1>
            <div className="color-scheme-instructions">
              <FormattedMessage id="COLOR_SCHEME_INSTRUCTIONS" values={{ br: <br /> }} />
            </div>
            <div className="all-components">
              <div className="colors-checkoxes">
                <div className="color-pickers">
                  <div className="color-item primary">
                    <p className="color-title">
                      <FormattedMessage id="PRIMARY_COLOR" />
                    </p>
                    <SketchPicker
                      color={primaryColor}
                      onChange={this.changePrimaryColor}
                      presetColors={logoColors}
                      disableAlpha
                    />
                  </div>
                  <div className="color-item">
                    <p className="color-title">
                      <FormattedMessage id="SECONDARY_COLOR" />
                    </p>
                    <SketchPicker
                      color={secondaryColor}
                      onChange={this.changeSecondaryColor}
                      presetColors={logoColors}
                      disableAlpha
                    />
                  </div>
                </div>
                {this.colorCheckboxes()}
              </div>
              {user.companyLogo && (
                <div>
                  <p className="theme-titles">
                    <FormattedMessage id="LOGO" />
                  </p>
                  <div className="theme-logo-container">
                    <div className="logo-item">
                      <input
                        type="radio"
                        name="logo"
                        value={BRO_LOGO_PATH}
                        onChange={this.handleLogoChange}
                        checked={logo === BRO_LOGO_PATH}
                      />
                      <label>
                        <img src={BRO_LOGO_PATH} className="logo-img" />
                      </label>
                    </div>
                    <div className="logo-item">
                      <input
                        type="radio"
                        name="logo"
                        value={user.companyLogo}
                        onChange={this.handleLogoChange}
                        checked={logo !== BRO_LOGO_PATH}
                      />
                      <label>
                        <img src={logoPath} className="logo-img" />
                      </label>
                    </div>
                  </div>
                </div>
              )}
              <div className="fonts-container">
                <p className="theme-titles">
                  <FormattedMessage id="FONT" />
                </p>
                {this.fonts()}
              </div>
            </div>
            <h1 className="title">
              <FormattedMessage id="PREVIEW" />
            </h1>
            <div style={{ fontFamily: font }}>
              <p className="preview-description">
                <FormattedMessage id="PREVIEW_DESCRIPTION" />
              </p>
              <div className="components-container">
                <div className="preview-component">
                  <div className="preview-component-text">
                    <FormattedMessage id="PRIMARY_BUTTON" />
                  </div>
                  <Button
                    className="presets primary"
                    btnColorType="primary"
                    color={primaryColor}
                    textColor={primaryTextColor}
                    fontStyle={font}
                  >
                    PREVIEW
                  </Button>
                </div>
                <div className="preview-component">
                  <div className="preview-component-text">
                    <FormattedMessage id="SECONDARY_BUTTON" />
                  </div>
                  <Button
                    className="presets primary"
                    btnColorType="secondary"
                    color={secondaryColor}
                    textColor={secondaryTextColor}
                    fontStyle={font}
                  >
                    PREVIEW
                  </Button>
                </div>
                <div className="preview-component channel">{this.renderChannelCard()}</div>
              </div>
            </div>
            <div className="btn-container">
              <Button
                className="presets primary reset-button"
                onClick={this.resetSettings}
                btnColorType="secondary"
              >
                RESET
              </Button>
              <Button
                className="presets primary"
                onClick={this.changeColorTheme}
                btnColorType="primary"
              >
                SAVE
              </Button>
            </div>
          </div>
        </PageLayout>
      </div>
    );
  }
}

export default injectIntl(
  connect(
    (state, { match: { params } }) => ({
      customers: state.customers.customerItems,
      user: state.global.currentUser,
      customerId: parseInt(params.id, 10)
    }),
    {
      changeUserColorScheme: AppActions.changeUserColorScheme,
      changeColorScheme: CustomerActions.changeColorScheme
    }
  )(ColorTheme)
);
