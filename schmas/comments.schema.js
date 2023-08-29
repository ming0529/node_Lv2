// schemas/comment.schema.js

import mongoose from "mongoose";


const commentSchema = new mongoose.Schema({
  user: {
    type: String,
    required: true, // 필수요소
  },
  password: {
    type: String,
    required: true, // 필수요소
  },
  content: {
    type : String,
    required : true, // 필수요소
  },
  createdAt: {
    type: Date, // createAt 필드는 Date 타입을 가집니다.
    required: false, 
  },
});



// 프론트엔드 서빙을 위한 코드입니다. 모르셔도 괜찮아요!
commentSchema.virtual("commentId").get(function () {
  return this._id.toHexString();
});
commentSchema.set("toJSON", {
  virtuals: true,
});



// postSchema를 바탕으로 post모델을 생성하여, 외부로 내보냅니다.
export default mongoose.model("Schemacomment", commentSchema);
