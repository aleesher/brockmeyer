const Router = require("express");
const axios = require("axios");
const _ = require("lodash");

const { URI } = require("../constants/URIConstants");
const { PAGE_SIZE, opts } = require("../constants/config");
const { makeNumber, take, errorTrap } = require("./utils");

const router = Router();
const toInt = makeNumber(["id", "addressNumber", "countryId"]);
const convert = data =>
  take(data)
    .rename(_.camelCase)
    .reset(toInt).result;
const reconvert = data => take(data).rename(_.snakeCase).result;

router.get("/", async (req, res) => {
  try {
    const token = req.user.accessToken;
    const { name, sort, page = 1 } = req.query;

    let parameters = `${URI.CUSTOMERS_URI}?page_size=${PAGE_SIZE}&page_nr=${_.toNumber(
      page
    )}&sort=${sort === "desc" ? "-name" : "name"}`;
    if (name) {
      parameters = `${parameters}&name=${encodeURIComponent(name.toLowerCase())}`;
    }
    const customers = await axios.get(parameters, opts(token));
    res.json(customers.data.map(convert));
  } catch (err) {
    const { status, error } = errorTrap(err, req.user.info.lang);
    res.status(status).json({ result: false, error });
  }
});

router.post("/", async (req, res) => {
  try {
    const token = req.user.accessToken;
    const { id, logo, ...rest } = req.body;
    const params = reconvert(rest);
    const { data } = await axios.post(URI.CUSTOMERS_URI, params, opts(token));
    res.json(convert(data));
  } catch (err) {
    const { status, error } = errorTrap(err, req.user.info.lang);
    res.status(status).json({ result: false, error });
  }
});

router.patch("/:id", async (req, res) => {
  try {
    const token = req.user.accessToken;
    const { id, logo, ...rest } = req.body;
    const params = reconvert(rest);
    const { data } = await axios.put(`${URI.CUSTOMERS_URI}/${id}`, params, opts(token));
    res.json(convert(data));
  } catch (err) {
    const { status, error } = errorTrap(err, req.user.info.lang);
    res.status(status).json({ result: false, error });
  }
});

module.exports = router;
