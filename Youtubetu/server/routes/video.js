const express = require('express');
const router = express.Router();
const { Video } = require("../models/Video");
const path = require('path')

const { auth } = require("../middleware/auth");
const multer =require('multer');
const ffmpeg = require('fluent-ffmpeg');
const Subscriber = require("../models/Subscriber")

// STORAGE MULTER CONFIG
let storage = multer.diskStorage({
    destination: (req, file, cb) =>{
        cb(null, "uploads/")
    },
    filename: (req,file, cb) =>{
        cb(null, `${Date.now()}_${file.originalname}`)
    },
})


const upload = multer({
    storage: storage,
    fileFilter: (req, file, cb) => {
      const ext = path.extname(file.originalname);
  
      if (ext !== '.mp4') {
        console.log('it is not mp4');
        return cb(new Error('only mp4 is allowed'), false);
      }
      cb(null, true);
    }
  }).single("file");


router.post('/uploadfiles', (req,res) => {

    // 비디오를 서버에서 저장한다.
    upload(req, res, err =>{
        if(err){
            return res.json({ success: false, 'message': err})
        }
        return res.json({success: true, url: res.req.file.path, fileName: res.req.file.filename})
        
    })
})

router.post('/uploadVideo', (req,res) => { 
    
    // 비디오 정보들을 저장한다.

    const video = new Video(req.body)
    
    video.save((err,doc)=>{
        if(err) return res.json({success: false, err})
        res.status(200).json({success: true})
    })

})

router.post('/getSubscriptionVideos', (req,res) => {
    
    // 자신의 아이디를 가지고 구독하는 사람들을 찾는다.
    let subscribedUser = [];

    Subscriber.find({"userFrom": req.body.userFrom})
    .exec((err, subscriberInfo) => {
        if(err) {return res.status(400).send(err)
        }else{
            subscriberInfo.map((subscriber,i)=>{
                subscribedUser.push(subscriber.userTo)
                
            })
        //Need to Fetch all of the Videos that belong to the Users that I found in previous step. 
        Video.find({ writer: { $in: subscribedUser }})
          .populate('writer')
          .exec((err, videos) => {
              if(err) return res.status(400).send(err);
              res.status(200).json({ success: true, videos })    
        })
        }
    })
})
 
router.get('/getVideos', (req,res) => {

    // 비디오를 DB 에서 가져와서 클라이언트에 보낸다

    Video.find()
        // populate를 쓰면 writer의 모든정보를 블러옴 ref: User
        .populate('writer')
        .exec((err, videos) =>{
            if (err) return res.status(400).send(err)
            res.status(200).json({ success:true, videos})
        })

})

router.post('/getVideoDetail', (req,res) => {

    Video.findOne({"_id" : req.body.videoId})
        .populate('writer')
        .exec((err,videoDetail)=>{
            if(err) return res.status(400).send(err)
            return res.status(200).json({success: true, videoDetail})
        })

})




router.post('/thumbnail', (req,res) => {

    // 썸네일 생성하고 비디오 러닝타임도 가져오기

    let filePath = ""
    let fileDuration = ""


    // 비디오 정보 가져오기
    ffmpeg.setFfmpegPath("C:\\Program Files\\ffmpeg-5.0.1-full_build\\bin\\ffmpeg.exe")
    ffmpeg.ffprobe(req.body.url, function (err, metadata) {
        console.dir(metadata)
        console.log(metadata.format.duration)
        fileDuration = metadata.format.duration  
    })

    // 썸네일 생성
    ffmpeg(req.body.url)
    .on('filenames', function (filenames){
        console.log('Will generate ' + filenames.join(', '))
        //console.log(filenames)

        filePath =  "uploads/thumbnails/" +filenames[0]
    })
    .on('end', function() {
        console.log('Screenshots taken')
        return res.json({success: true, url: filePath, fileDuration: fileDuration})
    })
    .on('error', function(err){
        console.error(err)
        return res.json({success: false, err})
    })
    .screenshot({
        // Will take screenshots at 20%, 40%, 60% and 80% of the video
        count: 1,
        folder: 'uploads/thumbnails',
        size: '320x240',
        //'%b' : input basename (filename w/o extension)
        filename: 'thumbnail-%b.png'
    })

})

module.exports = router
