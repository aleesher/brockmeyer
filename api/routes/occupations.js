const Router = require("express");
const _ = require("lodash");
const axios = require("axios");

const { opts } = require("../constants/config");
const { errorTrap, take } = require("./utils");
const { URI } = require("../constants/URIConstants");

const router = Router();
const convert = data => take(data).rename(_.camelCase).result;

const fetchOccupation = async (token, lang, occupationId) => {
  const { data } = await axios.get(
    `${URI.OCCUPATIONS_URI}/${occupationId}?language=${lang}`,
    opts(token)
  );
  return convert(data);
};

router.get("/", async (req, res) => {
  const {
    accessToken,
    info: { lang }
  } = req.user;
  try {
    const { search, pageSize } = req.query;
    const parameters = `${URI.OCCUPATIONS_URI}?page_size=${pageSize}&&search=${search &&
      search.toLowerCase()}&&language=${lang}&&sort=preferred_label`;
    const response = await axios.get(parameters, { ...opts(accessToken) });
    res.json(response.data.map(convert));
  } catch (err) {
    const { status, error } = errorTrap(err, lang);
    res.status(status).json({ result: false, error });
  }
});

router.get("/:id", async (req, res) => {
  const {
    accessToken,
    info: { lang }
  } = req.user;

  try {
    const occupation = await fetchOccupation(accessToken, lang, req.params.id);
    res.json(occupation);
  } catch (err) {
    const { status, error } = errorTrap(err, lang);
    res.status(status).json({ result: false, error });
  }
});

module.exports = router;
module.exports.fetchOccupation = fetchOccupation;
