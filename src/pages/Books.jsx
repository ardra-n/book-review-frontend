import React, { useState, useEffect } from 'react'

import {
    Box,
    Typography,
    Button,
    CircularProgress,
    TextField,
    MenuItem,
    InputAdornment,
    Pagination
} from '@mui/material'

import { Add, Search } from '@mui/icons-material'

import { useNavigate } from 'react-router-dom'

import BookCard from '../components/BookCard'

import { viewBooksAPI } from '../services/apiServices'


function Books() {

    const navigate = useNavigate()

    const [books, setBooks] = useState([])

    const [loading, setLoading] = useState(true)

    const [error, setError] = useState('')


    // Search, filter and sort states

    const [search, setSearch] = useState('')

    const [genre, setGenre] = useState('All')

    const [status, setStatus] = useState('All')

    const [sort, setSort] = useState('default')


    // Pagination states

    const [page, setPage] = useState(1)

    const booksPerPage = 8


    // Fetch books from JSON Server

    const getBooks = async () => {

        try {

            setLoading(true)

            setError('')

            const response = await viewBooksAPI()

            setBooks(response.data)

            console.log('Books:', response.data)

        }

        catch (error) {

            console.log('Error fetching books:', error)

            setError('Failed to load books. Please try again.')

        }

        finally {

            setLoading(false)

        }

    }


    // Run when component loads

    useEffect(() => {

        getBooks()

    }, [])


    // Remove deleted book from the screen

    const handleDelete = (id) => {

        setBooks(prevBooks =>
            prevBooks.filter(book => book.id !== id)
        )

    }


    // Get unique genres from books

    const genres = [...new Set(

        books
            .map(book => book.genre)
            .filter(item => item)

    )]


    // Get unique reading statuses

    const statuses = [...new Set(

        books
            .map(book => book.status)
            .filter(item => item)

    )]


    // Search, filter and sort books

    const filteredBooks = books

        // Search by title or author

        .filter(book => {

            return (

                (book.title || '').toLowerCase().includes(search.toLowerCase()) ||

                (book.author || '').toLowerCase().includes(search.toLowerCase())

            )

        })


        // Filter by genre

        .filter(book => {

            return genre === 'All' || book.genre === genre

        })


        // Filter by status

        .filter(book => {

            return status === 'All' || book.status === status

        })


        // Sort books

        .sort((a, b) => {

            if (sort === 'title-asc') {

                return (a.title || '').localeCompare(b.title || '')

            }

            if (sort === 'title-desc') {

                return (b.title || '').localeCompare(a.title || '')

            }

            if (sort === 'rating-high') {

                return Number(b.rating || 0) - Number(a.rating || 0)

            }

            if (sort === 'rating-low') {

                return Number(a.rating || 0) - Number(b.rating || 0)

            }

            return 0

        })


    // Reset page when search or filters change

    useEffect(() => {

        setPage(1)

    }, [search, genre, status, sort])


    // Calculate total pages

    const totalPages = Math.ceil(filteredBooks.length / booksPerPage)


    // Calculate starting index

    const startIndex = (page - 1) * booksPerPage


    // Get books for current page

    const currentBooks = filteredBooks.slice(

        startIndex,

        startIndex + booksPerPage

    )


    // Clear all search and filters

    const clearFilters = () => {

        setSearch('')

        setGenre('All')

        setStatus('All')

        setSort('default')

        setPage(1)

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

                mb: 4,

                flexWrap: 'wrap',

                gap: 2

            }}>

                <Box>

                    <Typography

                        variant="h4"

                        fontWeight="bold"

                        sx={{ color: '#593C32' }}

                    >

                        My Books

                    </Typography>


                    <Typography

                        variant="body2"

                        sx={{ color: '#967C70', mt: 1 }}

                    >

                        Manage your personal book collection

                    </Typography>

                </Box>


                <Button

                    variant="contained"

                    startIcon={<Add />}

                    onClick={() => navigate('/add-book')}

                    sx={{

                        backgroundColor: '#F47745',

                        textTransform: 'none',

                        borderRadius: 2,

                        '&:hover': {

                            backgroundColor: '#E76535'

                        }

                    }}

                >

                    Add Book

                </Button>

            </Box>



            {/* Loading, Error and Books */}

            {

                loading ? (

                    <Box sx={{

                        display: 'flex',

                        justifyContent: 'center',

                        mt: 8

                    }}>

                        <CircularProgress sx={{ color: '#F47745' }} />

                    </Box>

                ) : error ? (

                    <Typography

                        color="error"

                        textAlign="center"

                        sx={{ mt: 5 }}

                    >

                        {error}

                    </Typography>

                ) : (

                    <>


                        {/* Search and Filter Section */}

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

                                Search and Filter Books

                            </Typography>


                            <Box sx={{

                                display: 'grid',

                                gridTemplateColumns: {

                                    xs: '1fr',

                                    sm: 'repeat(2, 1fr)',

                                    md: '2fr 1fr 1fr 1.3fr'

                                },

                                gap: 2

                            }}>


                                {/* Search */}

                                <TextField

                                    fullWidth

                                    size="small"

                                    placeholder="Search by title or author..."

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


                                {/* Genre Filter */}

                                <TextField

                                    select

                                    fullWidth

                                    size="small"

                                    label="Genre"

                                    value={genre}

                                    onChange={(e) => setGenre(e.target.value)}

                                    sx={{

                                        '& .MuiOutlinedInput-root.Mui-focused fieldset': {

                                            borderColor: '#F47745'

                                        }

                                    }}

                                >

                                    <MenuItem value="All">

                                        All Genres

                                    </MenuItem>


                                    {

                                        genres.map((item, index) => (

                                            <MenuItem

                                                key={index}

                                                value={item}

                                            >

                                                {item}

                                            </MenuItem>

                                        ))

                                    }

                                </TextField>


                                {/* Status Filter */}

                                <TextField

                                    select

                                    fullWidth

                                    size="small"

                                    label="Reading Status"

                                    value={status}

                                    onChange={(e) => setStatus(e.target.value)}

                                    sx={{

                                        '& .MuiOutlinedInput-root.Mui-focused fieldset': {

                                            borderColor: '#F47745'

                                        }

                                    }}

                                >

                                    <MenuItem value="All">

                                        All Status

                                    </MenuItem>


                                    {

                                        statuses.map((item, index) => (

                                            <MenuItem

                                                key={index}

                                                value={item}

                                            >

                                                {item}

                                            </MenuItem>

                                        ))

                                    }

                                </TextField>


                                {/* Sort */}

                                <TextField

                                    select

                                    fullWidth

                                    size="small"

                                    label="Sort By"

                                    value={sort}

                                    onChange={(e) => setSort(e.target.value)}

                                    sx={{

                                        '& .MuiOutlinedInput-root.Mui-focused fieldset': {

                                            borderColor: '#F47745'

                                        }

                                    }}

                                >

                                    <MenuItem value="default">

                                        Default Order

                                    </MenuItem>

                                    <MenuItem value="title-asc">

                                        Title (A - Z)

                                    </MenuItem>

                                    <MenuItem value="title-desc">

                                        Title (Z - A)

                                    </MenuItem>

                                    <MenuItem value="rating-high">

                                        Rating (Highest First)

                                    </MenuItem>

                                    <MenuItem value="rating-low">

                                        Rating (Lowest First)

                                    </MenuItem>

                                </TextField>


                            </Box>


                            {/* Clear Filters */}

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

                                    Showing {filteredBooks.length} of {books.length} books

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



                        {/* Book Cards */}

                        {

                            filteredBooks.length > 0 ? (

                                <>

                                    <Box

                                        sx={{

                                            display: 'grid',

                                            gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))',

                                            gap: 3,

                                            width: '100%'

                                        }}

                                    >

                                        {

                                            currentBooks.map((book) => (

                                                <BookCard

                                                    key={book.id}

                                                    book={book}

                                                    onDelete={handleDelete}

                                                />

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

                                        Page {page} of {totalPages}

                                    </Typography>

                                </>

                            ) : (

                                <Box sx={{

                                    textAlign: 'center',

                                    mt: 8

                                }}>

                                    <Typography

                                        variant="h6"

                                        sx={{ color: '#593C32' }}

                                    >

                                        No books found

                                    </Typography>


                                    <Typography

                                        sx={{ color: '#967C70', mt: 1 }}

                                    >

                                        Try changing your search or filters.

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

        </Box>

    )

}


export default Books