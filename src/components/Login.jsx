import React, { useEffect } from 'react'
import { GoogleLogin } from '@react-oauth/google'
import jwt_decode from 'jwt-decode'
import { useNavigate } from 'react-router-dom'

import shareVideo from '../assets/share.mp4'
import logo from '../assets/logowhite.png'

import { client } from '../client'

const Login = () => {
    const navigate = useNavigate()

    const User = localStorage.getItem('user') !== 'undefined' ? JSON.parse(localStorage.getItem('user')) : localStorage.clear();

    useEffect(() => {
        if (User) {
            navigate('/', { replace: true })
        }
    }, [])

    const responseGoogle = (response) => {
        const decoded = jwt_decode(response.credential)

        localStorage.setItem('user', JSON.stringify({
            googleId: decoded.sub,
            image: decoded.picture,
            name: decoded.name,
        }))
        
        const name = decoded.name
        const googleId = decoded.sub
        const imageUrl = decoded.picture

        const doc = {
            _id: googleId,
            _type: 'user',
            userName: name,
            image: imageUrl,
        }

        client.createIfNotExists(doc)
        .then(() => {
            navigate('/', { replace: true })
        })
    }

    const responseGoogleFail =(response) => {
        console.log(response)
    }

    return (
        <div className='flex justify-start items-center flex-col h-screen'>
            <div className='relative w-full h-full'>
                <video
                    src={shareVideo}
                    type='video/mp4'
                    loop
                    controls={false}
                    muted
                    autoPlay
                    className='w-full h-full object-cover'
                />
                <div className='absolute flex flex-col justify-center items-center top-0 right-0 left-0 bottom-0 bg-blackOverlay'>
                    <div className='p-5'>
                        <img src={logo} width='130px' alt='logo' />
                    </div>
                    <div className='shadow-2xl'>
                        <GoogleLogin
                            onSuccess={responseGoogle}
                            onError={responseGoogleFail}
                            cookiePolicy='single_host_origin'
                        />
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Login