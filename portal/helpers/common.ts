import _ from "lodash";

import { SOCIAL_MEDIA_ID, BANNERS_ID, ADD_ONS_ID, NETHERLANDS_PROVINCE } from "constants/constants";

export const hightligthTextHtml = (text: string, hightlight: string) => {
  if (!text || !hightlight) {
    return "";
  }
  const regExp = new RegExp(hightlight, "gi");
  // Dont panic, is an algorithm at the old way
  let match: RegExpExecArray | null = regExp.exec(text); // Exec gives next result each time is called
  let lastIndex = 0; // from which part of the string are we searching
  let newString = "";

  while (match) {
    newString += text.substring(lastIndex, match.index) + "<span>" + match + "</span>";
    lastIndex = match.index + hightlight.length; // Specify next index for next loop
    match = regExp.exec(text); // Get next result
  }

  // Copy the rest
  newString += text.substring(lastIndex, text.length);
  // Parse special HTML characters
  newString = newString.split(" ").join("&nbsp;");

  return newString;
};

export const cloneDeep = (o: any) => {
  return JSON.parse(JSON.stringify(o));
};

export const parseQuery = (query: string) =>
  _.chain(query || "")
    .replace("?", "")
    .split("&")
    .map(_.partial(_.split, "=", 2))
    .fromPairs()
    .value();

export const formatPrice = (price: number) => {
  return Number(price).toLocaleString("nl-NL", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  });
};

export const asyncForEach = async (array, callback) => {
  for (let index = 0; index < array.length; index++) {
    await callback(array[index], index, array);
  }
};

export const roundNumber = (number, toFixed = 2) =>
  parseFloat((Math.round(number * 100) / 100).toString()).toFixed(toFixed);

export const getUserName = (
  { firstName = "", infixSurname = "", surname = "" },
  additional?: any
) =>
  `${firstName || ""} ${infixSurname ? infixSurname + " " : ""}${surname || ""}${
    additional ? ` (${additional})` : ""
  }`;

export const selectedlItems = channel =>
  channel.channelType &&
  channel.channelType !== SOCIAL_MEDIA_ID &&
  channel.channelType !== BANNERS_ID &&
  channel.channelType !== ADD_ONS_ID;

export const socialItems = channel =>
  channel.channelType === SOCIAL_MEDIA_ID && channel.channelType !== BANNERS_ID;

export const bannerItems = channel =>
  channel.channelType !== SOCIAL_MEDIA_ID && channel.channelType === BANNERS_ID;

export const addOnsItems = channel => channel.channelType === ADD_ONS_ID;

export const otherItems = channel => !channel.channelType && !channel.duration;

export const filterAddons = channels => channels.filter(c => c.channelType !== ADD_ONS_ID);

export const sortContacts = contacts =>
  _.sortBy(contacts, [c => (c.firstName || "" + c.surname).toLowerCase()]);

export const redirect = history => (url: string, param?: number | string) => {
  const path = param ? `${url}/${param}` : url;
  history.push(path);
};

export const scrollTop = () => window.scrollTo(0, 0);

export const getAddOns = channel => channel.channelType === ADD_ONS_ID;

export const getStatusName = status => _.get(status, "name", "order_new");

export const hasMarketAnalysis = sharedCampaign =>
  !_.isEmpty(sharedCampaign.regions) &&
  _.every(sharedCampaign.regions, region => NETHERLANDS_PROVINCE.includes(region)) &&
  sharedCampaign.occupation;

export const getTotalClicks = channels => {
  let total = 0;
  channels.map(ch => {
    let add = _.get(ch, "statistics.estimatedClicks");
    if (add == null) {
      add = 0;
    } else {
      add = parseInt(add, 10);
    }
    total += add;
  });
  return total;
};

export const getTotalChannelaClicks = selected => {
  return selected.reduce((total, k) => total + k.statistics.estimatedClicks, 0);
};

export const getDownloadData = ({
  plainChannels,
  addOnsChannels,
  socialChannels,
  bannersChannels,
  otherChannels,
  formatMessage
}) => [
  {
    name: formatMessage({ id: "CHANNEL_TITLE" }),
    items: plainChannels && plainChannels.length > 0 && plainChannels
  },
  {
    name: formatMessage({ id: "ADD_ONS" }),
    items: addOnsChannels && addOnsChannels.length > 0 && addOnsChannels,
    withoutInfo: true
  },
  {
    name: formatMessage({ id: "SOCIAL_MEDIA" }),
    items: socialChannels && socialChannels.length > 0 && socialChannels
  },
  {
    name: formatMessage({ id: "BANNERS" }),
    items: bannersChannels && bannersChannels.length > 0 && bannersChannels
  },
  {
    name: formatMessage({ id: "OTHERS" }),
    items: otherChannels && otherChannels.length > 0 && otherChannels
  }
];

export const getTotalPrice = channels => {
  return formatPrice(channels.reduce((total, { price }) => total + parseFloat(price), 0));
};
