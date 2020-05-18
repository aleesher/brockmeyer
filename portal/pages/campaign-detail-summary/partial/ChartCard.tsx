import React from "react";
import moment from "moment";
import _ from "lodash";
import { Line } from "react-chartjs-2";
import { FormattedMessage } from "react-intl";

import "./ChartCard.scss";

interface IProps {
  campaignWizard: any;
}

const options = {
  legend: {
    display: false
  },
  scales: {
    yAxes: [{ ticks: { min: 0 } }],
    xAxes: [{ gridLines: { display: true }, ticks: { display: true } }]
  }
};

const graphData = (labels, orangeLabel, orangeData, greenLabel, greenData) => ({
  labels,
  datasets: [
    {
      label: orangeLabel,
      lineTension: 0.1,
      borderColor: "#FF9D1B",
      backgroundColor: "rgba(0, 0, 0, 0)",
      pointRadius: 1,
      data: orangeData
    },
    {
      label: greenLabel,
      lineTension: 0.1,
      borderColor: "#59B55C",
      backgroundColor: "rgba(0, 0, 0, 0)",
      pointRadius: 1,
      data: greenData
    }
  ]
});

const getClicksPerDate = (diff, dateStart, clicksPerDate) => {
  if (!clicksPerDate) {
    return [];
  }
  const clickPerDate = JSON.parse(clicksPerDate);
  const { d: clicksGreen } = _.range(diff).reduce(
    ({ d, c }, day) => {
      const date = moment(dateStart)
        .add(day, "days")
        .format("YYYY-MM-DD");
      const newCount = clickPerDate[date] ? clickPerDate[date] + c : c;
      return { d: d.concat(newCount), c: newCount };
    },
    { d: [], c: 0 }
  );

  return clicksGreen;
};

const ChartCard: React.StatelessComponent<IProps> = ({ campaignWizard }) => {
  const {
    dateEnd,
    dateStart,
    clicksExpected,
    clicksCpcExpected,
    clicksCpc,
    clicksPerDate
  } = campaignWizard;

  const diff = (dateEnd ? moment(dateEnd) : moment()).diff(moment(dateStart), "days") + 1;
  const perDateDiff =
    (dateEnd && moment(dateEnd).isSame(moment().format("YYYY-MM-DD"))
      ? diff
      : moment().diff(moment(dateStart), "days")) + 1;

  const clicksOrange = [{ x: 0, y: 0 }, { x: dateEnd, y: clicksExpected }];
  const clicksGreen = getClicksPerDate(perDateDiff, dateStart, clicksPerDate);

  const clicksCpcOrange = [{ x: 0, y: 0 }, { x: dateEnd, y: clicksCpcExpected }];
  const clicksCpcGreen = [{ x: 0, y: 0 }, { x: dateEnd, y: clicksCpc }];

  const labels = _.range(diff).map(d =>
    moment(dateStart)
      .add(d, "days")
      .format("YYYY-MM-DD")
  );

  const graphs = [
    {
      title: "Clicks",
      data: graphData(labels, "Click expected", clicksOrange, "Click per date", clicksGreen)
    },
    {
      title: "CPC clicks",
      data: graphData(labels, "ClickCpc expected", clicksCpcOrange, "ClickCpc", clicksCpcGreen)
    }
  ];

  return (
    <div className="chart-item card">
      {graphs.map(graph => (
        <div key={graph.title} className="chart-card">
          <div className="card-caption">
            <span className="title">{graph.title}</span>
            <div className="chart-mark">
              <div className="chart-line-row">
                <div className="chart-line yellow" />
                <span className="chart-line-title">
                  <FormattedMessage id="EXPECTATION" />
                </span>
              </div>
              <div className="chart-line-row">
                <div className="chart-line green" />
                <span className="chart-line-title">
                  <FormattedMessage id="REALIZED" />
                </span>
              </div>
            </div>
          </div>
          <Line data={graph.data} options={options} />
        </div>
      ))}
    </div>
  );
};

export default ChartCard;
