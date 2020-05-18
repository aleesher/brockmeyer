const PAGE_SIZE = 30;

const opts = token => ({ headers: { Authorization: `Bearer ${token}` } });

const SIMPLE_API_KEY = { "SIMPLE-API-KEY": "Zrdn717rShMhP4I37ObCYyzWBfkhEyUy" };

module.exports = {
  PAGE_SIZE,
  opts,
  SIMPLE_API_KEY
};
