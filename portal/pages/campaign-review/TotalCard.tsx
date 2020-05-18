import React from "react";
import { FormattedMessage } from "react-intl";

import { formatPrice } from "helpers/common";
import { Info } from "components/icons";
import ChannelReviewCardTemplate from "../../components/page-template/card-template/ChannelReviewCardTemplate";

import "./TotalCard.scss";

interface IProps {
  listPrice: number;
  targetPrice: number;
  partnerPrice?: number;
  isLoading?: boolean;
  theme?: any;
  textColor: string;
}

const CampaignCard: React.StatelessComponent<IProps> = ({
  listPrice,
  targetPrice,
  partnerPrice,
  isLoading,
  theme,
  textColor
}) => {
  return isLoading ? (
    <ChannelReviewCardTemplate className="review-item total" total={true} />
  ) : (
    <div className="review-item total card" style={{ backgroundColor: theme.secondary_color }}>
      <div className="label">
        <h3 style={{ color: textColor }}>
          <FormattedMessage id="PRICING" />
        </h3>
      </div>
      <div className="content">
        <div className="item-row">
          <div className="left-content">
            <h2 style={{ color: textColor }}>
              <FormattedMessage id="TOTAL_COSTS" />
            </h2>
          </div>
          <div className="price" style={{ color: textColor }}>
            €{formatPrice(listPrice)}
          </div>
        </div>

        <div className="item-row">
          <div className="left-content">
            <h2 style={{ color: textColor }}>
              <FormattedMessage id="PURCHASE_ADVANTAGE" />
            </h2>
            <Info className="info-icon" />
            <div className="info-message">
              <FormattedMessage id="SAVING_MESSAGE" />
            </div>
          </div>
          <div className="price" style={{ color: textColor }}>
            €{formatPrice(listPrice - targetPrice)}
          </div>
        </div>

        {partnerPrice && (
          <div className="item-row partner-discount">
            <div className="left-content">
              <h2 style={{ color: textColor }}>
                <FormattedMessage id="PARTNER_PRICE" />
              </h2>
            </div>
            <div className="price" style={{ color: textColor }}>
              €{formatPrice(targetPrice - partnerPrice)}
            </div>
          </div>
        )}

        <div className="item-row">
          <div className="left-content">
            <h2 style={{ color: textColor }}>
              <FormattedMessage id="TOTAL" />
            </h2>
            <span
              style={{
                color: textColor
              }}
              className="views-text"
            >
              <FormattedMessage id="EX_BTW" />
            </span>
          </div>
          <div className="price" style={{ color: textColor }} id="target-price">
            €{formatPrice(partnerPrice || targetPrice)}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CampaignCard;
