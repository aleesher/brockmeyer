const Router = require("express");
const axios = require("axios");

const { URI } = require("../constants/URIConstants");
const { errorTrap } = require("./utils");
const { opts } = require("../constants/config");

const router = Router();

const fetchLanguage = async (token, languageId) => {
  const dataLanguage = await axios.get(`${URI.DATA_LANGUAGES_URI}/${languageId}`, opts(token));
  return dataLanguage.data;
};

router.get("/", async (req, res) => {
  try {
    const token = req.user.accessToken;
    const { data } = await axios.get(`${URI.DATA_LANGUAGES_URI}`, opts(token));
    res.json(data);
  } catch (err) {
    const { status, error } = errorTrap(err, req.user.info.lang);
    res.status(status).json({ result: false, error });
  }
});

router.get("/:id", async (req, res) => {
  try {
    const token = req.user.accessToken;
    const languageId = req.params.id;
    const language = await fetchLanguage(token, languageId);
    res.json(language);
  } catch (err) {
    const { status, error } = errorTrap(err, req.user.info.lang);
    res.status(status).json({ result: false, error });
  }
});

module.exports = router;
module.exports.fetchLanguage = fetchLanguage;
