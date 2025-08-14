import { Box, IconButton, Menu, MenuItem, Tooltip, Typography } from "@mui/material"
import Link from "next/link";
import { useDispatch } from "react-redux";
import Icon from 'src/@core/components/icon'
import React, { useContext, useState } from 'react'
import { AuthContext } from "@/context/AuthContext";
import ModalRelaciones from "@/pages/perfil/ModalRelaciones";
import { eliminarRelacionVinculacion, obtenerRelacionesFETCH } from "@/redux/RelacionDeVinculacion";
import { Relaciones } from "@/context/GetRelacionesContext";

const RowOptions = ({ id }) => {
    // ** State

    const [anchorEl, setAnchorEl] = useState(null);
    const rowOptionsOpen = Boolean(anchorEl);
    const dispatch = useDispatch();
    const { referido, token } = useContext(AuthContext);
    const { deleteRelacion } = useContext(Relaciones);
    const [openNew, setOpenNew] = useState(false)

    const handleOpenNew = () => {
        setOpenNew(true)
    }

    const handleCloseNew = () => setOpenNew(false);

    const handleRowOptionsClick = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleRowOptionsClose = () => {
        setAnchorEl(null);
    };

    const deleteRow = () => {
        deleteRelacion(id, token)
        handleRowOptionsClose();
    };

    return (
        <>
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <Tooltip title='Eliminar'>
                    <IconButton size='small' onClick={handleRowOptionsClick}>
                        <Icon icon='material-symbols:delete-outline' fontSize={24} />
                    </IconButton>
                </Tooltip>
                <Tooltip title='Ver'>
                    <IconButton size='small' onClick={() => handleOpenNew()}>
                        <Icon icon='mdi:eye-outline' fontSize={24} />
                    </IconButton>
                </Tooltip>
            </Box>
            {
                openNew &&
                <ModalRelaciones open={openNew} close={handleCloseNew} modo={"editar"} id={id} />
            }
            <Menu
                keepMounted
                anchorEl={anchorEl}
                open={rowOptionsOpen}
                onClose={handleRowOptionsClose}
                anchorOrigin={{
                    vertical: "bottom",
                    horizontal: "center",
                }}
                transformOrigin={{
                    vertical: "top",
                    horizontal: "center",
                }}
                PaperProps={{ style: { minWidth: "8rem" } }}
            >
                <MenuItem onClick={deleteRow} sx={{ "& svg": { mr: 2 } }}>
                    <Icon icon="mingcute:alert-fill" fontSize={20} style={{ color: "red" }} />
                    Desea eliminar este registro ?
                </MenuItem>
            </Menu>
        </>
    );
};

export const columns_relaciones = [
    {
        flex: 0.1,
        minWidth: 130,
        sortable: false,
        field: 'actions',
        headerName: 'Acciones',
        renderCell: ({ row }) => (
            <RowOptions id={row.id} />
        )
    },
    {
        flex: 0.25,
        field: 'new_tipoderelacion_value',
        minWidth: 200,
        headerName: 'Tipo de relación',
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
                            {row.new_tipoderelacion_value}
                        </Typography>
                    </Box>
                </Box>
            )
        }
    },
    {
        flex: 0.2,
        minWidth: 120,
        field: '_new_cuentacontactovinculado_value',
        headerName: 'Vinculado con',
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
                            {row._new_cuentacontactovinculado_value}
                        </Typography>
                    </Box>
                </Box>
            )
        }
    },
]