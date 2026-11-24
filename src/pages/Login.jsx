
import React, { useState } from 'react'

import {
    Box,
    Paper,
    Typography,
    TextField,
    Button,
    InputAdornment,
    IconButton
} from '@mui/material'

import {
    Visibility,
    VisibilityOff,
    Login,
    MenuBook
} from '@mui/icons-material'

import { Link, useNavigate } from 'react-router-dom'

import { loginUserAPI } from '../services/apiServices'

function LoginPage() {

    const navigate = useNavigate()

    const [loginDetails, setLoginDetails] = useState({
        email: '',
        password: ''
    })

    const [showPassword, setShowPassword] = useState(false)
    const [error, setError] = useState('')
    const [loading, setLoading] = useState(false)

    const handleChange = (e) => {

        const { name, value } = e.target

        setLoginDetails({
            ...loginDetails,
            [name]: value
        })

        setError('')
    }

    const handleSubmit = async (e) => {

        e.preventDefault()

        const { email, password } = loginDetails

        if (!email || !password) {
            setError('Please enter email and password')
            return
        }

        try {

            setLoading(true)
            setError('')

            const response = await loginUserAPI(
                email.trim().toLowerCase()
            )

            const user = response.data.find(
                (item) =>
                    item.email.toLowerCase() === email.trim().toLowerCase() &&
                    item.password === password
            )

            if (!user) {
                setError('Invalid email or password')
                return
            }

            localStorage.setItem('loggedUser', JSON.stringify({
                id: user.id,
                name: user.name,
                email: user.email
            }))

            alert('Login successful!')

            navigate('/dashboard')

        }
        catch (err) {

            console.log(err)
            setError('Login failed. Please try again.')

        }
        finally {
            setLoading(false)
        }

    }

    return (

        <Box sx={{
            minHeight: '100vh',
            backgroundColor: '#FFF7ED',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            p: { xs: 2, md: 4 }
        }}>

            <Paper elevation={0} sx={{
                width: '100%',
                maxWidth: 1050,
                minHeight: 600,
                display: 'flex',
                overflow: 'hidden',
                borderRadius: 4,
                boxShadow: '0 8px 35px rgba(89,60,50,0.12)'
            }}>

                {/* Left Image Section */}

                <Box sx={{
                    width: '45%',
                    display: { xs: 'none', md: 'flex' },
                    flexDirection: 'column',
                    justifyContent: 'space-between',
                    p: 5,
                    color: '#FFFFFF',
                    backgroundImage: `
                        linear-gradient(
                            rgba(65,40,30,0.45),
                            rgba(65,40,30,0.65)
                        ),
                        url("https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS9UIdVmDknM82m5L5LaQKkHISOkq9kpWxxLtcBw2xkAw&s=10")
                    `,
                    backgroundSize: 'cover',
                    backgroundPosition: 'center'
                }}>

                    <Box sx={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: 1
                    }}>
                        <MenuBook sx={{ fontSize: 38 }} />

                        <Typography variant="h4" fontWeight="bold">
                            BookVerse
                        </Typography>
                    </Box>

                    <Box>
                        <Typography variant="h3"
                            fontWeight="bold"
                            sx={{ mb: 2 }}>
                            Welcome to your reading space.
                        </Typography>

                        <Typography sx={{
                            fontSize: 16,
                            lineHeight: 1.8,
                            color: '#FCE8DB'
                        }}>
                            Keep your favourite books organized,
                            write reviews and make every
                            reading moment count.
                        </Typography>
                    </Box>

                    <Typography variant="body2" sx={{
                        color: '#FCE8DB'
                    }}>
                        A world of stories awaits you.
                    </Typography>

                </Box>


                {/* Right Login Form */}

                <Box sx={{
                    width: { xs: '100%', md: '55%' },
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    p: { xs: 3, sm: 5 },
                    backgroundColor: '#FFFFFF'
                }}>

                    <Box sx={{ width: '100%', maxWidth: 420 }}>

                        {/* Mobile Logo */}

                        <Box sx={{
                            display: { xs: 'flex', md: 'none' },
                            justifyContent: 'center',
                            alignItems: 'center',
                            gap: 1,
                            mb: 3
                        }}>
                            <MenuBook sx={{
                                fontSize: 35,
                                color: '#F47745'
                            }} />

                            <Typography variant="h4"
                                fontWeight="bold"
                                sx={{ color: '#593C32' }}>
                                BookVerse
                            </Typography>
                        </Box>

                        <Typography variant="h4"
                            fontWeight="bold"
                            sx={{ color: '#593C32' }}>
                            Welcome Back!
                        </Typography>

                        <Typography sx={{
                            color: '#9B8175',
                            mt: 1,
                            mb: 4
                        }}>
                            Login to continue your reading journey.
                        </Typography>


                        <Box component="form" onSubmit={handleSubmit}>

                            <TextField
                                fullWidth
                                label="Email Address"
                                name="email"
                                type="email"
                                value={loginDetails.email}
                                onChange={handleChange}
                                margin="normal"
                                required
                            />

                            <TextField
                                fullWidth
                                label="Password"
                                name="password"
                                type={showPassword ? 'text' : 'password'}
                                value={loginDetails.password}
                                onChange={handleChange}
                                margin="normal"
                                required
                                InputProps={{
                                    endAdornment: (
                                        <InputAdornment position="end">
                                            <IconButton
                                                onClick={() => setShowPassword(!showPassword)}
                                                edge="end"
                                            >
                                                {showPassword
                                                    ? <VisibilityOff />
                                                    : <Visibility />}
                                            </IconButton>
                                        </InputAdornment>
                                    )
                                }}
                            />

                            {error && (
                                <Typography sx={{
                                    color: '#D9534F',
                                    mt: 2,
                                    fontSize: 14
                                }}>
                                    {error}
                                </Typography>
                            )}

                            <Button
                                fullWidth
                                type="submit"
                                variant="contained"
                                disabled={loading}
                                startIcon={<Login />}
                                sx={{
                                    mt: 3,
                                    py: 1.4,
                                    borderRadius: 2,
                                    backgroundColor: '#F47745',
                                    textTransform: 'none',
                                    fontSize: 16,
                                    fontWeight: 'bold',
                                    '&:hover': {
                                        backgroundColor: '#D95F32'
                                    }
                                }}
                            >
                                {loading ? 'Logging in...' : 'Login'}
                            </Button>

                        </Box>


                        <Typography textAlign="center"
                            sx={{ mt: 4, color: '#9B8175' }}>

                            Don't have an account?{' '}

                            <Box component={Link}
                                to="/register"
                                sx={{
                                    color: '#F47745',
                                    fontWeight: 'bold',
                                    textDecoration: 'none'
                                }}>
                                Register
                            </Box>

                        </Typography>

                    </Box>

                </Box>

            </Paper>

        </Box>

    )
}

export default LoginPage
