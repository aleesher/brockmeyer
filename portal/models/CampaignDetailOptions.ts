interface IOption {
  label: string,
  value: number
}

export interface ICampaignDetailOptions {
  educations: IOption[],
  jobLevels: IOption[],
  regions: IOption[],
  jobProfiles: IOption[],
  sectors: IOption[],
}
