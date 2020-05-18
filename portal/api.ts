const CAMPAIGN_KEY = "campaign";

function setCampaign(campaign) {
  localStorage.setItem(CAMPAIGN_KEY, JSON.stringify(campaign));
}

function getCampaign() {
  return JSON.parse(localStorage.getItem(CAMPAIGN_KEY) || "{}");
}

export default {
  setCampaign,
  getCampaign
};
