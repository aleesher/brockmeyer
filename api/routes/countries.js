const Router = require("express");
const axios = require("axios");

const { opts } = require("../constants/config");
const { URI } = require("../constants/URIConstants");
const { take, makeNumber, errorTrap } = require("./utils");

const router = Router();
const toInt = makeNumber(["id"]);
const convert = data => take(data).reset(toInt).result;

router.get("/", async (req, res) => {
  const {
    accessToken,
    info: { lang }
  } = req.user;
  const { search = "" } = req.query;

  try {
    const url = `${URI.COUNTRIES_URI}/?page_size=1000&language=${lang}&search=${encodeURIComponent(
      search.toLowerCase()
    )}`;
    const { data } = await axios.get(url, opts(accessToken));
    res.json(data.map(convert));
  } catch (err) {
    const { status, error } = errorTrap(err, lang);
    res.status(status).json({ result: false, error });
  }
});

module.exports = router;
