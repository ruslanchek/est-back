import { EAdvertContractType, EAdvertType } from './advert.enum';
import { IAgent } from '../agent/agent.interface';

export interface IAdvertPicture {
  id: number;
  title: string;
  description: string;
  src: string;
}

export interface IObjectParam {
  id: number;
  icon: string;
  name: string;
  value: string;
}

export interface ICountry {
  id: number;
  title: string;
  nativeTitle: string;
  isoCode: string;
  geoPoint: IGeoPoint;
}

export interface ICity {
  id: number;
  isoCode: string;
  title: string;
  nativeTitle: string;
  countryId: number;
  geoPoint: IGeoPoint;
}

export interface IGeoPoint {
  lat: number;
  lng: number;
}

export interface IAddress {
  streetAddress: string;
  country: ICountry;
  city: ICity;
  geoPoint: IGeoPoint;
}

export interface IAdvert {
  id: number;
  title: string;
  type: EAdvertType;
  contractType: EAdvertContractType;
  constructionDate: Date;
  price: number;
  address: IAddress;
  params: IObjectParam[];
  agent: IAgent;
  isFavorite: boolean;
  pictures: IAdvertPicture[];
  coverPicture: IAdvertPicture;
}