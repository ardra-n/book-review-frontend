
import React, { useState, useEffect } from 'react'

import {
    Box,
    Typography,
    Button,
    IconButton,
    Paper,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    TextField
} from '@mui/material'

import {
    ArrowBackIos,
    ArrowForwardIos,
    Delete
} from '@mui/icons-material'

import {
    viewActivitiesAPI,
    addActivityAPI,
    deleteActivityAPI
} from '../services/apiServices'

function Calendar() {

    const [currentDate, setCurrentDate] = useState(new Date())

    const [selectedDate, setSelectedDate] = useState(null)

    const [open, setOpen] = useState(false)

    const [activities, setActivities] = useState([])

    const [activityDetails, setActivityDetails] = useState({
        bookTitle: '',
        pagesRead: '',
        notes: ''
    })

    const [loading, setLoading] = useState(true)

    // Get current month and year

    const month = currentDate.getMonth()
    const year = currentDate.getFullYear()

    // Month names

    const monthNames = [
        'January', 'February', 'March',
        'April', 'May', 'June',
        'July', 'August', 'September',
        'October', 'November', 'December'
    ]

    // Week days

    const weekDays = [
        'Sun', 'Mon', 'Tue', 'Wed',
        'Thu', 'Fri', 'Sat'
    ]

    // Format date as YYYY-MM-DD

    const formatDate = (date) => {

        const y = date.getFullYear()
        const m = String(date.getMonth() + 1).padStart(2, '0')
        const d = String(date.getDate()).padStart(2, '0')

        return `${y}-${m}-${d}`

    }

    // Fetch Reading Activities

    const getActivities = async () => {

        try {

            const response = await viewActivitiesAPI()

            setActivities(response.data)

        }
        catch (error) {

            console.log('Error fetching activities:', error)

        }
        finally {

            setLoading(false)

        }

    }

    useEffect(() => {

        getActivities()

    }, [])

    // Previous month

    const previousMonth = () => {

        setCurrentDate(new Date(year, month - 1, 1))

    }

    // Next month

    const nextMonth = () => {

        setCurrentDate(new Date(year, month + 1, 1))

    }

    // Get first day and total days

    const firstDay = new Date(year, month, 1).getDay()

    const totalDays = new Date(year, month + 1, 0).getDate()

    // Create calendar days

    const calendarDays = []

    for (let i = 0; i < firstDay; i++) {

        calendarDays.push(null)

    }

    for (let day = 1; day <= totalDays; day++) {

        calendarDays.push(day)

    }

    // Open Add Activity Form

    const handleDateClick = (day) => {

        if (!day) return

        const date = new Date(year, month, day)

        setSelectedDate(date)

        setActivityDetails({
            bookTitle: '',
            pagesRead: '',
            notes: ''
        })

        setOpen(true)

    }

    // Handle input changes

    const handleChange = (e) => {

        setActivityDetails({
            ...activityDetails,
            [e.target.name]: e.target.value
        })

    }

    // Open form using current date

    const handleAdd = () => {

        setSelectedDate(new Date())

        setActivityDetails({
            bookTitle: '',
            pagesRead: '',
            notes: ''
        })

        setOpen(true)

    }

    // Add Reading Activity

    const handleSubmit = async () => {

        if (
            !activityDetails.bookTitle.trim() ||
            !activityDetails.pagesRead ||
            Number(activityDetails.pagesRead) <= 0
        ) {

            alert('Please enter book title and valid pages read')

            return

        }

        const requestBody = {

            date: formatDate(selectedDate),

            bookTitle: activityDetails.bookTitle.trim(),

            pagesRead: Number(activityDetails.pagesRead),

            notes: activityDetails.notes.trim()

        }

        try {

            const response = await addActivityAPI(requestBody)

            console.log(response)

            alert('Reading activity added successfully!')

            setOpen(false)

            getActivities()

        }
        catch (error) {

            console.log('Add activity error:', error)

            alert('Unable to add reading activity')

        }

    }

    // Check whether a date has reading activity

    const hasActivity = (day) => {

        if (!day) return false

        const date = formatDate(new Date(year, month, day))

        return activities.some(
            activity => activity.date === date
        )

    }

    // Delete Reading Activity

    const handleDelete = async (id) => {

        const confirmDelete = window.confirm(
            'Are you sure you want to delete this activity?'
        )

        if (!confirmDelete) return

        try {

            await deleteActivityAPI(id)

            alert('Activity deleted successfully!')

            getActivities()

        }
        catch (error) {

            console.log('Delete activity error:', error)

            alert('Unable to delete activity')

        }

    }

    return (

        <Box sx={{
            p: { xs: 2, md: 4 },
            minHeight: 'calc(100vh - 75px)',
            backgroundColor: '#FFF7ED'
        }}>

            {/* Page Heading */}

            <Typography
                variant="h4"
                fontWeight="bold"
                sx={{ color: '#593C32' }}
            >
                Reading Calendar
            </Typography>

            <Typography sx={{
                color: '#967C70',
                mt: 1,
                mb: 4
            }}>
                Track your daily reading activities
            </Typography>

            {/* Calendar */}

            <Paper
                elevation={0}
                sx={{
                    p: { xs: 2, md: 3 },
                    border: '1px solid #E9DED3',
                    borderRadius: 3,
                    backgroundColor: '#FFFFFF'
                }}
            >

                {/* Month Navigation */}

                <Box sx={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    mb: 3
                }}>

                    <IconButton onClick={previousMonth}>
                        <ArrowBackIos sx={{
                            color: '#F47745',
                            fontSize: 18
                        }} />
                    </IconButton>

                    <Typography
                        variant="h5"
                        fontWeight="bold"
                        sx={{ color: '#593C32' }}
                    >
                        {monthNames[month]} {year}
                    </Typography>

                    <IconButton onClick={nextMonth}>
                        <ArrowForwardIos sx={{
                            color: '#F47745',
                            fontSize: 18
                        }} />
                    </IconButton>

                </Box>

                {/* Week Days */}

                <Box sx={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(7, minmax(0, 1fr))',
                    gap: 1,
                    mb: 1
                }}>

                    {weekDays.map((day) => (

                        <Box
                            key={day}
                            sx={{
                                textAlign: 'center',
                                p: 1
                            }}
                        >

                            <Typography
                                fontWeight="bold"
                                sx={{ color: '#967C70' }}
                            >
                                {day}
                            </Typography>

                        </Box>

                    ))}

                </Box>

                {/* Calendar Dates */}

                <Box sx={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(7, minmax(0, 1fr))',
                    gap: 1
                }}>

                    {calendarDays.map((day, index) => (

                        <Box
                            key={index}
                            onClick={() => handleDateClick(day)}
                            sx={{
                                minHeight: { xs: 55, sm: 75 },
                                display: 'flex',
                                flexDirection: 'column',
                                justifyContent: 'center',
                                alignItems: 'center',
                                gap: 0.5,

                                border: day
                                    ? '1px solid #E9CFC0'
                                    : 'none',

                                borderRadius: 2,

                                backgroundColor: day
                                    ? hasActivity(day)
                                        ? '#FCE0D2'
                                        : '#FFFFFF'
                                    : 'transparent',

                                color: '#593C32',

                                cursor: day ? 'pointer' : 'default',

                                transition: '0.2s',

                                '&:hover': day ? {
                                    backgroundColor: '#FFF0E8',
                                    borderColor: '#F47745'
                                } : {}
                            }}
                        >

                            {day && (

                                <>
                                    <Typography fontWeight="medium">
                                        {day}
                                    </Typography>

                                    {hasActivity(day) && (
                                        <Box sx={{
                                            width: 7,
                                            height: 7,
                                            borderRadius: '50%',
                                            backgroundColor: '#F47745'
                                        }} />
                                    )}

                                </>

                            )}

                        </Box>

                    ))}

                </Box>

            </Paper>

            {/* Add Activity Button */}

            <Box sx={{
                display: 'flex',
                justifyContent: 'flex-end',
                mt: 3
            }}>

                <Button
                    variant="contained"
                    onClick={handleAdd}
                    sx={{
                        backgroundColor: '#F47745',
                        textTransform: 'none',
                        '&:hover': {
                            backgroundColor: '#E76535'
                        }
                    }}
                >
                    Add Reading Activity
                </Button>

            </Box>

            {/* Reading Activities */}

            <Box sx={{ mt: 4 }}>

                <Typography
                    variant="h5"
                    fontWeight="bold"
                    sx={{ color: '#593C32', mb: 2 }}
                >
                    Reading Activities
                </Typography>

                {loading ? (

                    <Typography sx={{ color: '#967C70' }}>
                        Loading activities...
                    </Typography>

                ) : activities.length > 0 ? (

                    <Box sx={{
                        display: 'grid',
                        gridTemplateColumns: {
                            xs: '1fr',
                            sm: 'repeat(2, minmax(0, 1fr))'
                        },
                        gap: 2
                    }}>

                        {activities.map((activity) => (

                            <Paper
                                key={activity.id}
                                elevation={0}
                                sx={{
                                    p: 3,
                                    border: '1px solid #E9DED3',
                                    borderRadius: 2,
                                    backgroundColor: '#FFFFFF'
                                }}
                            >

                                <Box sx={{
                                    display: 'flex',
                                    justifyContent: 'space-between',
                                    alignItems: 'center'
                                }}>

                                    <Typography
                                        variant="h6"
                                        fontWeight="bold"
                                        sx={{ color: '#593C32' }}
                                    >
                                        {activity.bookTitle}
                                    </Typography>

                                    <IconButton
                                        onClick={() => handleDelete(activity.id)}
                                        sx={{ color: '#C65B4B' }}
                                    >
                                        <Delete />
                                    </IconButton>

                                </Box>

                                <Typography sx={{
                                    color: '#F47745',
                                    mt: 1
                                }}>
                                    {activity.date}
                                </Typography>

                                <Typography sx={{
                                    color: '#70594F',
                                    mt: 1
                                }}>
                                    Pages Read: {activity.pagesRead}
                                </Typography>

                                <Typography sx={{
                                    color: '#967C70',
                                    mt: 1
                                }}>
                                    {activity.notes}
                                </Typography>

                            </Paper>

                        ))}

                    </Box>

                ) : (

                    <Paper
                        elevation={0}
                        sx={{
                            p: 4,
                            textAlign: 'center',
                            border: '1px solid #E9DED3',
                            borderRadius: 2
                        }}
                    >

                        <Typography sx={{ color: '#967C70' }}>
                            No reading activities added yet.
                        </Typography>

                    </Paper>

                )}

            </Box>

            {/* Add Reading Activity Dialog */}

            <Dialog
                open={open}
                onClose={() => setOpen(false)}
                fullWidth
                maxWidth="sm"
            >

                <DialogTitle sx={{
                    color: '#593C32',
                    fontWeight: 'bold'
                }}>
                    Add Reading Activity
                </DialogTitle>

                <DialogContent>

                    <Box sx={{
                        display: 'flex',
                        flexDirection: 'column',
                        gap: 3,
                        pt: 2
                    }}>

                        <Typography sx={{ color: '#967C70' }}>
                            Reading Date: {
                                selectedDate
                                    ? selectedDate.toLocaleDateString()
                                    : ''
                            }
                        </Typography>

                        <TextField
                            label="Book Title"
                            name="bookTitle"
                            value={activityDetails.bookTitle}
                            onChange={handleChange}
                            fullWidth
                            required
                        />

                        <TextField
                            label="Pages Read"
                            name="pagesRead"
                            type="number"
                            value={activityDetails.pagesRead}
                            onChange={handleChange}
                            fullWidth
                            required
                            slotProps={{
                                htmlInput: { min: 1 }
                            }}
                        />

                        <TextField
                            label="Reading Notes"
                            name="notes"
                            value={activityDetails.notes}
                            onChange={handleChange}
                            multiline
                            rows={3}
                            fullWidth
                        />

                    </Box>

                </DialogContent>

                <DialogActions sx={{ p: 3 }}>

                    <Button
                        onClick={() => setOpen(false)}
                        sx={{ color: '#F47745' }}
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
                        Save Activity
                    </Button>

                </DialogActions>

            </Dialog>

        </Box>

    )

}

export default Calendar
