import React from "react";
import classnames from "classnames";
import { FormattedMessage } from "react-intl";
import _ from "lodash";

import { ThemeConsumer } from "constants/themes/theme-context";

import "./Button.scss";

class Button extends React.Component<any> {
  private icon(leftIconCss) {
    const { loading, icon: Icon } = this.props;
    const onClick = event => event.stopPropagation();
    return loading ? (
      <i className={classnames("icon-loading", leftIconCss)} onClick={onClick} />
    ) : (
      Icon && <Icon onClick={onClick} />
    );
  }

  private text() {
    const { loading, loadingText, children } = this.props;
    return loading && loadingText ? loadingText : children;
  }

  private getButtonType = (btnColorType, theme) => {
    return btnColorType === "primary"
      ? theme.primary_color
      : btnColorType === "secondary"
      ? theme.secondary_color
      : "";
  };

  private getButtonTextColor = (btnColorType, theme) => {
    return btnColorType === "primary"
      ? theme.primaryTextColor
      : btnColorType === "secondary"
      ? theme.secondaryTextColor
      : "";
  };

  private getButtonBorderColor = (btnColorType, theme) => {
    return btnColorType === "shared" ? theme.secondary_color : "";
  };

  render() {
    const {
      className,
      iconPosition,
      disabled,
      loading,
      visible = true,
      btnType = "main",
      btnColorType,
      color,
      textColor,
      fontStyle,
      ...rest
    } = this.props;
    const props = _.omit(rest, ["children", "icon", "loading", "loadingText", "disabled"]);
    const iconCss = iconPosition === "right" && "icon-alignment-right";
    const leftIcon = iconPosition !== "right" ? "icon-alignment-left" : "";
    const css = classnames("bro-button", btnType, iconCss, className);

    return (
      visible && (
        <ThemeConsumer>
          {theme => {
            const buttonColor = color ? color : this.getButtonType(btnColorType, theme);
            const buttonText = textColor ? textColor : this.getButtonTextColor(btnColorType, theme);
            // const borderColor =

            return (
              <button
                className={css}
                disabled={loading || disabled}
                {...props}
                style={{
                  backgroundColor: buttonColor,
                  color: buttonText,
                  fontFamily: fontStyle ? fontStyle : "inherit",
                  borderColor: this.getButtonBorderColor(btnColorType, theme)
                }}
              >
                {this.icon(leftIcon)}
                <FormattedMessage id={this.text()} defaultMessage={this.text()} />
              </button>
            );
          }}
        </ThemeConsumer>
      )
    );
  }
}

export default Button;
