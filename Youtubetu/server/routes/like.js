const express = require('express');
const router = express.Router();

const {Like} = require("../models/Like")
const {Dislike} =require("../models/Dislike")

   
router.post("/getLikes", (req,res) =>{

    let variable ={}

    if(req.body.videoId){
        variable = {videoId: req.body.videoId}
    }else{
        variable = {commentId: req.body.commentId}
    }

    Like.find(variable)
        .exec((err, likes)=>{
            if(err) return res.status(400).send(err)
            res.status(200).json({success: true, likes})
        })
})

router.post("/getDislikes", (req,res) =>{

    let variable ={}

    if(req.body.videoId){
        variable = {videoId: req.body.videoId}
    }else{
        variable = {commentId: req.body.commentId}
    }

    Dislike.find(variable)
        .exec((err, dislikes)=>{
            if(err) return res.status(400).send(err)
            res.status(200).json({success: true, dislikes})
        })
})

router.post("/upLike", (req,res) =>{

    let variable ={}

    if(req.body.videoId){
        variable = {videoId: req.body.videoId, userId: req.body.userId}
    }else{
        variable = {commentId: req.body.commentId, userId: req.body.userId}
    }

    // Like collection에다가 클릭 정보 넣어주기
    const like = new Like(variable)

    like.save((err, likeResult) => {
        if (err) return res.json({ success: false, err})
        return res.json({success: true})
    })

    
})

router.post("/downLike", (req,res) =>{

    let variable = {}
    if (req.body.videoId) {
        variable = { videoId: req.body.videoId }
    } else {
        variable = { commentId: req.body.commentId}
    }
    Like.findOneAndDelete(variable)
        .exec((err,result) =>{
            if(err) {
                console.log(err)
                return res.status(400).json({success:false,err})
            }
            res.status(200).json({success: true})
        })
})
    
    
/////////////////////////////dislike//////////////////////////////////////////

router.post("/upDisLike", (req, res) => {

    let variable = {}
    if (req.body.videoId) {
        variable = { videoId: req.body.videoId, userId: req.body.userId }
    } else {
        variable = { commentId: req.body.commentId , userId: req.body.userId }
    }
    const disLike = new Dislike(variable)
    //save the like information data in MongoDB
    disLike.save((err, dislikeResult) => {
        if (err) return res.status(400).json({ success: false, err });
        return res.status(200).json({success:true})
    })
})


router.post("/downDislike", (req,res) =>{

    let variable = {}
    if (req.body.videoId) {
        variable = { videoId: req.body.videoId }
    } else {
        variable = { commentId: req.body.commentId}
    }
   
     Dislike.findOneAndDelete(variable)
        .exec((err, disLikeResult) => {
            if (err) return res.status(400).json({ success: false, err})
            console.log(err)
            res.status(200).json({success: true})
        })

})








module.exports = router
