import React from 'react'
import FormControl from '@mui/material/FormControl';
import { FormHelperText, useMediaQuery } from '@mui/material';
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
    const esPantallaChica = useMediaQuery(theme => theme.breakpoints.down('xl'))

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
    )
}

export default CustomSearchSelectHook