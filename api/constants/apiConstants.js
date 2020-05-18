const CAMPAIGN_STATUS = {
  52: { name: "order_cancelled" },
  54: { name: "order_suspend" },
  56: { name: "order_open" },
  58: { name: "order_on_hold" },
  60: { name: "order_new" },
  62: { name: "order_publish" },
  64: { name: "order_online" },
  66: { name: "order_retract" },
  68: { name: "order_offline" }
};

const CAMPAIGN_SORT = {
  DATE_END_ASC: "date_end_asc",
  DATE_END_DESC: "date_end_desc",
  DATE_START_ASC: "date_start_asc",
  DATE_START_DESC: "date_start_desc"
};

const CHANNEL_SORT = {
  A_Z: "name_asc",
  Z_A: "name_desc",
  RANKING: "ranking_desc"
};

const NETHERLANDS_PROVINCE = [
  { id: "109", value: "all" },
  { id: "66", value: "drenthe", code: "NL-DR" },
  { id: "70", value: "flevoland", code: "NL-FL" },
  { id: "5", value: "friesland", code: "NL-FR" },
  { id: "80", value: "gelderland", code: "NL-GE" },
  { id: "68", value: "groningen", code: "NL-GR" },
  { id: "3", value: "limburg", code: "NL-LI" },
  { id: "78", value: "noord-brabant", code: "NL-NB" },
  { id: "72", value: "noord-holland", code: "NL-NH" },
  { id: "82", value: "overijssel", code: "NL-OV" },
  { id: "94", value: "utrecht", code: "NL-UT" },
  { id: "76", value: "zeeland", code: "NL-ZE" },
  { id: "74", value: "zuid-holland", code: "NL-ZH" }
];

module.exports = {
  campaignStatus: CAMPAIGN_STATUS,
  campaignSort: CAMPAIGN_SORT,
  channelSort: CHANNEL_SORT,
  netherlandsProvince: NETHERLANDS_PROVINCE
};
