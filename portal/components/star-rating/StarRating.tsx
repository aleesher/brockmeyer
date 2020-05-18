import React from "react";

import { Star, StarHalf, StarBorder } from "components/icons";

import "./StarRating.scss";

const DEFAULT_STAR_COUNT = 5;

interface IProps {
  starCount?: number;
  valueInPercent: number;
}

const StarRating: React.StatelessComponent<IProps> = props => {
  const { starCount: maxValue = DEFAULT_STAR_COUNT, valueInPercent } = props;

  if (!valueInPercent) {
    return null;
  }

  const value = (maxValue * valueInPercent) / 100;
  const stars = Math.floor(value);
  const starHalf = value % 1 > 0;
  const starBorders = Math.floor(maxValue - value);

  return (
    <div className="star-rating">
      {Array(stars)
        .fill(0)
        .map((x, i) => <Star className="star" key={i} />)}
      {starHalf && <StarHalf className="star" />}
      {Array(starBorders)
        .fill(0)
        .map((x, i) => <StarBorder className="star" key={i} />)}
    </div>
  );
};

export default StarRating;
