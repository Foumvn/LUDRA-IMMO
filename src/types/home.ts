
export interface Statistic {
  number: string;
  label: string;
}

export interface ProcessStep {
  icon: string;
  title: string;
  description: string;
}

export interface FilterOption {
  value: string;
  label: string;
}

export interface FilterData {
  status: FilterOption[];
  locations: FilterOption[];
  propertyTypes: FilterOption[];
  priceRanges: FilterOption[];
  beds: FilterOption[];
  baths: FilterOption[];
}