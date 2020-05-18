const isProduction = process.env.NODE_ENV === "production";
const ENV_CLIENT_ID = process.env.CLIENT_ID;
const ENV_CLIENT_SECRET = process.env.CLIENT_SECRET;

const CLIENT_ID =
  ENV_CLIENT_ID ||
  (isProduction ? "6a7ff6ff918b5e701508f7fa8d94fdf7" : "25e0e9e5e6d4726ceb52b5a93908b4e5");

const CLIENT_SECRET =
  ENV_CLIENT_SECRET ||
  (isProduction
    ? "b73adc6362cc8a041e1990255de33b5ff8809e491a53a5286cf3bb0028eef456"
    : "b06cb5d222f1a26d56bde4c6425b7204ca7529350691ba2d94e03bae9174c5c6");

module.exports = {
  CLIENT_ID,
  CLIENT_SECRET
};
