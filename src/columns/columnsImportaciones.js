import { Box, IconButton, Menu, MenuItem, Tooltip, Typography } from '@mui/material';
import { useContext, useEffect, useState } from 'react';
import Icon from 'src/@core/components/icon'
import ModalDetalleImportacion from '@/pages/garantias/ModalDetalleImportacion';

const RowOptions = ({ detalle }) => {
  const [anchorEl, setAnchorEl] = useState(null);
  const [openNew, setOpenNew] = useState(false)

  const handleOpenNew = () => {
    setOpenNew(true)
  }

  const handleCloseNew = () => setOpenNew(false);

  return (
    <>
      <Box sx={{ display: 'flex', alignItems: 'center' }}>
        <Tooltip title='Ver Detalle'>
          <IconButton size='small' onClick={() => handleOpenNew()}>
            <Icon icon='mdi:eye-outline' fontSize={24} />
          </IconButton>
        </Tooltip>
      </Box>
      {
        openNew &&
        <ModalDetalleImportacion open={openNew} handleClose={handleCloseNew} detalle={detalle} />
      }
    </>
  );
};


export const columns_cheques = [
  {
    flex: 0.1,
    maxWidth: 130,
    sortable: false,
    field: 'actions',
    headerName: 'Acciones',
    renderCell: ({ row }) => (
      <RowOptions detalle={row.new_detalledeejecucion} />
    )
  },
  {
    flex: 0.2,
    maxWidth: 320,
    field: 'new_name',
    headerName: 'Archivo',
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
              {row.new_name}
            </Typography>
          </Box>
        </Box>
      )
    }
  },
  {
    flex: 0.2,
    maxWidth: 200,
    field: 'cretedon',
    headerName: 'Fecha de Creacion',
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
              {row.createdon}
            </Typography>
          </Box>
        </Box>
      )
    }
  },
  {
    flex: 0.2,
    maxWidth: 720,
    field: 'new_detalledeejecucion',
    headerName: 'Detalle',
    renderCell: ({ row }) => {
      return (
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <Box sx={{
            maxWidth: '720px', whiteSpace: 'nowrap',
            textOverflow: 'ellipsis',
            overflow: 'hidden'
          }}>
            <Tooltip title={row.new_detalledeejecucion}>
              <Typography
                sx={{
                  mb: -0.5,
                  fontWeight: 600,
                  lineHeight: 1.72,
                  fontSize: '0.875rem',
                  letterSpacing: '0.22px',
                }}
              >
                {row.new_detalledeejecucion}
              </Typography>
            </Tooltip>
          </Box>
        </Box>
      )
    }
  },
]