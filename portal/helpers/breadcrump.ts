import { ADD_ONS_ID } from "constants/constants";
import { NAVIGATION_URLS } from "constants/URIConstants";
import { IBreadcrump, IChannel } from "models/.";

export const getMainBreadcrump = (
  campaignBreadrumbs: IBreadcrump[],
  status: any,
  channels: IChannel[]
) => {
  let breadcrumbUrl = NAVIGATION_URLS.CAMPAIGN_CHANNELS;

  if (status.name === "order_open") {
    breadcrumbUrl = NAVIGATION_URLS.CAMPAIGN_VACANCY;
  } else {
    const hasChannels = !!channels.length;
    if (hasChannels) {
      breadcrumbUrl = NAVIGATION_URLS.CAMPAIGN_ADD_ONS;
      const hasAddons = channels.findIndex(channel => channel.channelType === ADD_ONS_ID);
      if (hasAddons) {
        breadcrumbUrl = NAVIGATION_URLS.CAMPAIGN_REVIEW;
      }
    }
  }

  return campaignBreadrumbs.find(({ url }: IBreadcrump) => url === breadcrumbUrl) || {};
};
