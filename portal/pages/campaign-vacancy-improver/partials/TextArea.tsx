import React from "react";
import classnames from "classnames";
import ReactQuill, { Quill } from "react-quill";
import { FormattedMessage } from "react-intl";
import _ from "lodash";

import { editorToolbar } from "constants/constants";
import PullFactorBlot from "./PullFactorBlot";

import "./TextArea.scss";

interface IProps {
  input: any;
  isNetherlands: boolean;
  currentUser: any;
}

class TextArea extends React.Component<IProps, any> {
  constructor(props) {
    super(props);
  }

  componentDidMount() {
    PullFactorBlot.blotName = "Span";
    Quill.register(PullFactorBlot, true);
  }

  private onChange = (newValue, _, source) => {
    const { input } = this.props;
    if (source === "user") {
      input.onChange(newValue);
    }
  };

  render() {
    const { input, isNetherlands } = this.props;
    const wordsNumber = _.words(input.value).length;

    return (
      <div className={classnames("text-area", { "not-dutch": !isNetherlands })}>
        <div className="tabs">
          <div className="number-of-words">
            <FormattedMessage id="NUMBER_OF_WORDS" /> {wordsNumber}
          </div>
        </div>
        <ReactQuill
          {...input}
          className="quill-editable-area"
          modules={editorToolbar(true)}
          onChange={(newValue, _, source) => this.onChange(newValue, _, source)}
          onBlur={(_, __, quill) => input.onBlur(quill.getHTML())}
        />
      </div>
    );
  }
}

export default TextArea;
