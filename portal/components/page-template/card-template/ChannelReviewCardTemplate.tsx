import React from "react";
import classnames from "classnames";

import Line from "../content-line";
import { ThemeConsumer } from "constants/themes/theme-context";

import "./CardTemplate.scss";

interface IProps {
  className?: string;
  total?: boolean;
}

const ChannelReviewCardTemplate: React.StatelessComponent<IProps> = ({ className = "", total }) => {
  const reviewCard = [
    { length: 60, price: 10 },
    { length: 40, price: 12 },
    { length: 50, price: 8 },
    { length: 30, price: 10 }
  ];

  return (
    <ThemeConsumer>
      {theme => (
        <div
          className={classnames("channel-review-card", "template-card", className)}
          style={{ backgroundColor: total ? theme.secondary_color : "#fff" }}
        >
          <div className="template-label">
            <Line width="45%" />
          </div>

          <div className="template-content">
            {reviewCard.map((item, index) => (
              <div className="channel-row" key={`channel-${index}`}>
                <Line width={`${item.length}%`} />
                <Line width={`${item.price}%`} />
              </div>
            ))}
          </div>
        </div>
      )}
    </ThemeConsumer>
  );
};

export default ChannelReviewCardTemplate;
