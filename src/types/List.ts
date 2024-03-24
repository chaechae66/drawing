export interface TList {
  contentType: "image/jpeg" | "image/jpg" | "image/png";
  data: string;
  user: string;
  _id: string;
  regDate: string;
  likeCount: number;
}

export interface TComment {
  _id: string;
  regDate: string;
  body: string;
  user: string;
}
