
export enum AppState {
  IDLE,
  GETTING_LOCATION,
  FETCHING_PLACES,
  SHOWING_RESULTS,
  ERROR,
}

export interface Place {
  uri: string;
  title: string;
}

export interface GroundingChunk {
  maps?: Place;
  web?: Place;
}
