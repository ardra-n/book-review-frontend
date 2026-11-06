
import React from 'react'

import { Routes, Route, Navigate } from 'react-router-dom'

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

function App() {

    return (

        <Box sx={{
            minHeight: '100vh',
            backgroundColor: '#FFF7ED'
        }}>

            {/* Header */}
            <Header />

            {/* Main Content */}
            <Box
                component="main"
                sx={{
                    width: '100%',
                    minHeight: 'calc(100vh - 75px)',
                    backgroundColor: '#FFF7ED'
                }}
            >

                <Routes>

                    <Route path="/" element={<Navigate to="/dashboard" replace />} />

                    <Route path="/dashboard" element={<Dashboard />} />

                    <Route path="/books" element={<Books />} />

                    <Route path="/reviews" element={<Reviews />} />

                    <Route path="/calendar" element={<Calendar />} />

                    <Route path="/goals" element={<Goals />} />

                    <Route path="/reports" element={<Reports />} />

                    <Route path="/add-book" element={<AddBook />} />

                    <Route path="/view-book/:id" element={<ViewBook />} />

                    <Route path="/edit-book/:id" element={<EditBook />} />

                    <Route path="*" element={<Pnf />} />

                </Routes>

            </Box>

        </Box>

    )
}

export default App
