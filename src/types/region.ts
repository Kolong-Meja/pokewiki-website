export type RegionResponse = {
  count: number;
  next: string | null;
  previous: string | null;
  results: Region[];
};

export type Region = {
  name: string;
  url: string;
  detail: RegionDetail | null;
};

type RegionDetail = {
  id: number;
  locations: RegionLocation[];
};

type RegionLocation = {
  name: string;
  url: string;
};
