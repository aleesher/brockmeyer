import React from "react";
import { withRouter } from "react-router";

import { scrollTop } from "helpers/common";

class ScrollTop extends React.Component<any, any> {
  componentDidUpdate(prevProps) {
    if (this.props.location.pathname !== prevProps.location.pathname) {
      scrollTop();
    }
  }

  render() {
    return this.props.children;
  }
}

export default withRouter(ScrollTop);
