import { useState, Fragment, useContext, useEffect, useCallback, useMemo } from 'react'
import { useRouter } from "next/router"
import {
  Box,
  Badge,
  Button,
  IconButton,
  useMediaQuery,
  Menu,
  MenuItem,
  Typography,
  Divider,
  List,
  ListItem,
  ListItemText,
  Stack,
  Tab,
  Tabs,
  Fade,
  Skeleton,
  Chip,
  useTheme,
  alpha,
  Tooltip,
  Paper
} from '@mui/material'
import { LoadingButton } from '@mui/lab'
import { useDispatch, useSelector } from 'react-redux'

// Icons
import {
  NotificationsOutlined,
  CheckCircleOutline,
  LaunchOutlined,
  InboxOutlined,
  TaskAltOutlined
} from '@mui/icons-material'

// Custom hooks and context
import useGetNotificaciones from '@/hooks/useGetNotificaciones'
import { inactivarTarea, obtenerTareas } from '@/redux/Cuenta'
import { AuthContext } from '@/context/AuthContext'

// Styled components with modern design
const StyledMenu = ({ children, ...props }) => (
  <Menu
    {...props}
    PaperProps={{
      elevation: 8,
      sx: {
        width: 420,
        maxWidth: '95vw',
        borderRadius: 3,
        mt: 1,
        overflow: 'hidden',
        border: '1px solid',
        borderColor: 'divider',
        '& .MuiList-root': {
          padding: 0,
        },
      },
    }}
    transformOrigin={{ horizontal: 'right', vertical: 'top' }}
    anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
  >
    {children}
  </Menu>
)

// Empty state component
const EmptyState = ({ type }) => {
  const theme = useTheme()

  return (
    <div>
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          py: 6,
          px: 3,
          textAlign: 'center',
        }}
      >
        <Box
          sx={{
            width: 80,
            height: 80,
            borderRadius: '50%',
            backgroundColor: alpha(theme.palette.primary.main, 0.1),
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            mb: 2,
          }}
        >
          {type === 'pending' ? (
            <InboxOutlined sx={{ fontSize: 40, color: 'primary.main' }} />
          ) : (
            <TaskAltOutlined sx={{ fontSize: 40, color: 'success.main' }} />
          )}
        </Box>
        <Typography variant="h6" sx={{ mb: 1, fontWeight: 600 }}>
          {type === 'pending' ? 'Todo al día' : 'Historial vacío'}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          {type === 'pending'
            ? 'No tienes notificaciones pendientes'
            : 'No hay notificaciones completadas'}
        </Typography>
      </Box>
    </div>
  )
}

// Notification item component
const NotificationItem = ({
  notification,
  onMarkAsRead,
  onNavigate,
  isLoading
}) => {
  const theme = useTheme()

  return (
    <div>
      <ListItem
        sx={{
          flexDirection: 'column',
          alignItems: 'stretch',
          py: 2.5,
          px: 3,
          borderBottom: '1px solid',
          borderColor: 'divider',
          '&:hover': {
            backgroundColor: alpha(theme.palette.primary.main, 0.02),
          },
        }}
      >
        <Box sx={{ mb: 1.5 }}>
          <Stack direction="row" justifyContent="space-between" alignItems="flex-start" spacing={2}>
            <Typography
              variant="subtitle2"
              sx={{
                fontWeight: 600,
                lineHeight: 1.3,
                flex: 1,
              }}
            >
              {notification.title}
            </Typography>
            <Typography
              variant="caption"
              color="text.secondary"
              sx={{
                whiteSpace: 'nowrap',
                fontSize: '0.75rem',
              }}
            >
              {notification.createdAt}
            </Typography>
          </Stack>
        </Box>

        <Typography
          variant="body2"
          color="text.secondary"
          sx={{
            mb: 2,
            lineHeight: 1.4,
          }}
        >
          {notification.description}
        </Typography>

        {notification.statecode === 0 && (
          <Stack direction="row" spacing={1.5}>
            <Button
              size="small"
              variant="outlined"
              startIcon={<LaunchOutlined />}
              onClick={() => onNavigate(notification.type_value)}
              sx={{
                borderRadius: 2,
                textTransform: 'none',
                fontWeight: 500,
              }}
            >
              Ver detalles
            </Button>
            <LoadingButton
              size="small"
              variant="contained"
              loading={isLoading}
              startIcon={<CheckCircleOutline />}
              onClick={() => onMarkAsRead(notification.id)}
              sx={{
                borderRadius: 2,
                textTransform: 'none',
                fontWeight: 500,
              }}
            >
              Marcar como leído
            </LoadingButton>
          </Stack>
        )}
      </ListItem>
    </div>
  )
}

// Loading skeleton
const NotificationSkeleton = () => (
  <ListItem sx={{ py: 2.5, px: 3 }}>
    <Box sx={{ width: '100%' }}>
      <Stack direction="row" justifyContent="space-between" sx={{ mb: 1 }}>
        <Skeleton variant="text" width="70%" height={20} />
        <Skeleton variant="text" width="20%" height={16} />
      </Stack>
      <Skeleton variant="text" width="100%" height={16} sx={{ mb: 2 }} />
      <Stack direction="row" spacing={1}>
        <Skeleton variant="rectangular" width={120} height={32} sx={{ borderRadius: 2 }} />
        <Skeleton variant="rectangular" width={140} height={32} sx={{ borderRadius: 2 }} />
      </Stack>
    </Box>
  </ListItem>
)

const NotificationDropdown = ({ settings }) => {
  const theme = useTheme()
  const dispatch = useDispatch()
  const router = useRouter()
  const { token, referido } = useContext(AuthContext)
  const { notificaciones, loading } = useGetNotificaciones()
  const inactivarTareaSelector = useSelector(store => store.cuenta.inactivarTarea)

  const [anchorEl, setAnchorEl] = useState(null)
  const [activeTab, setActiveTab] = useState(0)
  const [loadingIds, setLoadingIds] = useState(new Set())

  const isMobile = useMediaQuery(theme.breakpoints.down('sm'))
  const isOpen = Boolean(anchorEl)

  // Memoized filtered notifications
  const { pendingNotifications, completedNotifications, totalPending } = useMemo(() => {
    if (!notificaciones) return { pendingNotifications: [], completedNotifications: [], totalPending: 0 }

    const pending = notificaciones.filter(item => item.statecode === 0)
    const completed = notificaciones.filter(item => item.statecode === 1)

    return {
      pendingNotifications: pending,
      completedNotifications: completed,
      totalPending: pending.length,
    }
  }, [notificaciones])

  const handleDropdownOpen = useCallback((event) => {
    setAnchorEl(event.currentTarget)
  }, [])

  const handleDropdownClose = useCallback(() => {
    setAnchorEl(null)
  }, [])

  const handleTabChange = useCallback((_, newValue) => {
    setActiveTab(newValue)
  }, [])

  const handleMarkAsRead = useCallback((id) => {
    setLoadingIds(prev => new Set(prev).add(id))
    dispatch(inactivarTarea(id, token))
  }, [dispatch, token])

  const handleNavigate = useCallback((type) => {
    const routes = {
      100000006: '/perfil',
      100000000: '/carpeta-digital',
      100000001: '/lineas',
      100000002: '/garantias',
      100000004: '/perfil',
      100000003: '/operaciones',
    }

    const route = routes[type]
    if (route) {
      router.push(route)
      setTimeout(handleDropdownClose, 300)
    }
  }, [router, handleDropdownClose])

  // Handle task completion response
  useEffect(() => {
    if (inactivarTareaSelector === "EXITO") {
      setLoadingIds(new Set())
      dispatch(obtenerTareas(referido?.accountid, token))
    } else if (inactivarTareaSelector === "ERROR") {
      setLoadingIds(new Set())
    }
  }, [inactivarTareaSelector, dispatch, referido?.accountid, token])

  return (
    <Fragment>
      <Tooltip title="Notificaciones" arrow>
        <IconButton
          color="inherit"
          onClick={handleDropdownOpen}
          sx={{
            backgroundColor: alpha(theme.palette.primary.contrastText, 0.1),
            transition: 'all 0.2s ease-in-out',
            '&:hover': {
              transform: 'scale(1.05)',
            },
          }}
        >
          <Badge
            sx={{ "& .MuiBadge-badge": { fontSize: 8, height: 15, minWidth: 15 }  }}
            badgeContent={totalPending}
            color="error"
            variant={totalPending > 0 ? 'standard' : 'dot'}
            invisible={totalPending === 0}
          >
            <NotificationsOutlined />
          </Badge>
        </IconButton>
      </Tooltip>

      <StyledMenu
        anchorEl={anchorEl}
        open={isOpen}
        onClose={handleDropdownClose}
        TransitionComponent={Fade}
        transitionDuration={200}
      >
        {/* Header */}
        <Box sx={{ p: 3, pb: 0 }}>
          <Stack direction="row" justifyContent="space-between" alignItems="center">
            <Typography sx={{ fontWeight: 600, fontSize: { xs: 16, xl: 18 } }}>
              Notificaciones
            </Typography>
            {totalPending > 0 && (
              <Chip
                label={`${totalPending} nueva${totalPending !== 1 ? 's' : ''}`}
                size="small"
                color="primary"
                variant="outlined"
                sx={{
                  borderRadius: 2,
                  fontWeight: 500,
                }}
              />
            )}
          </Stack>
        </Box>

        {/* Tabs */}
        <Box sx={{ px: 3, pt: 2 }}>
          <Tabs
            value={activeTab}
            onChange={handleTabChange}
            variant="fullWidth"
            sx={{
              minHeight: 40,
              '& .MuiTab-root': {
                minHeight: 40,
                textTransform: 'none',
                fontWeight: 500,
                fontSize: '0.875rem',
              },
            }}
          >
            <Tab
              label={`Pendientes${totalPending > 0 ? ` (${totalPending})` : ''}`}
              icon={<InboxOutlined sx={{ fontSize: 18 }} />}
              iconPosition="start"
            />
            <Tab
              label={`Completadas (${completedNotifications.length})`}
              icon={<TaskAltOutlined sx={{ fontSize: 18 }} />}
              iconPosition="start"
            />
          </Tabs>
        </Box>

        <Divider sx={{ mt: 2 }} />

        {/* Content */}
        <Box sx={{ maxHeight: 400, overflow: 'hidden' }}>
          <Fragment>
            {loading ? (
              <div>
                <List sx={{ py: 0 }}>
                  {[...Array(3)].map((_, index) => (
                    <NotificationSkeleton key={index} />
                  ))}
                </List>
              </div>
            ) : (
              <div>
                <Box sx={{ overflowY: 'auto', maxHeight: 400 }}>
                  {activeTab === 0 ? (
                    pendingNotifications.length === 0 ? (
                      <EmptyState type="pending" />
                    ) : (
                      <List sx={{ py: 0 }}>
                        <Fragment>
                          {pendingNotifications.map((notification) => (
                            <NotificationItem
                              key={notification.id}
                              notification={notification}
                              onMarkAsRead={handleMarkAsRead}
                              onNavigate={handleNavigate}
                              isLoading={loadingIds.has(notification.id)}
                            />
                          ))}
                        </Fragment>
                      </List>
                    )
                  ) : (
                    completedNotifications.length === 0 ? (
                      <EmptyState type="completed" />
                    ) : (
                      <List sx={{ py: 0 }}>
                        <Fragment>
                          {completedNotifications.map((notification) => (
                            <NotificationItem
                              key={notification.id}
                              notification={notification}
                              onMarkAsRead={handleMarkAsRead}
                              onNavigate={handleNavigate}
                              isLoading={false}
                            />
                          ))}
                        </Fragment>
                      </List>
                    )
                  )}
                </Box>
              </div>
            )}
          </Fragment>
        </Box>
      </StyledMenu>
    </Fragment>
  )
}

export default NotificationDropdown
