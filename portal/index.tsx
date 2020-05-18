import "@babel/polyfill";

import React from "react";
import ReactDOM from "react-dom";
import en from "react-intl/locale-data/en";
import nl from "react-intl/locale-data/nl";
import { addLocaleData } from "react-intl";
import { ConnectedRouter } from "connected-react-router";
import { Provider } from "react-redux";
import smoothscroll from "smoothscroll-polyfill";

import App from "./pages/app/App";
import { store, history } from "./reduxStore";
import ScrollTop from "components/scroll-top";

import "react-toastify/dist/ReactToastify.min.css";

smoothscroll.polyfill();
addLocaleData(en);
addLocaleData(nl);

ReactDOM.render(
  <Provider store={store}>
    <ConnectedRouter history={history}>
      <ScrollTop>
        <App />
      </ScrollTop>
    </ConnectedRouter>
  </Provider>,
  document.getElementById("application")
);
