import React from "react";
import moment from "moment";
import { FormattedMessage } from "react-intl";
import _ from "lodash";

import { formatPrice, roundNumber, getUserName } from "helpers/common";
import { ThemeConsumer } from "constants/themes/theme-context";

import "./VacancyCard.scss";

interface IProps {
  campaignWizard: any;
  allContacts: any;
  isPartnerJobHolder: boolean;
  isPartnerJobContact: boolean;
  companyName?: string;
  sharedJobContact?: any;
  sharedJobHolder?: any;
}

const VacancyCard: React.StatelessComponent<IProps> = ({
  campaignWizard,
  allContacts,
  companyName,
  isPartnerJobHolder,
  isPartnerJobContact,
  sharedJobContact,
  sharedJobHolder
}) => {
  const jobHolder = sharedJobHolder
    ? sharedJobHolder
    : _.find(allContacts, ["id", +campaignWizard.jobHolder]);
  const jobContact = sharedJobContact
    ? sharedJobContact
    : _.find(allContacts, ["id", +campaignWizard.jobContact]);

  return (
    <ThemeConsumer>
      {theme => (
        <div className="vacancy-item card">
          <div className="card-left">
            <div className="card-left-row">
              <span className="card-text">
                <FormattedMessage id="VACANCY_TITLE" />
              </span>
              <span className="card-title job-position" style={{ color: theme.primary_color }}>
                {campaignWizard.jobTitle}
              </span>
            </div>
            <div className="card-left-row">
              <span className="card-text">
                {_.isEmpty(campaignWizard.campaignStatus) ? (
                  <FormattedMessage id="PROPOSAL_ID" />
                ) : (
                  <FormattedMessage id="CAMPAIGN_ID" />
                )}
              </span>
              <span className="card-title">{campaignWizard.id}</span>
            </div>

            <div className="card-left-row">
              <span className="card-text">
                <FormattedMessage id="START_DATE" />
              </span>
              <span className="card-title">
                {moment(campaignWizard.dateStart).format("DD-MM-YYYY")}
              </span>
            </div>
            <div className="card-left-row">
              <span className="card-text">
                <FormattedMessage id="END_DATE" />
              </span>
              <span className="card-title">
                {campaignWizard.dateEnd && moment(campaignWizard.dateEnd).format("DD-MM-YYYY")}
              </span>
            </div>
            <div className="card-left-row">
              <span className="card-text">
                <FormattedMessage id="JOB_HOLDER_HOLDER" />
              </span>
              <span className="card-title">
                {jobHolder && getUserName(jobHolder, isPartnerJobHolder && companyName)}
              </span>
            </div>
            <div className="card-left-row">
              <span className="card-text">
                <FormattedMessage id="CONTACT_PERSON" />
              </span>
              <span className="card-title">
                {jobContact && getUserName(jobContact, isPartnerJobContact && companyName)}
              </span>
            </div>
            <div className="card-left-row">
              <span className="card-text">
                <FormattedMessage id="JOB_APPLICATION_URL" />
              </span>
              {campaignWizard.jobApplicationUrl ? (
                <a
                  className="card-title job-url"
                  target="_blank"
                  href={`${/^https?:\/\//.test(campaignWizard.jobApplicationUrl) ? "" : "//"}${
                    campaignWizard.jobApplicationUrl
                  }`}
                >
                  {campaignWizard.jobApplicationUrl}
                </a>
              ) : (
                <span className="card-title" />
              )}
            </div>
            {campaignWizard.yourReference && (
              <div className="card-left-row">
                <span className="card-text">
                  <FormattedMessage id="YOUR_REFERENCE" />
                </span>
                <span className="card-title">{campaignWizard.yourReference}</span>
              </div>
            )}
          </div>
          <div className="card-right">
            <div className="card-right-row">
              <div className="card-item">
                <span className="card-title">{campaignWizard.clicks || 0}</span>
                <span className="card-text">
                  <FormattedMessage id="CAPITALIZE_CLICKS" />
                </span>
              </div>
              <div className="card-item">
                <span className="card-title">{campaignWizard.clicksCpc || 0}</span>
                <span className="card-text">
                  CPC <FormattedMessage id="CLICKS" />
                </span>
              </div>
              <div className="card-item">
                <span className="card-title">
                  {`${
                    campaignWizard.performance
                      ? roundNumber(campaignWizard.performance * 100, 0)
                      : 0
                  }%`}
                </span>
                <span className="card-text">
                  <FormattedMessage id="CAPITALIZE_PERFORMANCE" />
                </span>
              </div>
            </div>
            <div className="card-right-row">
              <div className="card-item">
                <span className="card-title">
                  {`${campaignWizard.ctr ? roundNumber(campaignWizard.ctr * 100, 0) : 0}%`}
                </span>
                <span className="card-text">CTR</span>
              </div>
              <div className="card-item">
                <span className="card-title">
                  {campaignWizard.dateEnd
                    ? moment(campaignWizard.dateEnd).diff(moment(), "days")
                    : "-"}
                </span>
                <span className="card-text">
                  <FormattedMessage id="CAPITALIZE_DAYS_LEFT" />
                </span>
              </div>
              <div className="card-item">
                <span className="card-title">
                  €{formatPrice(campaignWizard.partnerPrice || campaignWizard.targetPrice || 0)}
                </span>
                <span className="card-text">
                  <FormattedMessage id="CAMPAIGN_COSTS" />
                </span>
              </div>
            </div>
          </div>
        </div>
      )}
    </ThemeConsumer>
  );
};

export default VacancyCard;
