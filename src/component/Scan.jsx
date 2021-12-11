import { useEffect, useState } from 'react'
import QrReader from 'react-qr-reader'
import { Navigate } from 'react-router';
import './style.css'
import CircularProgress from '@mui/material/CircularProgress';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export default function Scan() {

    const [result, setResult] = useState()
    const [amount, setAmount] = useState(false)
    const [showAmount, setShowAmount] = useState(false)
    const [loggedIn, setLoggedIn] = useState(sessionStorage.getItem('userDetails'))
    const [digit, setDigit] = useState()
    const [displayPin, setDisplayPin] = useState(false)
    const [processPay, setProcessPay] = useState()
    const [fullName, setFullName] = useState()
    const [pin, setPin] = useState()


    const handleSubmit = (e) => {
        e.preventDefault()
        if (pin.length == 4) {
            setPin('')
            setProcessPay(true)
            var data = JSON.stringify({ name: sessionStorage.getItem('CustomerName'), pin: pin, amount: amount });
            console.log(data)
            const url = 'http://localhost:8080/withdraw'

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
                    console.log(result)
                    if (result.status) {
                        toast.success(result.data, {
                            position: "top-center",
                            autoClose: 3000,
                            hideProgressBar: false,
                            closeOnClick: true,
                            pauseOnHover: true,
                            draggable: true,
                            progress: undefined,
                        });
                        setProcessPay(false)
                        setTimeout(() => {
                            setShowAmount(false)
                            setDisplayPin(false)
                            setDisplayPin('')
                            setAmount('')
                        }, 3000)
                    } else {
                        toast.error(result.message, {
                            position: "top-center",
                            autoClose: 3000,
                            hideProgressBar: false,
                            closeOnClick: true,
                            pauseOnHover: true,
                            draggable: false,
                            progress: undefined,
                        });
                        setProcessPay(false)
                        setTimeout(() => {
                            setShowAmount(true)
                            setDisplayPin(false)
                            setAmount('')
                        }, 3000)
                    }
                })
                .catch(err => { console.error(err) })
        } else { alert('Pin has to be 4 digits') }
    }

    useEffect(() => {
        if (result) {
            setShowAmount(true)
            toast.success('Customer Verified!', {
                position: "top-center",
                autoClose: 3000,
                hideProgressBar: true,
                closeOnClick: true,
                pauseOnHover: false,
                draggable: false,
                progress: undefined,
            });
        }
    }, [result])

    useEffect(() => {
        if (result) {
            setFullName(result.FullName)
        }
    }, [result])

    if (!loggedIn) return <Navigate to='login' />;

    return (
        <div
            style={{
                width: '90vw',
                maxWidth: '500px',
                textAlign: 'center',
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
            {!showAmount &&
                <div>
                    <h1>Scan Customer's QR code</h1>
                    <div>
                        <QrReader
                            delay={1000}
                            onError={err => console.log(err)}
                            onScan={(res) => {
                                setResult(res)
                                console.log(res)
                                if (res !== null) sessionStorage.setItem('CustomerName', JSON.parse(res).FullName)
                            }}
                            style={{
                                width: '100%',
                            }}
                        />
                        {/* <h1>{result}</h1> */}
                    </div>
                </div>}

            {showAmount & !displayPin &&
                <div style={{ width: '100%', maxWidth: '500px' }} >
                    <div style={{ margin: '50px auto', textAlign: 'left' }} >
                        <h1 style={{ margin: 0 }} > <span> Hello,</span></h1>
                        <h1 style={{ margin: '5px auto' }}>{JSON.parse(result).FullName}</h1>
                        <h3><span>Bank:</span> {JSON.parse(result).Bank}</h3>
                        <h3><span>Account No:</span> {JSON.parse(result).AccountNumber}</h3>
                    </div>
                    <h3 style={{ color: '#595cc3', fontWeight: 400 }}>Enter transaction amount</h3>
                    <input className='transaction-input' value={amount} onChange={(e) => { setAmount(e.target.value) }} type='number' required min="1" max="99999999" />
                    <button
                        onClick={() => {
                            setDisplayPin(true)
                        }} disabled={!amount ? true : false}>Proceed</button>
                </div>}
            {displayPin &&
                <div style={{ width: '100%', maxWidth: '500px' }} >
                    <h1>Enter your 4 digit pin</h1>
                    <form onSubmit={handleSubmit}>
                        <input value={pin} onChange={(e) => { setPin(e.target.value.toString().substring(0, 4)) }} type='number' maxLength='4' pattern="[0-9]" required />
                        <button disabled={pin ? false : true} type='submit' >
                            {processPay ? <CircularProgress style={{ color: 'white' }} size={20} /> : 'Proceed'}
                        </button>
                    </form>
                </div>}
        </div>
    )
}