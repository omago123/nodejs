import React,{useEffect,useState} from 'react'
import Axios from 'axios'
import {Card, Icon, Avatar, Col, Typography, Row} from 'antd'
import moment from 'moment';
const {Title} = Typography
const {Meta} = Card

function SubscriptionPage() {

    const [Video, setVideo] = useState([])

    // Dom 이 로드되자마자 무엇을  할 것인가에 대한 메서드
    useEffect(() => {
        
        const subscriptionVariables = {
            userFrom : localStorage.getItem('userId')
        }
        

        Axios.post('/api/video/getSubscriptionVideos', subscriptionVariables)
            .then(response => {
                if(response.data.success){
                    console.log(response.data)
                    setVideo(response.data.videos)
                } else{
                    console.log(response.data)
                    alert('비디오 가져오기를 실패 했습니다.')
                }

            })
    }, []) 
    // [] 이 없으면 계속 함수가  실행된다 [] 이있으면 한번만
    

    const renderCards = Video.map((video,index)=>{

        const minutes= Math.floor(video.duration/60)
        const seconds = Math.floor((video.duration - minutes*60 ));

        return  <Col key={video._id}  lg={6} md={8} xs={24}>
            <a href={`video/${video._id}`}>
                <div style={{ position: 'relative'}}>
                    <img style ={{ width: '100%'}} src={`http://localhost:5000/${video.thumbnail}`} alt="thumbnail" />
                    <div className="duration">
                        <span>{minutes} :{seconds}</span>
                    </div>
                </div>
            </a>
            <br />
            <Meta
                avatar={
                    <Avatar src={video.writer.image} />
                }
                title={video.title}
                description=""
            />
            <span>{video.writer.name} </span><br />
            <span style={{ marginLeft: '3rem'}}>{video.views} views</span> - <span>{moment(video.createdAt).format("MMM Do YY")}</span>
        </Col>

    })

    return (
       <div style ={{ width: '85%', margin: '3rem auto'}}>
           <Title level={2}> Subscription</Title>
            <hr />
            <Row gutter={[16, 32]}>

              {renderCards}

            </Row>
       </div>
    )

}

export default SubscriptionPage