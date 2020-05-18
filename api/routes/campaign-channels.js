const Router = require("express");
const axios = require("axios");
const _ = require("lodash");

const { makeNumber, take, errorTrap } = require("./utils");
const { fetchChannels, mapApiChannels } = require("./channels");
const { opts } = require("../constants/config");
const { URI } = require("../constants/URIConstants");

const router = Router();
const toInt = makeNumber(["id", "channelId", "campaignId"]);
const convert = data =>
  take(data)
    .rename(_.camelCase)
    .reset(toInt).result;

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
  return data.map(convert);
};

router.get("/:campaign_id", async (req, res) => {
  const {
    accessToken,
    info: { lang }
  } = req.user;

  try {
    const campaignId = req.params.campaign_id;
    let data = await fetchCampaignChannels(accessToken, campaignId);
    const campaignChannelsConverted = convertCampaignChannels(data);
    const channels = await fetchChannels(accessToken, lang);
    let campaignChannels = campaignChannelsConverted.map(campaignChannel => ({
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
        const otherChannels = unmatchedChannels
          .map(channel => {
            const channelIndx = data.findIndex(
              item => parseInt(item.channel_id, 10) === channel.id
            );
            const channelItem = data[channelIndx];
            data = [...data.slice(0, channelIndx), ...data.slice(channelIndx + 1, data.length)];
            return channelItem;
          })
          .map(mapApiChannels);

        result = [...result, ...otherChannels];
      }

      res.json(result);
    } else {
      res.json([]);
    }
  } catch (err) {
    const { status, error } = errorTrap(err, lang);
    res.status(status).json({ result: false, error });
  }
});

router.post("/", async (req, res) => {
  try {
    const token = req.user.accessToken;
    const { campaignId, channelIds } = req.body;
    for (const channelId of channelIds) {
      const params = { campaign_id: campaignId, channel_id: channelId };
      await axios.post(URI.CAMPAIGN_CHANNELS_URI, params, opts(token));
    }
    res.json({ ok: true });
  } catch (err) {
    const { status, error } = errorTrap(err, req.user.info.lang);
    res.status(status).json({ result: false, error });
  }
});

router.post("/new", async (req, res) => {
  try {
    const token = req.user.accessToken;
    const { campaignId, channelId } = req.body;
    const params = { campaign_id: campaignId, channel_id: channelId };
    await axios.post(URI.CAMPAIGN_CHANNELS_URI, params, opts(token));
    res.json({ ok: true });
  } catch (err) {
    const { status, error } = errorTrap(err, req.user.info.lang);
    res.status(status).json({ result: false, error });
  }
});

router.delete("/", async (req, res) => {
  try {
    const token = req.user.accessToken;
    const { campaignId } = convert(req.query);
    const channelId = req.query.channel_id;
    if (campaignId && channelId) {
      const campaignChannels = await fetchCampaignChannels(token, campaignId, channelId);
      if (campaignChannels.length) {
        const { id } = campaignChannels[0];
        await axios.delete(`${URI.CAMPAIGN_CHANNELS_URI}/${id}`, opts(token));
      }
    }
    res.json({ ok: true });
  } catch (err) {
    const { status, error } = errorTrap(err, req.user.info.lang);
    res.status(status).json({ result: false, error });
  }
});

module.exports = router;
