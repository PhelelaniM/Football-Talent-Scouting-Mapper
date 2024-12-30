export interface Player {
  name: string;
  position: string;
  club: string;
  province: string;
  city: string;
}

export interface ProvinceCoordinates {
  [key: string]: [number, number];
}
