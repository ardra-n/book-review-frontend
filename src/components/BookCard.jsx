import React, { useState } from 'react'

import {
    Card,
    CardMedia,
    CardContent,
    Typography,
    Box,
    Chip,
    Rating,
    IconButton,
    Button,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions
} from '@mui/material'

import {
    Edit,
    Delete,
    Visibility
} from '@mui/icons-material'

import { useNavigate } from 'react-router-dom'

import { deleteBookAPI } from '../services/apiServices'

function BookCard({ book, onDelete }) {

    const [open, setOpen] = useState(false)

    const navigate = useNavigate()

    // DELETE BOOK FUNCTION
    const handleDelete = async () => {

        try {

            console.log('Deleting book ID:', book.id)

            const response = await deleteBookAPI(book.id)

            console.log('Book deleted:', response.data)

            setOpen(false)

            onDelete(book.id)

        }
        catch (error) {

            console.log('Delete error:', error)

            alert('Failed to delete book')

        }

    }

    return (

        <>

            <Card
                elevation={0}
                sx={{
                    border: '1px solid #E9DFD5',
                    borderRadius: 3,
                    overflow: 'hidden',
                    backgroundColor: '#FFFFFF',
                    transition: '0.3s',
                    display: 'flex',
                    flexDirection: 'column',
                    height: '100%',

                    '&:hover': {
                        transform: 'translateY(-5px)',
                        boxShadow: '0 8px 20px rgba(91,64,48,0.12)'
                    }
                }}
            >

                {/* Book Cover */}

                <CardMedia
                    component="img"
                    height="200"
                    image={book.coverImage || 'https://placehold.co/300x400?text=Book+Cover'}
                    alt={book.title}
                    sx={{
                        objectFit: 'contain',
                        backgroundColor: '#FAF6F0',
                        padding: 2
                    }}
                />

                {/* Book Details */}

                <CardContent
                    sx={{
                        display: 'flex',
                        flexDirection: 'column',
                        flexGrow: 1
                    }}
                >

                    <Typography
                        variant="h6"
                        fontWeight="bold"
                        sx={{ color: '#3E3027' }}
                        noWrap
                    >
                        {book.title}
                    </Typography>

                    <Typography
                        variant="body2"
                        sx={{ color: '#8C7B6E', mt: 0.5 }}
                    >
                        By {book.author}
                    </Typography>

                    <Box sx={{ mt: 1.5 }}>
                        <Chip
                            label={book.genre}
                            size="small"
                            sx={{
                                backgroundColor: '#F3E7D9',
                                color: '#6B4F3B'
                            }}
                        />
                    </Box>

                    {/* Rating */}

                    <Box sx={{ mt: 1.5 }}>
                        <Rating
                            value={Number(book.rating) || 0}
                            precision={0.5}
                            readOnly
                            size="small"
                        />
                    </Box>

                    {/* Reading Status */}

                    <Box sx={{ mt: 1.5 }}>
                        <Chip
                            label={book.status}
                            size="small"
                            color={
                                book.status === 'Completed'
                                    ? 'success'
                                    : book.status === 'Currently Reading'
                                        ? 'warning'
                                        : 'default'
                            }
                        />
                    </Box>

                    {/* Action Buttons */}

                    <Box
                        sx={{
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                            mt: 'auto',
                            pt: 2
                        }}
                    >

                        <Button
    size="small"
    startIcon={<Visibility />}
    sx={{ color: '#8B5E3C' }}
    onClick={() => navigate(`/view-book/${book.id}`)}
>
    View
</Button>

                        <Box>

                            <IconButton
                            size="small"
                            sx={{ color: '#8B5E3C' }}
                            onClick={() => navigate(`/edit-book/${book.id}`)}
>
                            <Edit fontSize="small" />
                             </IconButton>

                            {/* DELETE BUTTON */}

                            <IconButton
                                size="small"
                                sx={{ color: '#B45345' }}
                                onClick={() => setOpen(true)}
                            >
                                <Delete fontSize="small" />
                            </IconButton>

                        </Box>

                    </Box>

                </CardContent>

            </Card>

            {/* DELETE CONFIRMATION */}

            <Dialog
                open={open}
                onClose={() => setOpen(false)}
            >

                <DialogTitle>
                    Delete Book?
                </DialogTitle>

                <DialogContent>
                    Are you sure you want to delete "{book.title}"?
                </DialogContent>

                <DialogActions>

                    <Button onClick={() => setOpen(false)}>
                        Cancel
                    </Button>

                    <Button
                        color="error"
                        variant="contained"
                        onClick={handleDelete}
                    >
                        Delete
                    </Button>

                </DialogActions>

            </Dialog>

        </>

    )

}

export default BookCard