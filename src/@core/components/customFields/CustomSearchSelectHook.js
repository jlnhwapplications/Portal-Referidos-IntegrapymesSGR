import React from 'react'
import FormControl from '@mui/material/FormControl';
import { FormHelperText, useMediaQuery, useTheme, alpha } from '@mui/material';
import GlobalStyles from '@mui/material/GlobalStyles';
import {
    Controller,
    useFormState
} from 'react-hook-form'
import Autocomplete from '@mui/material/Autocomplete';
import TextField from '@mui/material/TextField';
import CircularProgress from '@mui/material/CircularProgress';

const CustomSearchSelectHook = ({ name, lab, value, helperText, rules, options, ultimaOpcion, req, ...restProps }) => {
    // const formState = useFormState()
    const [open, setOpen] = React.useState(false);
    const loading = open && options.length === 0;
    const theme = useTheme()
    const esPantallaChica = useMediaQuery(theme => theme.breakpoints.down('xl'))
    const paperSx = {
        borderRadius: 3,
        overflow: 'hidden',
        boxShadow: theme.shadows[4],
        border: `1px solid ${theme.palette.divider}`,
    }
    const thumbColor = alpha(theme.palette.text.primary, theme.palette.mode === 'dark' ? 0.5 : 0.35)
    const thumbHover = alpha(theme.palette.text.primary, theme.palette.mode === 'dark' ? 0.7 : 0.5)
    const trackColor = alpha(theme.palette.divider, theme.palette.mode === 'dark' ? 0.3 : 0.4)
    const listboxSx = {
        maxHeight: 320,
        padding: 0,
        overflowY: 'auto',
        overflowX: 'hidden',
        overscrollBehavior: 'contain',
        '& li': { padding: '8px 16px' },
        '&::-webkit-scrollbar': { width: 10, height: 10 },
        '&::-webkit-scrollbar-thumb': {
            backgroundColor: thumbColor,
            borderRadius: 8,
            border: `2px solid ${trackColor}`,
        },
        '&::-webkit-scrollbar-thumb:hover': {
            backgroundColor: thumbHover,
        },
        '&::-webkit-scrollbar-track': {
            backgroundColor: trackColor,
            borderRadius: 8,
        },
        scrollbarWidth: 'thin',
        scrollbarColor: `${thumbColor} ${trackColor}`,
    }

    React.useEffect(() => {
        let active = true;
        if (!loading) {
            return undefined;
        }
        return () => {
            active = false;
        };
    }, [loading]);

    return (
        <>
        <GlobalStyles styles={(theme) => {
            const thumbColor = alpha(theme.palette.text.primary, theme.palette.mode === 'dark' ? 0.5 : 0.35)
            const thumbHover = alpha(theme.palette.text.primary, theme.palette.mode === 'dark' ? 0.7 : 0.5)
            const trackColor = alpha(theme.palette.divider, theme.palette.mode === 'dark' ? 0.3 : 0.4)
            return {
                '.MuiAutocomplete-paper': {
                    borderRadius: 3,
                    overflow: 'hidden',
                    boxShadow: theme.shadows[4],
                    border: `1px solid ${theme.palette.divider}`,
                },
                '.MuiAutocomplete-listbox': {
                    maxHeight: 320,
                    padding: 0,
                    overflowY: 'auto',
                    overflowX: 'hidden',
                    overscrollBehavior: 'contain',
                    '& li': { padding: '8px 16px' },
                    '&::-webkit-scrollbar': { width: 10, height: 10 },
                    '&::-webkit-scrollbar-thumb': {
                        backgroundColor: thumbColor,
                        borderRadius: 8,
                        border: `2px solid ${trackColor}`,
                    },
                    '&::-webkit-scrollbar-thumb:hover': { backgroundColor: thumbHover },
                    '&::-webkit-scrollbar-track': { backgroundColor: trackColor, borderRadius: 8 },
                    // Oculta flechas de arriba/abajo del scrollbar en WebKit
                    '&::-webkit-scrollbar-button': {
                        width: 0,
                        height: 0,
                        display: 'none',
                    },
                    scrollbarWidth: 'thin',
                    scrollbarColor: `${thumbColor} ${trackColor}`,
                },
            }
        }} />
        <Autocomplete
            open={open}
            onOpen={() => { setOpen(true) }}
            onClose={() => { setOpen(false) }}
            loading={loading}
            loadingText="Cargando..."
            options={options}
            getOptionSelected={(option) => option.value === value.value}
            getOptionLabel={(option) => option.label}
            color="success"
            fullWidth
            size={esPantallaChica ? 'small' : 'medium'}
            slotProps={{
                paper: { sx: paperSx },
                listbox: { sx: listboxSx },
                popper: { sx: { zIndex: 1300 } },
            }}
            componentsProps={{
                paper: { sx: paperSx },
                listbox: { sx: listboxSx },
                popper: { sx: { zIndex: 1300 } },
            }}
            renderInput={(params) => (
                <TextField
                    {...params}
                    label={lab}
                    color="success"
                    variant="standard"
                    // error={Boolean(formState.errors && formState.errors[name])}
                    required={req}
                    InputProps={{
                        ...params.InputProps,
                        endAdornment: (
                            <React.Fragment>
                                {loading ? <CircularProgress color="inherit" size={20} /> : null}
                                {params.InputProps.endAdornment}
                            </React.Fragment>
                        ),
                    }}
                />
            )}
        />
        </>
    )
}

export default CustomSearchSelectHook
