import React from 'react'
import FormControl from '@mui/material/FormControl';
import {
    Controller,
    useFormState
} from 'react-hook-form'
import CurrencyTextField from '@lupus-ai/mui-currency-textfield'
import { useMediaQuery, useTheme } from '@mui/material';
import { BorderRight } from '@mui/icons-material';

const CustomCurrencyField = ({ name, label, Component, rules, helperText, type, req, symbol = "$", ...restProps }) => {
    const formState = useFormState()
    const theme = useTheme()
    const esPantallaChica = useMediaQuery(theme => theme.breakpoints.down('xl'))
    return (
        <Controller
            name={name}
            render={({ field: { onChange, onBlur, value, ref } }) => (
                <FormControl variant="outlined" fullWidth margin="normal" color="success"
                    error={Boolean(formState.errors && formState.errors[name])}>
                    <CurrencyTextField
                        label={label}
                        variant="outlined"
                        value={value}
                        currencySymbol={symbol}
                        outputFormat="string"
                        color="success"
                        onChange={(event, value) => onChange(value)}
                        required={req}
                        helperText={formState.errors[name] ? formState.errors[name].message : null}
                        error={Boolean(formState.errors && formState.errors[name])}
                        placeholder='0.00'
                        size={esPantallaChica ? 'small' : 'medium'}
                        InputProps={{
                            style: {
                                borderRadius:'18px'
                            },
                        }}
                        {...restProps}
                    />
                </FormControl>
            )}
            rules={rules}
        />
    )
}

export default CustomCurrencyField