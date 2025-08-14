import React, { useState } from "react"
import {
    Box,
    Typography,
    Card,
    CardContent,
    Button,
    Grid,
    Chip,
    Avatar,
    IconButton,
    Tooltip,
    useTheme,
    alpha,
    Skeleton,
} from "@mui/material"
// import { Plus, FileText, Eye, Download, Calendar, Shield } from 'lucide-react'
import AddIcon from '@mui/icons-material/Add';
// import InitialState from "./InitialState"
import { useToast } from "@/@core/components/toast/ToastProvider"
import { Download, Shield } from "@mui/icons-material"
import useGetCertificadosPymes from "@/hooks/useGetCertificadosPymes";
import TodayIcon from '@mui/icons-material/Today';
import EventIcon from '@mui/icons-material/Event';
import WorkspacePremiumIcon from '@mui/icons-material/WorkspacePremium';
import { Group as GroupIcon } from "@mui/icons-material"

const CertificadoPymeCard = ({ certificado, onView, onDownload }) => {
    const theme = useTheme()
    const { toast } = useToast()


    const getStatusColor = (status) => {
        switch (status?.toLowerCase()) {
            case "aprobado":
                return "success"
            // case "Inactivo":
            //     return "warning"
            case "Inactivo":
                return "error"
            default:
                return "default"
        }
    }

    const getCategoryColor = (categoria) => {
        switch (categoria?.toLowerCase()) {
            case "micro empresa":
                return "info"
            case "pequeña empresa":
                return "primary"
            case "mediana empresa":
                return "secondary"
            default:
                return "default"
        }
    }

    const formatDate = (dateString) => {
        if (!dateString) return "-"
        try {
            return new Intl.DateTimeFormat("es-AR", {
                year: "numeric",
                month: "short",
                day: "numeric",
            }).format(new Date(dateString))
        } catch (error) {
            return dateString
        }
    }

    const getDaysUntilExpiration = (expirationDate) => {
        if (!expirationDate) return null
        const today = new Date()
        const expDate = new Date(expirationDate)
        const diffTime = expDate - today
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
        return diffDays
    }

    const daysUntilExpiration = getDaysUntilExpiration(certificado.new_vigenciahasta)

    return (
        <Card
            sx={{
                borderRadius: 3,
                boxShadow: theme.shadows[2],
                transition: "all 0.2s ease-in-out",
                "&:hover": {
                    boxShadow: theme.shadows[8],
                    transform: "translateY(-2px)",
                },
                border: "1px solid",
                borderColor: "divider",
                position: "relative",
                overflow: "hidden",
            }}
        >
            {/* Header con gradiente */}
            <Box
                sx={{
                    backgroundColor: theme.palette.info.dark,
                    color: "white",
                    p: 2,
                    position: "relative",
                }}
            >
                <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                    <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                        <Avatar
                            sx={{
                                backgroundColor: "rgba(255,255,255,0.2)",
                                color: "white",
                                width: 40,
                                height: 40,
                            }}
                        >
                            <WorkspacePremiumIcon size={20} />
                        </Avatar>
                        <Box>
                            <Typography variant="h6" sx={{ fontWeight: 700, fontSize: "1rem" }}>
                                {certificado.new_numeroderegistro}
                            </Typography>
                            <Typography variant="body2" sx={{ opacity: 0.9, fontSize: "0.85rem" }}>
                                {certificado.tipo}
                            </Typography>
                        </Box>
                    </Box>
                </Box>
            </Box>

            <CardContent sx={{ py: 3, px: 5 }}>
                {/* Status y Categoría */}
                <Box sx={{ display: "flex", gap: 1, mb: 3, flexWrap: "wrap" }}>
                    <Chip
                        label={certificado.statuscode}
                        color={getStatusColor(certificado.statuscode)}
                        size="small"
                        sx={{ fontWeight: 600, fontSize: "0.75rem" }}
                    />
                </Box>
                {/* Fechas de Vigencia */}
                <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
                    <Box sx={{ display: "flex", justifyContent: 'space-between', alignItems: "center", gap: 1 }}>
                        <Box>
                            {/* <TodayIcon size={16} color={theme.palette.text.secondary} /> */}
                            <Typography variant="caption" sx={{ display: "block", fontWeight: 'bold' }}>
                                Categoría
                            </Typography>
                            <Chip
                                label={certificado.new_categoria}
                                color={getCategoryColor(certificado.new_categoria)}
                                variant="outlined"
                                size="small"
                                sx={{ fontWeight: 600, fontSize: "0.75rem" }}
                            />
                        </Box>
                        <Box>
                            {/* <TodayIcon size={16} color={theme.palette.text.secondary} /> */}
                            <Typography variant="caption" sx={{ fontWeight: 'bold', display: "block" }}>
                                Sector Economico
                            </Typography>
                            <Chip
                                label={certificado.new_sectoreconomico}
                                color={getCategoryColor(certificado.new_sectoreconomico)}
                                variant="outlined"
                                size="small"
                                sx={{ fontWeight: 600, fontSize: "0.75rem" }}
                            />
                        </Box>
                    </Box>
                    <Box sx={{ display: "flex", justifyContent: 'space-between', alignItems: "center", gap: 1 }}>
                        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                            <TodayIcon size={16} color={theme.palette.text.secondary} />
                            <Box>
                                <Typography variant="caption" sx={{ color: "text.secondary", display: "block" }}>
                                    Vigencia Desde
                                </Typography>
                                <Typography variant="body2" sx={{ fontWeight: 600 }}>
                                    {formatDate(certificado.new_vigenciadesde)}
                                </Typography>
                            </Box>
                        </Box>
                        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                            <EventIcon size={16} color={theme.palette.text.secondary} />
                            <Box>
                                <Typography variant="caption" sx={{ color: "text.secondary", display: "block" }}>
                                    Vigencia Hasta
                                </Typography>
                                <Typography variant="body2" sx={{ fontWeight: 600 }}>
                                    {formatDate(certificado.new_vigenciahasta)}
                                </Typography>
                            </Box>
                        </Box>
                    </Box>
                </Box>
            </CardContent>
        </Card>
    )
}

const TablaCertificadosPymes = () => {
    const { certificados, loadingCertificados } = useGetCertificadosPymes()
    const theme = useTheme()
    const { showToast } = useToast()

    const handleAddCertificate = () => {
        showToast("Funcionalidad de agregar certificado en desarrollo", "info")
    }

    const handleViewCertificate = (certificado) => {
        showToast(`Viendo detalles del certificado ${certificado.new_numeroderegistro}`, "info")
    }

    const handleDownloadCertificate = (certificado) => {
        showToast(`Descargando certificado ${certificado.new_numeroderegistro}`, "success")
    }

    if (certificados.length === 0 && loadingCertificados === false) {
        return (
            <Box
                sx={{
                    textAlign: "center",
                    py: 8,
                    color: theme.palette?.text.secondary,
                    backgroundColor: alpha(theme.palette?.background.paper, 0.8),
                    borderRadius: 3,
                    border: `1px dashed ${alpha(theme.palette?.divider, 0.2)}`,
                    boxShadow: theme.shadows[2],
                }}
            >
                <Avatar
                    sx={{
                        width: 80,
                        height: 80,
                        mx: "auto",
                        mb: 3,
                        backgroundColor: alpha(theme.palette?.primary.main, 0.1),
                        color: theme.palette.primary.main,
                    }}
                >
                    <WorkspacePremiumIcon sx={{ fontSize: 40 }} />
                </Avatar>
                <Typography variant="h6" sx={{ fontWeight: 600, mb: 1 }}>
                    No hay certificados pymes
                </Typography>
            </Box>
        )
    }

    return (
        <>
            {
                loadingCertificados ?
                    <Box>
                        <Skeleton variant="rectangular" height={140} sx={{ borderRadius: 3 }} />
                    </Box> :
                    <Card sx={{ borderRadius: 3, boxShadow: theme.shadows[4] }}>
                        <CardContent sx={{ p: 4 }}>
                            {/* Header */}
                            <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 4 }}>
                                <Box>
                                    <Typography variant="h5" sx={{ fontWeight: 700, mb: 1 }}>
                                        Certificados PYMES
                                    </Typography>
                                    <Typography variant="body2" sx={{ color: "text.secondary" }}>
                                        {certificados.length} certificado{certificados.length !== 1 ? "s" : ""} registrado{certificados.length !== 1 ? "s" : ""}
                                    </Typography>
                                </Box>
                            </Box>

                            {/* Cards Grid */}
                            <Grid container spacing={3}>
                                {certificados.map((certificado) => (
                                    <Grid item xs={12} md={6} lg={4} key={certificado.id}>
                                        <CertificadoPymeCard
                                            certificado={certificado}
                                            onView={handleViewCertificate}
                                            onDownload={handleDownloadCertificate}
                                        />
                                    </Grid>
                                ))}
                            </Grid>
                        </CardContent>
                    </Card >
            }
        </>
    )
}

export default TablaCertificadosPymes
