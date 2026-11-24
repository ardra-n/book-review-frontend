
import React from 'react'
import { Routes, Route, Navigate, useLocation } from 'react-router-dom'
import { Box } from '@mui/material'

import Header from './components/Header'

import Dashboard from './pages/Dashboard'
import Books from './pages/Books'
import Reviews from './pages/Reviews'
import Calendar from './pages/Calendar'
import Goals from './pages/Goals'
import Reports from './pages/Reports'
import Pnf from './pages/Pnf'
import AddBook from './pages/AddBook'
import EditBook from './pages/EditBook'
import ViewBook from './pages/ViewBook'
import Register from './pages/Register'
import LoginPage from './pages/Login'

function App() {

    const location = useLocation()

const isLoggedIn = Boolean(localStorage.getItem('loggedUser'))

    return (

        <Box sx={{
            minHeight: '100vh',
            backgroundColor: '#FFF7ED'
        }}>

            {/* Show Header only after login */}
            {isLoggedIn && <Header />}

            <Box
                component="main"
                sx={{
                    width: '100%',
                    minHeight: 'calc(100vh - 75px)',
                    backgroundColor: '#FFF7ED'
                }}
            >

                <Routes>

                    {/* Home Route */}
                    <Route
                        path="/"
                        element={
                            isLoggedIn ?
                                <Navigate to="/dashboard" replace /> :
                                <Navigate to="/login" replace />
                        }
                    />

                    {/* Login and Register */}
                    <Route
                        path="/login"
                        element={
                            isLoggedIn ?
                                <Navigate to="/dashboard" replace /> :
                                <LoginPage />
                        }
                    />

                    <Route
                        path="/register"
                        element={
                            isLoggedIn ?
                                <Navigate to="/dashboard" replace /> :
                                <Register />
                        }
                    />

                    {/* Protected Pages */}
                    <Route path="/dashboard" element={isLoggedIn ? <Dashboard /> : <Navigate to="/login" replace />} />

                    <Route path="/books" element={isLoggedIn ? <Books /> : <Navigate to="/login" replace />} />

                    <Route path="/reviews" element={isLoggedIn ? <Reviews /> : <Navigate to="/login" replace />} />

                    <Route path="/calendar" element={isLoggedIn ? <Calendar /> : <Navigate to="/login" replace />} />

                    <Route path="/goals" element={isLoggedIn ? <Goals /> : <Navigate to="/login" replace />} />

                    <Route path="/reports" element={isLoggedIn ? <Reports /> : <Navigate to="/login" replace />} />

                    <Route path="/add-book" element={isLoggedIn ? <AddBook /> : <Navigate to="/login" replace />} />

                    <Route path="/view-book/:id" element={isLoggedIn ? <ViewBook /> : <Navigate to="/login" replace />} />

                    <Route path="/edit-book/:id" element={isLoggedIn ? <EditBook /> : <Navigate to="/login" replace />} />

                    {/* Page Not Found */}
                    <Route path="*" element={<Pnf />} />

                </Routes>

            </Box>

        </Box>
    )
}

export default App
