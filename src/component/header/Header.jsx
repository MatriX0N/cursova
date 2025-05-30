import React, { useState, useEffect } from 'react'
import './Header.css'
import { Link } from 'react-router-dom'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'

function Header({ onLogin }) {
    const [isLoggedIn, setIsLoggedIn] = useState(false)
    const [isModalOpen, setIsModalOpen] = useState(false) 
    const [message, setMessage] = useState('') 
    const navigate = useNavigate()

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
                <Link className='navigatorTarget' to={'./KatalogCar'}>
                    Закладки
                </Link>
                <Link className='navigatorTarget' to={'./MyProfile'}>
                    Профіль
                </Link>
                <Link className='navigatorTarget' to={"./chatPage"}>
                    Історія
                </Link>
            </nav>
            <div className='headerBtn'>
                {isLoggedIn ? (
                    <button onClick={handleLogout} className='btnLogReg'>
                        Вийти
                    </button>
                ) : (
                    <Link to={'/Singin'}>
                        <button className='btnLogReg'>Увійти</button>
                    </Link>
                )}
            </div>
            
        </div>
    )
}

export default Header
