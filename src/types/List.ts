export interface TList {
  contentType: "image/jpeg" | "image/jpg" | "image/png";
  data: string;
  user: string;
  _id: string;
  regDate: string;
  count: number;
  comment: null | TComment[];
}

export interface TComment {
  _id: string;
  regDate: string;
  body: string;
  user: string;
}
