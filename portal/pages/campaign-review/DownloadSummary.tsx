import React from "react";
import _ from "lodash";
import { Page, Text, View, Document, StyleSheet, PDFDownloadLink } from "@react-pdf/renderer";

import { formatPrice, getTotalClicks } from "helpers/common";

// Font.register({ family: "Raleway", fonts: [{ src: "/assets/fonts/Raleway-SemiBold.ttf" }] });
// Font.register({ family: "OpenSans", fonts: [{ src: "/assets/fonts/OpenSans/OpenSans-Bold.ttf" }] });

const styles = StyleSheet.create({
  body: {
    flexGrow: 1,
    padding: "20px 20px"
    // fontFamily: "Raleway"
  },
  campaignCardWrap: {
    flexDirection: "row",
    width: "100%",
    marginBottom: "40px",
    padding: "20px 20px"
  },
  itemTitleWrap: {
    width: "30%"
  },
  itemTitle: {
    fontSize: "16pt"
  },
  itemContent: {
    width: "70%"
  },
  contentList: {
    flexDirection: "row",
    justifyContent: "space-between"
  },
  listLeft: {
    flexDirection: "row",
    alignItems: "center"
  },
  leftTitle: {
    fontSize: "10pt"
  },
  subTitle: {
    fontSize: "10pt",
    color: "grey",
    marginTop: "8pt"
  },
  leftDescription: {
    fontSize: "8pt",
    color: "grey",
    marginLeft: "8pt"
  },
  rightText: {
    fontSize: "10pt"
  },
  divider: {
    backgroundColor: "grey",
    height: "1pt",
    marginTop: "8pt",
    marginBottom: "8pt"
  },
  downloadLink: {
    textDecoration: "none"
  }
});

const getTotalPrice = channels =>
  formatPrice(channels.reduce((total, { price }) => total + parseFloat(price), 0));

const MainCard = ({
  mainCardData: { companyName, jobTitle, id, statusID },
  theme,
  formatMessage
}) => (
  <View>
    <View style={styles.campaignCardWrap}>
      <View style={styles.itemTitleWrap}>
        <Text style={styles.itemTitle}>{formatMessage({ id: "YOUR_VACANCY" })}</Text>
      </View>
      <View style={styles.itemContent}>
        <View>
          <View style={styles.contentList}>
            <Text style={{ ...styles.itemTitle, color: theme.primary_color }}>{jobTitle}</Text>
          </View>
          <View style={styles.contentList}>
            <Text style={styles.subTitle}>
              {formatMessage({ id: "FOR" })} {companyName}
            </Text>
          </View>
        </View>
        <View>
          <View style={styles.contentList}>
            <Text style={styles.subTitle}>
              {statusID === "60"
                ? formatMessage({ id: "PROPOSAL_ID" })
                : formatMessage({ id: "CAMPAIGN_ID" })}
              : {id}
            </Text>
          </View>
        </View>
      </View>
    </View>
  </View>
);

const CampaignCard = ({ channelsCardData, theme, formatMessage }) => (
  <View>
    {channelsCardData.map(({ name, items, withoutInfo, index }) => {
      if (items) {
        return (
          <View style={styles.campaignCardWrap} key={`${name}${index}`}>
            <View style={styles.itemTitleWrap}>
              <Text style={styles.itemTitle}>{name}</Text>
            </View>
            <View style={styles.itemContent}>
              {items.length > 0 &&
                items.map(({ name, days, price, statistics }) => (
                  <View key={name}>
                    <View style={styles.contentList}>
                      <View style={styles.listLeft}>
                        <Text style={styles.leftTitle}>{name}</Text>
                        {!withoutInfo && (
                          <Text style={styles.leftDescription}>
                            {!_.isNil(days) ? `${days} ${formatMessage({ id: "DAYS" })}` : ""}
                            {!_.isNil(statistics.estimatedClicks)
                              ? !_.isNil(days)
                                ? ` - ${statistics.estimatedClicks} ${formatMessage({
                                    id: "EST_CLICKS"
                                  })}`
                                : `${statistics.estimatedClicks} ${formatMessage({
                                    id: "EST_CLICKS"
                                  })}`
                              : ""}
                          </Text>
                        )}
                      </View>
                      <View>
                        <Text style={{ ...styles.rightText, color: theme.primary_color }}>
                          €{price}
                        </Text>
                      </View>
                    </View>
                    <View style={styles.divider} />
                  </View>
                ))}
              <View>
                <View style={styles.contentList}>
                  <View style={styles.listLeft}>
                    <Text style={styles.leftTitle}>{formatMessage({ id: "TOTAL" })}</Text>
                    <Text style={styles.leftDescription}>
                      {getTotalClicks(items) !== 0
                        ? `${getTotalClicks(items)} ${formatMessage({ id: "EST_VIEWS" })}`
                        : ""}
                    </Text>
                  </View>
                  <View>
                    <Text style={{ ...styles.rightText, color: theme.primary_color }}>
                      €{getTotalPrice(items)}
                    </Text>
                  </View>
                </View>
              </View>
            </View>
          </View>
        );
      } else {
        return <View key={`${name}${index}`} />;
      }
    })}
  </View>
);

const TotalCard = ({
  data: { listPrice, partnerPrice, targetPrice, textColor },
  theme,
  formatMessage,
  customer
}) => (
  <View style={{ ...styles.campaignCardWrap, backgroundColor: theme.secondary_color }}>
    <View style={styles.itemTitleWrap}>
      <Text style={{ ...styles.itemTitle, color: textColor }}>
        {formatMessage({ id: "PRICING" })}
      </Text>
    </View>
    <View style={styles.itemContent}>
      <View>
        <View style={styles.contentList}>
          <View style={styles.listLeft}>
            <Text style={{ ...styles.leftTitle, color: textColor }}>
              {formatMessage({ id: "TOTAL_COSTS" })}
            </Text>
          </View>
          <View>
            <Text style={{ ...styles.rightText, color: textColor }}>€{formatPrice(listPrice)}</Text>
          </View>
        </View>
        <View style={{ ...styles.divider, backgroundColor: textColor }} />
      </View>
      <View>
        <View style={styles.contentList}>
          <View style={styles.listLeft}>
            <Text style={{ ...styles.leftTitle, color: textColor }}>
              {formatMessage({ id: "PURCHASE_ADVANTAGE" })}
            </Text>
            <Text style={{ ...styles.leftDescription, color: textColor }}>
              {formatMessage({ id: "SAVING_MESSAGE" })}
            </Text>
          </View>
          <View>
            <Text style={{ ...styles.rightText, color: textColor }}>
              €{formatPrice(listPrice - targetPrice)}
            </Text>
          </View>
        </View>
        <View style={{ ...styles.divider, backgroundColor: textColor }} />
      </View>
      {!customer && (
        <View>
          <View style={styles.contentList}>
            <View style={styles.listLeft}>
              <Text style={{ ...styles.leftTitle, color: textColor }}>
                {formatMessage({ id: "PARTNER_PRICE" })}
              </Text>
            </View>
            <View>
              <Text style={{ ...styles.rightText, color: textColor }}>
                €{formatPrice(targetPrice - partnerPrice)}
              </Text>
            </View>
          </View>
          <View style={{ ...styles.divider, backgroundColor: textColor }} />
        </View>
      )}
      <View>
        <View style={styles.contentList}>
          <View style={styles.listLeft}>
            <Text style={{ ...styles.leftTitle, color: textColor }}>
              {formatMessage({ id: "TOTAL" })}
            </Text>
            <Text style={{ ...styles.leftDescription, color: textColor }}>
              {formatMessage({ id: "EX_BTW" })}
            </Text>
          </View>
          <View>
            <Text style={{ ...styles.rightText, color: textColor }}>
              €{customer ? formatPrice(targetPrice) : formatPrice(partnerPrice || targetPrice)}
            </Text>
          </View>
        </View>
      </View>
    </View>
  </View>
);

const Content = ({
  mainCardData,
  channelsCardData,
  totalCardData,
  theme,
  formatMessage,
  text,
  // settings,
  customer = false
}) => {
  // const font = _.get(settings, "font", "Raleway");

  return (
    <PDFDownloadLink
      key={Math.random()}
      document={
        <Document>
          <Page size="A4">
            <View
              style={{
                ...styles.body
                // fontFamily: font
              }}
            >
              <MainCard mainCardData={mainCardData} theme={theme} formatMessage={formatMessage} />
              <CampaignCard
                channelsCardData={channelsCardData}
                theme={theme}
                formatMessage={formatMessage}
              />
              <TotalCard
                data={totalCardData}
                theme={theme}
                formatMessage={formatMessage}
                customer={customer}
              />
            </View>
          </Page>
        </Document>
      }
      fileName={formatMessage({ id: "SUMMARY" })}
      style={styles.downloadLink}
      className="pdf"
    >
      {({ loading }) => {
        return loading ? formatMessage({ id: "DATA_LOADING" }) : formatMessage({ id: text });
      }}
    </PDFDownloadLink>
  );
};

export default Content;
