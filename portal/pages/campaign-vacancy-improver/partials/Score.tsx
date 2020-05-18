import React from "react";
import _ from "lodash";
import classnames from "classnames";
import { FormattedMessage } from "react-intl";
import ReactHighcharts from "react-highcharts";
import HighchartsMore from "highcharts-more";
import SolidGauge from "highcharts/modules/solid-gauge";

import { CheckCircle, Error, Cancel } from "components/icons";
import { VACANCY_SCORE_LEVELS } from "constants/constants";

import "./Score.scss";

HighchartsMore(ReactHighcharts.Highcharts);
(SolidGauge as any)(ReactHighcharts.Highcharts);

interface IProps {
  vacancyResult: any;
}

const Score: React.StatelessComponent<IProps> = ({ vacancyResult }) => {
  const score = Number(vacancyResult.score_percentage.replace("%", "")) || 0;
  const scoreLabel = _.result(
    VACANCY_SCORE_LEVELS.find(item => score >= item.from && score < item.to),
    "text",
    ""
  );

  return (
    <>
      <FormattedMessage id="SCORE" tagName="h2" />
      <div className="score-chart-container">
        <ReactHighcharts config={getScoreConfig(score)} />
        <span className="score-chart-label">
          <FormattedMessage id={scoreLabel} />
        </span>
      </div>
      <p className="sub-header description">
        <FormattedMessage id="VACANCY_IMPROVER_SCORE" />
      </p>
      {Object.keys(vacancyResult.pull_factors).map((key, index, arr) => {
        const { status, name, importance } = vacancyResult.pull_factors[key];
        const color = status === 1 ? "#59b55c" : status === 2 ? "#0b6b99" : "#992f2f";

        return (
          status !== 0 && (
            <span
              className={classnames("sub-header score", { last: arr.length === index + 1 })}
              key={key}
            >
              <div className="score-chart-container">
                <ReactHighcharts config={getImportanceConfig(importance, color)} />
              </div>
              {status === 1 ? (
                <CheckCircle className="icon check" />
              ) : status === 2 ? (
                <Error className="icon error" />
              ) : (
                <Cancel className="icon cancel" />
              )}
              <span className="number">{index + 1}</span>
              {_.upperFirst(_.lowerCase(name))}
            </span>
          )
        );
      })}
    </>
  );
};

const getScoreConfig = value => ({
  chart: {
    type: "solidgauge",
    height: 100,
    width: 100
  },
  title: null,
  tooltip: {
    enabled: false
  },
  pane: {
    center: ["50%", "50%"],
    size: "62px",
    startAngle: 0,
    endAngle: 360,
    background: {
      backgroundColor: "#dbdbdb",
      innerRadius: "75%",
      outerRadius: "100%",
      borderWidth: 0
    }
  },
  yAxis: {
    min: 0,
    max: 100,
    labels: {
      enabled: false
    },
    lineWidth: 0,
    minorTickInterval: null,
    tickWidth: 0,
    stops: [[1, "#59B55C"]]
  },
  plotOptions: {
    solidgauge: {
      innerRadius: "75%",
      dataLabels: {
        borderWidth: 0,
        y: -22,
        style: {
          color: "#002335",
          fontSize: "24px"
        }
      }
    }
  },
  series: [
    {
      data: [value]
    }
  ],
  credits: {
    enabled: false
  }
});

const getImportanceConfig = (value, color) => ({
  chart: {
    type: "solidgauge",
    height: 50,
    width: 50
  },
  title: null,
  tooltip: {
    enabled: false
  },
  pane: {
    background: {
      backgroundColor: "#FFFFFF",
      innerRadius: "75%",
      outerRadius: "110%",
      borderWidth: 2
    }
  },
  yAxis: {
    min: 0,
    max: 1,
    labels: {
      enabled: false
    },
    title: {
      text: null
    },
    lineWidth: 0,
    minorTickInterval: null,
    tickWidth: 0,
    stops: [[1, color]]
  },
  plotOptions: {
    solidgauge: {
      innerRadius: "75%",
      dataLabels: {
        enabled: false
      }
    }
  },
  series: [
    {
      data: [value]
    }
  ],
  credits: {
    enabled: false
  }
});

export default Score;
