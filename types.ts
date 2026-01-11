export enum PropertyType {
  SALE = 'For Sale',
  RENT = 'For Rent',
}

export enum PropertyCategory {
  HOUSE = 'House',
  LAND = 'Land',
  COMMERCIAL = 'Commercial',
}

export interface Property {
  id: string;
  title: string;
  description: string;
  price: number;
  location: {
    state: string;
    lga: string;
    address: string;
  };
  features: string[];
  type: PropertyType;
  category: PropertyCategory;
  imageUrl: string;
  dateAdded: number;
  contactPhone: string;
}

export interface StateData {
  name: string;
  lgas: string[];
}

export enum UserStatus {
  PENDING = 'Pending',
  APPROVED = 'Approved',
  REJECTED = 'Rejected',
}

export interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  businessName: string;
  status: UserStatus;
  dateRequested: number;
}

export type ViewState = 'HOME' | 'LISTINGS' | 'UPLOAD' | 'CONTACT' | 'ADMIN';

export interface PropertyContextType {
  properties: Property[];
  addProperty: (property: Property) => void;
  deleteProperty: (id: string) => void;
  filterState: string;
  filterLGA: string;
  setFilterState: (state: string) => void;
  setFilterLGA: (lga: string) => void;
}