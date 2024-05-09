import React, { useState, useEffect } from 'react'
import '../profile.css'
import Modal from 'react-bootstrap/Modal';
import { API_BASE_URL } from '../../src/config'
import axios from 'axios';
import Swal from 'sweetalert2'
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import Sidebar from './sidebar';
import { Button } from 'react-bootstrap';

const Profile = () => {

    const user = useSelector(state => state.userReducer);

    const navigate = useNavigate();
    const [image, setImage] = useState({ preview: '', data: '' })
    const [mytweets, setMytweets] = useState([]);


    const [show, setShow] = useState(false);
    const [Name, setName] = useState("");
    const [username, setUsername] = useState("");
    const handleShow = () => setShow(true);
    const [commentBox, setCommentBox] = useState(false)
    const [comment, setComment] = useState("")

    const [showPost, setShowPost] = useState(false);

    const handlePostClose = () => setShowPost(false);
    const handlePostShow = () => setShowPost(true);

    const CONFIG_OBJ = {
        headers: {
            "Content-Type": "application/json",
            "Authorization": "Bearer " + localStorage.getItem("token")
        }
    }
    const deletetweet = async (id) => {
        const response = await axios.delete(`${API_BASE_URL}/deletetweet/${id}`, CONFIG_OBJ);

        if (response.status === 200) {
            getMytweets(response.data);

        }
    }
    const handleFileSelect = (event) => {
        const img = {
            preview: URL.createObjectURL(event.target.files[0]),
            data: event.target.files[0]
        }
        setImage(img);
    }

    const handleImgUpload = async () => {
        let formData = new FormData();
        formData.append('file', image.data);

        const response = axios.post(`${API_BASE_URL}/uploadFile`, formData)
        return response;
    }
    const handleSave = async () => {
        try {
            const imgRes = await handleImgUpload();
            const response = await axios.put(
                `${API_BASE_URL}/profile`,
                {
                    Name,
                    username,
                    profileImg: `${API_BASE_URL}/files/${imgRes.data.fileName}`
                },
                CONFIG_OBJ
            );
            if (response.status === 200)
                navigate("/profile")
            else {
                Swal.fire({
                    icon: 'error',
                    title: 'some error in updating data'
                })
            }
        } catch (error) {
            // Handle errors, show an error message, etc.
            console.error(error);
        }
    };


    const getMytweets = async () => {
        const response = await axios.get(`${API_BASE_URL}/mytweets`, CONFIG_OBJ);

        if (response.status === 200) {
            setMytweets(response.data);
        } else {
            console.log("Error");
        }
    }
    useEffect(() => {
        getMytweets();
    }, []);

    const retweet = async (id) => {
        const request = { "id": id };
        const response = await axios.put(`${API_BASE_URL}/retweet`, request, CONFIG_OBJ);
        if (response.status === 200) {
            getMytweets();
        }
    }


    const submitComment = async (id) => {
        setCommentBox(false);
        const request = { "id": id, "commentText": comment };
        const response = await axios.put(`${API_BASE_URL}/comment`, request, CONFIG_OBJ);
        if (response.status === 200) {
            getMytweets();
        }
    }
    const likeDislikePost = async (id, type) => {
        const request = { "id": id };
        const response = await axios.put(`${API_BASE_URL}/${type}`, request, CONFIG_OBJ);
        if (response.status === 200) {
            getMytweets();
        }
    }
    return (
        <>
            <div className='row'>
                <div className='col-2'>
                    <Sidebar />
                </div>
                <div className='container mt-4 col-10'>
                    <div className='row'>
                        <div className='col-md-6 d-flex flex-column'>
                            <img className='p-2 profile-pic img-fluid' alt="profile pic" src='https://images.unsplash.com/photo-1480429370139-e0132c086e2a?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Nnx8bWFufGVufDB8fDB8fHww' />
                            <h4 className='p-2'>{user.user.Name}</h4>
                            <h6>@{user.user.username}</h6>

                        </div>
                        <div className='col-md-6 mt-4 fl'>
                            <button className="custom-btn custom-btn-white me-md-3" onClick={handlePostShow}>
                                <span className='fs-6'>Edit Profile</span>
                            </button>
                        </div>
                        <div className='mt-3'>
                            <div className='d-flex justify-content-equal mx-auto'>
                                <div className='mx-2 text-center fw-bold'>
                                    <h6>{mytweets.length} Followers</h6>

                                </div>
                                <div className='text-center fw-bold'>
                                    <h6>20 Following</h6>

                                </div>
                            </div>

                        </div>
                    </div>
                    <div className='row my-3'>
                        <div className='col-12'>
                            <hr />
                        </div>
                    </div>
                    <div>
                        <h4 className='text-center'>Tweets and replies</h4>
                    </div>
                    <hr />
                    <div className='row mb-4'>
                        {mytweets.map((tweet) => {
                            return (
                                <div className='col-md-12 col-sm-12 mb-3' key={tweet._id}>
                                    <div className="card" onClick={handleShow}>
                                        {tweet.Image ? (
                                            <img src={tweet.Image} className="card-img-top" alt="img" />
                                        ) : (
                                            null // Or any fallback content you want to render when there's no image
                                        )}
                                        <p className='p-1'>{tweet.content}</p>
                                        <div className='row my-3'>
                                            <div className='col-6 d-flex'>
                                                <i onClick={() => likeDislikePost(tweet._id, 'like')} className="ps-2 fs-4 fa-regular fa-heart"></i>
                                                <span className='pe-2 fs-6 fw-bold float-end'>{tweet.likes.length}</span>

                                                <i class="fa-solid fa-repeat" onClick={() => retweet(tweet._id)} style={{ 'color': '#0b0c0f' }}></i>
                                                <span className='pe-2 fs-6 fw-bold float-end'>{tweet.Retweetedby.length}</span>
                                                <i onClick={() => setCommentBox(true)} className="ps-3 fs-4 fa-regular fa-comment"></i>
                                            </div>
                                            <div className='col-6 d-flex justify-content-end'>
                                                
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

                            )
                        })
                        }
                    </div>

                    <Modal show={showPost} onHide={handlePostClose} size="lg" centered>
                        <Modal.Header closeButton>
                            <span className='fw-bold fs-5'>Edit Profile</span>
                        </Modal.Header>
                        <Modal.Body>
                            <div className='row'>
                                <div className='col-md-6 col-sm-12 mb-3'>
                                    <div className='upload-box'>
                                        <div className="dropZoneContainer">
                                            <input name="file" type="file" id="drop_zone" className="FileUpload" accept=".jpg,.png,.gif" onChange={handleFileSelect} />
                                            <div className="dropZoneOverlay">
                                                {image.preview && <img src={image.preview} width='150' height='150' />}
                                                <i class="fa-solid fa-cloud-arrow-up fs-1"></i><br />Upload Photo From Computer</div>
                                        </div>
                                    </div>
                                </div>
                                <div className='col-md-6 col-sm-12 d-flex flex-column justify-content-between'>
                                    <div className='row'>
                                        <div className='col-sm-12 mb-3'>
                                            <label className='form-label '>Name</label>
                                            <br />
                                            <input type='text' value={Name} onChange={(e) => setName(e.target.value)} />

                                        </div>
                                        <div className='col-sm-12 mb-3'>
                                            <label className='form-label '>username</label>
                                            <br />
                                            <input type='text' value={username} onChange={(e) => setUsername(e.target.value)} />

                                        </div>

                                    </div>
                                    <div className='row'>
                                        <div className='col-sm-12'>
                                            <button className="custom-btn custom-btn-pink float-end" onClick={handleSave}>
                                                <span className='fs-6 fw-600'>Save</span>
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>

                        </Modal.Body>
                    </Modal>
                </div>
            </div>
        </>

    )
}

export default Profile
