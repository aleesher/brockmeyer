const Router = require("express");
const _ = require("lodash");
const axios = require("axios");

const { fetchCampaignStatuses } = require("./campaign-status-types");
const { take, makeArray, makeString, errorTrap } = require("./utils");
const { PAGE_SIZE, opts } = require("../constants/config");
const { URI } = require("../constants/URIConstants");
const { campaignSort } = require("../constants/apiConstants");
// const clearVacancyContentTags = require("../helpers/clear-vacancy-optimizer-tags");

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
const toArray = makeArray(strList);
const toString = makeString(strList);
const convert = data =>
  take(data)
    .rename(_.camelCase)
    .reset(toArray).result;
const reconvert = data =>
  take(data)
    .reset(toString)
    .rename(_.snakeCase);
const remove = data => {
  strList.map(el => {
    const dataEl = data[el];
    if (dataEl) {
      const arr = dataEl.map(e => e.id);
      _.set(data, el, arr);
    }
    return dataEl;
  });
  const deep = ["partner", "jobContact", "company", "occupation"];
  deep.map(d => {
    const deepData = data[d];
    if (deepData) {
      const el = convert(deepData);
      _.set(data, d, el);
    }
    return d;
  });
  const jobContact = _.get(data, "jobContact.companyId");
  if (jobContact) {
    const jobContactConverted = convert(jobContact);
    _.set(data, "jobContact.companyId", jobContactConverted);
  }

  return {
    ...data,
    campaignStatus: {
      ...data.campaignStatus,
      name: `order_${_.get(data, "campaignStatus.name").toLowerCase()}`
    }
  };
};

const retrieveDetailOptions = data => {
  const detailOptions = {};
  strList.map(el => {
    if (data[_.snakeCase(el)]) {
      detailOptions[el] = data[_.snakeCase(el)].map(item => ({ label: item.name, value: item.id }));
    }
    return data;
  });
  return detailOptions;
};

const retrieveCampaignChannels = channels => {
  const formattedData = [];

  _.mapValues(
    channels,
    ({ channel_name: name, channel_id: id, channel_logo: logo, list_price: price, ...rest }) => {
      formattedData.push(
        convert({
          ...rest,
          statistics: {
            estimatedClicks: rest.clicks_expected,
            rating: rest.ranking,
            visitorsPerDay: _.values(JSON.parse(rest.clicks_daily_expected) || [])
          },
          name,
          id: _.get(id, "id"),
          logo,
          price,
          description: _.get(id, "summary"),
          url: _.get(id, "url"),
          channelType: parseInt(_.get(id, "channel_type.id", null), 10)
        })
      );
    }
  );

  return formattedData;
};

router.get("/:id", async (req, res) => {
  try {
    const token = req.user.accessToken;
    const { data: campaign } = await axios.get(
      `${URI.CAMPAIGNS_URI}/${req.params.id}`,
      opts(token)
    );
    res.json(convert(campaign));
  } catch (err) {
    const { status, error } = errorTrap(err, req.user.info.lang);
    res.status(status).json({ result: false, error });
  }
});

router.get("/", async (req, res) => {
  try {
    const token = req.user.accessToken;
    const { search, statusId, sort, page = 1 } = req.query;

    let parameters = `${URI.CAMPAIGNS_URI}/?page_size=${PAGE_SIZE}&page_nr=${page}`;
    if (statusId) {
      parameters = `${parameters}&campaign_status=${statusId}`;
    }
    if (search) {
      parameters = `${parameters}&job_title=${encodeURIComponent(search.toLowerCase())}`;
    }

    switch (sort) {
      case campaignSort.DATE_END_ASC: {
        parameters = `${parameters}&sort=date_end`;
        break;
      }
      case campaignSort.DATE_END_DESC: {
        parameters = `${parameters}&sort=-date_end`;
        break;
      }
      case campaignSort.DATE_START_ASC: {
        parameters = `${parameters}&sort=date_start`;
        break;
      }
      case campaignSort.DATE_START_DESC: {
        parameters = `${parameters}&sort=-date_start`;
        break;
      }
      default:
        parameters = `${parameters}&sort=-date_end`;
        break;
    }

    const { data } = await axios.get(parameters, opts(token));
    res.json(data.map(convert));
  } catch (err) {
    const { status, error } = errorTrap(err, req.user.info.lang);
    res.status(status).json({ result: false, error });
  }
});

router.post("/", async (req, res) => {
  try {
    const token = req.user.accessToken;
    const params = reconvert(req.body).filter(key => key !== "channels").result;
    const { channels } = req.body;
    const { data } = await axios.post(URI.CAMPAIGNS_URI, params, opts(token));
    const campaign = convert(data);
    if (channels) {
      for (const channel of channels) {
        const ps = { campaign_id: campaign.id, channel_id: channel.id };
        await axios.post(URI.CAMPAIGN_CHANNELS_URI, ps, opts(token));
      }
    }
    res.json({ channels, ...campaign });
  } catch (err) {
    const { status, error } = errorTrap(err, req.user.info.lang);
    res.status(status).json({ result: false, error });
  }
});

router.patch("/:id", async (req, res) => {
  try {
    const token = req.user.accessToken;
    const { channels, ...rest } = req.body;

    // if (rest.jobDescription) {
    //   rest.jobDescription = clearVacancyContentTags(rest.jobDescription);
    // }

    const params = reconvert(rest).result;
    const { data } = await axios.put(`${URI.CAMPAIGNS_URI}/${req.params.id}`, params, opts(token));
    const campaign = convert(data);
    res.json({ channels, ...campaign });
  } catch (err) {
    const { status, error } = errorTrap(err, req.user.info.lang);
    res.status(status).json({ result: false, error });
  }
});

router.delete("/:id", async (req, res) => {
  try {
    const token = req.user.accessToken;
    const { data } = await axios.delete(`${URI.CAMPAIGNS_URI}/${req.params.id}`, opts(token));
    res.json(data);
  } catch (err) {
    const { status, error } = errorTrap(err, req.user.info.lang);
    res.status(status).json({ result: false, error });
  }
});

router.patch("/:id/approve", async (req, res) => {
  const {
    accessToken,
    info: { lang }
  } = req.user;

  try {
    const url = `${URI.BASE_URL}/approve_campaign/${req.params.id}`;
    const { data } = await axios.put(url, {}, opts(accessToken));
    const campaign = convert(data);
    const status = await fetchCampaignStatuses(accessToken, lang, campaign.campaignStatus);
    res.json({ ...campaign, status });
  } catch (err) {
    const { status, error } = errorTrap(err, lang);
    res.status(status).json({ result: false, error });
  }
});

router.patch("/:id/publish", async (req, res) => {
  try {
    const token = req.user.accessToken;
    const url = `${URI.BASE_URL}/publish_campaign/${req.params.id}`;
    const { data } = await axios.put(url, {}, opts(token));
    res.json(convert(data));
  } catch (err) {
    const { status, error } = errorTrap(err, req.user.info.lang);
    res.status(status).json({ result: false, error });
  }
});

router.patch("/:id/cancel", async (req, res) => {
  try {
    const token = req.user.accessToken;
    const url = `${URI.BASE_URL}/cancel_campaign/${req.params.id}`;
    const { data } = await axios.put(url, {}, opts(token));
    res.json(data);
  } catch (err) {
    const { status, error } = errorTrap(err, req.user.info.lang);
    res.status(status).json({ result: false, error });
  }
});

router.put("/:id/retract", async (req, res) => {
  try {
    const token = req.user.accessToken;
    const url = `${URI.BASE_URL}/retract_campaign/${req.params.id}`;
    const { data } = await axios.put(url, {}, opts(token));
    const campaign = convert(data);
    res.json(campaign);
  } catch (err) {
    const { status, error } = errorTrap(err, req.user.info.lang);
    res.status(status).json({ result: false, error });
  }
});

router.get("/share-campaign/:id", async (req, res) => {
  try {
    const { accessToken } = req.user;
    const { data } = await axios.get(`${URI.SHARE_CAMPAIGN}/${req.params.id}`, opts(accessToken));
    res.json(convert(data));
  } catch (err) {
    res.json();
    const { status, error } = errorTrap(err, req.user.info.lang);
    res.status(status).json({ result: false, error });
  }
});

router.delete("/share-campaign/:id", async (req, res) => {
  try {
    const token = req.user.accessToken;
    const { data } = await axios.delete(`${URI.SHARE_CAMPAIGN}/${req.params.id}`, opts(token));
    res.json(data);
  } catch (err) {
    const { status, error } = errorTrap(err, req.user.info.lang);
    res.status(status).json({ result: false, error });
  }
});

router.get("/shared-campaign/:id/:language", async (req, res) => {
  try {
    const { data: campaign } = await axios.get(
      `${URI.SHARED_CAMPAIGN}?token=${req.params.id}&expand=true&language=${req.params.language}`,
      opts("z2tyFSoF2o9qlWuzk7hcSxU9Fxiu5sax")
    );
    const detailOptions = retrieveDetailOptions(campaign);
    const formattedCampaign = remove(convert(campaign));

    res.json({
      sharedCampaign: {
        ...formattedCampaign,
        campaignChannels: retrieveCampaignChannels(formattedCampaign.campaignChannels)
      },
      detailOptions
    });
  } catch (err) {
    const { status, error } = errorTrap(err, "nl");
    res.status(status).json({ result: false, error });
  }
});

router.get("/share-campaign-token/:id", async (req, res) => {
  try {
    const token = req.user.accessToken;
    const { data: campaign } = await axios.get(
      `${URI.SHARE_CAMPAIGN}/${req.params.id}`,
      opts(token)
    );
    res.json(convert(campaign));
  } catch (err) {
    const { status, error } = errorTrap(err, req.user.info.lang);
    res.status(status).json({ result: false, error });
  }
});

router.put("/share-campaign/:id/:date", async (req, res) => {
  try {
    const token = req.user.accessToken;
    const { data } = await axios.put(
      `${URI.SHARE_CAMPAIGN}/${req.params.id}?expiry_date=${req.params.date}`,
      {},
      opts(token)
    );
    const campaign = convert(data);
    res.json(convert(campaign));
  } catch (err) {
    const { status, error } = errorTrap(err, req.user.info.lang);
    res.status(status).json({ result: false, error });
  }
});

router.post("/share-campaign/:id/:date", async (req, res) => {
  try {
    const token = req.user.accessToken;
    const { data } = await axios.post(
      `${URI.SHARE_CAMPAIGN}/${req.params.id}?expiry_date=${req.params.date}`,
      {},
      opts(token)
    );
    const campaign = convert(data);
    res.json(convert(campaign));
  } catch (err) {
    const { status, error } = errorTrap(err, req.user.info.lang);
    res.status(status).json({ result: false, error });
  }
});

router.post("/share-campaign-hash/:id/:date", async (req, res) => {
  try {
    const token = req.user.accessToken;
    const { data } = await axios.post(
      `${URI.SHARE_CAMPAIGN}?orderid=${req.params.id}&expiry_date=${req.params.date}`,
      {},
      opts(token)
    );
    const campaign = convert(data);
    res.json(convert(campaign));
  } catch (err) {
    const { status, error } = errorTrap(err, req.user.info.lang);
    res.status(status).json({ result: false, error });
  }
});

module.exports = router;
