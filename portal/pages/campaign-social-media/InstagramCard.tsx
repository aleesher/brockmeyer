import React from "react";

import {
  CameraAlt,
  Favorite,
  Home,
  IndeterminateCheckBox,
  MoreVert,
  Person,
  Search,
  Send
} from "components/icons";

import "./InstagramCard.scss";

const Instagram: React.StatelessComponent = () => {
  return (
    <div className="instagram">
      <h3>Uw instagram advertenties</h3>
      <ul>
        <li>Advertentie 1</li>
      </ul>
      <div className="instagram-header">
        <img src="/assets/images/logos/instagram-text-logo.png" />
      </div>
      <div className="instagram-content">
        <div className="instagram-post">
          <div className="instagram-post-header">
            <CameraAlt />
            <img className="logo" src="/assets/images/logos/instagram-text-logo.png" />
            <Send />
          </div>
          <div className="menu">
            <MoreVert />
          </div>
          <img className="picture" src="/assets/images/instagram-post.png" />
          <div className="buttons">
            <img src="/assets/images/heart.svg" />
            <img src="/assets/images/comment.svg" className="flip" />
            <img src="/assets/images/send.svg" />
            <img src="/assets/images/bookmark.svg" />
          </div>
          <div className="descriptions">7 vind-ik-leuks</div>
          <div className="post-footer border">
            <Home />
            <Search className="active" />
            <IndeterminateCheckBox />
            <Favorite />
            <Person />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Instagram;
