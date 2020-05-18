const Router = require("express");
const axios = require("axios");
const _ = require("lodash");

const {
  errorTrap,
  take,
  makeArray,
  arrayToQS,
  isString,
  toCamelCase,
  makeNumber
} = require("./utils");
const { URI } = require("../constants/URIConstants");
const { PAGE_SIZE, opts } = require("../constants/config");
const { channelSort } = require("../constants/apiConstants");

const router = Router();

const strList = [
  "educations",
  "jobLevel",
  "jobProfiles",
  "regions",
  "sector",
  "jobCompetence",
  "contractType"
];

const toArray = str => str && str.split(",").map(id => parseInt(id, 10));

const toArray2 = makeArray(strList);
const toInt = makeNumber(["id", "channelId", "campaignId"]);

const convert = data =>
  take(data)
    .rename(_.camelCase)
    .reset(toArray2).result;

const convertChannels = data =>
  take(data)
    .rename(_.camelCase)
    .reset(toInt).result;

const toCamel = toCamelCase(["id"]);

const mapApiChannels = channel => ({
  id: parseInt(channel.channel_id || channel.id || channel.channel.id, 10),
  name: channel.name || channel.channel_name,
  description: channel.summary || "",
  logo: channel.logo || channel.channel_logo,
  days: channel.days_online,
  price: parseFloat(channel.list_price || 0),
  channelType: parseInt(channel.channel_type, 10),
  educations: toArray(channel.educations),
  sectors: toArray(channel.sectors),
  regions: toArray(channel.regions),
  addedToCampaign: channel.added_to_campaign === "Y",
  suggestionScore: parseFloat(channel.suggestion_score || null),
  quantity: channel.quantity || 0,
  statistics: {
    estimatedClicks: parseFloat(channel.clicks_expected),
    rating: parseFloat(channel.ranking),
    visitorsPerDay: _.values(JSON.parse(channel.clicks_daily_expected) || [])
  }
});

const fetchChannels = async (token, lang, search, filters, page, sort) => {
  let parameters = `${URI.CHANNELS_URI}/`;
  parameters = page
    ? `${parameters}?page_size=${PAGE_SIZE}&page_nr=${page}`
    : `${parameters}?page_size=2000000`;
  if (filters) {
    const filterParams = filters
      .map(filter => (isString(filter) ? JSON.parse(filter) : filter))
      .map(({ key, ids }) => `${key === "channelTypes" ? "channel_type" : key}=${ids.join(",")}`)
      .join("&");
    parameters = `${parameters}&${filterParams}`;
  }
  if (search) {
    parameters = `${parameters}&name=${encodeURIComponent(search.toLowerCase())}`;
  }

  switch (sort) {
    case channelSort.A_Z: {
      parameters = `${parameters}&sort=name`;
      break;
    }
    case channelSort.Z_A: {
      parameters = `${parameters}&sort=-name`;
      break;
    }
    case channelSort.RANKING: {
      parameters = `${parameters}&sort=-ranking`;
      break;
    }
    default:
      parameters = `${parameters}&sort=name`;
      break;
  }

  parameters = `${parameters}&language=${lang}`;
  const { data } = await axios.get(parameters, opts(token));
  return data.map(mapApiChannels);
};

const fetchCampaignChannels = async (token, campaignId, channelId) => {
  let parameters = `${URI.CAMPAIGNS_URI}`;

  if (campaignId) {
    parameters = `${parameters}/${campaignId}/campaign_channels`;
  }

  parameters = `${parameters}?page_size=100000`;

  if (channelId) {
    parameters = `${parameters}&channel_id=${channelId}`;
  }

  const { data } = await axios.get(parameters, opts(token));

  return data;
};

const convertCampaignChannels = data => {
  return data.map(convertChannels);
};

const filterCampaignChannels = async (data, accessToken, lang, unconvertedData) => {
  const channels = await fetchChannels(accessToken, lang);
  let campaignChannels = data.map(campaignChannel => ({
    id: campaignChannel.channelId,
    postingUrl: campaignChannel.postingUrl,
    price: campaignChannel.listPrice
  }));

  if (channels.length && campaignChannels.length) {
    let result = [];
    let unmatchedChannels = [];
    result = campaignChannels.reduce((arr, campaignChannel) => {
      const channelById = channels.find(channel => campaignChannel.id === channel.id);
      if (channelById) {
        campaignChannels = campaignChannels.filter(
          campChannel => campChannel.id !== channelById.id
        );
      }
      unmatchedChannels = campaignChannels;

      return channelById
        ? arr.concat({
            ...channelById,
            postingUrl: campaignChannel.postingUrl,
            price: campaignChannel.price
          })
        : arr;
    }, []);

    if (unmatchedChannels.length) {
      let channelData = unconvertedData;
      const otherChannels = unmatchedChannels
        .map(channel => {
          const channelIndx = channelData.findIndex(
            item => parseInt(item.channel_id, 10) === channel.id
          );
          const channelItem = channelData[channelIndx];
          channelData = [
            ...channelData.slice(0, channelIndx),
            ...channelData.slice(channelIndx + 1, channelData.length)
          ];
          return channelItem;
        })
        .map(mapApiChannels);

      result = [...result, ...otherChannels];
    }

    return result;
  }

  return [];
};

const fetchData = async (token, lang) => {
  const response = await Promise.all([
    axios.get(`${URI.EDUCATIONS_URI}?page_size=1000&language=${lang}`, opts(token)),
    axios.get(`${URI.REGIONS_URI}?page_size=1000&language=${lang}`, opts(token)),
    axios.get(`${URI.SECTORS_URI}?page_size=1000&language=${lang}`, opts(token)),
    axios.get(`${URI.CHANNEL_TYPES_URI}?page_size=1000&language=${lang}`, opts(token))
  ]);
  const [educations, regions, sectors, channelTypes] = response.map(records =>
    records.data.map(record => ({ ...record, id: parseInt(record.id, 10) }))
  );
  return { educations, regions, sectors, channelTypes };
};

const fetchChannelFilters = async (accessToken, lang, name, filters, page, sort) => {
  let data = await fetchData(accessToken, lang);
  data = {
    ...data,
    channelTypes: _.filter(data.channelTypes, item => item.name !== "Content")
  };
  const channels = await fetchChannels(accessToken, lang, name, filters, page, sort);
  const getCount = branch => item => {
    const count = channels.reduce((acc, channel) => {
      const key = branch === "channelTypes" ? "channelType" : branch;
      const found = Array.isArray(channel[key])
        ? channel[key].includes(item.id)
        : channel[key] === item.id;
      return acc + Number(found);
    }, 0);
    return { ...item, count };
  };
  const result = ["educations", "regions", "sectors", "channelTypes"].reduce(
    (acc, branch) => ({ ...acc, [branch]: data[branch].map(getCount(branch)) }),
    {}
  );

  return result;
};

router.get("/:id", async (req, res) => {
  const {
    accessToken,
    info: { lang }
  } = req.user;

  try {
    const { id } = req.params;
    const response = await axios.get(
      `${URI.CHANNELS_URI}/${id}?language=${lang}`,
      opts(accessToken)
    );
    res.json(mapApiChannels(response.data));
  } catch (err) {
    const { status, error } = errorTrap(err, lang);
    res.status(status).json({ result: false, error });
  }
});

router.get("/", async (req, res) => {
  const {
    accessToken,
    info: { lang }
  } = req.user;

  try {
    const { name, filters, page, sort } = req.query;
    const channels = await fetchChannels(accessToken, lang, name, filters, page, sort);
    res.json(channels);
  } catch (err) {
    const { status, error } = errorTrap(err, lang);
    res.status(status).json({ result: false, error });
  }
});

router.get("/suggested/:id/:isNew", async (req, res) => {
  const {
    accessToken,
    info: { lang }
  } = req.user;

  try {
    const { id, isNew } = req.params;
    let response;
    if (isNew === "true") {
      response = await axios.get(
        `${URI.SUGGEST_CHANNELS_URI}/${id}?page_size=2000000&language=${lang}`,
        opts(accessToken)
      );
    } else {
      response = await axios.get(
        `${URI.CAMPAIGNS_URI}/${id}/${URI.CAMPAIGN_SUGGESTIONS_URI}?page_size=2000000`,
        opts(accessToken)
      );
    }
    const channels = _.orderBy(response.data.map(mapApiChannels), "suggestionScore", "desc");
    res.json(channels);
  } catch (err) {
    const { status, error } = errorTrap(err, lang);
    res.status(status).json({ result: false, error });
  }
});

router.get("/suggested/:id/:isNew/new", async (req, res) => {
  const {
    accessToken,
    info: { lang }
  } = req.user;

  try {
    const { isNew, id } = req.params;
    const { data } = await axios.get(`${URI.CAMPAIGNS_URI}/${id}`, opts(accessToken));
    const campaign = convert(data);
    const suggestedChannelsUri =
      isNew === "true"
        ? `${URI.SUGGEST_CHANNELS_URI}/${id}?page_size=2000000&language=${lang}`
        : `${URI.CAMPAIGNS_URI}/${id}/${URI.CAMPAIGN_SUGGESTIONS_URI}?page_size=2000000`;

    const response = await Promise.all([
      axios.get(suggestedChannelsUri, opts(accessToken)),
      axios.get(`${URI.CHANNEL_TYPES_URI}?language=${lang}`, opts(accessToken)),
      fetchCampaignChannels(accessToken, id)
    ]);

    const [res1, res2, allCampaignChannels] = response;
    const { data: channels } = res1;
    const { data: channelTypes } = res2;
    const campaignChannelsConverted = convertCampaignChannels(allCampaignChannels);
    const suggestedChannels = _.orderBy(channels.map(mapApiChannels), "suggestionScore", "desc");
    const campaignChannels = await filterCampaignChannels(
      campaignChannelsConverted,
      accessToken,
      lang,
      allCampaignChannels
    );

    res.json({
      campaign,
      suggestedChannels,
      channelTypes,
      campaignChannels
    });
  } catch (err) {
    const { status, error } = errorTrap(err, lang);
    res.status(status).json({ result: false, error });
  }
});

router.get("/:id/all", async (req, res) => {
  const {
    accessToken,
    info: { lang }
  } = req.user;

  try {
    const { id } = req.params;
    const { name, sort } = req.query;

    const { data } = await axios.get(`${URI.CAMPAIGNS_URI}/${id}`, opts(accessToken));
    const campaign = convert(data);
    const { educations = [], regions = [], sector = [] } = campaign;
    const filters = arrayToQS({
      educations: educations.map(eid => +eid),
      regions: regions.map(rid => +rid),
      sectors: sector.map(sid => +sid)
    });

    const result = await Promise.all([
      fetchChannelFilters(accessToken, lang, name, filters, 1, sort),
      axios.get(`${URI.CHANNEL_TYPES_URI}?language=${lang}`, opts(accessToken)),
      fetchChannels(accessToken, lang, name, filters, 1, sort),
      fetchCampaignChannels(accessToken, id)
    ]);

    const [channelFilters, channelTypesResponse, channelItems, allCampaignChannels] = result;
    const { data: channelTypes } = channelTypesResponse;
    const campaignChannelsConverted = convertCampaignChannels(allCampaignChannels);
    const campaignChannels = await filterCampaignChannels(
      campaignChannelsConverted,
      accessToken,
      lang,
      allCampaignChannels
    );

    res.json({
      campaign,
      channelFilters,
      channelTypes,
      channelItems,
      campaignChannels
    });
  } catch (err) {
    const { status, error } = errorTrap(err, lang);
    res.status(status).json({ result: false, error });
  }
});

router.get("/:id/add-ons-page", async (req, res) => {
  const {
    accessToken,
    info: { lang }
  } = req.user;

  try {
    const { id } = req.params;
    const { filters, name, sort } = req.query;
    const { data } = await axios.get(`${URI.CAMPAIGNS_URI}/${id}`, opts(accessToken));
    const campaign = convert(data);

    const contactsUrl = `${URI.CONTACTS_URI}?page_size=2000000&company_id=${campaign.companyId}`;

    const result = await Promise.all([
      fetchCampaignChannels(accessToken, id),
      axios.get(contactsUrl, opts(accessToken)),
      axios.get(`${URI.DATA_LANGUAGES_URI}`, opts(accessToken)),
      axios.get(`${URI.CONTACT_TYPES_URI}?language=${lang}`, opts(accessToken)),
      fetchChannels(accessToken, lang, name, filters, 1, sort)
    ]);

    const [allCampaignChannels, res1, res2, res3, channelItems] = result;
    const campaignChannelsConverted = convertCampaignChannels(allCampaignChannels);
    const campaignChannels = await filterCampaignChannels(
      campaignChannelsConverted,
      accessToken,
      lang,
      allCampaignChannels
    );

    const { data: contacts } = res1;
    const { data: languages } = res2;
    const { data: contactTypes } = res3;

    const customerContacts = contacts.map(toCamel);
    res.json({
      campaign,
      customerContacts,
      languages,
      contactTypes,
      campaignChannels,
      channelItems
    });
  } catch (err) {
    const { status, error } = errorTrap(err, lang);
    res.status(status).json({ result: false, error });
  }
});

module.exports = router;
module.exports.fetchChannels = fetchChannels;
module.exports.mapApiChannels = mapApiChannels;
