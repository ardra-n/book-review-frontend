
import React from 'react'

import {
    Box,
    Typography,
    Button,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    TextField,
    MenuItem,
    Rating
} from '@mui/material'

function ReviewForm({
    open,
    handleClose,
    books,
    reviewDetails,
    setReviewDetails,
    editId,
    handleSubmit
}) {

    // Handle input changes
    const handleChange = (e) => {
        setReviewDetails({
            ...reviewDetails,
            [e.target.name]: e.target.value
        })
    }

    return (
        <Dialog
            open={open}
            onClose={handleClose}
            fullWidth
            maxWidth="sm"
        >

            <DialogTitle sx={{
                color: '#593C32',
                fontWeight: 'bold'
            }}>
                {editId ? 'Edit Review' : 'Write a Review'}
            </DialogTitle>

            <DialogContent>

                <Box sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    gap: 3,
                    pt: 2
                }}>

                    <Typography sx={{ color: '#967C70' }}>
                        Share your thoughts about a book you've read.
                    </Typography>

                    {/* Select Book */}

                    <TextField
                        select
                        label="Select Book"
                        name="bookId"
                        value={reviewDetails.bookId}
                        onChange={handleChange}
                        fullWidth
                        required
                    >

                        <MenuItem value="" disabled>
                            Select a book
                        </MenuItem>

                        {books.map((book) => (
                            <MenuItem
                                key={book.id}
                                value={book.id}
                            >
                                {book.title} - {book.author}
                            </MenuItem>
                        ))}

                        <MenuItem value="other">
                            Another Book (Not in My Books)
                        </MenuItem>

                    </TextField>

                    {/* External Book Details */}

                    {reviewDetails.bookId === 'other' && (
                        <>
                            <TextField
                                label="Book Title"
                                name="bookTitle"
                                value={reviewDetails.bookTitle}
                                onChange={handleChange}
                                fullWidth
                                required
                            />

                            <TextField
                                label="Author Name"
                                name="author"
                                value={reviewDetails.author}
                                onChange={handleChange}
                                fullWidth
                                required
                            />
                        </>
                    )}

                    {/* Reviewer Name */}

                    <TextField
                        label="Your Name"
                        name="reviewerName"
                        value={reviewDetails.reviewerName}
                        onChange={handleChange}
                        fullWidth
                        required
                        placeholder="Enter your name"
                    />

                    {/* Rating */}

                    <Box>
                        <Typography sx={{
                            color: '#593C32',
                            mb: 1
                        }}>
                            Your Rating
                        </Typography>

                        <Rating
                            value={Number(reviewDetails.rating)}
                            precision={0.5}
                            size="large"
                            onChange={(e, newValue) => {
                                setReviewDetails({
                                    ...reviewDetails,
                                    rating: newValue || 0
                                })
                            }}
                            sx={{ color: '#F47745' }}
                        />
                    </Box>

                    {/* Review Title */}

                    <TextField
                        label="Review Title"
                        name="reviewTitle"
                        value={reviewDetails.reviewTitle}
                        onChange={handleChange}
                        fullWidth
                        required
                        placeholder="Write a review title"
                    />

                    {/* Review Description */}

                    <TextField
                        label="Your Review"
                        name="comment"
                        value={reviewDetails.comment}
                        onChange={handleChange}
                        multiline
                        rows={4}
                        fullWidth
                        required
                        placeholder="Share your experience with this book..."
                    />

                </Box>

            </DialogContent>

            <DialogActions sx={{ p: 3 }}>

                <Button
                    onClick={handleClose}
                    sx={{
                        color: '#F47745',
                        textTransform: 'none'
                    }}
                >
                    Cancel
                </Button>

                <Button
                    variant="contained"
                    onClick={handleSubmit}
                    sx={{
                        backgroundColor: '#F47745',
                        textTransform: 'none',
                        '&:hover': {
                            backgroundColor: '#E76535'
                        }
                    }}
                >
                    {editId ? 'Update Review' : 'Submit Review'}
                </Button>

            </DialogActions>

        </Dialog>
    )
}

export default ReviewForm
