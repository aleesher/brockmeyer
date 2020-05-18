import React from "react";
import { FormattedMessage, injectIntl } from "react-intl";
import ReactHighcharts from "react-highcharts";
import HighchartsMore from "highcharts-more";
import _ from "lodash";

import Tooltip from "components/tooltip";

import { SCARCITY_TRANSLATION_IDS, TARGET_AUDIENCE_TRANSLATION_IDS } from "constants/constants";

import "./RecruitmentPressure.scss";

HighchartsMore(ReactHighcharts.Highcharts);

const ACTIVELY_LOOKING = "ik ben actief op zoek naar een (nieuwe) baan";
const LATENT_LOOKING =
  "ik ben niet op zoek naar een nieuwe baan, maar ik houd de arbeidsmarkt wel in de gaten";

interface IProps {
  intl: any;
  analysis: any;
}

const getScarcityText = (value, formatMessage) => {
  let index = 0;

  if (value >= 3) {
    index = 3;
  } else if (value >= 2) {
    index = 2;
  } else if (value >= 1) {
    index = 1;
  }

  return formatMessage({ id: SCARCITY_TRANSLATION_IDS[index] });
};

const getTargetAudienceText = (value, formatMessage) => {
  let index = 0;

  if (value >= 30 && value < 55) {
    index = 1;
  } else if (value >= 55 && value < 70) {
    index = 2;
  } else if (value >= 70 && value < 90) {
    index = 3;
  } else if (value >= 90) {
    index = 4;
  }

  return formatMessage({ id: TARGET_AUDIENCE_TRANSLATION_IDS[index] });
};

const recalculateX = value => (value > 60 ? ((value - 60) * 5) / 4 + 50 : (value * 50) / 60);
const recalculateY = value => (value > 2.5 ? ((value - 5) * 2) / 2.5 + 5 : (value * 2.5) / 2);

const RecruitmentPressure: React.StatelessComponent<IProps> = props => {
  const {
    intl: { formatMessage },
    analysis
  } = props;
  const isThereSelected = _.every(analysis, arr => !_.get(arr, "[0].selected"));
  const analysisData = analysis.reduce((acc, arr) => {
    if (!isThereSelected && !_.get(arr, "[0].selected")) {
      return acc;
    }

    const newActivelyLooking = _.get(
      arr,
      `[0].ddOrientationActivityCat[${ACTIVELY_LOOKING}].value`,
      0
    );
    const newLatentLooking = _.get(arr, `[0].ddOrientationActivityCat[${LATENT_LOOKING}].value`, 0);
    const ratios: any = _.split(_.get(arr, `[0].ddRecruitmentFeasibility.ratio`, "1 : 1"), ":", 2);
    const scarcityRatio = ratios[0] / ratios[1];

    return acc.concat({
      name: _.replace(_.startCase(_.get(arr, "[0].name", "")), " ", "-"),
      x: (newActivelyLooking + newLatentLooking) * 100,
      y: scarcityRatio > 5 ? 5 : scarcityRatio
    });
  }, []);
  const averageX = _.round(
    _.reduce(analysisData, (sum, value) => sum + value.x, 0) / analysisData.length,
    2
  );
  const averageY = _.round(
    _.reduce(analysisData, (sum, value) => sum + value.y, 0) / analysisData.length,
    2
  );
  const average = {
    name: formatMessage({ id: "AVERAGE" }),
    data: [
      {
        scarcity: getScarcityText(averageY, formatMessage),
        audience: getTargetAudienceText(averageX, formatMessage),
        x: _.round(recalculateX(averageX), 2),
        y: _.round(recalculateY(averageY), 2)
      }
    ]
  };
  const series = !isThereSelected
    ? _.reduce(
        analysisData,
        (result: any, value) => {
          result.push({
            name: value.name,
            visible: false,
            data: [
              {
                scarcity: getScarcityText(value.y, formatMessage),
                audience: getTargetAudienceText(_.round(value.x, 2), formatMessage),
                x: _.round(recalculateX(value.x), 2),
                y: _.round(recalculateY(value.y), 2)
              }
            ]
          });
          return result;
        },
        [average]
      )
    : [average];

  const config = {
    chart: {
      type: "bubble"
    },
    title: {
      text: null
    },
    legend: {
      enabled: true
    },
    xAxis: {
      tickWidth: 0,
      gridLineWidth: 0,
      reversed: true,
      title: {
        text: formatMessage({ id: "BUBBLE_X_TEXT" }),
        offset: 8
      },
      labels: {
        formatter() {
          if (this.value === 0) {
            return formatMessage({ id: "TARGET_SMALL" });
          } else if (this.value === 100) {
            return formatMessage({ id: "TARGET_LARGE" });
          }
          return null;
        }
      },
      min: -2.5,
      max: 102.5,
      plotLines: [
        {
          color: "black",
          dashStyle: "dot",
          width: 2,
          value: 50,
          zIndex: 3
        },
        {
          color: "#ccd6eb",
          width: 1,
          value: -2.5,
          zIndex: 3
        }
      ]
    },
    yAxis: {
      lineWidth: 1,
      gridLineWidth: 0,
      reversed: false,
      title: {
        text: formatMessage({ id: "BUBBLE_Y_TEXT" }),
        offset: 8
      },
      labels: {
        formatter() {
          if (this.value < 1) {
            return formatMessage({ id: "NOT_SCARCE" });
          } else if (this.value > 4) {
            return formatMessage({ id: "VERY_SCARCE" });
          }
          return null;
        }
      },
      min: 0,
      max: 5,
      tickPositions: [-0.28, 5.28],
      plotLines: [
        {
          color: "black",
          dashStyle: "dot",
          width: 2,
          value: 2.5,
          zIndex: 3
        },
        {
          color: "#ccd6eb",
          width: 1,
          value: 5.28,
          zIndex: 3
        },
        {
          color: "#ccd6eb",
          width: 0,
          value: 0.95,
          label: {
            text: formatMessage({ id: "BUBBLE_LABEL_1" }),
            style: {
              color: "green",
              fontSize: 16,
              fontWeight: "bold"
            },
            x: 77
          },
          zIndex: 1
        },
        {
          color: "#ccd6eb",
          width: 0,
          value: 0.95,
          label: {
            align: "right",
            text: formatMessage({ id: "BUBBLE_LABEL_2" }),
            style: {
              color: "orange",
              fontSize: 16,
              fontWeight: "bold"
            },
            x: -62.5
          },
          zIndex: 1
        },
        {
          color: "#ccd6eb",
          width: 0,
          value: 3.7,
          label: {
            align: "right",
            text: formatMessage({ id: "BUBBLE_LABEL_3" }),
            style: {
              color: "red",
              fontSize: 16,
              fontWeight: "bold"
            },
            x: -58
          },
          zIndex: 1
        },
        {
          color: "#ccd6eb",
          width: 0,
          value: 3.7,
          label: {
            text: formatMessage({ id: "BUBBLE_LABEL_4" }),
            style: {
              color: "orange",
              fontSize: 16,
              fontWeight: "bold"
            },
            x: 52.5
          },
          zIndex: 1
        }
      ]
    },
    tooltip: {
      useHTML: true,
      headerFormat: "<table>",
      pointFormat:
        `<tr><th>${formatMessage({ id: "RECRUITMENT_PRESSURE_TEXT_1" })}</td></tr>` +
        `<tr><th>${formatMessage({
          id: "RECRUITMENT_PRESSURE_TEXT_2"
        })}: </th><td>{point.scarcity}</td></tr>` +
        `<tr><th>${formatMessage({
          id: "RECRUITMENT_PRESSURE_TEXT_3"
        })}: </th><td>{point.audience}</td></tr>`,
      footerFormat: "</table>",
      followPointer: true
    },
    plotOptions: {
      series: {
        dataLabels: {
          enabled: false,
          format: "{point.name}"
        }
      },
      bubble: {
        maxSize: 40
      }
    },
    series
  };

  return (
    <div id="recruitment-pressure" className="card">
      <div className="label">
        <FormattedMessage id="RECRUITMENT_PRESSURE" />
        <Tooltip id="RECRUITMENT_PRESSURE_INFO" />
      </div>
      <div className="recruitment-pressure-graph">
        <ReactHighcharts config={config} />
      </div>
    </div>
  );
};

export default injectIntl(RecruitmentPressure);
