import React from 'react'
import { useState } from 'react';
import { Link,useNavigate } from 'react-router-dom'
import { Button, Modal} from 'react-bootstrap'
import { useDispatch } from 'react-redux';
import Swal from 'sweetalert2';
import axios from 'axios';
import { API_BASE_URL } from '../config';

export default function Sidebar() {
  const [show, setShow] = useState(false);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);
  const [tweetMessage, setTweetMessage] = useState("");
  const [tweetImage, setTweetImage] = useState("");
  const [author,setAuthor] = useState("")
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const CONFIG_OBJ = {
    headers: {
        "Content-Type": "application/json",
        "Authorization": "Bearer " + localStorage.getItem("token")
    }
}

  const sendTweet = (e) => {
    const requestData = {
      tweetMessage: tweetMessage,
      tweetImage: tweetImage,
      author: author // Add the author information here
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
        setAuthor(localStorage.getItem('token'))
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

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    dispatch({ type: "LOGIN_ERROR" });
    navigate("/");
  }

  return (
    <div className='mt-1 side '>
      <div className='sidebar'>
        <Link to='/welcome' className='sidebar-link'>
          <i className="fab fa-twitter" style={{ fontSize: '20px' }}></i>
        </Link>
      </div>
      <div className='sidebar'>
        <Link to='/feed' className='sidebar-link'>
          <i className="fa-solid fa-house" style={{ fontSize: '20px' }}></i>
        </Link>
      </div>

      <div className='sidebar'>
        <Link to='/profile' className='sidebar-link'>
          <i className="fa-solid fa-user" style={{ fontSize: '20px' }}></i>
        </Link>
      </div>
      <div className='sidebar'>
      <Link className='sidebar-link' to="#" data-bs-toggle="dropdown" aria-expanded="false">
        <i className="fa-solid fa-ellipsis-vertical" style={{ 'color': '#fff', 'fontSize': '16px' }}></i>
        <div className='drop-down dropdown-menu'>
          <>
            <ul>
              <Link className="dropdown-item" onClick={logout}>
                Logout
              </Link>
            </ul>
          </>
        </div>
      </Link>
    </div>
      <div>

      </div>
      <div className='sidebar'>
        <div className='text-center' style={{ 'background-color': 'rgb(42, 159, 237)' }} onClick={handleShow}>
          Post
        </div>

        <Modal show={show} onHide={handleClose}>
          <Modal.Header closeButton>
          </Modal.Header>
          <Modal.Body>
            <div className="tweetBox">
              <form>
                <div className="tweetBox__input">
                  <img
                    className="img"
                    src="https://images.unsplash.com/photo-1702295138368-21eea2d35a6d?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxlZGl0b3JpYWwtZmVlZHwzNHx8fGVufDB8fHx8fA%3D%3D"
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


              </form>
            </div>

          </Modal.Body>
          <Modal.Footer>

            <Button
              onClick={sendTweet}
              type="submit"
              className="tweetBox__tweetButton"

            >
              Tweet
            </Button>
          </Modal.Footer>
        </Modal>
      </div>

    </div>
  )
}

