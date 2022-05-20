import React, {useEffect,useState}from 'react'
import {Tooltip, Icon} from 'antd'
import axios from 'axios'


function LikeDislike(props) {

    const [Likes, setLikes] = useState(0);
    const [Dislikes, setDislikes] = useState(0);
    const [LikeAction, setLikeAction] = useState(null);
    const [DislikeAction, setDislikeAction] = useState(null);
    
    let variable ={ }

    if(props.video) {
        variable = {videoId: props.videoId , userId: props.userId}
    }else {
        variable = {commentId:props.commentId, userId: props.userId}
    }

    useEffect(() => {
        axios.post('/api/like/getLikes',variable)
            .then(response=> {
                if (response.data.success){
                    // 얼마나 많은 좋아요를 받았는지
                    setLikes(response.data.likes.length)

                    // 내가 이미 그 좋아요를 눌렀는지
                    response.data.likes.map(like =>{
                        if(like.userId === props.userId){
                            setLikeAction('liked')
                        }
                    })
                } else{
                    alert('Likes에 정보를 가져오지 못했습니다.')
                }
            })

            axios.post('/api/like/getDislikes',variable)
            .then(response=> {
                if (response.data.success){
                    // 얼마나 많은 싫어요를 받았는지
                    setDislikes(response.data.dislikes.length)

                    // 내가 이미 그 싫어요를 눌렀는지
                    response.data.dislikes.map(dislike =>{
                        if(dislike.userId === props.userId){
                            setDislikeAction('disliked')
                        }
                    })
                } else{
                    alert('DisLikes에 정보를 가져오지 못했습니다.')
                }
            })
    }, [])

    const onLike =()=>{

        //If like button is unclicked
        if(LikeAction === null){
            axios.post('/api/like/upLike', variable)
                .then(response=>{
                    if(response.data.success){
                        // like + 1
                        setLikes(Likes + 1)
                        // state : liked
                        setLikeAction('liked')
                    
                        // If dislike button is already clicked
                        if(DislikeAction !== null){
                            // turn the unchecked
                            axios.post('/api/like/downDislike')
                                .then(response=>{
                                    if(response.data.success){
                                        setDislikeAction(null)
                                        // dislike - 1
                                        setDislikes(Dislikes - 1)
                                    }else{
                                        console.log('why')
                                    }
                                })              
                        }
                    } else{
                        alert('Like를 올리지 못하였습니다.')
                    }
                })
        } else{
            //if like button is already clicked
            axios.post('/api/like/downLike', variable)
                .then(response=>{
                    if(response.data.success){
                        setLikes(Likes - 1)
                        setLikeAction(null)
                    } else{
                     alert('Like를 내리지 못하였습니다.')
                    }
                })
            }
        }

    const onDisLike =()=>{

        if(DislikeAction === null){
            axios.post('/api/like/upDislike', variable)
                .then(response=>{
                    if(response.data.success){
                        setDislikes(Dislikes + 1)
                        setDislikeAction('disliked')
                    } else{
                        alert('dislike를 채우지 못했습니다.')
                    }
                })
            if(LikeAction !== null){
                  // turn the unchecked
                  axios.post('/api/like/downLike')
                  .then(response=>{
                      if(response.data.success){
                          setLikeAction(null)
                          // dislike - 1
                          setLikes(Likes - 1)
                      }else{
                          console.log('why')
                      }
                  })   

            }
        } else{
            axios.post('/api/like/downDisLike', variable)
                .then(response => {
                    if (response.data.success) {
                        setDislikes(Dislikes - 1)
                        setDislikeAction(null)

                    } else {
                        alert('Failed to increase dislike')
                    }
                })

    }
    }


    
  return (
    <div>
        <span key="comment-basic-like">
            <Tooltip title="Like">
                <Icon type="like"
                    theme={LikeAction === 'liked' ? 'filled':'outlined'}
                    onClick={onLike}
                />
            </Tooltip>
            <span style={{ paddingLeft:'8px', cursor:'auto'}}> {Likes}</span>
        </span>

        <span key="comment-basic-dislike">
            <Tooltip title="Dislike">
                <Icon type="dislike"
                    theme={DislikeAction === 'disliked' ? 'filled':'outlined'}
                    onClick={onDisLike}
                />
            </Tooltip>
            <span style={{ paddingLeft:'8px', cursor:'auto'}}> {Dislikes}</span>
        </span>

    </div>
  )
  }

export default LikeDislike