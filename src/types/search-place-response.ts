export interface SearchPlaceResponse {
  places: Place[];
}

export interface Place {
  formattedAddress: string;
  location: Location;
  displayName: DisplayName;
}

export interface Location {
  latitude: number;
  longitude: number;
}

export interface DisplayName {
  text: string;
  languageCode: string;
}
