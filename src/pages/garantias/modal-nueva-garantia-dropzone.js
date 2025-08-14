"use client"

import { useState } from "react"
import {
  Box,
  Typography,
  Paper,
  List,
  ListItem,
  IconButton,
  Chip,
  LinearProgress,
  Alert,
  useTheme,
  alpha,
} from "@mui/material"
import { CloudUpload, Delete, InsertDriveFile, CheckCircle, Warning } from "@mui/icons-material"
import { useDropzone } from "react-dropzone"

export default function EnhancedDropzone({ files, setFiles, maxSize = 15000000 }) {
  const theme = useTheme()
  const isDark = theme.palette.mode === "dark"
  const [uploadProgress, setUploadProgress] = useState(0)

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop: (acceptedFiles, rejectedFiles) => {
      // Validar archivos rechazados
      if (rejectedFiles.length > 0) {
        console.error("Archivos rechazados:", rejectedFiles)
        return
      }

      // Validar un solo archivo
      if (acceptedFiles.length > 1) {
        console.error("Solo se permite un archivo")
        return
      }

      // Validar tipo de archivo
      const file = acceptedFiles[0]
      if (file?.type !== "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet") {
        console.error("Tipo de archivo inválido")
        return
      }

      // Validar tamaño
      if (file.size > maxSize) {
        console.error("Archivo muy grande")
        return
      }

      setFiles([file])
    },
    accept: {
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet": [".xlsx"],
    },
    maxFiles: 1,
    maxSize,
  })

  const formatFileSize = (bytes) => {
    if (bytes === 0) return "0 Bytes"
    const k = 1024
    const sizes = ["Bytes", "KB", "MB", "GB"]
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return Number.parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i]
  }

  const handleRemoveFile = () => {
    setFiles([])
    setUploadProgress(0)
  }

  return (
    <Box>
      {/* Dropzone Area */}
      <Paper
        {...getRootProps()}
        elevation={isDark ? 4 : 2}
        sx={{
          p: 4,
          textAlign: "center",
          cursor: "pointer",
          border: isDragActive
            ? `2px dashed ${isDark ? "#64b5f6" : "#1976d2"}`
            : `2px dashed ${isDark ? "#4A4063" : "#e0e0e0"}`,
          borderRadius: 3,
          bgcolor: isDragActive
            ? isDark
              ? alpha("#64b5f6", 0.1)
              : alpha("#1976d2", 0.05)
            : isDark
              ? "#332C4E"
              : "#ffffff",
          transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
          "&:hover": {
            borderColor: isDark ? "#64b5f6" : "#1976d2",
            bgcolor: isDark ? alpha("#64b5f6", 0.05) : alpha("#1976d2", 0.02),
            transform: "translateY(-2px)",
            boxShadow: isDark
              ? "0 8px 30px rgba(0,0,0,0.4), 0 0 0 1px rgba(100, 181, 246, 0.2)"
              : "0 8px 30px rgba(0,0,0,0.1), 0 0 0 1px rgba(25, 118, 210, 0.2)",
          },
        }}
      >
        <input {...getInputProps()} />

        <CloudUpload
          sx={{
            fontSize: 64,
            color: isDragActive ? (isDark ? "#64b5f6" : "#1976d2") : "text.secondary",
            mb: 2,
            transition: "color 0.3s ease",
          }}
        />

        <Typography
          variant="h6"
          fontWeight="bold"
          gutterBottom
          sx={{
            color: isDragActive ? (isDark ? "#64b5f6" : "#1976d2") : "text.primary",
            transition: "color 0.3s ease",
          }}
        >
          {isDragActive ? "Suelta el archivo aquí" : "Arrastra tu archivo Excel aquí"}
        </Typography>

        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
          o haz clic para seleccionar el archivo
        </Typography>

        <Chip
          label="Solo archivos .xlsx"
          size="small"
          variant="outlined"
          sx={{
            fontWeight: "medium",
            borderColor: isDark ? "#4A4063" : "#e0e0e0",
          }}
        />
      </Paper>

      {/* File List */}
      {files.length > 0 && (
        <Box sx={{ mt: 3 }}>
          <Typography variant="subtitle2" fontWeight="bold" gutterBottom color="text.primary">
            Archivo Seleccionado:
          </Typography>

          <Paper
            elevation={isDark ? 2 : 1}
            sx={{
              bgcolor: isDark ? "#3A3356" : "#f8f9fa",
              border: isDark ? "1px solid #4A4063" : "1px solid #e0e0e0",
              borderRadius: 2,
              overflow: "hidden",
            }}
          >
            <List disablePadding>
              {files.map((file, index) => (
                <ListItem
                  key={index}
                  sx={{
                    py: 2,
                    "&:hover": {
                      bgcolor: isDark ? alpha("#64b5f6", 0.05) : alpha("#1976d2", 0.02),
                    },
                  }}
                >
                  <Box display="flex" alignItems="center" gap={2} flex={1}>
                    <InsertDriveFile
                      sx={{
                        color: isDark ? "#66bb6a" : "#2e7d32",
                        fontSize: 32,
                      }}
                    />

                    <Box flex={1}>
                      <Typography variant="body2" fontWeight="medium" color="text.primary">
                        {file.name}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        {formatFileSize(file.size)}
                      </Typography>

                      {uploadProgress > 0 && uploadProgress < 100 && (
                        <Box sx={{ mt: 1 }}>
                          <LinearProgress
                            variant="determinate"
                            value={uploadProgress}
                            sx={{
                              height: 4,
                              borderRadius: 2,
                              bgcolor: isDark ? "#4A4063" : "#e0e0e0",
                              "& .MuiLinearProgress-bar": {
                                bgcolor: isDark ? "#64b5f6" : "#1976d2",
                              },
                            }}
                          />
                          <Typography variant="caption" color="text.secondary" sx={{ mt: 0.5 }}>
                            Subiendo... {uploadProgress}%
                          </Typography>
                        </Box>
                      )}
                    </Box>

                    <Box display="flex" alignItems="center" gap={1}>
                      {uploadProgress === 100 && <CheckCircle sx={{ color: "success.main", fontSize: 20 }} />}

                      <IconButton
                        size="small"
                        onClick={handleRemoveFile}
                        sx={{
                          color: "error.main",
                          "&:hover": {
                            bgcolor: isDark ? alpha("#f44336", 0.1) : alpha("#f44336", 0.05),
                          },
                        }}
                      >
                        <Delete fontSize="small" />
                      </IconButton>
                    </Box>
                  </Box>
                </ListItem>
              ))}
            </List>
          </Paper>
        </Box>
      )}

      {/* Información adicional */}
      <Alert
        severity="info"
        icon={<Warning />}
        sx={{
          mt: 3,
          bgcolor: isDark ? alpha("#ff9800", 0.1) : alpha("#ff9800", 0.05),
          border: `1px solid ${isDark ? alpha("#ff9800", 0.3) : alpha("#ff9800", 0.2)}`,
          borderRadius: 2,
        }}
      >
        <Typography variant="body2" fontWeight="medium">
          Tamaño máximo permitido: {formatFileSize(maxSize)}
        </Typography>
        <Typography variant="caption" color="text.secondary">
          Solo se permiten archivos Excel (.xlsx) descargados desde Epyme
        </Typography>
      </Alert>
    </Box>
  )
}
