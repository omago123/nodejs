import axios from 'axios';
import React,{useState} from 'react'
import { useSelector } from 'react-redux';
import SingleComment from './SingleComment';
import ReplyComment from './ReplyComment';

export default function Comment(props) {

    const videoId = props.postId

    const user = useSelector(state => state.user)
    const [commentValue, setcommentValue] = useState();

    const handleClick = (event) =>{
        setcommentValue(event.currentTarget.value)
    }
    

    const onSubmit = (event) => {
        event.preventDefault()
        const variables = {
            content: commentValue ,
            writer: user.userData._id,
            postId: videoId
        }
        
        axios.post('/api/comment/saveComment',variables)
            .then((response) =>{
                if(response.data.success){
                    setcommentValue("")
                    props.refreshFunction(response.data.result)
                }else{
                    console.log(response.data)
                    alert('코멘트를 저장할 수 없습니다.')
                }
            })
            .catch(err=>{
                console.log(err)
            })
            
    }
     return (
    <div>
        <br />
        <p>Replies</p>

        {/* Comment Lists */}

        {props.commentLists && props.commentLists.map((comment, index) =>(
            (!comment.responseTo && 
                <React.Fragment >
                    <SingleComment  refreshFunction={props.refreshFunction} comment={comment} postId={videoId} />
                    <ReplyComment  refreshFunction={props.refreshFunction}  parentCommentId={comment._id} postId={videoId} commentLists={props.commentLists}/>
                </React.Fragment>
            )
        ))}
         


        {/* Root Comment Form */}

        <form style={{ display: 'flex'}} onSubmit={onSubmit} >
            <textarea
                style={{ width: '100%', borderRadius: '5px'}}
                onChange={handleClick}
                value={commentValue}
                placeholder="코멘트를 작성해 주세요"
            />
            <br />
            <button style={{ width: '20%', height: '52px'}} onClick={onSubmit}>Submit</button>
        </form>
    </div>
  )
}
