import React, {useState} from 'react'
import { useSelector } from 'react-redux';
import { Comment, Avatar, Button, Input,Icon} from 'antd'
import axios from 'axios';
import LikeDislike from './LikeDislikes';

const { TextArea } = Input;

function SingleComment(props) {

    const user = useSelector(state => state.user)

    const [OpenReply, setOpenReply] = useState(false);
    const [CommentValue, setCommentValue] = useState("");

    const onClickReplyOpen = () =>{
        setOpenReply(!OpenReply)
    }

  
    
    const onHandleChange = (event) =>{
        setCommentValue(event.currentTarget.value)
    }

    
    const onDeleteComment = (targetedCommentId) => {

        let confirmRes = window.confirm('정말 이 글을 삭제하시길 원하시나요 ?');
      
        if (confirmRes) {
            const variables = {
            commentId: targetedCommentId
        }
        
        
        
        axios.post('/api/comment/deleteComment', variables)  
        .then(response => {
            if (response.data.success) {
            console.log(variables.commentId)
        } else {
            alert('댓글 지우기를 실패 했습니다.')   
        }    
        })
    }}

    

    const onSubmit =(event) =>{
        event.preventDefault()
   
        const variables ={
            content: CommentValue ,
            writer: user.userData._id,
            postId: props.postId,
            responseTo: props.comment._id           
        }

        
        axios.post('/api/comment/saveComment',variables)
            .then(response =>{
                if(response.data.success){
                    setCommentValue("")
                    setOpenReply(false)
                    props.refreshFunction(response.data.result)
                }else{
                    alert(' 커멘트를 저장하지 못했습니다.')
                    console.log(response.data)
                }
            })
    }

 
const actions = [
    <React.Fragment>
        <LikeDislike comment commentId={props.comment._id} userId={localStorage.getItem('userId')} />,
        ,<span onClick={onClickReplyOpen} key="comment-basic-reply-to">Reply to </span>
        <span onClick={() => onDeleteComment(props.comment._id)}><Icon type="delete" /></span>
    </React.Fragment>
]

return (
    <div>
        <Comment
            actions={actions}
            author={props.comment.writer.name}
            avatar={
                <Avatar
                    src={props.comment.writer.image}
                    alt="image"
                />
            }
            content={
                <p>
                    {props.comment.content}
                </p>
            }
        ></Comment>


        {OpenReply &&
            <form style={{ display: 'flex' }} onSubmit={onSubmit}>
                <TextArea
                    style={{ width: '100%', borderRadius: '5px' }}
                    onChange={onHandleChange}
                    value={CommentValue}
                    placeholder="write some comments"
                />
                <br />
                <Button style={{ width: '20%', height: '52px' }} onClick={onSubmit}>Submit</Button>
            </form>
        }
    </div>
)
}

export default SingleComment