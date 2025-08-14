import { createContext, useContext, useState, useCallback } from "react";
import {
  Snackbar,
  Alert,
  AlertTitle,
  IconButton,
  Box,
  Typography,
  LinearProgress,
  Slide,
  useTheme,
  alpha,
} from "@mui/material";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import ErrorIcon from "@mui/icons-material/Error";
import WarningIcon from "@mui/icons-material/Warning";
import InfoIcon from "@mui/icons-material/Info";
import CloseIcon from "@mui/icons-material/Close";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import DownloadIcon from "@mui/icons-material/Download";
import EmailIcon from "@mui/icons-material/Email";
import SecurityIcon from "@mui/icons-material/Security";
import { Close } from "@mui/icons-material";

const ToastContext = createContext();

const toastIcons = {
  success: CheckCircleIcon,
  error: ErrorIcon,
  warning: WarningIcon,
  info: InfoIcon,
  upload: CloudUploadIcon,
  download: DownloadIcon,
  email: EmailIcon,
  security: SecurityIcon,
};

const SlideTransition = (props) => {
  return <Slide {...props} direction="down" />;
};

export const ToastProvider = ({ children }) => {
  const [toasts, setToasts] = useState([]);
  const theme = useTheme();

  const addToast = useCallback((toast) => {
    const id = Date.now() + Math.random();
    const newToast = {
      id,
      autoHideDuration: 3000,
      ...toast,
    };
    setToasts((prev) => [...prev, newToast]);

    if (newToast.autoHideDuration > 0) {
      setTimeout(() => {
        removeToast(id);
      }, newToast.autoHideDuration);
    }

    return id;
  }, []);

  const removeToast = useCallback((id) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id));
  }, []);

  const updateToast = useCallback((id, updates) => {
    setToasts((prev) =>
      prev.map((toast) => (toast.id === id ? { ...toast, ...updates } : toast))
    );
  }, []);

  const toast = {
    success: (message, options = {}) =>
      addToast({
        type: "success",
        message,
        title: "¡Éxito!",
        ...options,
      }),

    error: (message, options = {}) =>
      addToast({
        type: "error",
        message,
        title: "Error",
        autoHideDuration: 6000,
        ...options,
      }),

    warning: (message, options = {}) =>
      addToast({
        type: "warning",
        message,
        title: "Advertencia",
        ...options,
      }),

    info: (message, options = {}) =>
      addToast({
        type: "info",
        message,
        title: "Información",
        ...options,
      }),

    upload: (message, options = {}) =>
      addToast({
        type: "upload",
        message,
        title: "Carga de archivo",
        severity: "info",
        ...options,
      }),

    download: (message, options = {}) =>
      addToast({
        type: "download",
        message,
        title: "Descarga",
        severity: "success",
        ...options,
      }),

    email: (message, options = {}) =>
      addToast({
        type: "email",
        message,
        title: "Email",
        severity: "info",
        ...options,
      }),

    loading: (message, options = {}) =>
      addToast({
        type: "info",
        message,
        title: "Procesando...",
        showProgress: true,
        autoHideDuration: 0,
        ...options,
      }),

    promise: async (promise, messages) => {
      const loadingId = addToast({
        type: "info",
        message: messages.loading || "Procesando...",
        title: "Cargando",
        showProgress: true,
        autoHideDuration: 0,
      });

      try {
        const result = await promise;
        removeToast(loadingId);
        addToast({
          type: "success",
          message: messages.success || "Operación completada",
          title: "¡Éxito!",
        });
        return result;
      } catch (error) {
        removeToast(loadingId);
        // Obtener mensaje del error (Axios)
        let errorMessage = messages.error || "Ocurrió un error";
        if (error?.response?.data) {
          errorMessage = error.response.data.trim();
        } else if (error?.message) {
          errorMessage = error.message;
        }
        addToast({
          type: "error",
          message: errorMessage || "Ocurrió un error",
          title: "Error",
        });
        throw error;
      }
    },
  };

  return (
    <ToastContext.Provider value={{ toast, removeToast, updateToast }}>
      {children}
      {toasts.map((toastItem) => (
        <ToastComponent
          key={toastItem.id}
          toast={toastItem}
          onClose={() => removeToast(toastItem.id)}
          toasts={toasts}
        />
      ))}
    </ToastContext.Provider>
  );
};

const ToastComponent = ({ toast, onClose, toasts }) => {
  const theme = useTheme();
  const IconComponent =
    toastIcons[toast.type] || toastIcons[toast.severity || "info"];

  const getSeverityColor = () => {
    if (toast.severity) return toast.severity;
    switch (toast.type) {
      case "success":
      case "upload":
      case "download":
        return "success";
      case "error":
        return "error";
      case "warning":
        return "warning";
      default:
        return "info";
    }
  };

  return (
    <Snackbar
      open={true}
      anchorOrigin={{ vertical: "top", horizontal: "right" }}
      TransitionComponent={SlideTransition}
      sx={{
        "& .MuiSnackbar-root": {
          top: `${toasts.indexOf(toast) * 80 + 24}px !important`,
        },
      }}
    >
      <Alert
        severity={getSeverityColor()}
        variant="filled"
        onClose={onClose}
        sx={{
          minWidth: 400,
          maxWidth: 500,
          borderRadius: 2,
          boxShadow: theme.shadows[8],
          "& .MuiAlert-icon": {
            fontSize: "1.5rem",
          },
          "& .MuiAlert-message": {
            width: "100%",
          },
          "& .MuiAlert-action": {
            alignItems: "flex-start",
            pt: 0.5,
          },
        }}
        icon={<IconComponent />}
        action={
          <IconButton
            size="small"
            onClick={onClose}
            sx={{
              color: "inherit",
              opacity: 0.8,
              "&:hover": {
                opacity: 1,
                backgroundColor: alpha(theme.palette.common.white, 0.1),
              },
            }}
          >
            <Close fontSize="small" />
          </IconButton>
        }
      >
        <Box>
          {toast.title && (
            <AlertTitle sx={{ mb: 0.5, fontWeight: 600, fontSize: "0.95rem" }}>
              {toast.title}
            </AlertTitle>
          )}
          <Typography variant="body2" sx={{ lineHeight: 1.4 }}>
            {toast.message}
          </Typography>

          {toast.showProgress && (
            <Box sx={{ mt: 1 }}>
              <LinearProgress
                sx={{
                  height: 3,
                  borderRadius: 1.5,
                  backgroundColor: alpha(theme.palette.common.white, 0.2),
                  "& .MuiLinearProgress-bar": {
                    backgroundColor: theme.palette.common.white,
                  },
                }}
              />
            </Box>
          )}

          {toast.actions && (
            <Box sx={{ mt: 1.5, display: "flex", gap: 1 }}>
              {toast.actions.map((action, index) => (
                <Typography
                  key={index}
                  variant="body2"
                  sx={{
                    cursor: "pointer",
                    textDecoration: "underline",
                    fontWeight: 500,
                    "&:hover": {
                      opacity: 0.8,
                    },
                  }}
                  onClick={action.onClick}
                >
                  {action.label}
                </Typography>
              ))}
            </Box>
          )}
        </Box>
      </Alert>
    </Snackbar>
  );
};

export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error("useToast must be used within a ToastProvider");
  }
  return context;
};
