
import React, { useState, useEffect } from 'react'

import {
    Box,
    Typography,
    Button,
    Paper,
    Card,
    CardContent,
    TextField,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    LinearProgress,
    IconButton,
    CircularProgress
} from '@mui/material'

import {
    Add,
    Edit,
    Delete,
    MenuBook,
    CalendarMonth,
    Flag
} from '@mui/icons-material'

import {
    viewGoalsAPI,
    addGoalAPI,
    editGoalAPI,
    deleteGoalAPI,
    viewBooksAPI,
    viewActivitiesAPI
} from '../services/apiServices'

function Goals() {

    const [goals, setGoals] = useState(null)

    const [books, setBooks] = useState([])

    const [activities, setActivities] = useState([])

    const [open, setOpen] = useState(false)

    const [editId, setEditId] = useState(null)

    const [loading, setLoading] = useState(true)

    const [goalDetails, setGoalDetails] = useState({
        monthlyTarget: '',
        dailyTarget: ''
    })

    // Get today's date

    const getTodayDate = () => {

        const today = new Date()

        const year = today.getFullYear()

        const month = String(today.getMonth() + 1).padStart(2, '0')

        const date = String(today.getDate()).padStart(2, '0')

        return `${year}-${month}-${date}`

    }

    // Fetch Goals, Books and Activities

    const getData = async () => {

        try {

            const goalResponse = await viewGoalsAPI()

            const bookResponse = await viewBooksAPI()

            const activityResponse = await viewActivitiesAPI()

            if (goalResponse.data.length > 0) {

                setGoals(goalResponse.data[0])

            }
            else {

                setGoals(null)

            }

            setBooks(bookResponse.data)

            setActivities(activityResponse.data)

        }
        catch (error) {

            console.log('Error fetching data:', error)

        }
        finally {

            setLoading(false)

        }

    }

    // Load data when component opens

    useEffect(() => {

        getData()

    }, [])

    // Calculate completed books

    const completedBooks = books.filter(
        book => book.status === 'Completed'
    ).length

    // Calculate pages read today

    const today = getTodayDate()

    const todayActivities = activities.filter(
        activity => activity.date === today
    )

    const pagesReadToday = todayActivities.reduce(
        (total, activity) => total + Number(activity.pagesRead || 0),
        0
    )

    // Open Add Goal Form

    const handleAdd = () => {

        setEditId(null)

        setGoalDetails({
            monthlyTarget: '',
            dailyTarget: ''
        })

        setOpen(true)

    }

    // Open Edit Goal Form

    const handleEdit = () => {

        setEditId(goals.id)

        setGoalDetails({
            monthlyTarget: goals.monthlyTarget,
            dailyTarget: goals.dailyTarget
        })

        setOpen(true)

    }

    // Handle Input Changes

    const handleChange = (e) => {

        setGoalDetails({
            ...goalDetails,
            [e.target.name]: e.target.value
        })

    }

    // Add or Edit Goal

    const handleSubmit = async () => {

        if (
            !goalDetails.monthlyTarget ||
            !goalDetails.dailyTarget ||
            Number(goalDetails.monthlyTarget) <= 0 ||
            Number(goalDetails.dailyTarget) <= 0
        ) {

            alert('Please enter valid goal details')

            return

        }

        const requestBody = {

            monthlyTarget: Number(goalDetails.monthlyTarget),

            dailyTarget: Number(goalDetails.dailyTarget)

        }

        try {

            if (editId) {

                await editGoalAPI(editId, requestBody)

                alert('Goal updated successfully!')

            }
            else {

                await addGoalAPI(requestBody)

                alert('Goal added successfully!')

            }

            setOpen(false)

            getData()

        }
        catch (error) {

            console.log('Goal error:', error)

            alert('Unable to save goal')

        }

    }

    // Delete Goal

    const handleDelete = async () => {

        const confirmDelete = window.confirm(
            'Are you sure you want to delete this reading goal?'
        )

        if (!confirmDelete) return

        try {

            await deleteGoalAPI(goals.id)

            alert('Goal deleted successfully!')

            setGoals(null)

        }
        catch (error) {

            console.log('Delete error:', error)

            alert('Unable to delete goal')

        }

    }

    // Close Dialog

    const handleClose = () => {

        setOpen(false)

    }

    // Calculate Monthly Progress

    const monthlyProgress = goals && goals.monthlyTarget > 0
        ? Math.min(
            (completedBooks / goals.monthlyTarget) * 100,
            100
        )
        : 0

    // Calculate Daily Progress

    const dailyProgress = goals && goals.dailyTarget > 0
        ? Math.min(
            (pagesReadToday / goals.dailyTarget) * 100,
            100
        )
        : 0

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
                gap: 2
            }}>

                <Box>

                    <Typography
                        variant="h4"
                        fontWeight="bold"
                        sx={{ color: '#593C32' }}
                    >
                        Reading Goals
                    </Typography>

                    <Typography sx={{
                        color: '#967C70',
                        mt: 1
                    }}>
                        Set your reading targets and track your progress.
                    </Typography>

                </Box>

                <Button
                    variant="contained"
                    startIcon={<Add />}
                    onClick={goals ? handleEdit : handleAdd}
                    sx={{
                        backgroundColor: '#F47745',
                        textTransform: 'none',
                        '&:hover': {
                            backgroundColor: '#E76535'
                        }
                    }}
                >
                    {goals ? 'Edit Goal' : 'Add Goal'}
                </Button>

            </Box>

            {loading ? (

                <Box sx={{
                    display: 'flex',
                    justifyContent: 'center',
                    mt: 8
                }}>

                    <CircularProgress sx={{ color: '#F47745' }} />

                </Box>

            ) : (

                <>

                    {/* Summary Cards */}

                    <Box sx={{
                        display: 'grid',
                        gridTemplateColumns: {
                            xs: '1fr',
                            sm: 'repeat(2, minmax(0, 1fr))',
                            md: 'repeat(3, minmax(0, 1fr))'
                        },
                        gap: 3,
                        mb: 4
                    }}>

                        {/* Monthly Goal */}

                        <Paper
                            elevation={0}
                            sx={{
                                p: 3,
                                borderRadius: 3,
                                backgroundColor: '#FFE5D5'
                            }}
                        >

                            <MenuBook sx={{
                                fontSize: 32,
                                color: '#F47745',
                                mb: 1
                            }} />

                            <Typography sx={{ color: '#967C70' }}>
                                Monthly Goal
                            </Typography>

                            <Typography variant="h4" sx={{ color: '#593C32' }}>
                                {goals ? goals.monthlyTarget : 0} Books
                            </Typography>

                        </Paper>

                        {/* Daily Page Target */}

                        <Paper
                            elevation={0}
                            sx={{
                                p: 3,
                                borderRadius: 3,
                                backgroundColor: '#FCEBD9'
                            }}
                        >

                            <CalendarMonth sx={{
                                fontSize: 32,
                                color: '#F47745',
                                mb: 1
                            }} />

                            <Typography sx={{ color: '#967C70' }}>
                                Daily Page Target
                            </Typography>

                            <Typography variant="h4" sx={{ color: '#593C32' }}>
                                {goals ? goals.dailyTarget : 0} Pages
                            </Typography>

                        </Paper>

                        {/* Completed Books */}

                        <Paper
                            elevation={0}
                            sx={{
                                p: 3,
                                borderRadius: 3,
                                backgroundColor: '#F8E1DC'
                            }}
                        >

                            <Flag sx={{
                                fontSize: 32,
                                color: '#E76555',
                                mb: 1
                            }} />

                            <Typography sx={{ color: '#967C70' }}>
                                Completed Books
                            </Typography>

                            <Typography variant="h4" sx={{ color: '#593C32' }}>
                                {completedBooks}
                            </Typography>

                        </Paper>

                    </Box>

                    {/* Progress Cards */}

                    {goals ? (

                        <Box sx={{
                            display: 'grid',
                            gridTemplateColumns: {
                                xs: '1fr',
                                sm: 'repeat(2, minmax(0, 1fr))'
                            },
                            gap: 3
                        }}>

                            {/* Monthly Reading Goal */}

                            <Card
                                elevation={0}
                                sx={{
                                    border: '1px solid #F5E9DE',
                                    borderRadius: 3,
                                    backgroundColor: '#FFFFFF'
                                }}
                            >

                                <CardContent sx={{ p: 3 }}>

                                    <Box sx={{
                                        display: 'flex',
                                        justifyContent: 'space-between',
                                        alignItems: 'center'
                                    }}>

                                        <Typography variant="h6" sx={{ color: '#593C32' }}>
                                            Monthly Reading Goal
                                        </Typography>

                                        <Box>

                                            <IconButton
                                                onClick={handleEdit}
                                                sx={{ color: '#F47745' }}
                                            >
                                                <Edit />
                                            </IconButton>

                                            <IconButton
                                                onClick={handleDelete}
                                                sx={{ color: '#D95C55' }}
                                            >
                                                <Delete />
                                            </IconButton>

                                        </Box>

                                    </Box>

                                    <Typography sx={{
                                        color: '#967C70',
                                        mt: 2
                                    }}>
                                        Your monthly reading progress
                                    </Typography>

                                    <Typography
                                        variant="h5"
                                        sx={{
                                            color: '#593C32',
                                            mt: 2,
                                            mb: 2
                                        }}
                                    >
                                        {completedBooks} / {goals.monthlyTarget} Books
                                    </Typography>

                                    <LinearProgress
                                        variant="determinate"
                                        value={monthlyProgress}
                                        sx={{
                                            height: 10,
                                            borderRadius: 5,
                                            backgroundColor: '#FCE5D8',
                                            '& .MuiLinearProgress-bar': {
                                                backgroundColor: '#F47745',
                                                borderRadius: 5
                                            }
                                        }}
                                    />

                                    <Typography
                                        textAlign="right"
                                        sx={{
                                            color: '#967C70',
                                            mt: 1
                                        }}
                                    >
                                        {Math.round(monthlyProgress)}% completed
                                    </Typography>

                                </CardContent>

                            </Card>

                            {/* Daily Reading Goal */}

                            <Card
                                elevation={0}
                                sx={{
                                    border: '1px solid #F5E9DE',
                                    borderRadius: 3,
                                    backgroundColor: '#FFFFFF'
                                }}
                            >

                                <CardContent sx={{ p: 3 }}>

                                    <Box sx={{
                                        display: 'flex',
                                        justifyContent: 'space-between',
                                        alignItems: 'center'
                                    }}>

                                        <Typography variant="h6" sx={{ color: '#593C32' }}>
                                            Daily Reading Goal
                                        </Typography>

                                        <Box>

                                            <IconButton
                                                onClick={handleEdit}
                                                sx={{ color: '#F47745' }}
                                            >
                                                <Edit />
                                            </IconButton>

                                            <IconButton
                                                onClick={handleDelete}
                                                sx={{ color: '#D95C55' }}
                                            >
                                                <Delete />
                                            </IconButton>

                                        </Box>

                                    </Box>

                                    <Typography sx={{
                                        color: '#967C70',
                                        mt: 2
                                    }}>
                                        Your daily reading progress
                                    </Typography>

                                    <Typography
                                        variant="h5"
                                        sx={{
                                            color: '#593C32',
                                            mt: 2,
                                            mb: 2
                                        }}
                                    >
                                        {pagesReadToday} / {goals.dailyTarget} Pages
                                    </Typography>

                                    <LinearProgress
                                        variant="determinate"
                                        value={dailyProgress}
                                        sx={{
                                            height: 10,
                                            borderRadius: 5,
                                            backgroundColor: '#FCE5D8',
                                            '& .MuiLinearProgress-bar': {
                                                backgroundColor: '#F47745',
                                                borderRadius: 5
                                            }
                                        }}
                                    />

                                    <Typography
                                        textAlign="right"
                                        sx={{
                                            color: '#967C70',
                                            mt: 1
                                        }}
                                    >
                                        {Math.round(dailyProgress)}% completed
                                    </Typography>

                                </CardContent>

                            </Card>

                        </Box>

                    ) : (

                        <Paper sx={{
                            p: 4,
                            textAlign: 'center',
                            borderRadius: 3,
                            backgroundColor: '#FFFFFF',
                            border: '1px solid #E9DED3'
                        }}>

                            <MenuBook sx={{
                                fontSize: 55,
                                color: '#F6C9B8',
                                mb: 2
                            }} />

                            <Typography
                                variant="h6"
                                fontWeight="bold"
                                sx={{ color: '#593C32' }}
                            >
                                No Reading Goals Yet
                            </Typography>

                            <Typography sx={{
                                color: '#967C70',
                                mt: 1
                            }}>
                                Create your first reading goal and track your progress.
                            </Typography>

                            <Button
                                variant="contained"
                                startIcon={<Add />}
                                onClick={handleAdd}
                                sx={{
                                    mt: 3,
                                    backgroundColor: '#F47745',
                                    textTransform: 'none'
                                }}
                            >
                                Create Your First Goal
                            </Button>

                        </Paper>

                    )}

                </>

            )}

            {/* Add / Edit Goal Dialog */}

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
                    {editId ? 'Edit Reading Goals' : 'Create Reading Goals'}
                </DialogTitle>

                <DialogContent>

                    <Box sx={{
                        display: 'flex',
                        flexDirection: 'column',
                        gap: 3,
                        pt: 2
                    }}>

                        <TextField
                            label="Monthly Book Target"
                            name="monthlyTarget"
                            type="number"
                            value={goalDetails.monthlyTarget}
                            onChange={handleChange}
                            fullWidth
                            required
                        />

                        <TextField
                            label="Daily Page Target"
                            name="dailyTarget"
                            type="number"
                            value={goalDetails.dailyTarget}
                            onChange={handleChange}
                            fullWidth
                            required
                        />

                    </Box>

                </DialogContent>

                <DialogActions sx={{ p: 3 }}>

                    <Button
                        onClick={handleClose}
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
                        {editId ? 'Update Goal' : 'Save Goal'}
                    </Button>

                </DialogActions>

            </Dialog>

        </Box>

    )

}

export default Goals
