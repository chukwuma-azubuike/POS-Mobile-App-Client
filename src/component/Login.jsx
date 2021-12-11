import { useState } from 'react';
import { Navigate } from 'react-router-dom';
import applogo from '../assets/applogo.png'
import './style.css';
import CircularProgress from '@mui/material/CircularProgress';
import { ToastContainer, toast } from 'react-toastify';

export default function Login() {

    const [loggedIn, setLoggedIn] = useState()
    const [email, setEmail] = useState()
    const [password, setPassword] = useState()
    const [loading, seLoading] = useState(false)

    if (loggedIn) return <Navigate to='/' />

    const handleSubmit = (e) => {
        e.preventDefault()
        seLoading(true)

        var data = JSON.stringify({ email: email, password: password });
        const url = 'http://localhost:8080/login'

        const options = {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: data,
            redirect: 'follow'
        }
        fetch(url, options)
            .then(res => res.json())
            .then(result => {
                // console.log(result)
                if (result.status) {
                    toast.success(result.message, {
                        position: "top-center",
                        autoClose: 3000,
                        hideProgressBar: true,
                        closeOnClick: true,
                        pauseOnHover: true,
                        draggable: true,
                        progress: undefined,
                    });
                    setTimeout(() => {
                        setLoggedIn(true)
                    }, 1500)
                    sessionStorage.setItem('userDetails', true)
                } else {
                    toast.error(result.message, {
                        position: "top-center",
                        autoClose: 3000,
                        hideProgressBar: true,
                        closeOnClick: true,
                        pauseOnHover: true,
                        draggable: false,
                        progress: undefined,
                    });
                    seLoading(false)
                }
            })
            .catch(err => { console.error(err) })
    }
    return (
        <div
            style={{
                padding: '30px',
                maxWidth: '500px',
                width: '90vw',
            }}
        >
            <ToastContainer
                position="top-center"
                autoClose={3000}
                hideProgressBar={false}
                newestOnTop={false}
                closeOnClick
                closeButton={false}
                rtl={false}
                pauseOnFocusLoss
                draggable
                pauseOnHover
            />
            <img alt='login-logo' src={applogo}
                style={{
                    width: '70px'
                }}
            />
            <h1>POS Mobile App</h1>
            <p>Login to your cashier account</p>
            <form onSubmit={handleSubmit} >
                <input placeholder='Enter your email here' type='email' onChange={e => { setEmail(e.target.value) }} value={email} required />
                <input placeholder='Enter your password here' type='password' onChange={e => { setPassword(e.target.value) }} value={password} required />
                <button type='submit'>
                    {loading ? <CircularProgress style={{ color: 'white' }} size={20} /> : 'Login'}
                </button>
            </form>
        </div>
    )
}