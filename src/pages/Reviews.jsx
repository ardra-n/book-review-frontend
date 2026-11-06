
import React, { useState, useEffect } from 'react'

import {
    Box,
    Typography,
    Button,
    Card,
    CardContent,
    CardMedia,
    Rating,
    IconButton,
    CircularProgress,
    Chip,
    Pagination,
    TextField,
    MenuItem,
    InputAdornment
} from '@mui/material'

import {
    Add,
    Edit,
    Delete,
    MenuBook,
    Search
} from '@mui/icons-material'

import ReviewForm from '../components/ReviewForm'

import {
    viewBooksAPI,
    viewReviewsAPI,
    addReviewAPI,
    editReviewAPI,
    deleteReviewAPI
} from '../services/apiServices'


function Reviews() {

    const [books, setBooks] = useState([])
    const [reviews, setReviews] = useState([])

    const [loading, setLoading] = useState(true)

    const [open, setOpen] = useState(false)
    const [editId, setEditId] = useState(null)

    // Search and rating filter states
    const [search, setSearch] = useState('')
    const [ratingFilter, setRatingFilter] = useState('All')

    // Pagination states
    const [page, setPage] = useState(1)

    const reviewsPerPage = 6

    const [reviewDetails, setReviewDetails] = useState({
        bookId: '',
        bookTitle: '',
        author: '',
        reviewerName: '',
        rating: 0,
        reviewTitle: '',
        comment: ''
    })


    // Fetch Books and Reviews

    const getData = async () => {

        try {

            const bookResponse = await viewBooksAPI()
            const reviewResponse = await viewReviewsAPI()

            setBooks(bookResponse.data)
            setReviews(reviewResponse.data)

        }

        catch (error) {

            console.log('Error fetching data:', error)

        }

        finally {

            setLoading(false)

        }

    }


    useEffect(() => {

        getData()

    }, [])


    // Search and filter reviews

    const filteredReviews = reviews

        // Search by book title or reviewer name

        .filter(review => {

            return (

                (review.bookTitle || '')
                    .toLowerCase()
                    .includes(search.toLowerCase()) ||

                (review.reviewerName || '')
                    .toLowerCase()
                    .includes(search.toLowerCase())

            )

        })

        // Filter by rating

        .filter(review => {

            return (
                ratingFilter === 'All' ||
                Number(review.rating) === Number(ratingFilter)
            )

        })


    // Calculate total pages

    const totalPages = Math.ceil(
        filteredReviews.length / reviewsPerPage
    )


    // Get reviews for current page

    const startIndex = (page - 1) * reviewsPerPage

    const currentReviews = filteredReviews.slice(
        startIndex,
        startIndex + reviewsPerPage
    )


    // Reset page when search or rating changes

    useEffect(() => {

        setPage(1)

    }, [search, ratingFilter])


    // Clear search and filters

    const clearFilters = () => {

        setSearch('')
        setRatingFilter('All')
        setPage(1)

    }


    // Open Add Review Form

    const handleAdd = () => {

        setEditId(null)

        setReviewDetails({
            bookId: '',
            bookTitle: '',
            author: '',
            reviewerName: '',
            rating: 0,
            reviewTitle: '',
            comment: ''
        })

        setOpen(true)

    }


    // Open Edit Review Form

    const handleEdit = (review) => {

        const bookExists = books.some(
            book => String(book.id) === String(review.bookId)
        )

        setEditId(review.id)

        setReviewDetails({
            bookId: bookExists ? review.bookId : 'other',
            bookTitle: review.bookTitle || '',
            author: review.author || '',
            reviewerName: review.reviewerName || '',
            rating: Number(review.rating),
            reviewTitle: review.reviewTitle || '',
            comment: review.comment || ''
        })

        setOpen(true)

    }


    // Close Review Form

    const handleClose = () => {

        setOpen(false)

    }


    // Add or Edit Review

    const handleSubmit = async () => {

        let selectedBook = null

        if (
            reviewDetails.bookId !== 'other' &&
            reviewDetails.bookId !== ''
        ) {

            selectedBook = books.find(
                book => String(book.id) === String(reviewDetails.bookId)
            )

        }

        const bookTitle = selectedBook
            ? selectedBook.title
            : reviewDetails.bookTitle.trim()

        const author = selectedBook
            ? selectedBook.author
            : reviewDetails.author.trim()

        if (
            !bookTitle ||
            !author ||
            !reviewDetails.reviewerName.trim() ||
            !reviewDetails.rating ||
            !reviewDetails.reviewTitle.trim() ||
            !reviewDetails.comment.trim()
        ) {

            alert('Please fill all review details')
            return

        }


        const requestBody = {

            bookId: selectedBook ? selectedBook.id : null,

            bookTitle: bookTitle,

            author: author,

            coverImage: selectedBook
                ? selectedBook.coverImage || ''
                : '',

            reviewerName: reviewDetails.reviewerName.trim(),

            rating: Number(reviewDetails.rating),

            reviewTitle: reviewDetails.reviewTitle.trim(),

            comment: reviewDetails.comment.trim(),

            date: new Date().toLocaleDateString()

        }


        try {

            if (editId) {

                await editReviewAPI(editId, requestBody)

                alert('Review updated successfully!')

            }

            else {

                await addReviewAPI(requestBody)

                alert('Review added successfully!')

            }

            setOpen(false)
            setPage(1)

            await getData()

        }

        catch (error) {

            console.log('Review error:', error)

            alert('Unable to save review')

        }

    }


    // Delete Review

    const handleDelete = async (id) => {

        const confirmDelete = window.confirm(
            'Are you sure you want to delete this review?'
        )

        if (!confirmDelete) return

        try {

            await deleteReviewAPI(id)

            alert('Review deleted successfully!')

            await getData()

            // Calculate remaining pages after deletion

            const remainingReviews = filteredReviews.length - 1

            const remainingPages = Math.ceil(
                remainingReviews / reviewsPerPage
            )

            setPage(prevPage =>
                Math.min(prevPage, Math.max(1, remainingPages))
            )

        }

        catch (error) {

            console.log('Delete error:', error)

            alert('Unable to delete review')

        }

    }


    return (

        <Box sx={{

            p: { xs: 2, md: 4 },

            minHeight: 'calc(100vh - 75px)',

            backgroundColor: '#FFF7ED'

        }}>


            {/* Page Heading */}

            <Box sx={{

                display: 'flex',

                justifyContent: 'space-between',

                alignItems: 'center',

                gap: 2,

                mb: 4,

                flexWrap: 'wrap'

            }}>

                <Box>

                    <Typography

                        variant="h4"

                        fontWeight="bold"

                        sx={{ color: '#593C32' }}

                    >

                        My Reviews

                    </Typography>


                    <Typography

                        sx={{ color: '#967C70', mt: 1 }}

                    >

                        Share your thoughts about the books you read

                    </Typography>

                </Box>


                <Button

                    variant="contained"

                    startIcon={<Add />}

                    onClick={handleAdd}

                    sx={{

                        backgroundColor: '#F47745',

                        borderRadius: 2,

                        textTransform: 'none',

                        '&:hover': {

                            backgroundColor: '#E76535'

                        }

                    }}

                >

                    Add Review

                </Button>

            </Box>



            {/* Loading */}

            {

                loading ? (

                    <Box sx={{

                        display: 'flex',

                        justifyContent: 'center',

                        mt: 8

                    }}>

                        <CircularProgress sx={{ color: '#F47745' }} />

                    </Box>

                ) : (

                    <>


                        {/* Search and Rating Filter */}

                        <Box sx={{

                            backgroundColor: '#FFFFFF',

                            border: '1px solid #E9DED3',

                            borderRadius: 3,

                            p: 3,

                            mb: 4

                        }}>

                            <Typography

                                variant="h6"

                                fontWeight="bold"

                                sx={{

                                    color: '#593C32',

                                    mb: 2

                                }}

                            >

                                Search and Filter Reviews

                            </Typography>


                            <Box sx={{

                                display: 'grid',

                                gridTemplateColumns: {

                                    xs: '1fr',

                                    sm: '2fr 1fr'

                                },

                                gap: 2

                            }}>


                                {/* Search */}

                                <TextField

                                    fullWidth

                                    size="small"

                                    placeholder="Search by book title or reviewer..."

                                    value={search}

                                    onChange={(e) => setSearch(e.target.value)}

                                    InputProps={{

                                        startAdornment: (

                                            <InputAdornment position="start">

                                                <Search sx={{ color: '#967C70' }} />

                                            </InputAdornment>

                                        )

                                    }}

                                    sx={{

                                        '& .MuiOutlinedInput-root': {

                                            borderRadius: 2,

                                            '&.Mui-focused fieldset': {

                                                borderColor: '#F47745'

                                            }

                                        }

                                    }}

                                />


                                {/* Rating Filter */}

                                <TextField

                                    select

                                    fullWidth

                                    size="small"

                                    label="Filter by Rating"

                                    value={ratingFilter}

                                    onChange={(e) => setRatingFilter(e.target.value)}

                                    sx={{

                                        '& .MuiOutlinedInput-root.Mui-focused fieldset': {

                                            borderColor: '#F47745'

                                        }

                                    }}

                                >

                                    <MenuItem value="All">

                                        All Ratings

                                    </MenuItem>

                                    <MenuItem value="5">

                                        5 Stars

                                    </MenuItem>

                                    <MenuItem value="4">

                                        4 Stars

                                    </MenuItem>

                                    <MenuItem value="3">

                                        3 Stars

                                    </MenuItem>

                                    <MenuItem value="2">

                                        2 Stars

                                    </MenuItem>

                                    <MenuItem value="1">

                                        1 Star

                                    </MenuItem>

                                </TextField>

                            </Box>


                            {/* Result Count and Clear Filters */}

                            <Box sx={{

                                display: 'flex',

                                justifyContent: 'space-between',

                                alignItems: 'center',

                                mt: 2,

                                flexWrap: 'wrap',

                                gap: 1

                            }}>

                                <Typography

                                    variant="body2"

                                    sx={{ color: '#967C70' }}

                                >

                                    Showing {filteredReviews.length} of {reviews.length} reviews

                                </Typography>


                                <Button

                                    onClick={clearFilters}

                                    sx={{

                                        color: '#F47745',

                                        textTransform: 'none',

                                        '&:hover': {

                                            backgroundColor: '#FFF0E8'

                                        }

                                    }}

                                >

                                    Clear Filters

                                </Button>

                            </Box>

                        </Box>



                        {/* Review Cards */}

                        {

                            filteredReviews.length > 0 ? (

                                <>

                                    <Box sx={{

                                        display: 'grid',

                                        gridTemplateColumns: {

                                            xs: '1fr',

                                            sm: 'repeat(2, minmax(0, 1fr))',

                                            lg: 'repeat(3, minmax(0, 1fr))'

                                        },

                                        gap: 3

                                    }}>


                                        {

                                            currentReviews.map((review) => (

                                                <Card

                                                    key={review.id}

                                                    elevation={0}

                                                    sx={{

                                                        border: '1px solid #E9DED3',

                                                        borderRadius: 3,

                                                        backgroundColor: '#FFFFFF',

                                                        overflow: 'hidden',

                                                        display: 'flex',

                                                        flexDirection: 'column',

                                                        transition: '0.3s',

                                                        '&:hover': {

                                                            transform: 'translateY(-4px)',

                                                            boxShadow: '0 8px 20px rgba(89,60,50,0.08)'

                                                        }

                                                    }}

                                                >

                                                    <Box sx={{

                                                        display: 'flex',

                                                        gap: 2,

                                                        p: 2

                                                    }}>

                                                        <CardMedia

                                                            component="img"

                                                            image={

                                                                review.coverImage ||

                                                                'https://placehold.co/100x140?text=Book'

                                                            }

                                                            alt={review.bookTitle}

                                                            sx={{

                                                                width: 85,

                                                                height: 115,

                                                                objectFit: 'contain',

                                                                backgroundColor: '#FFF7ED',

                                                                borderRadius: 1

                                                            }}

                                                        />


                                                        <Box sx={{ flex: 1, minWidth: 0 }}>

                                                            <Typography

                                                                variant="h6"

                                                                fontWeight="bold"

                                                                sx={{ color: '#593C32' }}

                                                            >

                                                                {review.bookTitle}

                                                            </Typography>


                                                            <Typography

                                                                variant="body2"

                                                                sx={{

                                                                    color: '#967C70',

                                                                    mt: 0.5

                                                                }}

                                                            >

                                                                By {review.author}

                                                            </Typography>


                                                            <Box sx={{ mt: 1 }}>

                                                                <Rating

                                                                    value={Number(review.rating)}

                                                                    precision={0.5}

                                                                    readOnly

                                                                    size="small"

                                                                />

                                                            </Box>


                                                            <Chip

                                                                label={review.date}

                                                                size="small"

                                                                sx={{

                                                                    mt: 1,

                                                                    backgroundColor: '#FFF0E8',

                                                                    color: '#F47745'

                                                                }}

                                                            />

                                                        </Box>

                                                    </Box>


                                                    <CardContent sx={{

                                                        pt: 0,

                                                        display: 'flex',

                                                        flexDirection: 'column',

                                                        flexGrow: 1

                                                    }}>

                                                        <Typography

                                                            variant="subtitle1"

                                                            fontWeight="bold"

                                                            sx={{

                                                                color: '#593C32',

                                                                mb: 1

                                                            }}

                                                        >

                                                            {review.reviewTitle}

                                                        </Typography>


                                                        <Typography

                                                            variant="body2"

                                                            sx={{

                                                                color: '#967C70',

                                                                mb: 1

                                                            }}

                                                        >

                                                            Reviewed by {review.reviewerName}

                                                        </Typography>


                                                        <Typography

                                                            variant="body2"

                                                            sx={{

                                                                color: '#70594F',

                                                                lineHeight: 1.7,

                                                                overflowWrap: 'anywhere'

                                                            }}

                                                        >

                                                            {review.comment}

                                                        </Typography>


                                                        <Box sx={{

                                                            display: 'flex',

                                                            justifyContent: 'flex-end',

                                                            mt: 'auto',

                                                            pt: 2

                                                        }}>

                                                            <IconButton

                                                                onClick={() => handleEdit(review)}

                                                                sx={{ color: '#F47745' }}

                                                            >

                                                                <Edit />

                                                            </IconButton>


                                                            <IconButton

                                                                onClick={() => handleDelete(review.id)}

                                                                sx={{ color: '#C65B4B' }}

                                                            >

                                                                <Delete />

                                                            </IconButton>

                                                        </Box>

                                                    </CardContent>

                                                </Card>

                                            ))

                                        }

                                    </Box>



                                    {/* Pagination */}

                                    <Box sx={{

                                        display: 'flex',

                                        justifyContent: 'center',

                                        alignItems: 'center',

                                        mt: 5,

                                        mb: 2

                                    }}>

                                        <Pagination

                                            count={totalPages}

                                            page={page}

                                            onChange={(event, value) => setPage(value)}

                                            color="primary"

                                            shape="rounded"

                                            sx={{

                                                '& .MuiPaginationItem-root': {

                                                    color: '#593C32'

                                                },

                                                '& .Mui-selected': {

                                                    backgroundColor: '#F47745 !important',

                                                    color: '#FFFFFF'

                                                },

                                                '& .MuiPaginationItem-root:hover': {

                                                    backgroundColor: '#FFF0E8'

                                                }

                                            }}

                                        />

                                    </Box>


                                    <Typography

                                        variant="body2"

                                        textAlign="center"

                                        sx={{ color: '#967C70', mb: 2 }}

                                    >

                                        Page {page} of {totalPages} · {filteredReviews.length} reviews

                                    </Typography>

                                </>

                            ) : (

                                <Box sx={{

                                    textAlign: 'center',

                                    mt: 8,

                                    backgroundColor: '#FFFFFF',

                                    border: '1px solid #E9DED3',

                                    borderRadius: 3,

                                    p: 5

                                }}>

                                    <MenuBook sx={{

                                        fontSize: 65,

                                        color: '#F6C9B8',

                                        mb: 2

                                    }} />


                                    <Typography

                                        variant="h6"

                                        fontWeight="bold"

                                        sx={{ color: '#593C32' }}

                                    >

                                        No Reviews Found

                                    </Typography>


                                    <Typography sx={{

                                        color: '#967C70',

                                        mt: 1

                                    }}>

                                        Try changing your search or rating filter.

                                    </Typography>


                                    <Button

                                        onClick={clearFilters}

                                        sx={{

                                            mt: 2,

                                            color: '#F47745',

                                            textTransform: 'none'

                                        }}

                                    >

                                        Clear Filters

                                    </Button>

                                </Box>

                            )

                        }


                    </>

                )

            }



            {/* Review Form Component */}

            <ReviewForm

                open={open}

                handleClose={handleClose}

                books={books}

                reviewDetails={reviewDetails}

                setReviewDetails={setReviewDetails}

                editId={editId}

                handleSubmit={handleSubmit}

            />

        </Box>

    )

}


export default Reviews
