const Router = require("express");
const axios = require("axios");
const _ = require("lodash");

const { errorTrap } = require("./utils");
const { SIMPLE_API_KEY } = require("../constants/config");
const { URI } = require("../constants/URIConstants");
const clearVacancyContentTags = require("../helpers/clear-vacancy-optimizer-tags");

const router = Router();

// The function replaces 'vacancyoptimizer' with 'span' and adds styles to it to highlight
const changeVacancyContentTags = text => {
  const nameLabel = "data-pullfactor-name";
  const scoreLabel = "data-pullfactor-score";
  // Replaces 'vacancyoptimizer' with 'span'
  let newText = text.replace(/vacancyoptimizer/g, "span").replace(/\n/g, "");
  let newText2 = "";
  let scoreIndex = -1;
  let nameIndex = -1;
  let score = 0;
  let closingTagIndex = -1;
  let styleString = "";

  // Loops through text while it has attribute of vacancyoptimizer - 'data-pullfactor-score'
  while (newText.indexOf(scoreLabel) > -1) {
    // Finds index of score in text
    scoreIndex = newText.indexOf(scoreLabel) + scoreLabel.length + 2;
    // Gets the score
    score = Number(newText.substring(scoreIndex, scoreIndex + 1));
    nameIndex = newText.indexOf(nameLabel);
    // Gets index of end of the current vacancyoptimizer (span) tag
    closingTagIndex = nameIndex + newText.substring(nameIndex).indexOf(">");
    // Sets style string depending on the score
    styleString =
      score > 0
        ? ` style="background-color: ${
            score === 1 ? "rgb(89, 181, 92)" : "rgb(11, 107, 153)"
          }; color: white; position: relative;"`
        : "";
    /*
     * Checks whether to include 'data-pullfactor-name' and 'data-pullfactor-score'
     * attributes to current vacancyoptimizer (span) tag and adds style attribute to it
     */
    const idx = score > 0 ? closingTagIndex : nameIndex;

    newText2 += newText.substring(0, idx) + styleString + newText.substring(idx, closingTagIndex);
    newText = newText.substring(closingTagIndex);
  }

  newText2 += newText;
  return newText2;
};

router.post("/", async (req, res) => {
  try {
    const jobLevel = req.body.jobLevel === "" ? 5 : Number(req.body.jobLevel);
    let workExperience;

    if (jobLevel >= 7) {
      workExperience = "senior";
    } else if (jobLevel === 5) {
      workExperience = "medior";
    } else {
      workExperience = "junior";
    }

    const jobDescription = clearVacancyContentTags(req.body.jobDescription);

    const vacancy = {
      from_name: "Brockmeyer",
      redirect_success_url: URI.VACANCY_IMPROVER_URI,
      redirect_error_url: URI.VACANCY_IMPROVER_URI,
      sections: [
        {
          key: req.body.id,
          title: req.body.jobTitle,
          content: jobDescription
        }
      ],
      metadata: [
        {
          key: "id",
          value: req.body.id
        }
      ],
      work_experience: workExperience,
      country: "nl",
      province: "all"
    };

    if (vacancy.sections) {
      const { data } = await axios.post(URI.ADD_VACANCY_IMPROVER_URI, vacancy, {
        headers: SIMPLE_API_KEY
      });
      res.json(data);
    } else {
      throw new Error("something went wrong, try again");
    }
  } catch (err) {
    const { status, error } = errorTrap(err, req.user.info.lang);
    res.status(status).json({ result: false, error });
  }
});

router.get("/:hash", async (req, res) => {
  try {
    const requestUrl = `${URI.GET_VACANCY_IMPROVER_URI}?hash=${
      req.params.hash
    }&include_vacancyoptimizer_tags=true`;
    const { data } = await axios.get(requestUrl, { headers: SIMPLE_API_KEY });
    const result = data;
    const content = _.get(result, "vacancy.sections[0].content");
    if (content) {
      _.set(result, "vacancy.sections[0].content", changeVacancyContentTags(content));
    }

    res.json(result);
  } catch (err) {
    const { status, error } = errorTrap(err, req.user.info.lang);
    res.status(status).json({ result: false, error });
  }
});

router.put("/:hash", async (req, res) => {
  try {
    await axios.put(`${URI.CHECK_VACANCY_IMPROVER_URI}?hash=${req.params.hash}`, null, {
      headers: SIMPLE_API_KEY
    });
    res.json();
  } catch (err) {
    const { status, error } = errorTrap(err, req.user.info.lang);
    res.status(status).json({ result: false, error });
  }
});

module.exports = router;
