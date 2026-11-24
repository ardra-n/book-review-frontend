
import React, { useEffect, useState } from 'react'

import {
    Box,
    Typography,
    Button,
    Rating,
    CircularProgress
} from '@mui/material'

import {
    ArrowForward,
    MenuBook,
    AutoStories,
    LocalLibrary
} from '@mui/icons-material'

import { useNavigate } from 'react-router-dom'
import { viewBooksAPI } from '../services/apiServices'


const primary = '#593C32'
const accent = '#F47745'
const muted = '#967C70'
const cream = '#FFF7ED'


function Dashboard() {

    const navigate = useNavigate()

    const [books, setBooks] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState('')

    useEffect(() => {
        const fetchBooks = async () => {
            try {
                const response = await viewBooksAPI()
                setBooks(response.data)
            }
            catch (err) {
                console.log(err)
                setError('Unable to load books. Please check JSON Server.')
            }
            finally {
                setLoading(false)
            }
        }

        fetchBooks()
    }, [])

    const latestBooks = [...books]
        .sort((a, b) => Number(b.id) - Number(a.id))

    

    const authors = [
        ...new Set(
            books.map(book => book.author?.trim()).filter(Boolean)
        )
    ]

    const openBook = (id) => {
        navigate(`/view-book/${id}`)
    }


    // Book cover component
    const BookCover = ({ book, height = 210 }) => (

        <Box
            component="img"
            src={book.coverImage}
            alt={book.title}
            onError={(e) => {
                e.target.style.opacity = 0
            }}
            sx={{
                width: '100%',
                height,
                objectFit: 'contain',
                transition: '0.3s',
                filter: 'drop-shadow(5px 7px 5px rgba(0,0,0,0.18))'
            }}
        />

    )


const authorPhotos = {
    'James Clear':
        'https://m.media-amazon.com/images/S/amzn-author-media-prod/rec58e62v0epfogin4i1o6mu55.jpg',

    'Robert Kiyosaki':
        'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSgA3A7PvG2HRhyNo8IKH9n-CSx8ZQfFPB7MGZVNDC1YLDLNSbfoSZRbsbt&s=10',

    'Paulo Coelho':
        'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQJ_1AXv1zN5E6MyVHnc-tQMTzIUGx_Au6__P-grs6S7g&s=10',

    'Morgan Housel':
        'https://m.media-amazon.com/images/S/amzn-author-media-prod/rtoaal9u1721n93pmiqkl7s1u1.jpg',

    'J.K. Rowling': 'https://image.tmdb.org/t/p/w500/8VDx3K8NBGJDEWr4KdsGsuT8wuj.jpg'
}



    return (

        <Box sx={{ backgroundColor: cream, minHeight: '100vh' }}>


            {/* HERO BANNER */}

            <Box
                sx={{
    backgroundImage: `
        linear-gradient(
            90deg,
            rgba(255, 240, 232, 0.94),
            rgba(255, 240, 232, 0.78)
        ),
        url('https://images.openai.com/static-rsc-4/8SU9U2gueJ-lzIqsUfqkUwZhiQzcZ2hAaI3JBZgkUwQpKjAcdq76LldBKY9CHrc14xgwAc-B6tVoz4zWeugYpizJv5ehG_kdvda7ssYFS5fxdcc_CwwATxypgYRI0ryT7MYskzD_kaBQz9rla8g38j7pM7h_QyJ3GHLFft2gwaepuJnCRq00KmdkogyVvSdv?purpose=fullsize')
    `,
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    backgroundRepeat: 'no-repeat',

    minHeight: { xs: 430, md: 440 },
    px: { xs: 3, md: 9 },
    py: { xs: 5, md: 6 },

    display: 'grid',
    gridTemplateColumns: {
        xs: '1fr',
        md: '1fr 1fr'
    },
    alignItems: 'center',
    gap: 3,
    overflow: 'hidden'
}}
            >

                <Box sx={{ maxWidth: 480, zIndex: 1 }}>

                    <Typography
                        sx={{
                            color: accent,
                            fontWeight: 'bold',
                            letterSpacing: 2,
                            fontSize: 13,
                            mb: 2
                        }}
                    >
                        WELCOME TO BOOKVERSE
                    </Typography>

                    <Typography
                        sx={{
                            fontFamily: '"Playfair Display", serif',
                            color: primary,
                            fontWeight: 'bold',
                            fontSize: {
                                xs: 37,
                                sm: 45,
                                md: 53
                            },
                            lineHeight: 1.12
                        }}
                    >
                        The World of
                        <br />
                        Books Awaits
                        <br />
                        <Box component="span" sx={{ color: accent }}>
                            You!
                        </Box>
                    </Typography>

                    <Typography
                        sx={{
                            color: muted,
                            lineHeight: 1.8,
                            mt: 2,
                            mb: 3,
                            maxWidth: 390
                        }}
                    >
                        Discover wonderful stories, explore new
                        authors and find your next favourite book
                        in your personal reading world.
                    </Typography>

                    <Button
                        variant="contained"
                        onClick={() => navigate('/books')}
                        endIcon={<ArrowForward />}
                        sx={{
                            backgroundColor: accent,
                            borderRadius: 5,
                            px: 3,
                            py: 1.2,
                            textTransform: 'none',
                            '&:hover': {
                                backgroundColor: primary
                            }
                        }}
                    >
                        Explore Books
                    </Button>

                </Box>


                {/* Overlapping book covers */}

                <Box
                    sx={{
                        position: 'relative',
                        height: { xs: 220, md: 330 },
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center'
                    }}
                >

                    {books.length > 0 ? (

                        <>

                            {books.slice(0, 3).map((book, index) => (

                                <Box
                                    key={book.id}
                                    onClick={() => openBook(book.id)}
                                    sx={{
                                        position: 'absolute',
                                        width: {
                                            xs: 115,
                                            md: 160
                                        },
                                        height: {
                                            xs: 165,
                                            md: 230
                                        },
                                        backgroundColor: '#FFFFFF',
                                        padding: 1,
                                        boxShadow: '0 12px 25px rgba(89,60,50,0.2)',
                                        cursor: 'pointer',
                                        transform: [
                                            'rotate(-12deg) translateX(-105px)',
                                            'rotate(2deg) translateY(-12px)',
                                            'rotate(12deg) translateX(105px)'
                                        ][index],
                                        zIndex: index + 1,
                                        transition: '0.3s',
                                        '&:hover': {
                                            transform: 'rotate(0deg) translateY(-15px)',
                                            zIndex: 5
                                        }
                                    }}
                                >

                                    <BookCover book={book} height="100%" />

                                </Box>

                            ))}

                        </>

                    ) : (

                        <LocalLibrary
                            sx={{
                                fontSize: 160,
                                color: '#D9A999'
                            }}
                        />

                    )}

                </Box>

            </Box>


            {/* MAIN CONTENT */}

            <Box
                sx={{
                    maxWidth: 1450,
                    mx: 'auto',
                    px: { xs: 2.5, md: 6 },
                    py: 6
                }}
            >

                {loading && (
                    <Box sx={{ textAlign: 'center', py: 5 }}>
                        <CircularProgress sx={{ color: accent }} />
                    </Box>
                )}

                {error && (
                    <Typography color="error" textAlign="center">
                        {error}
                    </Typography>
                )}


                {!loading && !error && (

                    <>


                        {/* TRENDING BOOKS */}

                        <Box sx={{ mb: 7 }}>

                            <Box
                                sx={{
                                    display: 'flex',
                                    justifyContent: 'space-between',
                                    alignItems: 'center',
                                    mb: 3
                                }}
                            >

                                <Box>
                                    <Typography
                                        variant="h5"
                                        fontWeight="bold"
                                        sx={{
                                            color: primary,
                                            fontFamily: '"Playfair Display", serif'
                                        }}
                                    >
                                        Trending on BookVerse
                                    </Typography>

                                    <Typography
                                        variant="body2"
                                        sx={{ color: muted, mt: 0.5 }}
                                    >
                                        Books worth adding to your reading list
                                    </Typography>
                                </Box>

                                <Button
                                    onClick={() => navigate('/books')}
                                    endIcon={<ArrowForward />}
                                    sx={{
                                        color: accent,
                                        textTransform: 'none'
                                    }}
                                >
                                    View More
                                </Button>

                            </Box>


                            <Box
                                sx={{
                                    display: 'grid',
                                    gridTemplateColumns: {
                                        xs: 'repeat(2, 1fr)',
                                        sm: 'repeat(3, 1fr)',
                                        md: 'repeat(5, 1fr)'
                                    },
                                    gap: { xs: 2, md: 3 }
                                }}
                            >

                                {latestBooks.slice(0, 5).map(book => (

                                    <Box
                                        key={book.id}
                                        onClick={() => openBook(book.id)}
                                        sx={{
                                            cursor: 'pointer',
                                            minWidth: 0,
                                            '&:hover img': {
                                                transform: 'translateY(-5px)'
                                            }
                                        }}
                                    >

                                        <Box
                                            sx={{
                                                height: 205,
                                                backgroundColor: '#F5EAE3',
                                                display: 'flex',
                                                alignItems: 'center',
                                                justifyContent: 'center',
                                                p: 2,
                                                mb: 1.5
                                            }}
                                        >
                                            <BookCover book={book} height="100%" />
                                        </Box>

                                        <Typography
                                            fontWeight="bold"
                                            fontSize={14}
                                            sx={{ color: primary }}
                                            noWrap
                                        >
                                            {book.title}
                                        </Typography>

                                        <Typography
                                            variant="caption"
                                            sx={{ color: muted }}
                                        >
                                            {book.author?.trim()}
                                        </Typography>

                                        <Rating
                                            value={Number(book.rating) || 0}
                                            readOnly
                                            size="small"
                                            sx={{ display: 'flex', color: accent }}
                                        />

                                    </Box>

                                ))}

                            </Box>

                            {books.length === 0 && (
                                <Typography color={muted}>
                                    Your book collection is empty. Add a book to get started.
                                </Typography>
                            )}

                        </Box>



                        {/* PROMOTIONAL BANNERS */}

                        <Box
                            sx={{
                                display: 'grid',
                                gridTemplateColumns: {
                                    xs: '1fr',
                                    md: '1fr 1fr'
                                },
                                gap: 2,
                                mb: 8
                            }}
                        >

                            <Box
                                sx={{
                                    backgroundColor: '#F4DDD5',
                                    p: 3,
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'space-between',
                                    minHeight: 160,
                                    gap: 2
                                }}
                            >

                                <Box>
                                    <Typography
                                        sx={{
                                            color: accent,
                                            fontSize: 11,
                                            fontWeight: 'bold',
                                            letterSpacing: 1
                                        }}
                                    >
                                        YOUR READING JOURNEY
                                    </Typography>

                                    <Typography
                                        variant="h6"
                                        fontWeight="bold"
                                        sx={{
                                            color: primary,
                                            mt: 1,
                                            fontFamily: '"Playfair Display", serif'
                                        }}
                                    >
                                        Every Page
                                        <br />
                                        Tells a Story
                                    </Typography>

                                    <Button
                                        onClick={() => navigate('/books')}
                                        size="small"
                                        sx={{
                                            mt: 1,
                                            backgroundColor: accent,
                                            color: '#FFFFFF',
                                            borderRadius: 4,
                                            textTransform: 'none',
                                            '&:hover': {
                                                backgroundColor: primary
                                            }
                                        }}
                                    >
                                        Browse Books
                                    </Button>
                                </Box>

                                <AutoStories
                                    sx={{
                                        fontSize: 85,
                                        color: '#C98B79',
                                        opacity: 0.8
                                    }}
                                />

                            </Box>


                            <Box
                                sx={{
                                    backgroundColor:  '#FFE5D4',
                                    p: 3,
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'space-between',
                                    minHeight: 160,
                                    gap: 2
                                }}
                            >

                                <Box>
                                    <Typography
                                        sx={{
                                            color: accent,
                                            fontSize: 11,
                                            fontWeight: 'bold',
                                            letterSpacing: 1
                                        }}
                                    >
                                        MAKE ROOM FOR STORIES
                                    </Typography>

                                    <Typography
                                        variant="h6"
                                        fontWeight="bold"
                                        sx={{
                                            color: primary,
                                            mt: 1,
                                            fontFamily: '"Playfair Display", serif'
                                        }}
                                    >
                                        Add a New
                                        <br />
                                        Favourite Book
                                    </Typography>

                                    <Button
                                        onClick={() => navigate('/add-book')}
                                        size="small"
                                        sx={{
                                            mt: 1,
                                           backgroundColor: accent,
                                           color: '#FFFFFF',
                                            borderRadius: 4,
                                            textTransform: 'none',
                                            '&:hover': {
                                                backgroundColor: '#F8E5DE'
                                            }
                                        }}
                                    >
                                        Add Book
                                    </Button>
                                </Box>

                                <MenuBook
                                    sx={{
                                        fontSize: 85,
                                        color: '#C98B79'
                                    }}
                                />

                            </Box>

                        </Box>

                        
{/* DISCOVER THE AUTHORS */}

<Box sx={{ mb: 8 }}>

    <Typography
        variant="h4"
        textAlign="center"
        fontWeight="bold"
        sx={{
            color: primary,
            fontFamily: '"Playfair Display", serif',
            mb: 1
        }}
    >
        Discover the Authors
    </Typography>

    <Typography
        textAlign="center"
        sx={{ color: muted, mb: 4 }}
    >
        Meet the talented authors behind your favourite books
    </Typography>

    <Box
        sx={{
            display: 'flex',
            justifyContent: 'center',
            flexWrap: 'wrap',
            gap: { xs: 3, md: 5 }
        }}
    >

       {authors.map((author) => (

            <Box
                key={author}
                sx={{
                    width: 160,
                    textAlign: 'center'
                }}
            >

                <Box
                    sx={{
                        width: 125,
                        height: 125,
                        borderRadius: '50%',
                        overflow: 'hidden',
                        mx: 'auto',
                        mb: 2,
                        backgroundColor: '#FFE5D4',
                        border: '4px solid #FFF0E8',
                        boxShadow: '0 5px 15px rgba(89,60,50,0.12)'
                    }}
                >

                    <Box
                        component="img"
                        src={authorPhotos[author]}
                        alt={author}
                        onError={(e) => {
                            e.target.style.display = 'none'
                        }}
                        sx={{
                            width: '100%',
                            height: '100%',
                            objectFit: 'cover'
                        }}
                    />

                </Box>

                <Typography
                    fontWeight="bold"
                    sx={{ color: primary }}
                >
                    {author}
                </Typography>

                <Typography
                    variant="caption"
                    sx={{ color: muted }}
                >
                    Author
                </Typography>

            </Box>

        ))}

    </Box>

</Box>



                       
                    </>

                )}


                

            </Box>

        </Box>
    )
}

export default Dashboard
