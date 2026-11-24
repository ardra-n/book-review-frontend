
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
    PersonAdd,
    MenuBook
} from '@mui/icons-material'

import { Link, useNavigate } from 'react-router-dom'

import {
    viewUsersAPI,
    registerUserAPI
} from '../services/apiServices'

function Register() {

    const navigate = useNavigate()

    const [userDetails, setUserDetails] = useState({
        name: '',
        email: '',
        password: '',
        confirmPassword: ''
    })

    const [showPassword, setShowPassword] = useState(false)
    const [showConfirmPassword, setShowConfirmPassword] = useState(false)
    const [error, setError] = useState('')
    const [loading, setLoading] = useState(false)

    const handleChange = (e) => {
        const { name, value } = e.target

        setUserDetails({
            ...userDetails,
            [name]: value
        })

        setError('')
    }

    const handleSubmit = async (e) => {

        e.preventDefault()

        const { name, email, password, confirmPassword } = userDetails

        if (!name || !email || !password || !confirmPassword) {
            setError('Please fill all the fields')
            return
        }

        if (password !== confirmPassword) {
            setError('Passwords do not match')
            return
        }

        if (password.length < 6) {
            setError('Password must contain at least 6 characters')
            return
        }

        try {

            setLoading(true)
            setError('')

            const response = await viewUsersAPI()

            const existingUser = response.data.find(
                (user) =>
                    user.email.toLowerCase() === email.trim().toLowerCase()
            )

            if (existingUser) {
                setError('Email already registered')
                return
            }

            const reqBody = {
                name: name.trim(),
                email: email.trim().toLowerCase(),
                password: password
            }

            await registerUserAPI(reqBody)

            alert('Registration successful! Please login.')

            navigate('/login')

        }
        catch (err) {
            console.log(err)
            setError('Registration failed. Please try again.')
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
                minHeight: 650,
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
                        url("https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTn6TSOpjhJGAEFo9myd61koxJh6BBowCDH_EHcaLLgKg&s=10")
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
                            Every book opens a new world.
                        </Typography>

                        <Typography sx={{
                            fontSize: 16,
                            lineHeight: 1.8,
                            color: '#FCE8DB'
                        }}>
                            Create your account and start your
                            reading journey with BookVerse.
                            Discover, organize and track
                            your favourite books.
                        </Typography>
                    </Box>

                    <Typography variant="body2" sx={{
                        color: '#FCE8DB'
                    }}>
                        Your reading journey starts here.
                    </Typography>

                </Box>


                {/* Right Register Form */}

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
                            Create Account
                        </Typography>

                        <Typography sx={{
                            color: '#9B8175',
                            mt: 1,
                            mb: 3
                        }}>
                            Join BookVerse and start your reading journey.
                        </Typography>


                        <Box component="form" onSubmit={handleSubmit}>

                            <TextField
                                fullWidth
                                label="Full Name"
                                name="name"
                                value={userDetails.name}
                                onChange={handleChange}
                                margin="normal"
                                required
                            />

                            <TextField
                                fullWidth
                                label="Email Address"
                                name="email"
                                type="email"
                                value={userDetails.email}
                                onChange={handleChange}
                                margin="normal"
                                required
                            />

                            <TextField
                                fullWidth
                                label="Password"
                                name="password"
                                type={showPassword ? 'text' : 'password'}
                                value={userDetails.password}
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

                            <TextField
                                fullWidth
                                label="Confirm Password"
                                name="confirmPassword"
                                type={showConfirmPassword ? 'text' : 'password'}
                                value={userDetails.confirmPassword}
                                onChange={handleChange}
                                margin="normal"
                                required
                                InputProps={{
                                    endAdornment: (
                                        <InputAdornment position="end">
                                            <IconButton
                                                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                                edge="end"
                                            >
                                                {showConfirmPassword
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
                                startIcon={<PersonAdd />}
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
                                {loading ? 'Registering...' : 'Create Account'}
                            </Button>

                        </Box>


                        <Typography textAlign="center"
                            sx={{ mt: 3, color: '#9B8175' }}>

                            Already have an account?{' '}

                            <Box component={Link}
                                to="/login"
                                sx={{
                                    color: '#F47745',
                                    fontWeight: 'bold',
                                    textDecoration: 'none'
                                }}>
                                Login
                            </Box>

                        </Typography>

                    </Box>

                </Box>

            </Paper>

        </Box>

    )
}

export default Register
