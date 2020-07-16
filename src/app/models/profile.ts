export interface IProfile {
  displayName: string,
  username: string,
  bio: string,
  image: string,
  following: boolean,
  followersCount: number,
  followingsCount: number,
  photos: IPhoto[]
}

export interface IPhoto {
  id: string,
  url: string,
  isMain: boolean
}
