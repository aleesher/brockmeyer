const Router = require("express");
const axios = require("axios");
const _ = require("lodash");

const { fetchChannels } = require("./channels");
const { errorTrap } = require("./utils");
const { opts } = require("../constants/config");
const { URI } = require("../constants/URIConstants");

const router = Router();

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

const fetchChannelFilters = async (accessToken, lang, name, filters) => {
  let data = await fetchData(accessToken, lang);
  data = {
    ...data,
    channelTypes: _.filter(data.channelTypes, item => item.name !== "Content")
  };
  const channels = await fetchChannels(accessToken, lang, name, filters);
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

router.get("/", async (req, res) => {
  const {
    accessToken,
    info: { lang }
  } = req.user;

  try {
    const { name, filters } = req.query;
    const result = await fetchChannelFilters(accessToken, lang, name, filters);
    res.json(result);
  } catch (err) {
    const { status, error } = errorTrap(err, lang);
    res.status(status).json({ result: false, error });
  }
});

module.exports = router;
module.exports.fetchChannelFilters = fetchChannelFilters;
