import React, { useState } from 'react'

import {
    Box,
    Typography,
    Card,
    CardContent,
    Button,
    LinearProgress,
    Rating,
    Chip
} from '@mui/material'

import {
    MenuBook,
    CheckCircle,
    Bookmark,
    Star,
    ArrowForward,
    ImageOutlined,
    FormatQuote
} from '@mui/icons-material'

import { useNavigate } from 'react-router-dom'


const images = {
    hero: 'https://t3.ftcdn.net/jpg/08/15/90/80/360_F_815908053_Mfy2DJfv1iFSdL6ET9pRD5R5VzOOEu5k.jpg',
    goal: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT2rqcLwljmYVyRYzsk2Y6GW8rSccI82oWi30TgwZ0nRe3GkxrP2X3M4bte&s=10',
    featured: 'https://media.istockphoto.com/id/1460007178/photo/library-books-on-table-and-background-for-studying-learning-and-research-in-education-school.jpg?s=612x612&w=0&k=20&c=OV_sdclWUExHy0VKPeZwyen2mO6g1NwAIBbLPT_Hd30=',
    quote: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSLIxPmZA9-n0-TkSc2xfxqqPxOg-JUKlNo3GziNpyeOSv5idJ87jR0y0c&s=10'
}


const continueReading = [
    { id: 1, title: 'The Midnight Library', author: 'Matt Haig', progress: 62, cover: 'https://m.media-amazon.com/images/I/71qsovx-x6L._AC_UF1000,1000_QL80_.jpg' },
    { id: 2, title: 'Atomic Habits', author: 'James Clear', progress: 35, cover: 'https://m.media-amazon.com/images/I/817HaeblezL._AC_UF1000,1000_QL80_.jpg' },
    { id: 3, title: 'The Alchemist', author: 'Paulo Coelho', progress: 80, cover: 'https://m.media-amazon.com/images/I/617lxveUjYL.jpg' }
]

const recommended = [
    { id: 11, title: 'Dune', author: 'Frank Herbert', genre: 'Fantasy', rating: 4.5, cover: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTu_UEU_t80YheLHKpeWkTNG9gJvU7vOnWee5cLj6q3QqiWeI0V1iJz6OU&s=10' },
    { id: 12, title: 'Sapiens', author: 'Yuval Noah Harari', genre: 'Science', rating: 4.5, cover: 'https://m.media-amazon.com/images/I/713jIoMO3UL._AC_UF1000,1000_QL80_.jpg' },
    { id: 13, title: 'Normal People', author: 'Sally Rooney', genre: 'Fiction', rating: 4, cover: 'https://m.media-amazon.com/images/S/compressed.photo.goodreads.com/books/1571423190i/41057294.jpg' },
    { id: 14, title: 'Deep Work', author: 'Cal Newport', genre: 'Self Help', rating: 4.5, cover: 'https://gyaanstore.com/cdn/shop/files/45_2e2a7539-497a-45e2-9eed-f8d248340b91.png?v=1757578380' }
]

const reviews = [
    { id: 1, title: 'Project Hail Mary', rating: 5, text: "Couldn't put it down. Funny, clever, and surprisingly moving." },
    { id: 2, title: 'Educated', rating: 4, text: 'A hard but important read with beautiful writing.' }
]

const goal = { read: 12, target: 30 }

const quote = {
    text: 'A reader lives a thousand lives before he dies.',
    author: 'George R.R. Martin'
}


// Shows the image if `src` is set, otherwise a dashed box where an image can go
function ImageSlot({ src, alt, label = 'Add image', compact = false, imageOpacity = 1, sx }) {

    const [failed, setFailed] = useState(false)

    const showImage = Boolean(src) && !failed

    return (

        <Box
            sx={{
                position: 'relative',
                overflow: 'hidden',
                borderRadius: 3,
                backgroundColor: compact && !showImage ? 'transparent' : '#FFF0E8',
                border: showImage || compact ? 'none' : '2px dashed #F6C9B8',
                color: '#F47745',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 0.5,
                textAlign: 'center',
                px: 1,
                ...sx
            }}
        >

            {showImage ? (

                <Box
                    component="img"
                    src={src}
                    alt={alt}
                    onError={() => setFailed(true)}
                    sx={{
                        position: 'absolute',
                        inset: 0,
                        width: '100%',
                        height: '100%',
                        objectFit: 'cover',
                        opacity: imageOpacity
                    }}
                />

            ) : compact ? null : (

                <>
                    <ImageOutlined />
                    <Typography variant="caption" sx={{ color: '#967C70' }}>
                        {failed ? "Image didn't load. Check the address" : label}
                    </Typography>
                </>

            )}

        </Box>

    )

}

function SectionHeading({ title, actionLabel, onAction }) {

    return (

        <Box
            sx={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                mb: 3
            }}
        >

            <Typography
                variant="h5"
                fontWeight="bold"
                sx={{ color: '#593C32' }}
            >
                {title}
            </Typography>

            {actionLabel && (

                <Button
                    onClick={onAction}
                    endIcon={<ArrowForward />}
                    sx={{
                        color: '#F47745',
                        textTransform: 'none',
                        '&:hover': { backgroundColor: '#FFF0E8' }
                    }}
                >
                    {actionLabel}
                </Button>

            )}

        </Box>

    )

}

const panelSx = {
    border: '1px solid #E9DED3',
    borderRadius: 3,
    backgroundColor: '#FFFFFF'
}

function Dashboard() {

    const navigate = useNavigate()

    // Dashboard statistics
    const cardData = [
        {
            title: 'Total Books',
            count: 24,
            icon: <MenuBook />,
            color: '#F47745',
            bg: '#FFF0E8'
        },
        {
            title: 'Completed',
            count: 12,
            icon: <CheckCircle />,
            color: '#588157',
            bg: '#EAF2E8'
        },
        {
            title: 'Currently Reading',
            count: 5,
            icon: <Bookmark />,
            color: '#D68B50',
            bg: '#FFF3E4'
        },
        {
            title: 'Average Rating',
            count: '4.6',
            icon: <Star />,
            color: '#D69E36',
            bg: '#FFF5D9'
        }
    ]

    const goalPercent = Math.round((goal.read / goal.target) * 100)

    return (

        <Box
            sx={{
                p: { xs: 2, md: 4 },
                backgroundColor: '#FFF7ED',
                minHeight: 'calc(100vh - 75px)',
                width: '100%'
            }}
        >

            {/* Welcome Section */}

            <Box
                sx={{
                    background: 'linear-gradient(120deg, #FCE0D2 0%, #FFF0E8 100%)',
                    borderRadius: 4,
                    p: { xs: 3, md: 5 },
                    mb: 5,
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    gap: 3,
                    flexWrap: 'wrap'
                }}
            >

                <Box sx={{ maxWidth: 520 }}>

                    <Typography
                        variant="h4"
                        fontWeight="bold"
                        sx={{ color: '#593C32' }}
                    >
                        Welcome to BookVerse!
                    </Typography>

                    <Typography
                        sx={{
                            color: '#967C70',
                            mt: 1.5,
                            mb: 2.5
                        }}
                    >
                        Every book is a new adventure. Continue your reading journey!
                    </Typography>

                    <Box sx={{ display: 'flex', gap: 1.5, flexWrap: 'wrap' }}>

                        <Button
                            variant="contained"
                            endIcon={<ArrowForward />}
                            onClick={() => navigate('/books')}
                            sx={{
                                backgroundColor: '#F47745',
                                borderRadius: 2,
                                px: 3,
                                py: 1,
                                textTransform: 'none',
                                '&:hover': {
                                    backgroundColor: '#E76535'
                                }
                            }}
                        >
                            Explore My Books
                        </Button>

                        <Button
                            variant="outlined"
                            onClick={() => navigate('/add-book')}
                            sx={{
                                color: '#F47745',
                                borderColor: '#F47745',
                                borderRadius: 2,
                                px: 3,
                                py: 1,
                                textTransform: 'none',
                                '&:hover': {
                                    backgroundColor: '#FFF0E8',
                                    borderColor: '#E76535'
                                }
                            }}
                        >
                            Add a Book
                        </Button>

                    </Box>

                </Box>

                {/* Hero image */}

                <ImageSlot
                    src={images.hero}
                    alt="Reading illustration"
                    label="Hero image"
                    sx={{
                        width: { xs: '100%', md: 280 },
                        height: { xs: 160, md: 180 },
                        borderRadius: 4,
                        backgroundColor: '#F6C9B8'
                    }}
                />

            </Box>

            {/* Reading Overview Heading */}

            <Typography
                variant="h5"
                fontWeight="bold"
                sx={{
                    color: '#593C32',
                    mb: 3
                }}
            >
                Reading Overview
            </Typography>

            {/* Statistics Cards */}

            <Box
                sx={{
                    display: 'grid',
                    gridTemplateColumns: {
                        xs: '1fr',
                        sm: 'repeat(2, minmax(0, 1fr))',
                        lg: 'repeat(4, minmax(0, 1fr))'
                    },
                    gap: 3,
                    width: '100%',
                    mb: 5
                }}
            >

                {cardData.map((item) => (

                    <Card
                        key={item.title}
                        elevation={0}
                        sx={{
                            width: '100%',
                            minWidth: 0,
                            border: '1px solid #E9DED3',
                            borderRadius: 3,
                            backgroundColor: '#FFFFFF',
                            transition: '0.3s',

                            '&:hover': {
                                transform: 'translateY(-4px)',
                                boxShadow: '0 8px 20px rgba(89,60,50,0.08)'
                            }
                        }}
                    >

                        <CardContent sx={{ p: 3 }}>

                            <Box
                                sx={{
                                    display: 'flex',
                                    justifyContent: 'space-between',
                                    alignItems: 'center',
                                    gap: 1
                                }}
                            >

                                {/* Card Details */}

                                <Box sx={{ minWidth: 0 }}>

                                    <Typography
                                        variant="body2"
                                        sx={{
                                            color: '#967C70',
                                            whiteSpace: 'nowrap'
                                        }}
                                    >
                                        {item.title}
                                    </Typography>

                                    <Typography
                                        variant="h4"
                                        fontWeight="bold"
                                        sx={{
                                            mt: 1,
                                            color: '#593C32'
                                        }}
                                    >
                                        {item.count}
                                    </Typography>

                                </Box>

                                {/* Card Icon */}

                                <Box
                                    sx={{
                                        backgroundColor: item.bg,
                                        color: item.color,
                                        p: 1.8,
                                        borderRadius: 3,
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        flexShrink: 0
                                    }}
                                >
                                    {item.icon}
                                </Box>

                            </Box>

                        </CardContent>

                    </Card>

                ))}

            </Box>

            {/* Continue Reading + Yearly Goal */}

            <Box
                sx={{
                    display: 'grid',
                    gridTemplateColumns: { xs: '1fr', md: 'minmax(0, 1.5fr) minmax(0, 1fr)' },
                    gap: 3,
                    mb: 5
                }}
            >

                <Box sx={{ ...panelSx, p: 3 }}>

                    <SectionHeading
                        title="Continue Reading"
                        actionLabel="See all"
                        onAction={() => navigate('/books')}
                    />

                    {continueReading.map((book, index) => (

                        <Box
                            key={book.id}
                            sx={{
                                display: 'flex',
                                gap: 2,
                                alignItems: 'center',
                                py: 2,
                                borderTop: index === 0 ? 'none' : '1px solid #E9DED3'
                            }}
                        >

                            <ImageSlot
                                src={book.cover}
                                alt={`${book.title} cover`}
                                label="Cover"
                                sx={{ width: 64, height: 92, flexShrink: 0, borderRadius: 2 }}
                            />

                            <Box sx={{ flex: 1, minWidth: 0 }}>

                                <Typography fontWeight="bold" sx={{ color: '#593C32' }} noWrap>
                                    {book.title}
                                </Typography>

                                <Typography variant="body2" sx={{ color: '#967C70' }}>
                                    By {book.author}
                                </Typography>

                                <LinearProgress
                                    variant="determinate"
                                    value={book.progress}
                                    sx={{
                                        mt: 1.5,
                                        height: 8,
                                        borderRadius: 4,
                                        backgroundColor: '#FFF0E8',
                                        '& .MuiLinearProgress-bar': {
                                            backgroundColor: '#F47745',
                                            borderRadius: 4
                                        }
                                    }}
                                />

                            </Box>

                            <Typography fontWeight="bold" sx={{ color: '#F47745', width: 44, textAlign: 'right' }}>
                                {book.progress}%
                            </Typography>

                        </Box>

                    ))}

                </Box>

                {/* Yearly goal */}

                <Box sx={{ ...panelSx, p: 3, display: 'flex', flexDirection: 'column' }}>

                    <Typography
                        variant="h5"
                        fontWeight="bold"
                        sx={{ color: '#593C32', mb: 3 }}
                    >
                        Reading Goal
                    </Typography>

                    <ImageSlot
                        src={images.goal}
                        alt="Reading goal"
                        label="Goal image"
                        sx={{ width: '100%', height: 150, mb: 3 }}
                    />

                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>

                        <Typography fontWeight="bold" sx={{ color: '#593C32', fontSize: '1.4rem' }}>
                            {goal.read} of {goal.target} books
                        </Typography>

                        <Typography fontWeight="bold" sx={{ color: '#F47745' }}>
                            {goalPercent}%
                        </Typography>

                    </Box>

                    <LinearProgress
                        variant="determinate"
                        value={goalPercent}
                        sx={{
                            mt: 1.5,
                            height: 10,
                            borderRadius: 5,
                            backgroundColor: '#FFF0E8',
                            '& .MuiLinearProgress-bar': {
                                backgroundColor: '#F47745',
                                borderRadius: 5
                            }
                        }}
                    />

                    <Typography variant="body2" sx={{ color: '#967C70', mt: 1.5, mb: 2.5 }}>
                        {goal.target - goal.read} more books to reach your yearly goal.
                    </Typography>

                    <Button
                        onClick={() => navigate('/goals')}
                        sx={{
                            mt: 'auto',
                            alignSelf: 'flex-start',
                            color: '#F47745',
                            textTransform: 'none',
                            px: 0,
                            '&:hover': { backgroundColor: 'transparent', textDecoration: 'underline' }
                        }}
                    >
                        View Reading Goals
                    </Button>

                </Box>

            </Box>

            {/* Recommended For You */}

            <SectionHeading
                title="Recommended for You"
                actionLabel="Browse books"
                onAction={() => navigate('/books')}
            />

            <Box
                sx={{
                    display: 'grid',
                    gridTemplateColumns: {
                        xs: 'repeat(2, minmax(0, 1fr))',
                        md: 'repeat(4, minmax(0, 1fr))'
                    },
                    gap: 3,
                    mb: 5
                }}
            >

                {recommended.map((book) => (

                    <Card
                        key={book.id}
                        elevation={0}
                        sx={{
                            ...panelSx,
                            overflow: 'hidden',
                            transition: '0.3s',
                            '&:hover': {
                                transform: 'translateY(-4px)',
                                boxShadow: '0 8px 20px rgba(89,60,50,0.08)'
                            }
                        }}
                    >

                        <ImageSlot
                            src={book.cover}
                            alt={`${book.title} cover`}
                            label="Book cover"
                            sx={{ width: '100%', aspectRatio: '3 / 4', borderRadius: 0 }}
                        />

                        <CardContent sx={{ p: 2 }}>

                            <Typography fontWeight="bold" sx={{ color: '#593C32' }} noWrap>
                                {book.title}
                            </Typography>

                            <Typography variant="body2" sx={{ color: '#967C70', mt: 0.5 }} noWrap>
                                By {book.author}
                            </Typography>

                            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mt: 1.5, gap: 1, flexWrap: 'wrap' }}>

                                <Rating value={book.rating} precision={0.5} readOnly size="small" sx={{ color: '#F47745' }} />

                                <Chip
                                    label={book.genre}
                                    size="small"
                                    sx={{ backgroundColor: '#F3E7D9', color: '#6B4F3B' }}
                                />

                            </Box>

                        </CardContent>

                    </Card>

                ))}

            </Box>

            {/* Featured Book Banner */}

            <Box
                sx={{
                    ...panelSx,
                    overflow: 'hidden',
                    display: 'grid',
                    gridTemplateColumns: { xs: '1fr', md: '1fr 1.2fr' },
                    mb: 5
                }}
            >

                <ImageSlot
                    src={images.featured}
                    alt="Featured book"
                    label="Featured image"
                    sx={{ width: '100%', minHeight: { xs: 200, md: 280 }, borderRadius: 0 }}
                />

                <Box sx={{ p: { xs: 3, md: 5 }, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>

                    <Chip
                        label="Book of the month"
                        size="small"
                        sx={{ alignSelf: 'flex-start', backgroundColor: '#FFF0E8', color: '#F47745', fontWeight: 'bold', mb: 2 }}
                    />

                    <Typography variant="h5" fontWeight="bold" sx={{ color: '#593C32' }}>
                        Pick a book for this month
                    </Typography>

                    <Typography sx={{ color: '#967C70', mt: 1.5, mb: 3 }}>
                        Choose one book to finish by the end of the month. Small goals keep your reading habit going.
                    </Typography>

                    <Button
                        variant="contained"
                        endIcon={<ArrowForward />}
                        onClick={() => navigate('/books')}
                        sx={{
                            alignSelf: 'flex-start',
                            backgroundColor: '#F47745',
                            borderRadius: 2,
                            px: 3,
                            textTransform: 'none',
                            '&:hover': { backgroundColor: '#E76535' }
                        }}
                    >
                        Choose a book
                    </Button>

                </Box>

            </Box>

            {/* Recent Reviews + Quote */}

            <Box
                sx={{
                    display: 'grid',
                    gridTemplateColumns: { xs: '1fr', md: 'minmax(0, 1.5fr) minmax(0, 1fr)' },
                    gap: 3
                }}
            >

                <Box sx={{ ...panelSx, p: 3 }}>

                    <SectionHeading
                        title="Recent Reviews"
                        actionLabel="All reviews"
                        onAction={() => navigate('/reviews')}
                    />

                    {reviews.map((review, index) => (

                        <Box
                            key={review.id}
                            sx={{
                                py: 2,
                                borderTop: index === 0 ? 'none' : '1px solid #E9DED3'
                            }}
                        >

                            <Typography fontWeight="bold" sx={{ color: '#593C32' }}>
                                {review.title}
                            </Typography>

                            <Rating value={review.rating} readOnly size="small" sx={{ color: '#F47745', mt: 0.5 }} />

                            <Typography variant="body2" sx={{ color: '#967C70', mt: 1 }}>
                                {review.text}
                            </Typography>

                        </Box>

                    ))}

                </Box>

                {/* Quote with image */}

                <Box
                    sx={{
                        position: 'relative',
                        overflow: 'hidden',
                        borderRadius: 3,
                        minHeight: 260,
                        background: 'linear-gradient(120deg, #FCE0D2 0%, #FFF0E8 100%)',
                        p: 4,
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: 'space-between'
                    }}
                >

                    <ImageSlot
                        src={images.quote}
                        alt="Quote background"
                        compact
                        imageOpacity={0.25}
                        sx={{ position: 'absolute', inset: 0, borderRadius: 0 }}
                    />

                    <FormatQuote sx={{ position: 'relative', fontSize: 48, color: '#F47745' }} />

                    <Typography
                        variant="h6"
                        fontWeight="bold"
                        sx={{ position: 'relative', color: '#593C32' }}
                    >
                        {quote.text}
                    </Typography>

                    <Typography sx={{ position: 'relative', color: '#967C70', mt: 2 }}>
                        {quote.author}
                    </Typography>

                </Box>

            </Box>

        </Box>

    )

}

export default Dashboard