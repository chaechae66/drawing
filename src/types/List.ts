export interface TList {
  contentType: "image/jpeg" | "image/jpg" | "image/png";
  data: string;
  user: string;
  _id: string;
  regDate: string;
  likeCount: number;
  userInfo: {
    id: string;
    nickname: string;
    _id: string;
  };
  commentCount: number;
}

export interface TComment {
  _id: string;
  regDate: string;
  body: string;
  user: string;
  userInfo: {
    id: string;
    nickname: string;
    _id: string;
  };
}

export interface Tlike {
  articleID: string;
  isLike: boolean;
  user: string;
  _id: string;
}
