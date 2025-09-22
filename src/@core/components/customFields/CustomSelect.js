import React from 'react'
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import { FormHelperText, useMediaQuery, useTheme } from '@mui/material';
import Select from '@mui/material/Select';
import {
    Controller,
    useFormState
} from 'react-hook-form'

const CustomSelect = ({ name, label, value, helperText, options, rules, variant = "outlined", required, ...restProps }) => {
    const formState = useFormState()
    const theme = useTheme()
    const esPantallaChica = useMediaQuery(theme => theme.breakpoints.down('xl'))
    const labelId = `${name}-label`
    const selectId = `${name}-select`

    const labelBackground = theme.palette.background.paper

    return (
        <Controller
            name={name}
            render={({ field: { onChange, onBlur, value, ref } }) => (
                <FormControl required={required} variant={variant} fullWidth margin="normal" error={Boolean(formState.errors && formState.errors[name])}>
                    <InputLabel
                        id={labelId}
                        shrink
                        required
                        sx={{
                            color: theme.palette.text.primary,
                            // backgroundColor: labelBackground,
                            px: 0.75,
                            '& .MuiFormLabel-asterisk': {
                                color: theme.palette.error.dark,
                            },
                        }}
                    >{label}</InputLabel>
                    <Select
                        id={selectId}
                        labelId={labelId}
                        value={value}
                        error={Boolean(formState.errors && formState.errors[name])}
                        label={label}
                        notched={Boolean(label)}
                        onChange={onChange}
                        onBlur={onBlur}
                        fullWidth
                        inputRef={ref}
                        sx={{
                            borderRadius: 3,
                        }}
                        size={esPantallaChica ? 'small' : 'medium'}
                        {...restProps}
                    >
                        {options?.map((option) => (
                            <MenuItem key={option.value} value={option.value}>
                                {option.label}
                            </MenuItem>
                        ))}
                    </Select>
                    <FormHelperText>{formState.errors[name] ? helperText : null}</FormHelperText>
                </FormControl>
            )}
            rules={rules}
        />
    )
}

export default CustomSelect
