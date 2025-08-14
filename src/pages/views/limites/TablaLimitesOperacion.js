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
        field: 'new_lineatipodeoperacion',
        minWidth: 200,
        headerName: 'Línea (Tipo de Operación)',
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
                            {row.new_lineatipodeoperacion}
                        </Typography>
                    </Box>
                </Box>
            )
        }
    },
    {
        flex: 0.2,
        minWidth: 100,
        field: 'new_tipochpd',
        headerName: 'Tipo CHPD',
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
                            {row.new_tipochpd}
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
        // renderCell: ({ row }) => (
        //   <CustomChip
        //     skin='light'
        //     label={row.statuscode_value}
        //     color={statusObj[row.statuscode_value].color}
        //     sx={{
        //       height: 24,
        //       fontSize: '0.75rem',
        //       textTransform: 'capitalize',
        //       '& .MuiChip-label': { fontWeight: 600, lineHeight: 1.4 }
        //     }}
        //   />
        // )
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
        field: 'new_montoutilizadoporoperacion',
        headerName: 'Monto Utilizado por Operación',
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
                            {dollarUS.format(row.new_montoutilizadoporoperacion)}
                        </Typography>
                    </Box>
                </Box>
            )
        }
    },
    {
        flex: 0.2,
        minWidth: 120,
        field: 'new_montodisponibleporoperacion',
        headerName: 'Monto Disponible por Operación',
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
                            {dollarUS.format(row.new_montodisponibleporoperacion)}
                        </Typography>
                    </Box>
                </Box>
            )
        }
    }
]

const TablaLimitesOperacion = () => {
    const { limites } = useGetLimites()

    return (
        <Card>
            <Table data={limites?.length > 0 ? limites : []} columns={columns} />
        </Card>
    )
}

export default TablaLimitesOperacion
