import { Injectable } from '@nestjs/common';
import * as faker from 'faker';

export enum EIcon {
  Favorite,
  Camera,
  Bed,
  Bath,
  Plus,
  User,
  Home,
  More,
}

export interface IPreset {
  id: number;
  title: string;
  price: number;
  color1: string;
  color2: string;
  pattern: ESpecialBrickPattern;
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
  agent: IObjectAgent;
  isFavorite: boolean;
  pictures: IObjectPicture[];
  coverPicture: IObjectPicture;
}

export interface IAddress {
  streetAddress: string;
  country: ICountry;
  city: ICity;
  geoPoint: IGeoPoint;
}

export interface IGeoPoint {
  lat: number;
  lng: number;
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

export interface IObjectAgent {
  id: number;
  avatar: string;
  type: EObjectAgentType;
  name: string;
}

export interface IObjectParam {
  id: number;
  icon: EIcon;
  name: string;
  value: string;
}

export interface IObjectPicture {
  id: number;
  title: string;
  description: string;
  src: string;
}

export enum EAdvertType {
  DetachedHouse,
  TownHouse,
  Flat,
  Studio,
}

export enum EAdvertContractType {
  Purchase,
  Rent,
}

export enum EObjectAgentType {
  Private,
  Realtor,
  Agency,
}

export enum ESpecialBrickPattern {
  Circles = 'circles',
  Stripes = 'stripes',
  Pluses = 'pluses',
  Waves = 'waves',
}

const SPECIAL_COLORS: string[][] = [
  ['#AE6FE3', '#363DB4'],
  ['#58C2C8', '#4D4AB1'],
  ['#EDA8FF', '#597AFF'],
  ['#AEDEAF', '#1482B1'],
  ['#C77DAE', '#7A34F3'],
  ['#FDA786', '#FF5C7B'],
  ['#5BA3E4', '#73D9C4'],
];

@Injectable()
export class FakerService {
  constructor() {
  }

  public generateAgent(objectId: number): IObjectAgent {
    const agentType: EObjectAgentType = faker.random.arrayElement([
      EObjectAgentType.Private,
      EObjectAgentType.Realtor,
      EObjectAgentType.Agency,
    ]);

    const name: string = agentType === EObjectAgentType.Agency ? faker.company.companyName() : `${faker.name.firstName()} ${faker.name.lastName()}`;

    return {
      id: faker.random.number({
        min: 1,
        max: 100000,
      }),
      avatar: `https://picsum.photos/600/400?i=${objectId}&t=agent`,
      type: agentType,
      name,
    };
  }

  public generateAddress(): IAddress {
    const country = this.generateCountry();

    return {
      streetAddress: faker.address.streetAddress(),
      country,
      city: this.generateCity(country.id),
      geoPoint: this.generateGeoPoint(),
    };
  }

  public generateGeoPoint(): IGeoPoint {
    return {
      lat: parseFloat(faker.address.latitude()),
      lng: parseFloat(faker.address.longitude()),
    };
  }

  public generateCountry(): ICountry {
    return {
      id: faker.random.number(100000),
      title: faker.address.country(),
      nativeTitle: faker.address.country(),
      isoCode: faker.address.countryCode(),
      geoPoint: this.generateGeoPoint(),
    };
  }

  public generateCity(countryId: number): ICity {
    return {
      id: faker.random.number(100000),
      isoCode: faker.address.cityPrefix(),
      countryId,
      title: faker.address.city(),
      nativeTitle: faker.address.city(),
      geoPoint: this.generateGeoPoint(),
    };
  }

  public generatePreset(): IPreset {
    const colorPair = faker.random.arrayElement(SPECIAL_COLORS);

    return {
      id: faker.random.number({ min: 1, max: 1000 }),
      title: faker.random.words(2),
      price: faker.random.number({ min: 1000, max: 5000 }),
      color1: colorPair[0],
      color2: colorPair[1],
      pattern: faker.random.arrayElement([
        ESpecialBrickPattern.Pluses,
        ESpecialBrickPattern.Circles,
        ESpecialBrickPattern.Stripes,
        ESpecialBrickPattern.Waves,
      ]),
    };
  }

  public generateAdvert(objectId: number): IAdvert {
    const params: IObjectParam[] = [];

    params.push(
      {
        id: 1,
        icon: EIcon.Bed,
        name: 'bedrooms',
        value: faker.random.number({ min: 1, max: 5 }).toString(),
      },

      {
        id: 2,
        icon: EIcon.Bath,
        name: 'bathrooms',
        value: faker.random.number({ min: 1, max: 4 }).toString(),
      },
    );

    const pictures: IObjectPicture[] = [];
    const photosCount: number = faker.random.number({ min: 1, max: 7 });

    for (let i: number = 0; i < photosCount; i++) {
      pictures.push({
        id: i,
        title: faker.lorem.sentence(2),
        description: faker.lorem.sentence(10),
        src: `https://picsum.photos/600/400?i=${objectId}&a=${i}`,
      });
    }

    const coverPicture: IObjectPicture = pictures[0];

    return {
      id: objectId,
      title: faker.name.title(),
      type: faker.random.arrayElement([
        EAdvertType.Flat,
        EAdvertType.DetachedHouse,
        EAdvertType.TownHouse,
        EAdvertType.Studio,
      ]),
      contractType: faker.random.arrayElement([
        EAdvertContractType.Rent,
        EAdvertContractType.Purchase,
      ]),
      constructionDate: faker.date.past(20),
      price: faker.random.number({ min: 50000, max: 1500000, precision: 2 }),
      address: this.generateAddress(),
      params,
      agent: this.generateAgent(objectId),
      isFavorite: faker.random.boolean(),
      pictures,
      coverPicture,
    };
  }
}