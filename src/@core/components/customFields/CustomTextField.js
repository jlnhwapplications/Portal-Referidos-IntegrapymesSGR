import { InputAdornment, useMediaQuery, useTheme } from "@mui/material";
import React from "react";
import { Controller, useFormState } from "react-hook-form";
import Icon from 'src/@core/components/icon'

const CustomTextField = ({
  name,
  label,
  Component,
  rules,
  helperText,
  type,
  req,
  rows = 1,
  readOnly = false,
  endAdornment,
  startAdornment,
  disabled = false,
  inputLabelProps = true,
  iconoClose = false,
  ...restProps
}) => {
  const formState = useFormState();
  const theme = useTheme()
  const esPantallaChica = useMediaQuery(theme => theme.breakpoints.down('xl'))
  return (
    <Controller
      name={name}
      render={({ field: { onChange, onBlur, value, ref } }) => (
        <Component
          margin="normal"
          type={type}
          onChange={onChange}
          onBlur={onBlur}
          value={value}
          rows={rows}
          ref={ref}
          error={Boolean(formState.errors && formState.errors[name])}
          helperText={formState.errors[name] ? helperText : null}
          label={label}
          variant="outlined"
          fullWidth
          required={req}
          multiline={restProps.multiline}
          disabled={disabled}
          size={esPantallaChica ? 'small' : 'medium'}
          sx={{
            borderRadius: 3,
            "& .MuiOutlinedInput-root": {
              borderRadius: 3,
            },
          }}
          {...restProps}
          InputProps={{
            readOnly: readOnly,
            endAdornment,
            startAdornment: startAdornment,
            endAdornment: (
              <InputAdornment position="end">
                {iconoClose && <Icon icon='clarity:lock-solid' />}
              </InputAdornment>
            ),
          }}
          InputLabelProps={{
            shrink: inputLabelProps,
            sx: {
              "& .MuiOutlinedInput-root": {
                borderRadius: 4,
              },
              color: theme.palette.text.primary,
              "& .MuiFormLabel-asterisk": {
                color: theme.palette.error.dark,
              },
            },
          }
          }
        />
      )}
      rules={rules}
    />
  );
};

export default CustomTextField;
