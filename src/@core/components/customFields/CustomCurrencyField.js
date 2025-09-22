import React from 'react'
import FormControl from '@mui/material/FormControl';
import { Box, Typography } from '@mui/material';
import {
    Controller,
    useFormState
} from 'react-hook-form'
import CurrencyTextField from '@lupus-ai/mui-currency-textfield'
import { useMediaQuery, useTheme } from '@mui/material';
import { BorderRight } from '@mui/icons-material';

const CustomCurrencyField = ({ name, label, Component, rules, helperText, type, req, symbol = "$", labelPlacement = 'internal', ...restProps }) => {
    const formState = useFormState()
    const theme = useTheme()
    const esPantallaChica = useMediaQuery(theme => theme.breakpoints.down('xl'))
    const hasError = Boolean(formState.errors && formState.errors[name])
    const isRequired = req === true || req === 'true'
    return (
        <Controller
            name={name}
            render={({ field: { onChange, onBlur, value, ref } }) => (
                <FormControl
                    variant="outlined"
                    fullWidth
                    margin={labelPlacement === 'external' ? 'none' : 'normal'}
                    required={isRequired}
                    error={hasError}
                    sx={{
                        ...(labelPlacement === 'internal' && isRequired
                            ? {
                                  '& .MuiFormLabel-asterisk, & .MuiInputLabel-asterisk': {
                                      color: theme.palette.error.main,
                                  },
                              }
                            : {}),
                    }}
                >
                    {label && labelPlacement === 'external' && (
                        <Typography
                            fontWeight="medium"
                            color="text.primary"
                            gutterBottom
                            sx={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: 0.5,
                                mb: 1,
                                fontSize: { xs: 12, xl: 14 }
                            }}
                        >
                            {label}
                            {isRequired && (
                                <Typography component="span" color="error.main" sx={{ fontSize: '1rem' }}>
                                    *
                                </Typography>
                            )}
                        </Typography>
                    )}
                    <CurrencyTextField
                        label={labelPlacement === 'internal' ? label : undefined}
                        variant="outlined"
                        value={value}
                        currencySymbol={symbol}
                        outputFormat="string"
                        onChange={(event, val) => onChange(val)}
                        required={isRequired}
                        helperText={labelPlacement === 'internal' ? (hasError ? formState.errors[name]?.message : helperText) : undefined}
                        error={hasError}
                        InputLabelProps={labelPlacement === 'internal' ? { sx: { '& .MuiFormLabel-asterisk, & .MuiInputLabel-asterisk': { color: 'error.main' } } } : undefined}
                        InputProps={{
                            sx: {
                                borderRadius: 3,
                                '& .MuiOutlinedInput-notchedOutline': {
                                    borderRadius: 3,
                                },
                            }
                        }}
                        placeholder='0.00'
                        size={esPantallaChica ? 'small' : 'medium'}
                        sx={{
                            ...(labelPlacement === 'internal' && isRequired ? {
                                '& .MuiFormLabel-asterisk, & .MuiInputLabel-asterisk': {
                                    color: 'error.main',
                                }
                            } : {})
                        }}
                        {...restProps}
                    />
                    {labelPlacement === 'external' && (hasError || helperText) && (
                        <Typography
                            variant="caption"
                            color={hasError ? 'error.main' : 'text.secondary'}
                            sx={{ mt: 0.5, display: 'block' }}
                        >
                            {hasError ? formState.errors[name]?.message : helperText}
                        </Typography>
                    )}
                </FormControl>
            )}
            rules={rules}
        />
    )
}

export default CustomCurrencyField
