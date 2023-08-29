// routes/comment.js

import express from 'express';
import Schemacomment from '../schmas/comments.schema.js'
import postRouter from './post.router.js'

//express.js 라우터 생성

const router = express.Router();



/* 댓글 생성 API */

router.post('/post/:_postId/comments', async(req,res,next) =>{

    const { password, user, content } = req.body

    if(!content){
        return res.status(400).json({ Message : '댓글 내용을 입력해주세요'})
    }

    if(!password || !user || !content){
        return res.status(400).json({ Message : '데이터 형식이 올바르지 않습니다.'})
    }
    // newComment 라는 새로운  Schemacomment 를만든다 /post 생성
    const newComment = new Schemacomment({
        user,
        password,
        content,
        createdAt : new Date()

    })

    //newComment 를 저장한다
    await newComment.save();

    // 완료되었을때 메세지
    res.status(201).json({message:'댓글을 생성하였습니다.'})
});


/* 댓글 목록 조회 */


router.get('/post/:_postId/comments', async(req,res,next) =>{

const cheakcomment = await Schemacomment.find().sort({createdAt : -1}).exec(); 


const mapCheakcomment = cheakcomment.map(comment =>({
    commentId : comment._id,
    user: comment.user,
    content : comment.content,
    createdAt: comment.createdAt
}));



return res.status(200).json({ mapCheakcomment });

});



/* 댓글 수정 */

router.put('/posts/:_postId/comments/:_commentId', async(req,res,next)=>{
    const {_commentId} = req.params;
    const {password , content} = req.body
    
    // 변수 editcomment = 게시글을 조회해 commentId 인 값을 찾음
    const editcomment = await Schemacomment.findById(_commentId).exec();

    /* 에러 */
    if(!content){
        return res.status(400).json({ Message : '댓글 내용을 입력해주세요'})
    }
    if(!_commentId){
        return res.status(404).json({ Message : '댓글 조회에 실패하였습니다.'})
    }
    if(editcomment.password !== password){
        return res.status(400).json({ Message : '데이터 형식이 올바르지 않습니다.'})
    }


    /* 댓글 변경 */
    editcomment.content = content;

    // 수정 내용 저장
    await editcomment.save();
    
    // 수정이 성공 했을 때 메세지
    return res.status(200).json({massege: '댓글이 수정되었습니다.'})

});



/* 댓글 삭제 */

router.delete('/posts/:_postId/comments/:_commentId', async(req,res,next) => {
    const {_commentId} = req.params;
    const {password} = req.body;

    // 개시글을 조회해서 commentId 값을 찾음
    const  deletecomment = await Schemacomment.findById(_commentId).exec();

    if(!_commentId){
        return res.status(404).json({message : '댓글 조회에 실패하였습니다.'})
    }
    if(deletecomment.password !== password){
        return res.status(400).json({ Message : '데이터 형식이 올바르지 않습니다.'})
    }

    //실제 삭제
    await deletecomment.deleteOne({password: _commentId});
    
    // 삭제되고 난후 서버에 메세지 출력
    return res.status(200).json({message : '게시글을 삭제하였습니다.'});

})








// routes/comment.js

export default router;