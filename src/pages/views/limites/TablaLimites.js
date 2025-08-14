// ** MUI Imports
import Box from '@mui/material/Box'
import Card from '@mui/material/Card'
import Typography from '@mui/material/Typography'
import Icon from 'src/@core/components/icon'
import CustomChip from 'src/@core/components/mui/chip'
import CustomAvatar from 'src/@core/components/mui/avatar'
import { getInitials } from 'src/@core/utils/get-initials'
import Table from '@/@core/components/table/Table'
import useGetLimites from '@/hooks/useGetLimites'
let dollarUS = Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
});

const roleObj = {
    author: {
        color: 'success',
        icon: <Icon icon='mdi:cog' />
    },
    maintainer: {
        color: 'primary',
        icon: <Icon icon='mdi:chart-pie' />
    },
    editor: {
        color: 'info',
        icon: <Icon icon='mdi:pencil' />
    },
    subscriber: {
        color: 'warning',
        icon: <Icon icon='mdi:account-outline' />
    }
}

// const statusObj = {
//   Recibido: { color: 'success' },
//   Pendiente: { color: 'warning' },
//   Aprobado: { color: 'secondary' }
// }

const renderUserAvatar = row => {
    if (row.avatarSrc) {
        return <CustomAvatar src={row.avatarSrc} sx={{ mr: 3, width: 30, height: 30 }} />
    } else {
        return (
            <CustomAvatar skin='light' sx={{ mr: 3, width: 30, height: 30, fontSize: '.8rem' }}>
                {getInitials(row.name ? row.name : 'John Doe')}
            </CustomAvatar>
        )
    }
}

const columns = [
    {
        flex: 0.25,
        field: '_transactioncurrencyid_value',
        minWidth: 200,
        headerName: 'Divisa',
        renderCell: ({ row }) => {
            return (
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                        <Typography
                            sx={{
                                mb: -0.5,
                                fontWeight: 600,
                                lineHeight: 1.72,
                                fontSize: '0.875rem',
                                letterSpacing: '0.22px'
                            }}
                        >
                            {row._transactioncurrencyid_value}
                        </Typography>
                    </Box>
                </Box>
            )
        }
    },
    {
        flex: 0.2,
        minWidth: 120,
        field: 'new_topeporlineacomercial',
        headerName: 'Tope por Línea Comercial',
        renderCell: ({ row }) => {
            return (
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                        <Typography
                            sx={{
                                mb: -0.5,
                                fontWeight: 600,
                                lineHeight: 1.72,
                                fontSize: '0.875rem',
                                letterSpacing: '0.22px'
                            }}
                        >
                            {dollarUS.format(row.new_topeporlineacomercial)}
                        </Typography>
                    </Box>
                </Box>
            )
        }
    },
    {
        flex: 0.2,
        minWidth: 120,
        field: 'new_topeporlineacomercialusd',
        headerName: 'Tope por Línea Comercial USD',
        renderCell: ({ row }) => {
            return (
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                        <Typography
                            sx={{
                                mb: -0.5,
                                fontWeight: 600,
                                lineHeight: 1.72,
                                fontSize: '0.875rem',
                                letterSpacing: '0.22px'
                            }}
                        >
                            {dollarUS.format(row.new_topeporlineacomercialusd)}
                        </Typography>
                    </Box>
                </Box>
            )
        }
    },
    {
        flex: 0.2,
        minWidth: 120,
        field: 'new_montoutilizadogeneral',
        headerName: 'Monto Utilizado General',
        renderCell: ({ row }) => {
            return (
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                        <Typography
                            sx={{
                                mb: -0.5,
                                fontWeight: 600,
                                lineHeight: 1.72,
                                fontSize: '0.875rem',
                                letterSpacing: '0.22px'
                            }}
                        >
                            {dollarUS.format(row.new_montoutilizadogeneral)}
                        </Typography>
                    </Box>
                </Box>
            )
        }
    },
    {
        flex: 0.2,
        minWidth: 120,
        field: 'new_montodisponiblegeneral',
        headerName: 'Monto Disponible General',
        renderCell: ({ row }) => {
            return (
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                        <Typography
                            sx={{
                                mb: -0.5,
                                fontWeight: 600,
                                lineHeight: 1.72,
                                fontSize: '0.875rem',
                                letterSpacing: '0.22px'
                            }}
                        >
                            {dollarUS.format(row.new_montodisponiblegeneral)}
                        </Typography>
                    </Box>
                </Box>
            )
        }
    }
]

const TablaLimites = () => {
    const { limiteGral } = useGetLimites()

    return (
        <Card>
            <Table data={limiteGral?.length > 0 ? limiteGral : []} columns={columns} />
        </Card>
    )
}

export default TablaLimites
