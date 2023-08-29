// /routes/post.router.js

import express from 'express';
import Schemapost from '../schmas/post.schema.js'
const router = express.Router();




/* 게시판 등록  API*/

router.post('/posts', async(req,res, next) =>{

    const {title, user, password , content } = req.body
    if(!user || !password || !title || !content){
        return res.status(400).json({ Message : '데이터 형식이 올바르지 않습니다.'})
    }
    
    const newPost = new Schemapost({
        user,
        password,
        title,
        content,
        createdAt : new Date()

    })
    await newPost.save();
    res.status(201).json({message:'개시글을 생성하였습니다'})
    
}) 


/* 게시판 목록 조회 */
router.get('/posts',  async(req, res, next) => {


    const cheakpost = await Schemapost.find().sort({createdAt : -1}).exec();


    const mapCheakpost = cheakpost.map(post =>({
        postId :post._id,  // _id 를 postId로 변경
        user: post.user,
        title : post.title,
        createdAt: post.createdAt
    }));


    return res.status(200).json({ mapCheakpost });
    

  });

/* 게시글 상세 조회 */
router.get('/posts/:postId', async(req, res, next) => {

    const {postId} = req.params;

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


    const editpost = await Schemapost.findById(postId).exec();

    /* 에러 */
 
    if(!editpost) {
        return res.status(404).json({message : '게시글 조회에 실패하였습니다.'})
    }

    if(editpost.password !== password){
        return res.status(400).json({message : '데이터 형식이 올바르지 않습니다.'})
    }



    editpost.title  = title;

    editpost.content = content;


    await editpost.save();
    

    return res.status(200).json({massege: '게시글이 수정되었습니다.'})


});

/* 게시글 삭제 */
router.delete('/posts/:postId', async(req,res,next)=>{
    const {postId} = req.params;
    const {password} = req.body;

    

    const  deletepost = await Schemapost.findById(postId).exec();
    
    /* 에러 */
    
    if(!deletepost){
        return res.status(404).json({message : '게시글 조회에 실패하였습니다.'})
    }
    
    if(deletepost.password !== password){
        return res.status(400).json({message : '데이터 형식이 올바르지 않습니다.'})
    }
    

    await deletepost.deleteOne({password: postId});
    

    return res.status(200).json({message : '게시글을 삭제하였습니다.'});


});





export default router;