const Router = require("express");
const axios = require("axios");

const { opts } = require("../constants/config");
const { URI } = require("../constants/URIConstants");
const { toCamelCase, errorTrap } = require("./utils");

const router = Router();
const toCamel = toCamelCase(["id"]);

router.get("/", async (req, res) => {
  const {
    accessToken,
    info: { lang }
  } = req.user;

  try {
    const { data } = await axios.get(
      `${URI.CONTACT_TYPES_URI}?language=${lang}`,
      opts(accessToken)
    );
    res.json(data.map(toCamel));
  } catch (err) {
    const { status, error } = errorTrap(err, lang);
    res.status(status).json({ result: false, error });
  }
});

module.exports = router;
