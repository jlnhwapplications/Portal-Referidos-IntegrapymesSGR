import React, { useState } from 'react'

// ** MUI Imports
import Grid from '@mui/material/Grid'
import Typography from '@mui/material/Typography'
import Card from '@mui/material/Card'
import CardMedia from '@mui/material/CardMedia'
import CardContent from '@mui/material/CardContent'
import CardActions from '@mui/material/CardActions'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import Avatar from '@mui/material/Avatar'
import AvatarGroup from '@mui/material/AvatarGroup'
import IconButton from '@mui/material/IconButton'
import Collapse from '@mui/material/Collapse'
import Divider from '@mui/material/Divider'

// ** Icon Imports
import Icon from '@/@core/components/icon'

const Basicas = () => {
    // ** State
    const [collapse, setCollapse] = useState(false)

    const handleClick = () => {
        setCollapse(!collapse)
    }

    return (
        <Grid container spacing={6}>
            <Grid item xs={12} sx={{ pb: 4 }}>
                <Typography variant='h5'>Basic Cards</Typography>
            </Grid>
            <Grid item xs={12} sm={6} md={4}>
                <Card>
                    <CardMedia sx={{ height: '14.5625rem' }} image='/images/cards/glass-house.png' />
                    <CardContent>
                        <Typography variant='h6' sx={{ mb: 2 }}>
                            Influencing The Influencer
                        </Typography>
                        <Typography variant='body2'>
                            Cancun is back, better than ever! Over a hundred Mexico resorts have reopened and the state tourism minister
                            predicts Cancun will draw as many visitors in 2006 as it did two years ago.
                        </Typography>
                    </CardContent>
                </Card>
            </Grid>
            <Grid item xs={12} sm={6} md={4}>
                <Card sx={{ position: 'relative' }}>
                    <CardMedia sx={{ height: '12.625rem' }} image='/images/cards/background-user.png' />
                    <Avatar
                        alt='Robert Meyer'
                        src='/images/avatars/2.png'
                        sx={{
                            width: 75,
                            height: 75,
                            left: '1.313rem',
                            top: '10.28125rem',
                            position: 'absolute',
                            border: theme => `0.25rem solid ${theme.palette.common.white}`
                        }}
                    />
                    <CardContent>
                        <Box
                            sx={{
                                mt: 5.75,
                                mb: 8.75,
                                display: 'flex',
                                flexWrap: 'wrap',
                                alignItems: 'center',
                                justifyContent: 'space-between'
                            }}
                        >
                            <Box sx={{ mr: 2, mb: 1, display: 'flex', flexDirection: 'column' }}>
                                <Typography variant='h6'>Robert Meyer</Typography>
                                <Typography variant='caption'>London, UK</Typography>
                            </Box>
                            <Button variant='contained'>Send Request</Button>
                        </Box>
                        <Box sx={{ gap: 2, display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'center' }}>
                            <Typography variant='subtitle2' sx={{ whiteSpace: 'nowrap', color: 'text.primary' }}>
                                18 mutual friends
                            </Typography>
                            <AvatarGroup max={4}>
                                <Avatar src='/images/avatars/8.png' alt='Alice Cobb' />
                                <Avatar src='/images/avatars/7.png' alt='Jeffery Warner' />
                                <Avatar src='/images/avatars/3.png' alt='Howard Lloyd' />
                                <Avatar src='/images/avatars/2.png' alt='Bettie Dunn' />
                                <Avatar src='/images/avatars/4.png' alt='Olivia Sparks' />
                                <Avatar src='/images/avatars/5.png' alt='Jimmy Hanson' />
                                <Avatar src='/images/avatars/6.png' alt='Hallie Richards' />
                            </AvatarGroup>
                        </Box>
                    </CardContent>
                </Card>
            </Grid>
            <Grid item xs={12} sm={6} md={4}>
                <Card>
                    <CardMedia sx={{ height: '14.5625rem' }} image='/images/cards/paper-boat.png' />
                    <CardContent>
                        <Typography variant='h6' sx={{ mb: 2 }}>
                            Popular Uses Of The Internet
                        </Typography>
                        <Typography variant='body2'>
                            Although cards can support multiple actions, UI controls, and an overflow menu.
                        </Typography>
                    </CardContent>
                    <CardActions className='card-action-dense'>
                        <Box
                            sx={{
                                width: '100%',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'space-between'
                            }}
                        >
                            <Button onClick={handleClick}>Details</Button>
                            <IconButton size='small' onClick={handleClick}>
                                <Icon fontSize='1.875rem' icon={collapse ? 'mdi:chevron-up' : 'mdi:chevron-down'} />
                            </IconButton>
                        </Box>
                    </CardActions>
                    <Collapse in={collapse}>
                        <Divider sx={{ m: '0 !important' }} />
                        <CardContent>
                            <Typography variant='body2'>
                                I&prime;m a thing. But, like most politicians, he promised more than he could deliver. You won&prime;t have
                                time for sleeping, soldier, not with all the bed making you&prime;ll be doing. Then we&prime;ll go with that
                                data file! Hey, you add a one and two zeros to that or we walk! You&prime;re going to do his laundry?
                                I&prime;ve got to find a way to escape.
                            </Typography>
                        </CardContent>
                    </Collapse>
                </Card>
            </Grid>
            {/* <Grid item xs={12} sm={6}>
                <CardMobile />
            </Grid>
            <Grid item xs={12} sm={6}>
                <CardHorizontalRatings />
            </Grid>
            <Grid item xs={12} sm={6} md={4}>
                <CardAppleWatch />
            </Grid>
            <Grid item xs={12} md={8}>
                <CardMembership />
            </Grid>
            <Grid item xs={12} sm={6} md={4}>
                <CardInfluencer />
            </Grid>
            <Grid item xs={12} sm={6} md={4}>
                <CardVerticalRatings />
            </Grid>
            <Grid item xs={12} sm={6} md={4}>
                <CardSupport />
            </Grid>
            <Grid item xs={12} sx={{ pb: 4, pt: theme => `${theme.spacing(17.5)} !important` }}>
                <Typography variant='h5'>Navigation Cards</Typography>
            </Grid>
            <Grid item xs={12} md={6}>
                <CardNavigation />
            </Grid>
            <Grid item xs={12} md={6}>
                <CardNavigationCenter />
            </Grid>
            <Grid item xs={12} sx={{ pb: 4, pt: theme => `${theme.spacing(17.5)} !important` }}>
                <Typography variant='h5'>Solid Cards</Typography>
            </Grid>
            <Grid item xs={12} sm={6} md={4}>
                <CardTwitter />
            </Grid>
            <Grid item xs={12} sm={6} md={4}>
                <CardFacebook />
            </Grid>
            <Grid item xs={12} sm={6} md={4}>
                <CardLinkedIn />
            </Grid> */}
        </Grid>
    )
}

export default Basicas