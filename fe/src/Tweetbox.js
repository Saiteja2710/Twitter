import React, { useState, useEffect } from "react";
import "./tweet.css";
import Side from './pages/sidebar';
import Button from 'react-bootstrap/Button';
import axios from "axios";
import Swal from "sweetalert2";
import { API_BASE_URL } from "./config";
import { useSelector } from "react-redux";

function TweetBox() {
    const user = useSelector(state => state.userReducer);
    const [tweetMessage, setTweetMessage] = useState("");
    const [tweetImage, setTweetImage] = useState("");
    const [alltweets, setAlltweets] = useState([]);
    const [commentBox, setCommentBox] = useState(false)
    const [comment, setComment] = useState("")
    const [follow,setFollow] = useState("")

    const CONFIG_OBJ = {
        headers: {
            "Content-Type": "application/json",
            "Authorization": "Bearer " + localStorage.getItem("token")
        }
    };

    const getalltweets = () => {
        axios
            .get(`${API_BASE_URL}/tweets`, CONFIG_OBJ)
            .then((response) => {
                if (response.status === 201) {
                    setAlltweets(response.data.data);
                }
            })
            .catch((error) => {
                console.error("Error fetching tweets:", error);
            });
    };

    useEffect(() => {
        getalltweets();
    }, [alltweets]);

    const deletetweet = async (id) => {
        const response = await axios.delete(`${API_BASE_URL}/deletetweet/${id}`, CONFIG_OBJ);
        if (response.status === 200) {
            getalltweets(response.data);
        }
    }

    const sendTweet = (e) => {
        const requestData = {
            tweetMessage: tweetMessage,
            tweetImage: tweetImage,
            // Assuming you want to set the author as the logged-in user
            author: localStorage.getItem('token')
        };

        axios.post(`${API_BASE_URL}/tweet`, requestData, CONFIG_OBJ)
            .then((result) => {
                if (result.status === 201) {
                    Swal.fire({
                        icon: 'success',
                        title: 'Tweeted'
                    });
                }
                setTweetImage('');
                setTweetMessage('');
            })
            .catch((error) => {
                console.log(error);
                Swal.fire({
                    icon: 'error',
                    title: 'Some error occurred, please try again later!'
                });
            });

        e.preventDefault();
    };

    const submitComment = async (id) => {
        setCommentBox(false);
        const request = { "id": id, "commentText": comment };
        const response = await axios.put(`${API_BASE_URL}/comment`, request, CONFIG_OBJ);
        if (response.status === 200) {
            getalltweets();
        }
    }
    const likeDislikePost = async (id, type) => {
        const request = { "id": id };
        const response = await axios.put(`${API_BASE_URL}/${type}`, request, CONFIG_OBJ);
        if (response.status === 200) {
            getalltweets();
        }
    }
    const [followStatus, setFollowStatus] = useState('Follow');

  const handleFollowClick = () => {
    
    setFollow("Following");
    setFollowStatus("Following");
  };

    const retweet = async (id) => {
        const request = { "id": id };
        const response = await axios.put(`${API_BASE_URL}/retweet`, request, CONFIG_OBJ);
        if (response.status === 200) {
            getalltweets();
        }
    }

    return (
        <div className="row">
            <div className="col-2">
                <Side />
            </div>
            <div className="col-10 mt-2">
                <div className="tweetBox">
                    <form>

                        <div className="tweetBox__input">
                            <img
                                className="img"
                                src="https://images.unsplash.com/photo-1703015619478-0fe558ed7d05?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxlZGl0b3JpYWwtZmVlZHw4fHx8ZW58MHx8fHx8"
                                alt="Profile"
                            />
                            <input
                                onChange={(e) => setTweetMessage(e.target.value)}
                                value={tweetMessage}
                                placeholder="What's happening?"
                                type="text"
                                className="tweetBox__inputText"
                            />
                        </div>
                        <input
                            value={tweetImage}
                            onChange={(e) => setTweetImage(e.target.value)}
                            className="tweetBox__imageInput"
                            placeholder="Optional: Enter image URL"
                            type="text"
                        />

                        <Button
                            onClick={sendTweet}
                            type="submit"
                            className="tweetBox__tweetButton"
                        >
                            Tweet
                        </Button>
                    </form>
                </div>
                <div className='row mb-4'>
                    {alltweets.map((tweet) => (
                        <div className='col-md-12 col-sm-12 mb-3' key={tweet._id}>
                            <div className="card">
                                {tweet.Image ? (
                                            <img src={tweet.Image} className="card-img-top" alt="img" />
                                        ) : (
                                            null
                                        )}
                                <p>{tweet.content}</p>
                                <div className='row my-3'>
                                    <div className='col-6 d-flex'>
                                        <i onClick={() => likeDislikePost(tweet._id, 'like')} className="ps-2 fs-4 fa-regular fa-heart"></i>
                                        <span className='pe-2 fs-6 fw-bold float-end'>{tweet.likes.length}</span>

                                        <i class="fa-solid fa-repeat" onClick={() => retweet(tweet._id)} style={{ 'color': '#0b0c0f' }}></i>
                                        <span className='pe-2 fs-6 fw-bold float-end'>{tweet.Retweetedby.length}</span>
                                        <i onClick={() => setCommentBox(true)} className="ps-3 fs-4 fa-regular fa-comment"></i>
                                    </div>
                                    <div className='col-6 d-flex justify-content-end'>
                                        {tweet.author !== user.user.id ? <div>
                                            <button className="btn btn-primary"onClick={handleFollowClick} >{followStatus}</button>
                                        </div> : ""}
                                        {tweet.author === user.user.id ?
                                            <div>
                                                <i className="fa-solid fa-trash" onClick={() => deletetweet(tweet._id)}></i>
                                            </div> : ""}
                                    </div>
                                </div>
                                {commentBox ? <div className='row mb-2'>
                                    <div className='col-8'>
                                        <textarea onChange={(e) => setComment(e.target.value)} className='form-control'></textarea>
                                    </div>
                                    <div className='col-4'>
                                        <button className='btn btn-primary' onClick={() => submitComment(tweet._id)}>Submit</button>
                                    </div>
                                    {tweet.comments.map((comment) => {
                                        return (<div className='row'>
                                            <div className='col-12'>
                                                <p>{comment.commentText} - {tweet.Name}</p>
                                            </div>
                                        </div>)
                                    })}
                                </div> : ""}



                            </div>
                        </div>
                    ))}

                </div>
            </div>

        </div>
    );
}

export default TweetBox;

