import mongoose, { models } from "mongoose";

const userSchema = new mongoose.Schema({
  id: {
    type: String,
    required: true,
  },
  nickname: {
    type: String,
    required: true,
  },
});
const commentSchema = new mongoose.Schema(
  {
    regDate: {
      type: Date,
      required: true,
    },
    userInfo: userSchema,
    body: {
      type: String,
    },
    user: {
      type: String,
      require: true,
    },
    articleID: {
      type: mongoose.Types.ObjectId,
      ref: "Article",
    },
  },
  {
    versionKey: false,
  }
);

const Comment = models?.Comment || mongoose.model("Comment", commentSchema);

export default Comment;
