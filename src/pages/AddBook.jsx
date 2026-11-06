import React, { useState } from 'react'

import {
    Box,
    Typography,
    TextField,
    Button,
    MenuItem,
    Rating,
    Paper
} from '@mui/material'

import {
    useNavigate
} from 'react-router-dom'

import {
    ArrowBack,
    MenuBook
} from '@mui/icons-material'

import { addBookAPI } from '../services/apiServices'

function AddBook() {

    const navigate = useNavigate()

    const [bookDetails, setBookDetails] = useState({
        title: '',
        author: '',
        genre: '',
        coverImage: '',
        rating: 0,
        status: '',
        description: ''
    })

    // Handle input changes
    const handleChange = (e) => {
        setBookDetails({
            ...bookDetails,
            [e.target.name]: e.target.value
        })
    }

    // Add book to JSON Server
    const handleSubmit = async (e) => {
        e.preventDefault()

        try {
            const response = await addBookAPI(bookDetails)

            console.log('Book Added:', response.data)

            alert('Book added successfully!')

            navigate('/books')
        }
        catch (error) {
            console.log('Error adding book:', error)
            alert('Unable to add book')
        }
    }

    return (

        <Box sx={{
            p: { xs: 2, md: 4 },
            backgroundColor: '#FFF7ED',
            minHeight: 'calc(100vh - 75px)'
        }}>

            {/* Page Heading */}

            <Box sx={{
                display: 'flex',
                alignItems: 'center',
                gap: 2,
                mb: 4
            }}>

                <Button
                    onClick={() => navigate('/books')}
                    sx={{
                        minWidth: 42,
                        width: 42,
                        height: 42,
                        borderRadius: 2,
                        color: '#593C32',
                        backgroundColor: '#FFFFFF',
                        border: '1px solid #E9DED3',
                        '&:hover': {
                            backgroundColor: '#FFF0E8'
                        }
                    }}
                >
                    <ArrowBack />
                </Button>

                <Box>
                    <Typography
                        variant="h4"
                        fontWeight="bold"
                        sx={{ color: '#593C32' }}
                    >
                        Add New Book
                    </Typography>

                    <Typography
                        variant="body2"
                        sx={{ color: '#967C70', mt: 0.5 }}
                    >
                        Add a new book to your personal collection
                    </Typography>
                </Box>

            </Box>

            {/* Main Layout */}

            <Box sx={{
                display: 'grid',
                gridTemplateColumns: {
                    xs: '1fr',
                    md: 'minmax(0, 2fr) minmax(260px, 1fr)'
                },
                gap: 3,
                alignItems: 'start'
            }}>

                {/* Book Information Form */}

                <Paper
                    elevation={0}
                    sx={{
                        p: { xs: 2, md: 4 },
                        border: '1px solid #E9DED3',
                        borderRadius: 3,
                        backgroundColor: '#FFFFFF',
                        boxShadow: '0 4px 20px rgba(89,60,50,0.05)',
                        minWidth: 0
                    }}
                >

                    <Typography
                        variant="h6"
                        fontWeight="bold"
                        sx={{
                            color: '#593C32',
                            mb: 3
                        }}
                    >
                        Book Information
                    </Typography>

                    <Box
                        component="form"
                        onSubmit={handleSubmit}
                    >

                        {/* Form Fields */}

                        <Box sx={{
                            display: 'grid',
                            gridTemplateColumns: {
                                xs: '1fr',
                                sm: 'repeat(2, minmax(0, 1fr))'
                            },
                            gap: 3
                        }}>

                            {/* Book Title */}

                            <TextField
                                label="Book Title"
                                name="title"
                                value={bookDetails.title}
                                onChange={handleChange}
                                required
                                fullWidth
                            />

                            {/* Author */}

                            <TextField
                                label="Author"
                                name="author"
                                value={bookDetails.author}
                                onChange={handleChange}
                                required
                                fullWidth
                            />

                            {/* Genre */}

                            <TextField
                                select
                                label="Genre"
                                name="genre"
                                value={bookDetails.genre}
                                onChange={handleChange}
                                required
                                fullWidth
                            >
                                <MenuItem value="Fiction">Fiction</MenuItem>
                                <MenuItem value="Thriller">Thriller</MenuItem>
                                <MenuItem value="Romance">Romance</MenuItem>
                                <MenuItem value="Self Help">Self Help</MenuItem>
                                <MenuItem value="Fantasy">Fantasy</MenuItem>
                                <MenuItem value="Science">Science</MenuItem>
                                <MenuItem value="Biography">Biography</MenuItem>
                            </TextField>

                            {/* Reading Status */}

                            <TextField
                                select
                                label="Reading Status"
                                name="status"
                                value={bookDetails.status}
                                onChange={handleChange}
                                required
                                fullWidth
                            >
                                <MenuItem value="Want to Read">
                                    Want to Read
                                </MenuItem>

                                <MenuItem value="Currently Reading">
                                    Currently Reading
                                </MenuItem>

                                <MenuItem value="Completed">
                                    Completed
                                </MenuItem>
                            </TextField>

                            {/* Cover Image URL */}

                            <Box sx={{ gridColumn: '1 / -1' }}>

                                <TextField
                                    label="Cover Image URL"
                                    name="coverImage"
                                    value={bookDetails.coverImage}
                                    onChange={handleChange}
                                    fullWidth
                                    placeholder="Enter book cover image URL"
                                />

                            </Box>

                            {/* Rating */}

                            <Box>

                                <Typography
                                    sx={{
                                        color: '#593C32',
                                        mb: 1,
                                        fontWeight: 500
                                    }}
                                >
                                    Book Rating
                                </Typography>

                                <Rating
                                    value={Number(bookDetails.rating)}
                                    precision={0.5}
                                    onChange={(e, newValue) => {
                                        setBookDetails({
                                            ...bookDetails,
                                            rating: newValue || 0
                                        })
                                    }}
                                    size="large"
                                    sx={{ color: '#F47745' }}
                                />

                            </Box>

                            {/* Description */}

                            <Box sx={{ gridColumn: '1 / -1' }}>

                                <TextField
                                    label="Book Description"
                                    name="description"
                                    value={bookDetails.description}
                                    onChange={handleChange}
                                    multiline
                                    rows={4}
                                    fullWidth
                                    placeholder="Write something about this book..."
                                />

                            </Box>

                        </Box>

                        {/* Buttons */}

                        <Box sx={{
                            display: 'flex',
                            justifyContent: 'flex-end',
                            gap: 2,
                            mt: 4
                        }}>

                            <Button
                                variant="outlined"
                                onClick={() => navigate('/books')}
                                sx={{
                                    color: '#F47745',
                                    borderColor: '#F47745',
                                    borderRadius: 2,
                                    px: 3,
                                    textTransform: 'none',
                                    '&:hover': {
                                        backgroundColor: '#FFF0E8',
                                        borderColor: '#E76535'
                                    }
                                }}
                            >
                                Cancel
                            </Button>

                            <Button
                                type="submit"
                                variant="contained"
                                sx={{
                                    backgroundColor: '#F47745',
                                    color: '#FFFFFF',
                                    borderRadius: 2,
                                    px: 3,
                                    textTransform: 'none',
                                    '&:hover': {
                                        backgroundColor: '#E76535'
                                    }
                                }}
                            >
                                Add Book
                            </Button>

                        </Box>

                    </Box>

                </Paper>

                {/* Book Preview */}

                <Paper
                    elevation={0}
                    sx={{
                        p: 3,
                        border: '1px solid #E9DED3',
                        borderRadius: 3,
                        backgroundColor: '#FFFFFF',
                        textAlign: 'center',
                        minWidth: 0
                    }}
                >

                    <Typography
                        variant="h6"
                        fontWeight="bold"
                        sx={{
                            color: '#593C32',
                            mb: 3
                        }}
                    >
                        Book Preview
                    </Typography>

                    {/* Cover Image */}

                    <Box sx={{
                        height: 260,
                        width: '100%',
                        maxWidth: 220,
                        mx: 'auto',
                        backgroundColor: '#FFF7ED',
                        borderRadius: 2,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        overflow: 'hidden',
                        mb: 3
                    }}>

                        {bookDetails.coverImage ? (

                            <Box
                                component="img"
                                src={bookDetails.coverImage}
                                alt="Book Cover"
                                onError={(e) => {
                                    e.currentTarget.style.display = 'none'
                                }}
                                sx={{
                                    width: '100%',
                                    height: '100%',
                                    objectFit: 'contain'
                                }}
                            />

                        ) : (

                            <MenuBook sx={{
                                fontSize: 80,
                                color: '#F6C9B8'
                            }} />

                        )}

                    </Box>

                    {/* Preview Details */}

                    <Typography
                        variant="h6"
                        fontWeight="bold"
                        sx={{ color: '#593C32' }}
                    >
                        {bookDetails.title || 'Book Title'}
                    </Typography>

                    <Typography
                        variant="body2"
                        sx={{
                            color: '#967C70',
                            mt: 1
                        }}
                    >
                        {bookDetails.author || 'Author Name'}
                    </Typography>

                    <Box sx={{ mt: 2 }}>
                        <Rating
                            value={Number(bookDetails.rating)}
                            precision={0.5}
                            readOnly
                            size="small"
                        />
                    </Box>

                    {bookDetails.genre && (

                        <Typography
                            sx={{
                                mt: 2,
                                color: '#F47745',
                                fontSize: 14
                            }}
                        >
                            {bookDetails.genre}
                        </Typography>

                    )}

                </Paper>

            </Box>

        </Box>

    )
}

export default AddBook