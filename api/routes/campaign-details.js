const Router = require("express");
const axios = require("axios");

const { opts } = require("../constants/config");
const { errorTrap } = require("./utils");
const { URI } = require("../constants/URIConstants");

const router = Router();

const getURI = field => {
  switch (field) {
    case "job-levels":
      return URI.JOB_LEVELS_URI;
    case "educations":
      return URI.EDUCATIONS_URI;
    case "regions":
      return URI.REGIONS_URI;
    case "job-profiles":
      return URI.JOB_PROFILES_URI;
    case "sectors":
      return URI.SECTORS_URI;
    case "contract-types":
      return URI.CONTRACT_TYPES_URI;
    case "job-competence":
      return URI.JOB_COMPETENCES_URI;
    default:
      return URI.JOB_LEVELS_URI;
  }
};

router.get("/:field", async (req, res) => {
  const {
    accessToken,
    info: { lang }
  } = req.user;
  const {
    params: { field }
  } = req;
  const uri = getURI(field);

  try {
    const response = await axios.get(`${uri}?page_size=1000&language=${lang}`, opts(accessToken));
    res.json(response.data);
  } catch (err) {
    const { status, error } = errorTrap(err, lang);
    res.status(status).json({ result: false, error });
  }
});

router.get("/fields/all", async (req, res) => {
  const {
    accessToken,
    info: { lang }
  } = req.user;
  const fields = [
    "educations",
    "job-levels",
    "regions",
    "job-profiles",
    "sectors",
    "contract-types",
    "job-competence"
  ];
  const uris = fields.map(field => getURI(field));
  try {
    const response = await Promise.all([
      axios.get(`${uris[0]}?page_size=1000&language=${lang}`, opts(accessToken)),
      axios.get(`${uris[1]}?page_size=1000&language=${lang}`, opts(accessToken)),
      axios.get(`${uris[2]}?page_size=1000&language=${lang}`, opts(accessToken)),
      axios.get(`${uris[3]}?page_size=1000&language=${lang}`, opts(accessToken)),
      axios.get(`${uris[4]}?page_size=1000&language=${lang}`, opts(accessToken)),
      axios.get(`${uris[5]}?page_size=1000&language=${lang}`, opts(accessToken)),
      axios.get(`${uris[6]}?page_size=1000&language=${lang}`, opts(accessToken))
    ]);

    const result = response.map(r => r.data);

    res.json(result);
  } catch (err) {
    const { status, error } = errorTrap(err, lang);
    res.status(status).json({ result: false, error });
  }
});

module.exports = router;
