import {
    AppBar, Dialog, DialogTitle, IconButton, Toolbar, Tooltip, Typography, DialogContentText,
    DialogContent, Chip, Box, Button, List
} from '@mui/material';
import React, { useContext, useState, Fragment, useEffect } from 'react'
import Icon from 'src/@core/components/icon'

const ModalDetalleImportacion = ({ open, handleClose, detalle }) => {
    const [fullWidth, setFullWidth] = useState(true);
    const [maxWidth, setMaxWidth] = useState("sm");

    return (
        <Dialog
            fullWidth={fullWidth}
            maxWidth={maxWidth}
            open={open}
            onClose={handleClose}
            aria-labelledby="responsive-dialog-title"
        >
            <AppBar sx={{ position: "relative" }}>
                <Toolbar
                    sx={{
                        display: "flex",
                        flexDirection: "row",
                        justifyContent: "space-between",
                        alignItems: "center",
                    }}
                >
                    <DialogTitle id="responsive-dialog-title">
                        Detalle de Ejecución
                    </DialogTitle>
                    <Tooltip title={<Typography sx={{ color: "#fff" }}>Cerrar</Typography>}>
                        <IconButton id="cerrar-cargaadjuntos" edge="end" color="warning" onClick={handleClose} aria-label="close" sx={{ mr: 2 }}>
                            <Icon color="red" icon="material-symbols:close" />
                        </IconButton>
                    </Tooltip>
                </Toolbar>
            </AppBar>
            <DialogContent>
                <DialogContentText>
                    {/* <Chip label={data} sx={{ mt: 2, mb: 2 }} /> */}
                    <Box sx={{ py: 2 }}>
                        <Typography>{detalle}</Typography>
                    </Box>
                </DialogContentText>
            </DialogContent>
        </Dialog>
    )
}

export default ModalDetalleImportacion