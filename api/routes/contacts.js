const Router = require("express");
const axios = require("axios");
const _ = require("lodash");

const { opts } = require("../constants/config");
const { URI } = require("../constants/URIConstants");
const { errorTrap, take, makeString, makeArray, makeNumber } = require("./utils");

const router = Router();
const strList = ["contactTypes"];
const intList = ["id", "companyId"];
const toInt = makeNumber(intList);
const toString = makeString(strList);
const toArray = makeArray(strList);
const convert = data =>
  take(data)
    .rename(_.camelCase)
    .reset(toArray)
    .reset(toInt).result;
const reconvert = data =>
  take(data)
    .reset(toString)
    .rename(_.snakeCase);

router.get("/", async (req, res) => {
  try {
    const token = req.user.accessToken;
    const url = `${URI.CONTACTS_URI}?page_size=2000000&company_id=${req.query.company_id}`;
    const { data } = await axios.get(url, opts(token));
    res.json(data.map(convert));
  } catch (err) {
    const { status, error } = errorTrap(err, req.user.info.lang);
    res.status(status).json({ result: false, error });
  }
});

router.post("/", async (req, res) => {
  try {
    const token = req.user.accessToken;
    const { id, logo, ...rest } = req.body;
    const params = reconvert(rest).result;
    const { data } = await axios.post(URI.CONTACTS_URI, params, opts(token));
    res.json(convert(data));
  } catch (err) {
    const { status, error } = errorTrap(err, req.user.info.lang);
    res.status(status).json({ result: false, error });
  }
});

router.delete("/:id", async (req, res) => {
  try {
    const token = req.user.accessToken;
    const { data } = await axios.get(`${URI.CONTACTS_URI}/${req.params.id}/campaigns`, opts(token));
    if (data && data.length > 0) {
      throw new Error("ERROR_REMOVE_CONTACT");
    }
    await axios.delete(`${URI.CONTACTS_URI}/${req.params.id}`, opts(token));
    res.json(req.params.id);
  } catch (err) {
    const { status, error } = errorTrap(err, req.user.info.lang);
    res.status(status).json({ result: false, error });
  }
});

router.patch("/:id", async (req, res) => {
  try {
    const token = req.user.accessToken;
    const params = reconvert(req.body).result;
    const { data } = await axios.put(`${URI.CONTACTS_URI}/${req.params.id}`, params, opts(token));
    res.json(convert(data));
  } catch (err) {
    const { status, error } = errorTrap(err, req.user.info.lang);
    res.status(status).json({ result: false, error });
  }
});

module.exports = router;
