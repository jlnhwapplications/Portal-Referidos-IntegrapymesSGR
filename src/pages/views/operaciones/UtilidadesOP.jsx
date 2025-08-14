import React, { useState } from 'react'
import { Tooltip, Typography, IconButton, Box } from '@mui/material';
import Icon from 'src/@core/components/icon'
import ModalAdjuntoOperacion from '@/pages/operaciones/ModalAdjuntoOperacion';

const UtilidadesOP = (utilidad) => {
    const [open, setOpen] = useState(false);

    const openModal = () => {
        setOpen(!open);
    };

    const handleClose = () => {
        setOpen(!open);
    };

    const handleCargar = (datos) => {
        cargarLicencia(datos, handleClose);
    };

    return (
        <>
            <Box textAlign="center">
                {
                    <Tooltip title={<Typography sx={{ color: '#fff' }}>Subir archivo</Typography>} sx={{ mt: 3 }}>
                        <IconButton edge="end" aria-label="" onClick={() => openModal(true)} sx={{ mx: 1 }}>
                            <Icon icon="mdi:file-upload-outline" style={{ fontSize: 30 }} />
                        </IconButton>
                    </Tooltip>
                }
                {
                    utilidad?.utilidad?.new_vinculocompartido != null ?
                        <Tooltip title={<Typography sx={{ color: '#fff' }}>Abrir carpeta</Typography>} sx={{ mt: 3 }}>
                            <IconButton edge="end" aria-label="" onClick={() => window.open(utilidad.utilidad.new_vinculocompartido, "_blank")} sx={{ mx: 1 }}>
                                <Icon icon="mdi:folder-open-outline" style={{ fontSize: 30 }} />
                            </IconButton>
                        </Tooltip>
                        : null
                }
                {
                    utilidad?.utilidad?.new_urlplantilla != null ?
                        <Tooltip title={<Typography sx={{ color: '#fff' }}>Descargar Plantilla</Typography>} sx={{ mt: 3 }} >
                            <IconButton edge="end" aria-label="" onClick={() => window.open(utilidad.utilidad.new_urlplantilla, "_blank")} sx={{ mx: 1 }}>
                                <Icon icon="mdi:cloud-download-outline" style={{ fontSize: 30 }} />
                            </IconButton>
                        </Tooltip> : null
                }
                {
                    utilidad?.utilidad?.new_descripcion != null ?
                        <Tooltip title={<Typography sx={{ color: '#fff' }}>{utilidad.utilidad.new_descripcion}</Typography>} sx={{ mx: 1 }}>
                            <IconButton edge="end" aria-label="">
                                <Icon icon="mdi:help-circle-outline" style={{ fontSize: 30 }} />
                            </IconButton>
                        </Tooltip> : null
                }
            </Box>
            <ModalAdjuntoOperacion
                open={open}
                data={utilidad?.utilidad?.new_documento}
                id={utilidad?.utilidad?.id}
                handleClose={handleClose}
                ZonSubmit={handleCargar}
                openModal={openModal}
            />
        </>
    )
}

export default UtilidadesOP
