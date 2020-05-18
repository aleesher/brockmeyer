const Router = require("express");
const axios = require("axios");

const { URI } = require("../constants/URIConstants");
const { campaignStatus } = require("../constants/apiConstants");
const { errorTrap } = require("./utils");
const { opts } = require("../constants/config");

const router = Router();

const fetchData = async (token, lang, statusId) => {
  let parameters = `${URI.CAMPAIGN_STATUS_TYPES_URI}`;
  if (statusId) {
    parameters = `${parameters}/${statusId}`;
  }
  parameters = `${parameters}/?language=${lang}`;
  const { data } = await axios.get(parameters, opts(token));
  return Array.isArray(data)
    ? data.map(item => ({ ...item, name: campaignStatus[item.id].name }))
    : { ...data, name: campaignStatus[data.id].name };
};

router.get("/", async (req, res) => {
  const {
    accessToken,
    info: { lang }
  } = req.user;

  try {
    const data = await fetchData(accessToken, lang);
    res.json(data);
  } catch (err) {
    const { status, error } = errorTrap(err, lang);
    res.status(status).json({ result: false, error });
  }
});

module.exports = router;
module.exports.fetchCampaignStatuses = fetchData;
