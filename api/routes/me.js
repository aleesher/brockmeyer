const Router = require("express");
const axios = require("axios");

const { fetchLanguage } = require("./data-languages");
const { opts } = require("../constants/config");
const { URI } = require("../constants/URIConstants");

const router = Router();

const getCurrenUser = async token => {
  const user = await axios.get(`${URI.CURRENT_USER_URI}`, opts(token));
  const currentUser = user.data[0];
  const company = await axios.get(`${URI.CUSTOMERS_URI}/${currentUser.company_id}`, opts(token));
  const dataLanguages = await fetchLanguage(token, currentUser.data_language);

  return {
    id: currentUser.id,
    surname: currentUser.surname,
    firstName: currentUser.first_name,
    username: currentUser.username,
    infixSurname: currentUser.infix_surname,
    contactTypes: currentUser.contact_types,
    contactId: currentUser.contact_id,
    email: currentUser.email,
    companyName: currentUser.company_name,
    companyLogo: company.data.logo,
    lang: dataLanguages.name,
    companyId: currentUser.company_id,
    roleName: currentUser.role_name,
    portalSettings: currentUser.portal_settings
  };
};

router.get("/", async (req, res) => {
  const token = req.user.accessToken;
  const user = await getCurrenUser(token);
  res.json(user);
});

router.patch("/", async (req, res) => {
  const token = req.user.accessToken;
  const user = await getCurrenUser(token);
  user.lang = req.body.lang;
  req.user.info.lang = req.body.lang;
  res.json(user);
});

router.patch("/change-colors", (req, res) => {
  req.user.info.portalSettings = JSON.stringify(req.body);
  res.json(req.user.info);
});

module.exports = router;
module.exports.getCurrentUser = getCurrenUser;
