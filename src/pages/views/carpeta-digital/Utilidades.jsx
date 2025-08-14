import React, { useState } from "react";
// import { Tooltip, Typography, IconButton, Box, ButtonGroup } from "@mui/material";
import Icon from "src/@core/components/icon";
import ModalCarpetaDigital from "@/pages/carpeta-digital/ModalCarpetaDigital";
// import { useTheme } from "@mui/material/styles";

import {
  IconButton,
  Tooltip,
  Typography,
  ButtonGroup,
  Badge,
  useTheme,
  alpha,
  Box,
  Chip,
} from "@mui/material";
import {
  CloudUpload,
  FolderOpen,
  CloudDownload,
  HelpOutline,
} from "@mui/icons-material";

const Utilidades = ({ utilidad, onOpenModal }) => {
  const theme = useTheme();
  const isDark = theme.palette.mode === "dark";

  const buttonStyle = {
    width: 36,
    height: 36,
    borderRadius: 1.5,
    transition: "all 0.2s ease",
    "&:hover": {
      transform: "scale(1.1)",
    },
  };

  return (
    <>
      <ButtonGroup
        variant="outlined"
        size="small"
        sx={{
          "& .MuiButtonGroup-grouped": {
            minWidth: "auto",
            border: `1px solid ${isDark ? "#4A4063" : "#e0e0e0"}`,
            "&:hover": {
              borderColor: theme.palette.primary.main,
              bgcolor: alpha(theme.palette.primary.main, 0.1),
            },
          },
        }}
      >
        {/* Upload */}
        <Tooltip title="Subir Archivo" arrow>
          <IconButton
            onClick={(e) => {
              debugger;
              if (typeof onOpenModal === "function") {
                onOpenModal(e);
              }
            }}
            sx={buttonStyle}
          >
            <CloudUpload fontSize="small" />
          </IconButton>
        </Tooltip>

        {/* Folder */}
        {utilidad?.utilidad?.new_vinculocompartido && (
          <Tooltip title="Abrir Carpeta" arrow>
            <Badge badgeContent="✓" color="success" variant="dot">
              <IconButton
                onClick={() =>
                  window.open(utilidad.utilidad.new_vinculocompartido, "_blank")
                }
                sx={buttonStyle}
              >
                <FolderOpen fontSize="small" />
              </IconButton>
            </Badge>
          </Tooltip>
        )}

        {/* Download */}
        {utilidad?.utilidad?.new_urlplantilla && (
          <Tooltip title="Descargar Plantilla" arrow>
            <IconButton
              onClick={() =>
                window.open(utilidad.utilidad.new_urlplantilla, "_blank")
              }
              sx={buttonStyle}
            >
              <CloudDownload fontSize="small" />
            </IconButton>
          </Tooltip>
        )}

        {/* Help */}
        {utilidad?.utilidad?.new_descripcion && (
          <Tooltip
            title={
              <Typography variant="body2" sx={{ maxWidth: 200 }}>
                {utilidad.utilidad.new_descripcion}
              </Typography>
            }
            arrow
          >
            <IconButton sx={buttonStyle} onClick={(e) => e.stopPropagation()}>
              <HelpOutline fontSize="small" />
            </IconButton>
          </Tooltip>
        )}
      </ButtonGroup>
    </>
  );
};

export default Utilidades;
