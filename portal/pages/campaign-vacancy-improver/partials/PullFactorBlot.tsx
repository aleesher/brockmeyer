import { Quill } from "react-quill";
import _ from "lodash";

import {
  PULLFACTOR_SCORE as SCORE,
  PULLFACTOR_ATTRIBUTES as ATTRIBUTES
} from "constants/constants";

const Inline = Quill.import("blots/inline");

class PullFactorBlot extends Inline {
  static create(value) {
    const node = super.create(value);
    if (value && value["data-pullfactor-score"] * 1 > 0) {
      value.class && node.setAttribute("class", value.class);
      value["data-pullfactor-name"] &&
        node.setAttribute(
          "data-pullfactor-name",
          _.upperFirst(_.lowerCase(value["data-pullfactor-name"]))
        );
      node.setAttribute("data-pullfactor-score", SCORE.nl[value["data-pullfactor-score"]].name);
      node.setAttribute("data-color", SCORE.nl[value["data-pullfactor-score"]].color);
    }
    return node;
  }

  static value(node) {
    return {
      "data-pullfactor-name": node.getAttribute("data-pullfactor-name"),
      "data-pullfactor-score": node.getAttribute("data-pullfactor-score"),
      "data-color": node.getAttribute("data-color"),
      class: node.getAttribute("class")
    };
  }

  static formats(domNode) {
    return ATTRIBUTES.reduce((formats, attribute) => {
      if (domNode.hasAttribute(attribute)) {
        formats[attribute] = domNode.getAttribute(attribute);
      }
      return formats;
    }, {});
  }

  format(name, value) {
    if (ATTRIBUTES.indexOf(name) > -1) {
      if (value) {
        this.domNode.setAttribute(name, value);
      } else {
        this.domNode.removeAttribute(name);
      }
    } else {
      super.format(name, value);
    }
  }
}

export default PullFactorBlot;
