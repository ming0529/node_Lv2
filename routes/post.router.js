// /routes/post.router.js

import express from 'express';
import Schemapost from '../schmas/post.schema.js'
const router = express.Router();




/* 게시판 등록  API*/

router.post('/posts', async(req,res, next) =>{
    // 1. 클라이언트로 받아온 데이터를 가져온다
    const {title, user, password , content } = req.body
    //1.5 클라이언트가 유저 데이터를 전달하지 않았을때 , 클라아인트에게 에러를 반환
    if(!user || !password || !title || !content){
        return res.status(400).json({ Message : '데이터 형식이 올바르지 않습니다.'})
    }
    
    // newPost 라는 새로운 Schemapost 를 만든다. / post 등록
    const newPost = new Schemapost({
        user,
        password,
        title,
        content,
        createdAt : new Date()

    })
    // newPost 를 저장한다.
    await newPost.save();
    // 클라이언트에게 반환한다.
    res.status(201).json({message:'개시글을 생성하였습니다'})
    //res.status(201).json(newPost);
    
}) 


/* 게시판 목록 조회 */
router.get('/posts',  async(req, res, next) => {
    // 게시판 목록 조회 진행
    // 게시판 목록에서 createdAt 으로 내림차순해서 정렬한다.
        //                  mongoose 모델   목록조회 .   createAt 내림차순
    const cheakpost = await Schemapost.find().sort({createdAt : -1}).exec();
                                                    //'-createAt'

    
    // 맵 함수로 postId 로 id 값을 이름바꾸고 보여줘야 할 값만 보여줌
    const mapCheakpost = cheakpost.map(post =>({
        postId :post._id,  // _id 를 postId로 변경
        user: post.user,
        title : post.title,
        createdAt: post.createdAt
    }));


    return res.status(200).json({ mapCheakpost });
    
    // 오류 수정
    // 맵을 돌려서 가공해서 만듬
    // 맵으로 _id 를 postId 로 바꿔서 출력
    //var widgetSchema = new Schema({ ... attributes ... }, { versionKey: false }); 
    // 언더바 v값을 안보여준다.

  });

/* 게시글 상세 조회 */
router.get('/posts/:postId', async(req, res, next) => {
    // post 아이디를 찾는다
    const {postId} = req.params;
    // findById 로 포스트아이디를 가지고 와서 조회
    const cheak1post = await Schemapost.findById(postId).exec();

    if(!cheak1post){
        return res.status(400).json({Massage : '데이터 형식이 올바르지 않습니다.'})
    }

    const mapCheak1post = {
        postId :cheak1post._id,
        user: cheak1post.user,
        content : cheak1post.content,
        createdAt: cheak1post.createdAt
    }

    return res.status(201).json({mapCheak1post});
})

/* 게시글 수정 */
router.put('/posts/:postId', async(req, res, next) => {
    const {postId} = req.params;
    const {password , title, content} = req.body;

    // 변수 editpost = 게시글을 조회해 postId 인 값을 찾음
    const editpost = await Schemapost.findById(postId).exec();

    /* 에러 */
    // postId 값이 없으면 게시글 조회 실패
    if(!editpost) {
        return res.status(404).json({message : '게시글 조회에 실패하였습니다.'})
    }

    // 비밀번호가 틀리면 데이터 형식이 올바르지 않습니다.
    if(editpost.password !== password){
        return res.status(400).json({message : '데이터 형식이 올바르지 않습니다.'})
    }


    // 변수 post 에 저장된 postId 게시물 의 제목과 컨텐츠
    editpost.title  = title;

    editpost.content = content;

    // 수정 내용 저장
    await editpost.save();
    
    // 수정이 성공 했을 때 메세지
    return res.status(200).json({massege: '게시글이 수정되었습니다.'})


});

/* 게시글 삭제 */
router.delete('/posts/:postId', async(req,res,next)=>{
    const {postId} = req.params;
    const {password} = req.body;
   //  const {password} = req.body;
    
    // 개시글을 조회해서 postId 값을 찾음
    const  deletepost = await Schemapost.findById(postId).exec();
    
    /* 에러 */
    
    if(!deletepost){
        return res.status(404).json({message : '게시글 조회에 실패하였습니다.'})
    }
    
    if(deletepost.password !== password){
        return res.status(400).json({message : '데이터 형식이 올바르지 않습니다.'})
    }
    
    //실제 삭제
    await deletepost.deleteOne({password: postId});
    
    // 삭제되고 난후 서버에 메세지 출력
    return res.status(200).json({message : '게시글을 삭제하였습니다.'});


});





export default router;