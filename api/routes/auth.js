const Router = require("express");
const axios = require("axios");
const qs = require("qs");
const url = require("url");

const { toCamelCase, errorTrap } = require("./utils");
const { CLIENT_ID, CLIENT_SECRET } = require("../constants/auth-config");
const { URI } = require("../constants/URIConstants");
const { getCurrentUser } = require("./me");

const router = Router();
const toCamel = toCamelCase([]);

const login = (res, redirectUri) => {
  const uri = url.format({
    pathname: URI.AUTHORIZE_URI,
    query: {
      response_type: "code",
      client_id: CLIENT_ID,
      redirect_uri: URI.REDIRECT_URI
    }
  });
  res.cookie("redirectUri", redirectUri);
  return res.format({
    json: () => res.status(403).json(uri),
    html: () => res.redirect(uri),
    default: () => res.redirect(uri)
  });
};

router.get("/auth", async (req, res) => {
  try {
    const { code: token } = req.query;
    const params = qs.stringify({
      client_id: CLIENT_ID,
      client_secret: CLIENT_SECRET,
      grant_type: "authorization_code",
      code: token,
      redirect_uri: URI.REDIRECT_URI
    });
    const response = await axios.post(URI.TOKEN_URL, params);
    const data = toCamel(response.data);
    const user = await getCurrentUser(data.accessToken);
    req.login({ info: user, ...data }, () => res.redirect(req.cookies.redirectUri));
  } catch (err) {
    const { status, error } = errorTrap(err, "nl_nl");
    res.status(status).json({ result: false, error });
  }
});

router.get("/logout", (req, res) => {
  res.clearCookie("redirectUri");
  req.logout();
  res.redirect("/");
});

const isServiceWorker = path => path === "/service-worker.js";

router.use("*", async (req, res, next) => {
  if (
    !req.isAuthenticated() &&
    // eslint-disable-next-line no-underscore-dangle
    !isServiceWorker(req._parsedOriginalUrl.path) &&
    req.headers.referer &&
    !req.headers.referer.includes("/shared-campaign")
  ) {
    login(res, req.headers.referer);
  } else {
    next();
  }
});

module.exports = router;
