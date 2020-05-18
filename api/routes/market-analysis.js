const Router = require("express");
const _ = require("lodash");
const axios = require("axios");
const qs = require("qs");

const { opts } = require("../constants/config");
const { take, errorTrap } = require("./utils");
const { URI } = require("../constants/URIConstants");
const { netherlandsProvince } = require("../constants/apiConstants");
const { fetchOccupation } = require("./occupations");

const router = Router();
const convert = data => take(data).rename(_.camelCase).result;

const fetchIGToken = async () => {
  const params = qs.stringify({
    username: "m.pater@brockmeyer.nl",
    password: "kK1D5Jqnm3"
  });
  const { data } = await axios.post(URI.IG_TOKEN_URI, params);
  return data.access_token;
};

const fetchProvinces = regions => {
  let provinces = [];
  const allProvincesId = netherlandsProvince[0].id;
  if (regions && netherlandsProvince.some(({ id }) => regions.includes(id))) {
    provinces = netherlandsProvince
      .filter(({ id }) => id !== allProvincesId)
      .map(({ value }) => value);
  }
  return provinces;
};

const fetchProvinceAnalysis = async (provinces, regions, token, iscoCode) => {
  const params = {
    c_isco_code: `{${iscoCode}}`,
    c_subjects: "{dd_orientation_activity_cat,dd_recruitment_feasibility}",
    c_language_code: "{}",
    c_authorization_code: "{m.pater@brockmeyer.nl}"
  };
  const requests = provinces.map(id =>
    axios.post(URI.MARKET_ANALYSIS_URI, qs.stringify({ ...params, c_provincie: id }), opts(token))
  );
  const responses = await axios.all(requests);
  return responses.map(({ data }, index) =>
    data.map(convert).map(d => ({
      ...d,
      code: netherlandsProvince[index + 1].code,
      name: netherlandsProvince[index + 1].value,
      selected: regions.includes(netherlandsProvince[index + 1].id)
    }))
  );
};

router.get("/", async (req, res) => {
  const language = _.get(req, "user.lang", "nl");

  try {
    const { regions, occupationId, iscoGroupId: iscoGroup } = req.query;
    if (!occupationId) {
      res.status(400).json({ result: false, error: "ISCO-code <NULL> not available" });
    }
    const provinces = fetchProvinces(regions);
    let token;
    if (req.user) {
      token = req.user.igToken;
    }

    if (!token) {
      token = await fetchIGToken();
      if (req.user) req.user.igToken = token;
    }
    let result;
    let iscoGroupId;
    try {
      if (iscoGroup) {
        iscoGroupId = iscoGroup;
      } else if (req.user) {
        const {
          accessToken,
          info: { lang }
        } = req.user;
        ({ iscoGroupId } = await fetchOccupation(accessToken, lang, occupationId));
      }
      result = await fetchProvinceAnalysis(provinces, regions, token, iscoGroupId);
    } catch (err) {
      const { status, error } = errorTrap(err, language);
      if (status === 401) {
        const newToken = await fetchIGToken();
        if (req.user) req.user.igToken = newToken;
        result = await fetchProvinceAnalysis(provinces, regions, newToken, iscoGroupId);
      } else {
        res.status(status).json({ result: false, error });
        console.error(status, error);
      }
    }
    res.json(result);
  } catch (err) {
    const { status, error } = errorTrap(err, language);
    res.status(status).json({ result: false, error });
  }
});

module.exports = router;
