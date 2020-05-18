import React from "react";
import { FormattedMessage, injectIntl } from "react-intl";
import ReactHighcharts from "react-highcharts";
import _ from "lodash";

import Tooltip from "components/tooltip";

import "./LaborMarketActivity.scss";

const NOT_LOOKING = "ik ben helemaal niet op zoek naar een (nieuwe) baan";
const ACTIVELY_LOOKING = "ik ben actief op zoek naar een (nieuwe) baan";
const LATENT_LOOKING =
  "ik ben niet op zoek naar een nieuwe baan, maar ik houd de arbeidsmarkt wel in de gaten";

interface IProps {
  intl: any;
  analysis: any;
}

const LaborMarketActivity: React.StatelessComponent<IProps> = props => {
  const {
    intl: { formatMessage },
    analysis
  } = props;
  const isThereSelected = _.every(analysis, arr => !_.get(arr, "[0].selected"));
  const analysisData = analysis.reduce(
    (acc, arr) => {
      if (!isThereSelected && !_.get(arr, "[0].selected")) {
        return acc;
      }

      const newNotLooking = _.get(arr, `[0].ddOrientationActivityCat[${NOT_LOOKING}].value`, 0);
      const newActivelyLooking = _.get(
        arr,
        `[0].ddOrientationActivityCat[${ACTIVELY_LOOKING}].value`,
        0
      );
      const newLatentLooking = _.get(
        arr,
        `[0].ddOrientationActivityCat[${LATENT_LOOKING}].value`,
        0
      );

      return {
        notLooking: acc.notLooking + newNotLooking,
        activelyLooking: acc.activelyLooking + newActivelyLooking,
        latentLooking: acc.latentLooking + newLatentLooking
      };
    },
    { notLooking: 0, activelyLooking: 0, latentLooking: 0 }
  );

  const data = [
    [formatMessage({ id: "LATENT_LOOKING" }), analysisData.latentLooking],
    [formatMessage({ id: "NOT_LOOKING" }), analysisData.notLooking],
    [formatMessage({ id: "ACTIVELY_LOOKING" }), analysisData.activelyLooking]
  ];

  const config = {
    chart: {
      plotBackgroundColor: null,
      plotBorderWidth: null,
      plotShadow: false,
      type: "pie"
    },
    title: {
      text: null
    },
    tooltip: {
      pointFormat: "Value: <b>{point.percentage:.1f}%</b>"
    },
    colors: ["#f5ca23", "#88949a", "#59b55c"],
    plotOptions: {
      pie: {
        allowPointSelect: true,
        cursor: "pointer",
        dataLabels: {
          enabled: true,
          format: "<b>{point.name}</b>: {point.percentage:.1f} %"
        }
      }
    },
    series: [
      {
        data
      }
    ]
  };

  return (
    <div id="labor-market-activity" className="card">
      <div className="label">
        <FormattedMessage id="LABOR_MARKET_ACTIVITY" />
        <Tooltip id="LABOR_MARKET_ACTIVITY_INFO" />
      </div>
      <div className="labor-market-activity-graph">
        <ReactHighcharts config={config} />
      </div>
    </div>
  );
};

export default injectIntl(LaborMarketActivity);
