
import React, { useState, useEffect } from 'react'

import {
    Box,
    Typography,
    Button,
    Paper,
    Chip,
    Rating,
    CircularProgress
} from '@mui/material'

import {
    ArrowBack,
    Edit,
    MenuBook
} from '@mui/icons-material'

import { useNavigate, useParams } from 'react-router-dom'

import { viewBooksAPI } from '../services/apiServices'

function ViewBook() {

    const navigate = useNavigate()

    const { id } = useParams()

    const [book, setBook] = useState(null)

    const [loading, setLoading] = useState(true)

    // Fetch selected book
    const getBook = async () => {

        try {

            const response = await viewBooksAPI()

            const selectedBook = response.data.find(
                item => String(item.id) === String(id)
            )

            setBook(selectedBook || null)

        }
        catch (error) {

            console.log('Error fetching book:', error)

        }
        finally {

            setLoading(false)

        }

    }

    useEffect(() => {

        getBook()

    }, [id])

    // Loading
    if (loading) {

        return (

            <Box sx={{
                display: 'flex',
                justifyContent: 'center',
                mt: 10
            }}>

                <CircularProgress sx={{ color: '#F47745' }} />

            </Box>

        )

    }

    // Book not found
    if (!book) {

        return (

            <Box sx={{
                textAlign: 'center',
                mt: 10
            }}>

                <Typography variant="h5">
                    Book not found
                </Typography>

                <Button
                    onClick={() => navigate('/books')}
                    sx={{ mt: 2 }}
                >
                    Back to My Books
                </Button>

            </Box>

        )

    }

    return (

        <Box sx={{
            p: { xs: 2, md: 4 },
            minHeight: 'calc(100vh - 75px)',
            backgroundColor: '#FFF7ED'
        }}>

            {/* Header */}

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
                        color: '#593C32',
                        backgroundColor: '#FFFFFF',
                        border: '1px solid #E9DED3',
                        borderRadius: 2
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
                        Book Details
                    </Typography>

                    <Typography
                        variant="body2"
                        sx={{ color: '#967C70', mt: 0.5 }}
                    >
                        View your complete book information
                    </Typography>

                </Box>

            </Box>

            {/* Book Details */}

            <Paper
                elevation={0}
                sx={{
                    p: { xs: 2, md: 4 },
                    borderRadius: 3,
                    border: '1px solid #E9DED3',
                    backgroundColor: '#FFFFFF'
                }}
            >

                <Box sx={{
                    display: 'grid',
                    gridTemplateColumns: {
                        xs: '1fr',
                        md: '280px 1fr'
                    },
                    gap: 4
                }}>

                    {/* Book Cover */}

                    <Box sx={{
                        height: 350,
                        backgroundColor: '#FFF7ED',
                        borderRadius: 2,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        overflow: 'hidden'
                    }}>

                        {book.coverImage ? (

                            <Box
                                component="img"
                                src={book.coverImage}
                                alt={book.title}
                                sx={{
                                    width: '100%',
                                    height: '100%',
                                    objectFit: 'contain',
                                    p: 2
                                }}
                            />

                        ) : (

                            <MenuBook sx={{
                                fontSize: 100,
                                color: '#F6C9B8'
                            }} />

                        )}

                    </Box>

                    {/* Book Information */}

                    <Box>

                        <Typography
                            variant="h4"
                            fontWeight="bold"
                            sx={{ color: '#593C32', mb: 1 }}
                        >
                            {book.title}
                        </Typography>

                        <Typography
                            variant="h6"
                            sx={{ color: '#967C70', mb: 3 }}
                        >
                            By {book.author}
                        </Typography>

                        {/* Genre */}

                        <Box sx={{ mb: 2 }}>

                            <Chip
                                label={book.genre}
                                sx={{
                                    backgroundColor: '#F3E7D9',
                                    color: '#6B4F3B'
                                }}
                            />

                        </Box>

                        {/* Rating */}

                        <Box sx={{ mb: 2 }}>

                            <Typography
                                fontWeight="bold"
                                sx={{ color: '#593C32', mb: 1 }}
                            >
                                Book Rating
                            </Typography>

                            <Rating
                                value={Number(book.rating) || 0}
                                precision={0.5}
                                readOnly
                                size="large"
                            />

                            <Typography
                                variant="body2"
                                sx={{ color: '#967C70' }}
                            >
                                {Number(book.rating) || 0} / 5
                            </Typography>

                        </Box>

                        {/* Reading Status */}

                        <Box sx={{ mb: 3 }}>

                            <Typography
                                fontWeight="bold"
                                sx={{ color: '#593C32', mb: 1 }}
                            >
                                Reading Status
                            </Typography>

                            <Chip
                                label={book.status || 'Not specified'}
                                color={
                                    book.status === 'Completed'
                                        ? 'success'
                                        : book.status === 'Currently Reading'
                                            ? 'warning'
                                            : 'default'
                                }
                            />

                        </Box>

                        {/* Description */}

                        <Typography
                            variant="h6"
                            fontWeight="bold"
                            sx={{ color: '#593C32', mb: 1 }}
                        >
                            Description
                        </Typography>

                        <Typography
                            sx={{
                                color: '#8C7B6E',
                                lineHeight: 1.8,
                                whiteSpace: 'pre-wrap'
                            }}
                        >
                            {book.description || 'No description available.'}
                        </Typography>

                        {/* Edit Button */}

                        <Box sx={{
                            display: 'flex',
                            gap: 2,
                            mt: 4
                        }}>

                            <Button
                                variant="contained"
                                startIcon={<Edit />}
                                onClick={() => navigate(`/edit-book/${book.id}`)}
                                sx={{
                                    backgroundColor: '#F47745',
                                    textTransform: 'none',
                                    borderRadius: 2,
                                    '&:hover': {
                                        backgroundColor: '#E76535'
                                    }
                                }}
                            >
                                Edit Book
                            </Button>

                            <Button
                                variant="outlined"
                                onClick={() => navigate('/books')}
                                sx={{
                                    color: '#8B5E3C',
                                    borderColor: '#8B5E3C',
                                    textTransform: 'none',
                                    borderRadius: 2
                                }}
                            >
                                Back
                            </Button>

                        </Box>

                    </Box>

                </Box>

            </Paper>

        </Box>

    )

}

export default ViewBook
