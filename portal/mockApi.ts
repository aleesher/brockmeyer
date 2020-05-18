import { request as req, bindRequest, CancelToken } from "./apiUtils";

interface IRequestToken {
  campaign?: any;
  customer?: any;
  channel?: any;
  filters?: any;
}

interface IStateFilters {
  channelTypes?: number[];
  educations?: number[];
  regions?: number[];
  sectors?: number[];
}

const arrayToQS = (value?: IStateFilters) =>
  value &&
  Object.entries(value)
    .map(([key, value]) => ({ key, ids: value }))
    .filter(({ ids }) => ids.length);

const requestIds: IRequestToken = {
  campaign: undefined
};

const request = bindRequest(req());
const requestVI = bindRequest(req(45000));

export function addCampaign(data) {
  return request.post("campaigns", data);
}

export function addCustomer(data) {
  return request.post("customers", data);
}

export function addCustomerContact(data) {
  return request.post("contacts", data);
}

export function checkUser(username, password) {
  return request.get("users", { params: { "user.username": username, password } });
}

export function getCampaigns(search?: string, statusId?: string, sort?: string, page: number = 1) {
  if (requestIds.campaign) {
    requestIds.campaign.cancel("Previous operation canceled");
  }
  requestIds.campaign = CancelToken.source();
  const cancelToken = requestIds.campaign.token;
  const params = { search, statusId, sort, page };
  return request.get("campaigns", { cancelToken, params });
}

export function putShareCampaign(id, date) {
  return request.put(`campaigns/share-campaign/${id}/${date}`);
}

export function postSharedCampaign(id, date) {
  return request.post(`campaigns/share-campaign/${id}/${date}`);
}

export function getSharedCampaign(id) {
  let language = navigator.language.slice(0, 2);
  if (language === "nl") {
    language = "nl_nl";
  } else {
    language = "en_uk";
  }
  return request.get(`campaigns/shared-campaign/${id}/${language}`);
}

export function getShareCampaign(id) {
  return request.get(`campaigns/share-campaign/${id}`);
}

export function deleteShareCampaign(id) {
  return request.delete(`campaigns/share-campaign/${id}`);
}

export function getSharedCampaignChannels(hashcode, lang) {
  return request.get(`campaign-channels/share-campaigns/${hashcode}/${lang}`);
}

export function getCampaign(campaignId) {
  return request.get(`campaigns/${campaignId}`);
}

export async function getChannelFilters(name?: string, filters?: IStateFilters) {
  if (requestIds.filters) {
    requestIds.filters.cancel("Previous operation canceled");
  }
  requestIds.filters = CancelToken.source();
  const cancelToken = requestIds.filters.token;
  const params = { name, filters: arrayToQS(filters) };
  return request.get("channel-filters", { cancelToken, params });
}

export async function getChannelTypes() {
  return request.get("channel-types");
}

export async function getAddOnsInfo(id, name, filters) {
  if (requestIds.filters) {
    requestIds.filters.cancel("Previous operation canceled");
  }
  requestIds.filters = CancelToken.source();
  const cancelToken = requestIds.filters.token;
  const params = { name, filters: arrayToQS(filters) };
  return request.get(`channels/${id}/add-ons-page`, { cancelToken, params });
}

export function getChannels(
  name?: string,
  filters?: IStateFilters,
  sort?: string,
  page: number = 1
) {
  if (requestIds.channel) {
    requestIds.channel.cancel("Previous operation canceled");
  }
  requestIds.channel = CancelToken.source();
  const cancelToken = requestIds.channel.token;
  const params = { name, filters: arrayToQS(filters), page, sort };
  return request.get("channels", { cancelToken, params });
}

export function getSuggestedChannels(id, isNew) {
  return request.get(`channels/suggested/${id}/${isNew}`);
}

export function getSuggestedChannelsNew(id, isNew) {
  if (requestIds.channel) {
    requestIds.channel.cancel("Previous operation canceled");
  }
  requestIds.channel = CancelToken.source();
  const cancelToken = requestIds.channel.token;
  return request.get(`channels/suggested/${id}/${isNew}/new`, { cancelToken });
}

export function getAllChannels(id) {
  if (requestIds.channel) {
    requestIds.channel.cancel("Previous operation canceled");
  }
  requestIds.channel = CancelToken.source();
  const cancelToken = requestIds.channel.token;
  return request.get(`channels/${id}/all`, { cancelToken });
}

export function getCampaignChannels(campaignId?: number) {
  return request.get(`campaign-channels/${campaignId}`);
}

export function addCampaignChannel(data) {
  return request.post("campaign-channels", data);
}

export function addCampaignChannelNew(data) {
  return request.post("campaign-channels/new", data);
}

export function removeCampaignChannel(campaign_id, channel_id) {
  return request.delete("campaign-channels", { params: { campaign_id, channel_id } });
}

export function getContacts(companyId) {
  return request.get(`contacts/?company_id=${companyId}`);
}

export function getContactTypes() {
  return request.get("contact-types");
}

export function getCountries(search?: string) {
  return request.get("countries", { params: { search } });
}

export function getCustomers(name?: string, sort?: string, page: number = 1) {
  if (requestIds.customer) {
    requestIds.customer.cancel("Previous operation canceled");
  }
  requestIds.customer = CancelToken.source();
  const cancelToken = requestIds.customer.token;
  const params = { name, sort, page };
  return request.get("customers", { cancelToken, params });
}

export async function getDetailsOptions() {
  const [
    educations,
    jobLevel,
    regions,
    jobProfiles,
    sector,
    contractType,
    jobCompetence
  ] = await request.get("/campaign-details/fields/all");

  return { educations, jobLevel, regions, jobProfiles, sector, contractType, jobCompetence };
}

export function getUserInfo() {
  return request.get("me");
}

export function fetchLanguages() {
  return request.get("data-languages");
}

export function updateLanguage(data) {
  return request.patch("me", data);
}

export function updateColorScheme(data) {
  return request.patch(`customers/${data.id}`, data);
}

export function updateUserColorScheme(data) {
  return request.patch("me/change-colors", data);
}

export function removeCampaign(id) {
  return request.delete(`campaigns/${id}`);
}

export function removeCustomerContact(id) {
  return request.delete(`contacts/${id}`);
}

export function updateCampaign(data) {
  return request.patch(`campaigns/${data.id}`, data);
}

export function updateCustomer(data) {
  return request.patch(`customers/${data.id}`, data);
}

export function updateCustomerContact(data) {
  return request.patch(`contacts/${data.id}`, data);
}

export function getCampaignStatusTypes() {
  return request.get("campaign-status-types");
}

export function approveCampaign(id) {
  return request.patch(`campaigns/${id}/approve`);
}

export function publishCampaign(id) {
  return request.patch(`campaigns/${id}/publish`);
}

export function cancelCampaign(id) {
  return request.patch(`campaigns/${id}/cancel`);
}

export function retractCampaign(id) {
  return request.put(`campaigns/${id}/retract`);
}

export function fetchMarketAnalysis(regions: string[], occupationId, iscoGroupId?) {
  return request.get("market-analysis", { params: { regions, occupationId, iscoGroupId } });
}

export function fetchOccupations(search?: string, pageSize: number = 30) {
  return request.get("occupations", { params: { search, pageSize } });
}

export function getOccupation(id) {
  return request.get(`occupations/${id}`);
}

export function addVacancyImprover(data) {
  return request.post(`vacancy-improver`, data);
}

export function checkVacancyImprover(hash) {
  return requestVI.put(`vacancy-improver/${hash}`);
}

export function getVacancyImprover(hash) {
  return request.get(`vacancy-improver/${hash}`);
}
