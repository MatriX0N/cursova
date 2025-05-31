import React, { useState, useEffect } from 'react'
import './Header.css'
import { Link } from 'react-router-dom'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import { useAuth0 } from "@auth0/auth0-react";
import Login from "../login/Login";

function Header({ onLogin }) {
    const [isLoggedIn, setIsLoggedIn] = useState(false)
    const [isModalOpen, setIsModalOpen] = useState(false) 
    const [message, setMessage] = useState('') 
    const navigate = useNavigate()
    const { isAuthenticated, loginWithRedirect, logout } = useAuth0();

    useEffect(() => {
        const storedUserInfo = localStorage.getItem('user-info')
        setIsLoggedIn(!!storedUserInfo)

        const interval = setInterval(() => {
            const storedUserInfo = localStorage.getItem('user-info')
            setIsLoggedIn(!!storedUserInfo)
        }, 500)

        return () => clearInterval(interval)
    }, [])

    useEffect(() => {
        if (isLoggedIn) {
            const fetchNotifications = async () => {
                try {
                    const response = await axios.get(
                        'http://127.0.0.1:8000/api/notifications'
                    )
                    if (response.data && response.data.message) {
                        setMessage(response.data.message)
                        setIsModalOpen(true)
                    }
                } catch (error) {
                    console.error('Помилка при отриманні повідомлень:', error)
                }
            }

            fetchNotifications()
        }
    }, [isLoggedIn])

    const handleLogout = () => {
        localStorage.removeItem('user-info')
        setIsLoggedIn(false)
        navigate('/')
        onLogin(false)
    }

    const openModal = () => {
        setIsModalOpen(true)
    }

    const closeModal = () => {
        setIsModalOpen(false)
        setMessage('')
    }

    return (
        <div className='headerBlock'>
            <nav className='navigatorSite'>
                <Link className='navigatorTarget' to={'./'}>
                    Головна
                </Link>
                <Link className='navigatorTarget' to={'./bookmarks'}>
                    Закладки
                </Link>
                <Link className='navigatorTarget' to={'./profile'}>
                    Профіль
                </Link>
                <Link className='navigatorTarget' to={"./history"}>
                    Історія
                </Link>
            </nav>
            <div className='headerBtn'>
            {isAuthenticated ? (
                <button className="auth-btn logout" onClick={() => logout({ returnTo: "http://localhost:5173/" })}>
                Вийти
                </button>
            ) : (
                <button className="auth-btn login" onClick={() => loginWithRedirect()}>
                Увійти
                </button>
            )}
            </div>
            
        </div>
    )
}

export default Header
