const Router = require("express");
const axios = require("axios");
const fs = require("fs");
const { opts } = require("../constants/config");
const { URI } = require("../constants/URIConstants");

const router = Router();
const defaultImage = fs.readFileSync("public/assets/images/default_company.png");

router.get("/:id", async (req, res) => {
  try {
    let token;
    if (req.user) {
      token = req.user.accessToken;
    } else {
      token = "z2tyFSoF2o9qlWuzk7hcSxU9Fxiu5sax";
    }
    const { id } = req.params;
    const { data } = await axios.request({
      responseType: "arraybuffer",
      url: `${URI.IMAGE_URL}/${id}`,
      method: "get",
      ...opts(token)
    });

    // the default ugly images length is 1635
    // let's replace it by sexy one
    const image = data.length === 1635 ? defaultImage : data;
    res.setHeader("Cache-Control", "public, max-age=5184000");
    res.contentType("image/png");
    res.end(image, "binary");
  } catch (err) {
    // if no image exists on https://api.acc.brockmeyer.nl/img/
    res.contentType("image/png");
    res.end(defaultImage, "binary");
  }
});

module.exports = router;
