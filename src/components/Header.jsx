
import React from 'react'

import {
    AppBar,
    Toolbar,
    Box,
    Typography,
    IconButton,
    Avatar,
    Button
} from '@mui/material'

import {
    NotificationsNone,
    MenuBook
} from '@mui/icons-material'

import { NavLink } from 'react-router-dom'

function Header() {

    const menuItems = [
        { title: 'Home', path: '/dashboard' },
        { title: 'My Books', path: '/books' },
        { title: 'Reviews', path: '/reviews' },
        { title: 'Calendar', path: '/calendar' },
        { title: 'Reading Goals', path: '/goals' },
        { title: 'Reports', path: '/reports' }
    ]

    return (

        <AppBar
            position="sticky"
            elevation={0}
            sx={{
                width: '100%',
                backgroundColor: '#FFFFFF',
                color: '#593C32',
                borderBottom: '1px solid #E9DED3'
            }}
        >

            <Toolbar
                sx={{
                    minHeight: '75px',
                    justifyContent: 'space-between',
                    px: { xs: 2, md: 4 },
                    gap: 2
                }}
            >

                {/* Logo */}

                <Box sx={{
                    display: 'flex',
                    alignItems: 'center',
                    flexShrink: 0
                }}>

                    <MenuBook sx={{
                        fontSize: 32,
                        color: '#F47745'
                    }} />

                    <Typography
        component="span"
        sx={{
            fontFamily: '"Playfair Display", serif',
            fontSize: '28px',
            fontWeight: 700,
            color: '#593C32'
        }}
    >
        Book
    </Typography>

    <Typography
        component="span"
        sx={{
            fontFamily: '"Playfair Display", serif',
            fontSize: '28px',
            fontWeight: 500,
            color: '#F47745'
        }}
    >
        Verse
    </Typography>

                </Box>

                {/* Navigation */}

                <Box sx={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 0.5
                }}>

                    {menuItems.map((item) => (

                        <Button
                            key={item.title}
                            component={NavLink}
                            to={item.path}
                            sx={{
                                color: '#593C32',
                                textTransform: 'none',
                                fontWeight: 500,
                                fontSize: 14,
                                borderRadius: 2,
                                px: 1.5,
                                py: 1,

                                '&:hover': {
                                    backgroundColor: '#FFF0E8'
                                },

                                '&.active': {
                                    color: '#F47745',
                                    backgroundColor: '#FFF0E8',
                                    fontWeight: 'bold'
                                }
                            }}
                        >
                            {item.title}
                        </Button>

                    ))}

                </Box>

                

            </Toolbar>

        </AppBar>

    )

}

export default Header

