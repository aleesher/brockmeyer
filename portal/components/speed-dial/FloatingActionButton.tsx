import React from "react";
import classnames from "classnames";

import { Add } from "components/icons";

import "./FloatingActionButton.scss";

interface ActionsType {
  icon: JSX.Element;
  name: string | JSX.Element;
  action: (data?: any) => void;
  disabled?: boolean;
}

interface IProps {
  open?: boolean;
  onClick: () => void;
  icon?: JSX.Element;
  actions?: ActionsType[];
}

export default class FloatingActionButton extends React.Component<IProps> {
  private speedDialRef;

  componentDidMount() {
    document.addEventListener("mousedown", event => this.hideOnClickOutside(event));
  }

  componentWillUnmount() {
    document.removeEventListener("mousedown", event => this.hideOnClickOutside(event));
  }

  private hideOnClickOutside(event) {
    if (this.speedDialRef && !this.speedDialRef.contains(event.target)) {
      this.props.open && this.props.onClick();
    }
  }

  render() {
    const { open, onClick, icon, actions } = this.props;
    const speedDialIcon = icon && !open ? icon : <Add />;

    return (
      <div className="speed-dial" ref={ref => (this.speedDialRef = ref)}>
        <div className={classnames("speed-dial-icon", { open })} onClick={onClick}>
          {speedDialIcon}
        </div>

        {actions && (
          <div className={classnames("speed-dial-list", { open })}>
            {actions.map((action, index) => (
              <div className={classnames("list-item", { disabled: action.disabled })} key={index}>
                <span onClick={action.action}>{action.name}</span>
                <div className="action-icon" onClick={action.action}>
                  {action.icon}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    );
  }
}
