import React, { useState } from 'react'
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import axios from 'axios'
import { API_BASE_URL } from '../config'
import Swal from 'sweetalert2'
import { Link } from 'react-router-dom';
export const Login = () => {


    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const dispatch = useDispatch();
    const navigate = useNavigate();

    const login = (event) => {
        event.preventDefault();

        const requestData = { email, password }
        axios.post(`${API_BASE_URL}/login`, requestData)
            .then((result) => {
                if (result.status === 200) {
                    localStorage.setItem("token", result.data.result.token);
                    localStorage.setItem("userId", result.data.result.user._id);
                    dispatch({ type: 'LOGIN_SUCCESS', payload: result.data.result.user });
                    navigate('/welcome')
                }
            })
            .catch((error) => {
                console.log(error);
                Swal.fire({
                    icon: 'error',
                    title: error.response.data.error
                })
            })
    }

    return (
        <div className='mt-5 login-form'>
            <h2 className='text-center text-white fw-bold'>LOGIN FORM</h2>
            <form onSubmit={(e) => login(e)}>
                <div className="row justify-content-center">
                    <div className="col-md-6">
                        <div className="mb-1">
                            <label htmlFor="quantity" className="form-label text-white">
                                Email
                            </label>
                            <input type="email" value={email} onChange={(ev) => setEmail(ev.target.value)} className="form-control" id="quantity" name="quantity" />
                        </div>
                    </div>
                </div>

                <div className="row justify-content-center">
                    <div className="col-md-6">
                        <div className="mb-2">
                            <label htmlFor="amount" className="form-label text-white">
                                Password
                            </label>
                            <input type="password" value={password} onChange={(ev) => setPassword(ev.target.value)} className="form-control" id="amount" name="amount" />
                        </div>
                    </div>
                </div>

                <div className="row justify-content-center">
                    <div className="col-md-6">
                        <div className="mt-3">
                            <button className='form-control btn btn-info'>Submit</button>
                        </div>
                    </div>
                </div>
                <div className='mt-3 mb-5 d-grid'>
                    <button className="custom-btn custom-btn-white">
                        <span className='text-muted fs-6'>Don't have an account?</span>
                        <Link to="/register" className='ms-1 text-info fw-bold'>Sign Up</Link>
                    </button>
                </div>
            </form>
        </div>
    )
}
export default Login