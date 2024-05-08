import React, { useState } from 'react'
import axios from 'axios'
import { API_BASE_URL } from '../config'
import Swal from 'sweetalert2'
import { Link } from 'react-router-dom'

export const Register = () => {

    const [Name, setName] = useState("");
    const [username, setUsername] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    

    
    const signup = (e) => {
        e.preventDefault();
        const requestData = { Name: Name, username, email, password }
        axios.post(`${API_BASE_URL}/signup`, requestData)
            .then((result) => {
                if (result.status === 201) {
                    Swal.fire({
                        icon: 'success',
                        title: 'User successfully registered'
                    })
                }
                setName('');
                setUsername('');
                setEmail('');
                setPassword('');         
            })
            .catch((error) => {
                console.log(error);
               
                Swal.fire({
                    icon: 'error',
                    title: 'Some error occurred please try again later!'
                })
            })
    }
    return (
        <div>
            <div className='container mt-3 login-form' style={{'backgroundColor':'blue'}}>
                <h2 className='text-center text-white fw-bold'>REGISTRATION FORM</h2>
                <form onSubmit={(e)=>signup(e)}>
                    <div className="row justify-content-center">
                        <div className="col-md-6">
                            <div className="mb-3">
                                <label htmlFor="name" className="form-label">
                                    Name
                                </label>
                                <input type="text" value={Name} onChange={(ev) => setName(ev.target.value)} className="form-control"  />
                            </div>
                        </div>
                    </div>
                    <div className="row justify-content-center">
                        <div className="col-md-6">
                            <div className="mb-3">
                                <label htmlFor="quantity" className="form-label">
                                    username
                                </label>
                                <input type="text" value={username} onChange={(ev) => setUsername(ev.target.value)} className="form-control" />
                            </div>
                        </div>
                    </div>
                    <div className="row justify-content-center">
                        <div className="col-md-6">
                            <div className="mb-3">
                                <label htmlFor="quantity" className="form-label">
                                    Email
                                </label>
                                <input type="email" value={email} onChange={(ev) => setEmail(ev.target.value)} className="form-control"  />
                            </div>
                        </div>
                    </div>

                    <div className="row justify-content-center">
                        <div className="col-md-6">
                            <div className="mb-3">
                                <label htmlFor="amount" className="form-label">
                                    Password
                                </label>
                                <input type="password" value={password} onChange={(ev) => setPassword(ev.target.value)}  className="form-control" />
                            </div>
                        </div>
                    </div>
                    
                    <div className="row justify-content-center">
                        <div className="col-md-6">
                            <div className="mb-3">
                                <button className='form-control btn btn-primary'>Submit</button>
                            </div>
                        </div>
                    </div>
                    <div className='mt-3 mb-5 d-grid'>
                                    <button className="custom-btn custom-btn-white">
                                        <span className='text-muted fs-6'>Already have an account?</span>
                                        <Link to="/" className='ms-1 text-info fw-bold'>Log In</Link>
                                    </button>
                                </div>
                </form>
            </div>
        </div>
    )
}
export default Register