const Router = require("express");
const axios = require("axios");

const { opts } = require("../constants/config");
const { URI } = require("../constants/URIConstants");
const { errorTrap } = require("./utils");

const router = Router();

router.get("/", async (req, res) => {
  const {
    accessToken,
    info: { lang }
  } = req.user;
  try {
    const response = await axios.get(
      `${URI.CHANNEL_TYPES_URI}?language=${lang}`,
      opts(accessToken)
    );
    res.json(response.data);
  } catch (err) {
    const { status, error } = errorTrap(err, lang);
    res.status(status).json({ result: false, error });
  }
});

module.exports = router;
