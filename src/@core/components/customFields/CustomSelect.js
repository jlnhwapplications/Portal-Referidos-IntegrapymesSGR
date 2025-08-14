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
    return (
        <Controller
            name={name}
            render={({ field: { onChange, onBlur, value, ref } }) => (
                <FormControl required={required} variant={variant} fullWidth margin="normal" error={Boolean(formState.errors && formState.errors[name])}>
                    <InputLabel
                        required
                        sx={{
                            color: theme.palette.text.primary,
                            bottom: 3,
                            "& .MuiFormLabel-asterisk": {
                                color: theme.palette.error.dark,
                            },
                        }}
                    >{label}</InputLabel>
                    <Select
                        value={value}
                        error={Boolean(formState.errors && formState.errors[name])}
                        label={label}
                        onChange={onChange}
                        onBlur={onBlur}
                        fullWidth
                        // sx={{
                        //     borderRadius: 3,
                        // }}
                        sx={{
                            borderRadius: 3,
                            ...(esPantallaChica && {
                                "& .MuiSelect-select": {
                                    
                                }
                            })
                        }}
                        size={esPantallaChica ? 'small' : 'medium'}
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
            {...restProps}
        />
    )
}

export default CustomSelect