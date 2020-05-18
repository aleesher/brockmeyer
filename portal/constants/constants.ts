import _ from "lodash";

export const PAGE_SIZE = 30;

export const JOB_HOLDER = 11;
export const JOB_CONTACT = 9;

export const ENGLISH_LANGUAGE = "en_uk";
export const DUTCH_LANGUAGE = "nl_nl";

export const PARTNER_ADMIN = "Partner admin";
export const COMPANY_ADMIN_ROLE = "Company admin";

export const SOCIAL_MEDIA_ID = _.toNumber(process.env.SOCIAL_MEDIA_ID) || 7;
export const BANNERS_ID = _.toNumber(process.env.BANNERS_ID) || 13;
export const ADD_ONS_ID = _.toNumber(process.env.ADD_ONS_ID) || 19;
export const ADD_ON_VACANCY_TEXT = 4865;
export const ADD_ON_DEFAULT_TEXT_CHECK = 4863;

export const SORT_DEFAULT = {
  60: { sort: "date_start_desc" },
  56: { sort: "date_start_desc" },
  62: { sort: "date_start_desc" },
  64: { sort: "date_end_asc" },
  66: { sort: "date_end_asc" },
  68: { sort: "date_end_desc" },
  0: { sort: "date_end_desc" }
};

export const CAMPAIGN_SORT = {
  DATE_END_ASC: "date_end_asc",
  DATE_END_DESC: "date_end_desc",
  DATE_START_ASC: "date_start_asc",
  DATE_START_DESC: "date_start_desc"
};

export const CHANNEL_SORT = {
  A_Z: "name_asc",
  Z_A: "name_desc",
  RANKING: "ranking_desc"
};

export const NETHERLANDS_PROVINCE = [
  "109",
  "66",
  "70",
  "5",
  "80",
  "68",
  "3",
  "78",
  "72",
  "82",
  "94",
  "76",
  "74"
];

export const SCARCITY_TRANSLATION_IDS = [
  "NOT_SCARCE",
  "LIGHT_SCARCE",
  "NORMAL_SCARCE",
  "VERY_SCARCE"
];

export const TARGET_AUDIENCE_TRANSLATION_IDS = ["VERY_SMALL", "SMALL", "MEDIUM", "BIG", "VERY_BIG"];

export const editorToolbar = (isEditable: boolean) => ({
  toolbar: isEditable
    ? [
        [{ header: [1, 2, 3, 4, 5, false] }],
        ["bold", "italic", "underline"],
        [{ list: "ordered" }, { list: "bullet" }, { indent: "-1" }, { indent: "+1" }],
        ["link"],
        [{ color: [] }, { background: [] }],
        [{ align: [] }],
        ["clean"]
      ]
    : false
});

export const VACANCY_SCORE_LEVELS = [
  {
    from: 0,
    to: 25,
    text: "NEEDS_IMPROVEMENT"
  },
  {
    from: 25,
    to: 50,
    text: "NOT_BAD"
  },
  {
    from: 50,
    to: 75,
    text: "GOOD"
  },
  {
    from: 75,
    to: 100,
    text: "VERY_GOOD"
  }
];

export const DEFAULT_CHANNEL_LOGO = "/assets/images/logo_icon.png";

export const PULLFACTOR_ATTRIBUTES = [
  "data-pullfactor-name",
  "data-pullfactor-score",
  "data-color",
  "class",
  "style"
];

export const PULLFACTOR_SCORE = {
  en: {
    0: {
      name: "Is missing",
      color: "red"
    },
    1: {
      name: "Good",
      color: "green"
    },
    2: {
      name: "Pay attention",
      color: "blue"
    }
  },
  nl: {
    0: {
      name: "Ontbreekt",
      color: "red"
    },
    1: {
      name: "Goed",
      color: "green"
    },
    2: {
      name: "Let op",
      color: "blue"
    }
  }
};

export const STEPS = (isMobile: boolean) => {
  return [
    {
      selector: ".card-item:nth-child(1)",
      content: "Here you can see the campaign's main information..."
    },
    ...(isMobile
      ? [
          {
            selector: "#job-title-mobile",
            content: "Company name and job title"
          }
        ]
      : [
          {
            selector: ".campaign-header",
            content: "Company name"
          },
          {
            selector: ".campaign-header:nth-child(2)",
            content: "Job title"
          }
        ]),
    ...(!isMobile
      ? [
          {
            selector: ".status-tour",
            content: "campaign status"
          }
        ]
      : []),
    {
      selector: ".campaign-data",
      content: "Campaign description"
    },
    {
      selector: ".filters-bar",
      content: "You can search the campaign by company name or job title"
    },
    ...(!isMobile
      ? [
          {
            selector: "#create-campaign",
            content: "Let's create the campaign"
          }
        ]
      : [])
  ];
};

export const STEPS_ADD_CAMPAIGN = () => {
  return [
    {
      selector: "#add-new-campaign #add-campaign-title",
      content: "Choose the job title please. The field is mandatory.",
      action: node => node.focus()
    },
    {
      selector: "#add-new-campaign #add-campaign-organization",
      content: "Choose the organization please. The field is mandatory.",
      action: node => node.focus()
    },
    {
      selector: "#create-button",
      content: "Let's create the campaign!"
    }
  ];
};

export const STEPS_CAMPAIGN_ADD_ONS = selected => {
  return [
    {
      selector: ".add-ons-channels",
      content: "The list of add-ons",
      action: element => {
        window.scrollTo(element.offsetTop, element.offsetTop - 150);
      }
    },
    selected
      ? {
          selector: ".selected-list",
          content: "This is selected channels list and the discounts you get"
        }
      : {
          selector: ".summary-item",
          content: "This is selected channels list and the discounts you get summary"
        },
    {
      selector: ".total",
      content: "This is the final price"
    }
  ];
};

export const STEPS_CAMPAIGN_REVIEW = (
  channels,
  add_ons,
  social_media,
  banners,
  others,
  agreement1,
  agreement2
) => {
  return [
    {
      selector: "#vacancy-review",
      content: "Review vacancy",
      action: node => node.focus()
    },
    ...(channels
      ? [
          {
            selector: "#channel-review",
            content: "Review channels",
            action: node => node.focus()
          }
        ]
      : []),
    ...(add_ons
      ? [
          {
            selector: "#add-ons-review",
            content: "Review add-ons",
            action: node => node.focus()
          }
        ]
      : []),
    ...(social_media
      ? [
          {
            selector: "#social-media-review",
            content: "Review add-ons",
            action: node => node.focus()
          }
        ]
      : []),
    ...(banners
      ? [
          {
            selector: "#banners-review",
            content: "Review add-ons",
            action: node => node.focus()
          }
        ]
      : []),
    ...(others
      ? [
          {
            selector: "#others-review",
            content: "Review add-ons",
            action: node => node.focus()
          }
        ]
      : []),
    {
      selector: ".total",
      content: "Review total price",
      action: node => node.focus()
    },
    {
      selector: ".pdfs",
      content: "You can download pdfs",
      action: node => node.focus()
    },
    {
      selector: ".agrees",
      content: "You should agree",
      action: node => node.focus()
    },
    ...(agreement1 && agreement2
      ? [
          {
            selector: ".icon-alignment-right",
            content: "let's go",
            action: node => node.focus()
          }
        ]
      : [])
  ];
};

export const STEPS_SOCIAL_MEDIA = () => {
  return [
    {
      selector: ".facebook",
      content: "You can see the advertisement examples",
      action: element => {
        window.scrollTo(element.offsetTop, element.offsetTop - 150);
      }
    },
    {
      selector: ".next-btn",
      content: "Let's go next"
    }
  ];
};

export const STEPS_CAMPAIGN_CHANNELS = (adding, selected, suggested) => {
  return [
    suggested
      ? {
          selector: ".campaign-channels-tab",
          content:
            "Brockmeyer gives suggetions for channel choices. Now you see the suggested channels"
        }
      : {
          selector: ".campaign-channels-tab",
          content: "Brockmeyer gives suggetions for channel choices. Now you see all the channels"
        },
    suggested
      ? {
          selector: ".tour-scroll",
          content: "This is suggested channels list. You need to choose at least one channel",
          action: element => {
            window.scrollTo(element.offsetTop, element.offsetTop - 150);
          }
        }
      : {
          selector: ".tour-scroll",
          content: "This is all channels list. You need to choose at least one channel",
          action: element => {
            window.scrollTo(element.offsetTop, element.offsetTop - 150);
          }
        },
    ...(adding
      ? [
          {
            selector: ".summary-item",
            content: "selected channels list and the discounts you get is loading"
          }
        ]
      : selected && !adding
      ? [
          {
            selector: ".selected-list",
            content: "This is selected channels list and the discounts you get"
          }
        ]
      : []),
    {
      selector: ".total",
      content: "This is the final price"
    }
  ];
};

export const CAMPAIGN_DETAILS_STEPS = () => {
  return [
    {
      selector: ".educations",
      content: "Choose the eduation level",
      action: node => node.focus()
    },
    {
      selector: ".jobLevel",
      content: "Choose the job level",
      action: node => node.focus()
    },
    {
      selector: ".regions",
      content: "Choose the regions",
      action: node => node.focus()
    },
    {
      selector: ".jobProfiles",
      content: "Choose the job profile",
      action: node => node.focus()
    },
    {
      selector: ".sector",
      content: "Choose the sector",
      action: node => node.focus()
    },
    {
      selector: ".contractType",
      content: "Choose the contract type",
      action: node => node.focus()
    },
    {
      selector: ".jobCompetence",
      content: "Choose the job competence",
      action: node => node.focus()
    },
    {
      selector: ".next-btn",
      content: "let's go"
    }
  ];
};

export const BANNER_STEPS = () => {
  return [
    {
      selector: ".content",
      content: "The banner",
      action: element => {
        window.scrollTo(element.offsetTop, element.offsetTop - 150);
      }
    },
    {
      selector: ".next-btn",
      content: "Let's go"
    }
  ];
};

export const fonts = [
  { value: "Raleway", text: "Raleway" },
  { value: "OpenSans", text: "Open Sans" }
];

export const DEFAULT_COLOR_SCHEME_SETTINGS = {
  primaryColor: "#59b55c",
  secondaryColor: "#0b6b99",
  logo: "/assets/images/logo_icon.png",
  font: "Raleway",
  primaryTextColor: "#ffffff",
  secondaryTextColor: "#ffffff"
};

export const PREVIEW_CHANNEL = {
  name: "Preview Channel",
  addedToCampaign: true,
  channelType: 19,
  days: "0.00",
  description: "Preview Description",
  id: -1,
  statistics: { estimatedClicks: null, rating: null },
  price: 0
};

export const BLACK_COLOR = "#000000";
export const WHITE_COLOR = "#ffffff";
