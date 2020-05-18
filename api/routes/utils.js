const _ = require("lodash");

const makeNumber = list => (key, value) =>
  value && list.includes(key) ? parseInt(value, 10) : value;

const makeString = list => (key, value) => (value && list.includes(key) ? value.join(",") : value);

const makeArray = list => (key, value) =>
  value && list.includes(key) && !Array.isArray(value) ? value.split(",") : value;

const toCamelCase = list => record => {
  const toInt = makeNumber(list);
  return Object.keys(record).reduce((acc, snake) => {
    const camel = _.camelCase(snake);
    acc[camel] = toInt(camel, record[snake]);
    return acc;
  }, {});
};

const toSnakeCase = record =>
  Object.keys(record).reduce((acc, camel) => {
    const snake = _.snakeCase(camel);
    acc[snake] = record[camel];
    return acc;
  }, {});

const errorTrap = ({ response, request, message }, lang) => {
  if (response) {
    const { status, statusText, data } = response || {};
    const errPrefix = lang === "nl_nl" ? "API-fout: " : "API error: ";
    const error = errPrefix + (data ? data.error : statusText);
    console.error("errorTrap 1:  ", error, status);
    return { status, error };
  }
  const status = 400;
  const error = request || message;
  console.error("errorTrap 2:  ", error, status);
  return { status, error };
};

class Chain {
  constructor(state) {
    this.state = Object.entries(state);
  }

  rename(callback) {
    for (const entry of this.state) {
      entry[0] = callback(...entry);
    }
    return this;
  }

  filter(callback) {
    const result = [];
    for (const entry of this.state) {
      if (callback(...entry)) {
        result.push(entry);
      }
    }
    this.state = result;
    return this;
  }

  map(callback) {
    this.state = this.state.map(callback);
    return this;
  }

  reset(callback) {
    for (const entry of this.state) {
      entry[1] = callback(...entry);
    }
    return this;
  }

  get result() {
    return this.state.reduce((acc, [key, value]) => {
      acc[key] = value;
      return acc;
    }, {});
  }
}

const arrayToQS = val =>
  val &&
  Object.entries(val)
    .map(([key, value]) => ({ key, ids: value }))
    .filter(({ ids }) => ids.length);

const take = obj => new Chain(obj);

const isString = value => typeof value === "string";

module.exports = {
  makeArray,
  makeNumber,
  makeString,
  take,
  toCamelCase,
  toSnakeCase,
  errorTrap,
  arrayToQS,
  isString
};
