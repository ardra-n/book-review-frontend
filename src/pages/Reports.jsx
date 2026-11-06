
import React, { useState, useEffect } from 'react'

import {
    Box,
    Typography,
    Paper,
    CircularProgress,
    Button
} from '@mui/material'

import {
    PieChart,
    Pie,
    Cell,
    Tooltip,
    Legend,
    ResponsiveContainer
} from 'recharts'

import MenuBookIcon from '@mui/icons-material/MenuBook'
import CheckCircleIcon from '@mui/icons-material/CheckCircle'
import AutoStoriesIcon from '@mui/icons-material/AutoStories'
import RateReviewIcon from '@mui/icons-material/RateReview'
import StarIcon from '@mui/icons-material/Star'
import DescriptionIcon from '@mui/icons-material/Description'
import DownloadIcon from '@mui/icons-material/Download'

import jsPDF from 'jspdf'
import autoTable from 'jspdf-autotable'

import {
    viewBooksAPI,
    viewReviewsAPI,
    viewActivitiesAPI,
    viewGoalsAPI,
    addReportDownloadAPI
} from '../services/apiServices'


function Reports() {

    const [books, setBooks] = useState([])
    const [reviews, setReviews] = useState([])
    const [activities, setActivities] = useState([])
    const [goal, setGoal] = useState(null)

    const [loading, setLoading] = useState(true)


    // Get today's date
    const getTodayDate = () => {

        const today = new Date()

        const year = today.getFullYear()
        const month = String(today.getMonth() + 1).padStart(2, '0')
        const day = String(today.getDate()).padStart(2, '0')

        return `${year}-${month}-${day}`

    }


    // Current year
    const currentYear = new Date().getFullYear()


    // Fetch all report data
    const getReportData = async () => {

        try {

            const bookResponse = await viewBooksAPI()
            const reviewResponse = await viewReviewsAPI()
            const activityResponse = await viewActivitiesAPI()
            const goalResponse = await viewGoalsAPI()

            setBooks(bookResponse.data)
            setReviews(reviewResponse.data)
            setActivities(activityResponse.data)

            setGoal(
                goalResponse.data.length > 0
                    ? goalResponse.data[0]
                    : null
            )

        }
        catch (err) {

            console.log(err)

        }
        finally {

            setLoading(false)

        }

    }


    useEffect(() => {

        getReportData()

    }, [])


    // Book calculations
    const completedBooks = books.filter(
        item => item.status === 'Completed'
    ).length

    const readingBooks = books.filter(
        item => item.status === 'Reading'
    ).length


    // Total pages read
    const totalPages = activities.reduce(
        (total, item) => total + Number(item.pagesRead || 0),
        0
    )


    // Average review rating
    const averageRating = reviews.length > 0

        ? (
            reviews.reduce(
                (total, item) => total + Number(item.rating || 0),
                0
            ) / reviews.length
        ).toFixed(1)

        : '0.0'


    // Today's reading activity
    const todayDate = getTodayDate()

    const todayActivities = activities.filter(
        item => item.date === todayDate
    )

    const pagesReadToday = todayActivities.reduce(
        (total, item) => total + Number(item.pagesRead || 0),
        0
    )


    // Reading status chart data
    const statusCounts = {}

    books.forEach(item => {

        const status = item.status || 'Not Specified'

        statusCounts[status] = (statusCounts[status] || 0) + 1

    })

    const statusData = Object.keys(statusCounts).map(status => ({

        name: status,
        value: statusCounts[status]

    }))


    // Chart colors
    const statusColors = [
        '#F47745',
        '#E6A23C',
        '#6C9B78',
        '#8B78B8',
        '#4D91A6'
    ]

    const monthColors = [
        '#F47745',
        '#E6A23C',
        '#6C9B78',
        '#8B78B8',
        '#4D91A6',
        '#E58A9B',
        '#D99A48',
        '#A77B5B',
        '#D68C63',
        '#8C9D77',
        '#C47754',
        '#B59ACB'
    ]


    // Monthly reading activity
    const monthNames = [
        'January', 'February', 'March', 'April',
        'May', 'June', 'July', 'August',
        'September', 'October', 'November', 'December'
    ]

    const monthlyData = monthNames.map((month, index) => {

        const monthNumber = String(index + 1).padStart(2, '0')

        const monthActivities = activities.filter(item => {

            return item.date &&
                item.date.startsWith(`${currentYear}-${monthNumber}`)

        })

        const pages = monthActivities.reduce(
            (total, item) => total + Number(item.pagesRead || 0),
            0
        )

        return {
            name: month,
            value: pages
        }

    })


    // Current month's activity
    const currentMonthNumber = String(
        new Date().getMonth() + 1
    ).padStart(2, '0')

    const monthlyActivities = activities.filter(item => {

        return item.date &&
            item.date.startsWith(`${currentYear}-${currentMonthNumber}`)

    })

    const monthlyPages = monthlyActivities.reduce(
        (total, item) => total + Number(item.pagesRead || 0),
        0
    )


    // Summary cards
    const reportCards = [

        {
            title: 'Total Books',
            value: books.length,
            icon: <MenuBookIcon />,
            color: '#F47745'
        },

        {
            title: 'Completed Books',
            value: completedBooks,
            icon: <CheckCircleIcon />,
            color: '#5B9A72'
        },

        {
            title: 'Currently Reading',
            value: readingBooks,
            icon: <AutoStoriesIcon />,
            color: '#D99A48'
        },

        {
            title: 'Total Reviews',
            value: reviews.length,
            icon: <RateReviewIcon />,
            color: '#8B78B8'
        },

        {
            title: 'Average Rating',
            value: `${averageRating} / 5`,
            icon: <StarIcon />,
            color: '#E6A23C'
        },

        {
            title: 'Pages Read',
            value: totalPages,
            icon: <DescriptionIcon />,
            color: '#4D91A6'
        }

    ]


    // ====================================
    // DOWNLOAD COMPLETE PDF REPORT
    // ====================================

    const downloadReport = async () => {

        try {

            const doc = new jsPDF('p', 'mm', 'a4')

            const pageWidth = doc.internal.pageSize.getWidth()
            const pageHeight = doc.internal.pageSize.getHeight()

            // PDF theme colors
            const darkBrown = [89, 60, 50]
            const terracotta = [220, 91, 51]
            const peach = [249, 211, 194]
            const cardColor = [255, 232, 218]
            const cream = [255, 247, 237]
            const mutedBrown = [125, 94, 80]
            const white = [255, 255, 255]


            // Common table styling
            const tableStyles = {

                theme: 'grid',

                headStyles: {
                    fillColor: terracotta,
                    textColor: white,
                    fontStyle: 'bold',
                    fontSize: 8
                },

                styles: {
                    fontSize: 8,
                    cellPadding: 3,
                    textColor: darkBrown,
                    lineColor: peach,
                    lineWidth: 0.2,
                    overflow: 'linebreak',
                    valign: 'middle'
                },

                alternateRowStyles: {
                    fillColor: cardColor
                },

                margin: {
                    left: 14,
                    right: 14,
                    top: 32,
                    bottom: 18
                },

                showHead: 'everyPage',

                rowPageBreak: 'avoid'

            }


            // Add header to each page
            const addPageHeading = (heading) => {

                doc.setFillColor(...peach)

                doc.roundedRect(
                    12,
                    8,
                    pageWidth - 24,
                    20,
                    3,
                    3,
                    'F'
                )

                doc.setFont('helvetica', 'bold')
                doc.setFontSize(16)
                doc.setTextColor(...darkBrown)

                doc.text('BookVerse', 18, 21)

                doc.setFont('helvetica', 'normal')
                doc.setFontSize(9)

                doc.text(
                    heading,
                    pageWidth - 18,
                    20,
                    { align: 'right' }
                )

            }


            // Add footer to each page
            const addPageFooter = () => {

                const pageCount = doc.internal.getNumberOfPages()

                for (let i = 1; i <= pageCount; i++) {

                    doc.setPage(i)

                    doc.setFont('helvetica', 'normal')
                    doc.setFontSize(8)
                    doc.setTextColor(...mutedBrown)

                    doc.text(
                        'BookVerse | Professional Reading Report',
                        14,
                        pageHeight - 10
                    )

                    doc.text(
                        `Page ${i} of ${pageCount}`,
                        pageWidth - 14,
                        pageHeight - 10,
                        { align: 'right' }
                    )

                }

            }


            // ==============================
            // PAGE 1 - READING OVERVIEW
            // ==============================

            // Background
            doc.setFillColor(...cream)

            doc.rect(
                0,
                0,
                pageWidth,
                pageHeight,
                'F'
            )

            addPageHeading('Professional Reading Report')

            doc.setFont('helvetica', 'bold')
            doc.setFontSize(14)
            doc.setTextColor(...darkBrown)

            doc.text('Reading Overview', 14, 38)

            doc.setFont('helvetica', 'normal')
            doc.setFontSize(9)
            doc.setTextColor(...mutedBrown)

            doc.text(
                `Generated on: ${new Date().toLocaleDateString()}`,
                14,
                45
            )


            // Statistics cards
            const summaryItems = [

                ['Total Books', books.length],
                ['Completed Books', completedBooks],
                ['Currently Reading', readingBooks],
                ['Total Reviews', reviews.length],
                ['Average Rating', `${averageRating} / 5`],
                ['Total Pages Read', totalPages]

            ]

            const cardWidth = 56
            const cardHeight = 25
            const gap = 6

            summaryItems.forEach((item, index) => {

                const row = Math.floor(index / 3)
                const column = index % 3

                const x = 14 + column * (cardWidth + gap)
                const y = 51 + row * (cardHeight + 5)

                doc.setFillColor(...cardColor)
                doc.setDrawColor(...terracotta)
                doc.setLineWidth(0.5)

                doc.roundedRect(
                    x,
                    y,
                    cardWidth,
                    cardHeight,
                    3,
                    3,
                    'FD'
                )

                doc.setFont('helvetica', 'normal')
                doc.setFontSize(8)
                doc.setTextColor(...mutedBrown)

                doc.text(
                    String(item[0]),
                    x + 4,
                    y + 8
                )

                doc.setFont('helvetica', 'bold')
                doc.setFontSize(15)
                doc.setTextColor(...darkBrown)

                doc.text(
                    String(item[1]),
                    x + 4,
                    y + 19
                )

            })


            // Monthly activity heading
            doc.setFont('helvetica', 'bold')
            doc.setFontSize(12)
            doc.setTextColor(...darkBrown)

            doc.text('Monthly Reading Activity', 14, 117)


            // Monthly activity table
            autoTable(doc, {

                ...tableStyles,

                startY: 121,

                head: [
                    ['Month', 'Pages Read']
                ],

                body: monthlyData.map(item => [
                    item.name,
                    item.value
                ]),

                tableWidth: 90,

                margin: {
                    left: 14,
                    right: 14,
                    top: 32,
                    bottom: 18
                },

                columnStyles: {
                    0: { cellWidth: 55 },
                    1: { cellWidth: 35 }
                }

            })


            // Reading goals
            let goalStartY = doc.lastAutoTable.finalY + 10

            if (goalStartY > 245) {

                doc.addPage()

                addPageHeading('Reading Goals')

                goalStartY = 40

            }

            doc.setFont('helvetica', 'bold')
            doc.setFontSize(12)
            doc.setTextColor(...darkBrown)

            doc.text('Reading Goal Progress', 14, goalStartY)

            autoTable(doc, {

                ...tableStyles,

                startY: goalStartY + 5,

                head: [
                    ['Reading Goal', 'Target', 'Completed', 'Progress']
                ],

                body: [

                    [
                        'Monthly Reading Goal',
                        goal ? `${goal.monthlyTarget} books` : 'Not set',
                        `${completedBooks} books`,
                        goal && Number(goal.monthlyTarget) > 0
                            ? `${Math.round(completedBooks / Number(goal.monthlyTarget) * 100)}%`
                            : '0%'
                    ],

                    [
                        'Daily Reading Goal',
                        goal ? `${goal.dailyTarget} pages` : 'Not set',
                        `${pagesReadToday} pages`,
                        goal && Number(goal.dailyTarget) > 0
                            ? `${Math.round(pagesReadToday / Number(goal.dailyTarget) * 100)}%`
                            : '0%'
                    ]

                ]

            })


            // ==============================
            // PAGE 2 - BOOK DETAILS
            // ==============================

            doc.addPage()

            addPageHeading('My Books')

            doc.setFont('helvetica', 'bold')
            doc.setFontSize(14)
            doc.setTextColor(...darkBrown)

            doc.text('Complete Book Collection', 14, 38)

            autoTable(doc, {

                ...tableStyles,

                startY: 44,

                head: [[
                    'Title',
                    'Author',
                    'Genre',
                    'Status',
                    'Rating',
                    'Description'
                ]],

                body: books.length > 0

                    ? books.map(item => [

                        item.title || 'N/A',
                        item.author || 'N/A',
                        item.genre || 'N/A',
                        item.status || 'N/A',
                        item.rating || 0,
                        item.description || 'N/A'

                    ])

                    : [['No books available', '', '', '', '', '']],

                columnStyles: {
                    0: { cellWidth: 32 },
                    1: { cellWidth: 28 },
                    2: { cellWidth: 23 },
                    3: { cellWidth: 23 },
                    4: { cellWidth: 14 },
                    5: { cellWidth: 'auto' }
                }

            })


            // ==============================
            // PAGE 3 - REVIEW DETAILS
            // ==============================

            doc.addPage()

            addPageHeading('Book Reviews')

            doc.setFont('helvetica', 'bold')
            doc.setFontSize(14)
            doc.setTextColor(...darkBrown)

            doc.text('Complete Review Details', 14, 38)

            autoTable(doc, {

                ...tableStyles,

                startY: 44,

                head: [[
                    'Book Title',
                    'Author',
                    'Reviewer',
                    'Review Title',
                    'Rating',
                    'Date',
                    'Comment'
                ]],

                body: reviews.length > 0

                    ? reviews.map(item => [

                        item.bookTitle || 'N/A',
                        item.author || 'N/A',
                        item.reviewerName || 'N/A',
                        item.reviewTitle || 'N/A',
                        item.rating || 0,
                        item.date || 'N/A',
                        item.comment || 'N/A'

                    ])

                    : [['No reviews available', '', '', '', '', '', '']],

                columnStyles: {
                    0: { cellWidth: 27 },
                    1: { cellWidth: 22 },
                    2: { cellWidth: 22 },
                    3: { cellWidth: 25 },
                    4: { cellWidth: 13 },
                    5: { cellWidth: 20 },
                    6: { cellWidth: 'auto' }
                }

            })


            // ==============================
            // PAGE 4 - READING ACTIVITIES
            // ==============================

            doc.addPage()

            addPageHeading('Reading Activities')

            doc.setFont('helvetica', 'bold')
            doc.setFontSize(14)
            doc.setTextColor(...darkBrown)

            doc.text('Complete Reading Activity History', 14, 38)

            autoTable(doc, {

                ...tableStyles,

                startY: 44,

                head: [[
                    'Date',
                    'Book Title',
                    'Pages Read',
                    'Notes'
                ]],

                body: activities.length > 0

                    ? activities.map(item => [

                        item.date || 'N/A',
                        item.bookTitle || 'N/A',
                        Number(item.pagesRead || 0),
                        item.notes || 'N/A'

                    ])

                    : [['No activities available', '', '', '']],

                columnStyles: {
                    0: { cellWidth: 30 },
                    1: { cellWidth: 45 },
                    2: { cellWidth: 25 },
                    3: { cellWidth: 'auto' }
                }

            })


            // Footer on every page
            addPageFooter()


            // ==============================
            // DOWNLOAD PDF
            // ==============================

            const fileName = 'BookVerse-Reading-Report.pdf'

            doc.save(fileName)


            // Save download details in JSON Server
            const downloadDetails = {

                reportName: 'BookVerse Reading Report',

                fileName: fileName,

                generatedDate: new Date().toISOString(),

                totalBooks: books.length,

                completedBooks: completedBooks,

                totalReviews: reviews.length,

                totalPages: totalPages

            }


            // Save download history
            try {

                await addReportDownloadAPI(downloadDetails)

                alert('PDF downloaded and history saved successfully!')

            }
            catch (err) {

                console.log('Download history saving error:', err)

                alert('PDF downloaded, but download history could not be saved.')

            }

        }
        catch (err) {

            console.log('PDF generation error:', err)

            alert('Unable to generate PDF. Please try again.')

        }

    }


    // ====================================
    // CIRCULAR GOAL PROGRESS COMPONENT
    // ====================================

    const GoalProgress = ({ title, current, target, unit }) => {

        const percentage = target > 0
            ? Math.min((current / target) * 100, 100)
            : 0

        return (

            <Box sx={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: 2,
                flex: 1
            }}>

                <Typography fontWeight="medium">
                    {title}
                </Typography>

                <Box sx={{
                    position: 'relative',
                    display: 'inline-flex'
                }}>

                    <CircularProgress
                        variant="determinate"
                        value={100}
                        size={150}
                        thickness={5}
                        sx={{
                            color: '#F6C9B8',
                            position: 'absolute'
                        }}
                    />

                    <CircularProgress
                        variant="determinate"
                        value={percentage}
                        size={150}
                        thickness={5}
                        sx={{
                            color: '#F47745',
                            '& .MuiCircularProgress-circle': {
                                strokeLinecap: 'round'
                            }
                        }}
                    />

                    <Box sx={{
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        bottom: 0,
                        right: 0,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        flexDirection: 'column'
                    }}>

                        <Typography variant="h5" fontWeight="bold">
                            {Math.round(percentage)}%
                        </Typography>

                        <Typography variant="caption" color="#967C70">
                            Completed
                        </Typography>

                    </Box>

                </Box>

                <Typography color="#967C70">
                    {current} / {target} {unit}
                </Typography>

            </Box>

        )

    }


    // ====================================
    // LOADING SCREEN
    // ====================================

    if (loading) {

        return (

            <Box sx={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                minHeight: '70vh'
            }}>

                <CircularProgress sx={{ color: '#F47745' }} />

            </Box>

        )

    }


    // ====================================
    // REPORTS PAGE UI
    // ====================================

    return (

        <Box sx={{
            width: '100%',
            px: { xs: 2, md: 5 },
            py: 4,
            color: '#593C32'
        }}>


            {/* Heading and Download Button */}

            <Box sx={{
                mb: 4,
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                flexWrap: 'wrap',
                gap: 2
            }}>

                <Box>

                    <Typography variant="h4" fontWeight="bold">
                        Reading Reports
                    </Typography>

                    <Typography sx={{
                        color: '#967C70',
                        mt: 1
                    }}>
                        Track your reading progress and discover your reading habits.
                    </Typography>

                </Box>


                <Button
                    variant="contained"
                    startIcon={<DownloadIcon />}
                    onClick={downloadReport}
                    sx={{
                        backgroundColor: '#F47745',
                        color: '#FFFFFF',
                        textTransform: 'none',
                        px: 3,
                        py: 1.2,
                        borderRadius: 2,
                        '&:hover': {
                            backgroundColor: '#E76535'
                        }
                    }}
                >
                    Download PDF
                </Button>

            </Box>



            {/* Summary Cards */}

            <Box sx={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
                gap: 3,
                mb: 4
            }}>

                {reportCards.map((item, index) => (

                    <Paper
                        key={index}
                        elevation={0}
                        sx={{
                            p: 3,
                            borderRadius: 3,
                            border: '1px solid #E9DED3',
                            backgroundColor: '#FFFFFF'
                        }}
                    >

                        <Box sx={{
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center'
                        }}>

                            <Typography sx={{ color: '#967C70' }}>
                                {item.title}
                            </Typography>

                            <Box sx={{
                                color: item.color,
                                backgroundColor: '#FFF0E8',
                                p: 1,
                                borderRadius: 2
                            }}>
                                {item.icon}
                            </Box>

                        </Box>

                        <Typography
                            variant="h4"
                            fontWeight="bold"
                            sx={{ mt: 2, color: '#593C32' }}
                        >
                            {item.value}
                        </Typography>

                    </Paper>

                ))}

            </Box>



            {/* Charts Row */}

            <Box sx={{
                display: 'grid',
                gridTemplateColumns: {
                    xs: '1fr',
                    md: '1fr 1fr'
                },
                gap: 3,
                mb: 4
            }}>


                {/* Reading Status Doughnut Chart */}

                <Paper
                    elevation={0}
                    sx={{
                        p: 3,
                        borderRadius: 3,
                        border: '1px solid #E9DED3',
                        backgroundColor: '#FFFFFF',
                        minWidth: 0
                    }}
                >

                    <Typography variant="h6" fontWeight="bold">
                        Reading Status
                    </Typography>

                    <Typography sx={{
                        color: '#967C70',
                        mb: 2
                    }}>
                        Distribution of your books
                    </Typography>


                    {statusData.length > 0 ? (

                        <Box sx={{ width: '100%', height: 280 }}>

                            <ResponsiveContainer width="100%" height="100%">

                                <PieChart>

                                    <Pie
                                        data={statusData}
                                        dataKey="value"
                                        nameKey="name"
                                        cx="50%"
                                        cy="45%"
                                        innerRadius={65}
                                        outerRadius={95}
                                        paddingAngle={4}
                                    >

                                        {statusData.map((item, index) => (

                                            <Cell
                                                key={index}
                                                fill={statusColors[index % statusColors.length]}
                                            />

                                        ))}

                                    </Pie>

                                    <Tooltip />

                                    <Legend verticalAlign="bottom" />

                                </PieChart>

                            </ResponsiveContainer>

                        </Box>

                    ) : (

                        <Box sx={{
                            height: 280,
                            display: 'flex',
                            justifyContent: 'center',
                            alignItems: 'center'
                        }}>

                            <Typography color="#967C70">
                                No books available to display.
                            </Typography>

                        </Box>

                    )}

                </Paper>



                {/* Monthly Activity Doughnut Chart */}

                <Paper
                    elevation={0}
                    sx={{
                        p: 3,
                        borderRadius: 3,
                        border: '1px solid #E9DED3',
                        backgroundColor: '#FFFFFF',
                        minWidth: 0
                    }}
                >

                    <Typography variant="h6" fontWeight="bold">
                        Monthly Reading Activity
                    </Typography>

                    <Typography sx={{
                        color: '#967C70',
                        mb: 2
                    }}>
                        Pages read during {currentYear}
                    </Typography>


                    {monthlyData.some(item => item.value > 0) ? (

                        <Box sx={{ width: '100%', height: 280 }}>

                            <ResponsiveContainer width="100%" height="100%">

                                <PieChart>

                                    <Pie
                                        data={monthlyData.filter(item => item.value > 0)}
                                        dataKey="value"
                                        nameKey="name"
                                        cx="50%"
                                        cy="45%"
                                        innerRadius={65}
                                        outerRadius={95}
                                        paddingAngle={4}
                                    >

                                        {monthlyData
                                            .filter(item => item.value > 0)
                                            .map(item => (

                                                <Cell
                                                    key={item.name}
                                                    fill={monthColors[monthNames.indexOf(item.name)]}
                                                />

                                            ))}

                                    </Pie>

                                    <Tooltip
                                        formatter={(value) => [
                                            `${value} pages`,
                                            'Pages Read'
                                        ]}
                                    />

                                    <Legend verticalAlign="bottom" />

                                </PieChart>

                            </ResponsiveContainer>

                        </Box>

                    ) : (

                        <Box sx={{
                            height: 280,
                            display: 'flex',
                            justifyContent: 'center',
                            alignItems: 'center'
                        }}>

                            <Typography color="#967C70">
                                No reading activity available this year.
                            </Typography>

                        </Box>

                    )}

                </Paper>

            </Box>



            {/* Reading Goals */}

            <Paper
                elevation={0}
                sx={{
                    p: 3,
                    borderRadius: 3,
                    border: '1px solid #E9DED3',
                    backgroundColor: '#FFFFFF',
                    mb: 4
                }}
            >

                <Typography variant="h6" fontWeight="bold" mb={3}>
                    Reading Goals
                </Typography>

                {goal ? (

                    <Box sx={{
                        display: 'flex',
                        flexDirection: { xs: 'column', sm: 'row' },
                        justifyContent: 'space-evenly',
                        alignItems: 'center',
                        gap: 4,
                        py: 2
                    }}>

                        <GoalProgress
                            title="Monthly Reading Goal"
                            current={completedBooks}
                            target={Number(goal.monthlyTarget)}
                            unit="books"
                        />

                        <GoalProgress
                            title="Daily Reading Goal"
                            current={pagesReadToday}
                            target={Number(goal.dailyTarget)}
                            unit="pages"
                        />

                    </Box>

                ) : (

                    <Typography color="#967C70">
                        No reading goals added yet. Please set your goals in the Reading Goals section.
                    </Typography>

                )}

            </Paper>



            {/* Monthly Activity Summary */}

            <Paper
                elevation={0}
                sx={{
                    p: 3,
                    borderRadius: 3,
                    border: '1px solid #E9DED3',
                    backgroundColor: '#FFFFFF'
                }}
            >

                <Typography variant="h6" fontWeight="bold" mb={2}>
                    This Month's Reading Activity
                </Typography>

                <Typography
                    variant="h4"
                    fontWeight="bold"
                    sx={{ color: '#F47745' }}
                >
                    {monthlyActivities.length}
                </Typography>

                <Typography color="#967C70">
                    Reading sessions this month
                </Typography>

                <Typography
                    variant="h5"
                    fontWeight="bold"
                    sx={{ mt: 2 }}
                >
                    {monthlyPages} pages
                </Typography>

                <Typography color="#967C70">
                    Total pages read this month
                </Typography>

            </Paper>


        </Box>

    )

}


export default Reports
