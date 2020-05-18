import React from "react";
import { FormattedMessage, injectIntl } from "react-intl";
import ReactHighmaps from "react-highcharts/ReactHighmaps";
import _ from "lodash";

import Tooltip from "components/tooltip";

import map from "../nl-all";
import { SCARCITY_TRANSLATION_IDS } from "constants/constants";

import "./ScarcityProvince.scss";

interface ScarcityProvinceProps {
  analysis: any;
  intl: any;
}

const getScarcityIndex = value => {
  let index = 0;

  if (value >= 3) {
    index = 3;
  } else if (value >= 2) {
    index = 2;
  } else if (value >= 1) {
    index = 1;
  }

  return index;
};

const ScarcityProvince: React.StatelessComponent<ScarcityProvinceProps> = props => {
  const {
    analysis,
    intl: { formatMessage }
  } = props;
  const data = analysis.reduce((acc, arr) => {
    const ratios: any = _.split(_.get(arr, `[0].ddRecruitmentFeasibility.ratio`, "1 : 1"), ":", 2);
    const scarcityRatio = ratios[0] / ratios[1];

    return _.concat(acc, [[_.toLower(arr[0].code), getScarcityIndex(scarcityRatio)]]);
  }, []);

  return (
    <div id="scarcity-province" className="card">
      <div className="label">
        <FormattedMessage id="SCARCITY_PER_PROVINCE" />
        <Tooltip id="SCARCITY_PER_PROVINCE_INFO" />
      </div>
      <div className="scarcity-province-graph">
        <ReactHighmaps
          config={{
            chart: {
              map,
              height: 500
            },
            title: {
              text: null
            },
            subtitle: {
              text: null
            },
            mapNavigation: {
              enabled: false,
              buttonOptions: {
                verticalAlign: "bottom"
              }
            },
            legend: {
              symbolWidth: 300
            },
            colorAxis: {
              min: 0,
              max: 3,
              minColor: "#e9eef2",
              maxColor: "#3a893d",
              labels: {
                style: { textOverflow: "none", whiteSpace: "nowrap" },
                step: 2,
                formatter() {
                  return (
                    SCARCITY_TRANSLATION_IDS[this.value] &&
                    formatMessage({
                      id: SCARCITY_TRANSLATION_IDS[this.value]
                    })
                  );
                }
              }
            },
            tooltip: {
              formatter() {
                return `${this.point.name}: ${formatMessage({
                  id: SCARCITY_TRANSLATION_IDS[this.point.value]
                })}`;
              }
            },
            series: [
              {
                data,
                dataLabels: {
                  enabled: true,
                  format: "{point.name}"
                }
              }
            ]
          }}
        />
      </div>
    </div>
  );
};

export default injectIntl(ScarcityProvince);
