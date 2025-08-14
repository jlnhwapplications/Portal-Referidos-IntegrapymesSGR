import { Box, IconButton, Menu, MenuItem, Typography } from "@mui/material"
import CustomChip from "@/@core/components/mui/chip"
import CustomAvatar from "@/@core/components/mui/avatar"
// ** Utils Import
import { getInitials } from '@/@core/utils/get-initials'
import Icon from "@/@core/components/icon"
import { useState } from "react"
// ** Next Imports
import Link from 'next/link'

const statusObj = {
    1: { title: 'current', color: 'primary' },
    2: { title: 'professional', color: 'success' },
    3: { title: 'rejected', color: 'error' },
    4: { title: 'resigned', color: 'warning' },
    5: { title: 'applied', color: 'info' }
}

// ** renders client column
const renderClient = params => {
    const { row } = params
    const stateNum = Math.floor(Math.random() * 6)
    const states = ['success', 'error', 'warning', 'info', 'primary', 'secondary']
    const color = states[stateNum]
    if (row.avatar.length) {
        return <CustomAvatar src={`/images/avatars/${row.avatar}`} sx={{ mr: 3, width: '1.875rem', height: '1.875rem' }} />
    } else {
        return (
            <CustomAvatar skin='light' color={color} sx={{ mr: 3, fontSize: '.8rem', width: '1.875rem', height: '1.875rem' }}>
                {getInitials(row.full_name ? row.full_name : 'John Doe')}
            </CustomAvatar>
        )
    }
}

const RowOptions = ({ id }) => {
    // // ** Hooks
    // const dispatch = useDispatch()
  
    // ** State
    const [anchorEl, setAnchorEl] = useState(null)
    const rowOptionsOpen = Boolean(anchorEl)
  
    const handleRowOptionsClick = event => {
      setAnchorEl(event.currentTarget)
    }
  
    const handleRowOptionsClose = () => {
      setAnchorEl(null)
    }
  
    const handleDelete = () => {
    //   dispatch(deleteUser(id))
      handleRowOptionsClose()
    }
  
    return (
      <>
        <IconButton size='small' onClick={handleRowOptionsClick}>
          <Icon icon='mdi:dots-vertical' />
        </IconButton>
        <Menu
          keepMounted
          anchorEl={anchorEl}
          open={rowOptionsOpen}
          onClose={handleRowOptionsClose}
          anchorOrigin={{
            vertical: 'bottom',
            horizontal: 'right'
          }}
          transformOrigin={{
            vertical: 'top',
            horizontal: 'right'
          }}
          PaperProps={{ style: { minWidth: '8rem' } }}
        >
          <MenuItem
            component={Link}
            sx={{ '& svg': { mr: 2 } }}
            onClick={handleRowOptionsClose}
            href='/apps/user/view/overview/'
          >
            <Icon icon='mdi:eye-outline' fontSize={20} />
            View
          </MenuItem>
          <MenuItem onClick={handleRowOptionsClose} sx={{ '& svg': { mr: 2 } }}>
            <Icon icon='mdi:pencil-outline' fontSize={20} />
            Edit
          </MenuItem>
          <MenuItem onClick={handleDelete} sx={{ '& svg': { mr: 2 } }}>
            <Icon icon='mdi:delete-outline' fontSize={20} />
            Delete
          </MenuItem>
        </Menu>
      </>
    )
  }

export const COLUMNSEXAMPLE = [
    {
        flex: 0.275,
        minWidth: 290,
        field: 'full_name',
        headerName: 'Name',
        renderCell: params => {
            const { row } = params

            return (
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    {renderClient(params)}
                    <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                        <Typography noWrap variant='body2' sx={{ color: 'text.primary', fontWeight: 600 }}>
                            {row.full_name}
                        </Typography>
                        <Typography noWrap variant='caption'>
                            {row.email}
                        </Typography>
                    </Box>
                </Box>
            )
        }
    },
    {
        flex: 0.2,
        type: 'date',
        minWidth: 120,
        headerName: 'Date',
        field: 'start_date',
        valueGetter: params => new Date(params.value),
        renderCell: params => (
            <Typography variant='body2' sx={{ color: 'text.primary' }}>
                {params.row.start_date}
            </Typography>
        )
    },
    {
        flex: 0.2,
        minWidth: 110,
        field: 'salary',
        headerName: 'Salary',
        renderCell: params => (
            <Typography variant='body2' sx={{ color: 'text.primary' }}>
                {params.row.salary}
            </Typography>
        )
    },
    {
        flex: 0.125,
        field: 'age',
        minWidth: 80,
        headerName: 'Age',
        renderCell: params => (
            <Typography variant='body2' sx={{ color: 'text.primary' }}>
                {params.row.age}
            </Typography>
        )
    },
    {
        flex: 0.2,
        minWidth: 140,
        field: 'status',
        headerName: 'Status',
        renderCell: params => {
            const status = statusObj[params.row.status]

            return (
                <CustomChip
                    size='small'
                    skin='light'
                    color={status.color}
                    label={status.title}
                    sx={{ '& .MuiChip-label': { textTransform: 'capitalize' } }}
                />
            )
        }
    },
    {
        flex: 0.1,
        minWidth: 90,
        sortable: false,
        field: 'actions',
        headerName: 'Actions',
        renderCell: ({ row }) => <RowOptions id={row.id} />
      }
]