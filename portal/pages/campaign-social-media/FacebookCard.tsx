import React from "react";
import { FormattedMessage } from "react-intl";
import classnames from "classnames";

import { ThumbUp, Comment, Replay } from "components/icons";

import "./FacebookCard.scss";
import "../../styles/global.scss";

interface IProps {
  companyName: string;
  jobTitle: string;
  selectedTab: number;
  onClick: (index: number) => void;
  isTourOpen?: boolean;
}

const tabs = ["Advertentie 1", "Advertentie 2", "Advertentie 3"];

const FacebookCard: React.StatelessComponent<IProps> = props => {
  const { selectedTab, onClick, jobTitle = "", companyName = "", isTourOpen } = props;
  const scrollClass = isTourOpen ? "tour-scroll" : "";

  return (
    <div className={classnames("facebook", scrollClass)}>
      <h3>
        <FormattedMessage id="YOUR_FACEBOOK_ADS" />
      </h3>
      <ul>
        {tabs.map((tabName, index) => (
          <li
            key={tabName}
            onClick={() => onClick(index)}
            className={selectedTab === index ? "active" : ""}
          >
            {tabName}
          </li>
        ))}
      </ul>
      <div className="facebook-header">
        <span>
          <img src="/assets/images/logos/facebook-icon.png" />
        </span>
      </div>
      <div className="facebook-content">
        <div className="outside-div">
          <div className="line-1" style={{ width: 112 }} />
          <div className="line-2" style={{ width: 89 }} />
          <div className="line-2" style={{ width: 52 }} />
          <div className="line-2" style={{ width: 72 }} />

          <div className="line-2" style={{ width: 0 }} />

          <div className="line-1" style={{ width: 72 }} />
          <div className="line-2" style={{ width: 89 }} />
          <div className="line-2" style={{ width: 52 }} />
          <div className="line-2" style={{ width: 72 }} />
          <div className="line-2" style={{ width: 52 }} />
          <div className="line-2" style={{ width: 72 }} />
        </div>
        <div className="facebook-post">
          <div className="facebook-post-header">
            <div className="author-image" />
            <div>
              <div className="line-3" style={{ width: 112 }} />
              <div className="line-3" style={{ width: 72 }} />
            </div>
          </div>
          <h4>
            <FormattedMessage id="JOIN_OUR_TEAM" values={{ jobTitle }} />
          </h4>
          <img src="/assets/images/facebook-post.jpg" />
          <div className="post-title">
            <FormattedMessage id="JOB_OFFER" values={{ jobTitle }} />
          </div>
          <h4>
            <FormattedMessage id="WHY_IT_SUITS" values={{ companyName }} />
          </h4>
          <div className="post-footer">
            <div className="line-3" style={{ width: 50 }} />
            <div className="line-3" style={{ width: 50 }} />
          </div>
          <div className="post-footer border">
            <ThumbUp className="post-btn" />
            <div className="line-3" style={{ width: 32 }} />
            <Comment className="post-btn" />
            <div className="line-3" style={{ width: 32 }} />
            <Replay className="post-btn" />
            <div className="line-3" style={{ width: 32 }} />
          </div>
        </div>
        <div className="outside-div" />
      </div>
    </div>
  );
};

export default FacebookCard;
