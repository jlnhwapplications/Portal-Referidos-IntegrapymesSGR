import React from "react";
import { Controller, useFormState } from "react-hook-form";
import { FormControl, TextField, useTheme } from "@mui/material";
import { AdapterMoment } from "@mui/x-date-pickers/AdapterMoment";
import "moment/locale/es";
import { DesktopDatePicker } from "@mui/x-date-pickers/DesktopDatePicker";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import moment from "moment/moment";

const CustomDateField = ({ name, label, rules, helperText, req = false, ...restProps }) => {
  const formState = useFormState();
  const theme = useTheme()
  
  return (
    <Controller
      name={name}
      render={({ field: { ref, onBlur, name, value, ...field }, fieldState }) => {
        const formattedValue = value ? moment(value).format("YYYY-MM-DD") : "";

        return (
          <FormControl variant="outlined" fullWidth margin="normal" color="success">
            <LocalizationProvider dateAdapter={AdapterMoment} adapterLocale="es">
              <DesktopDatePicker
                {...field}
                value={value || null}
                inputRef={ref}
                label={label}
                onChange={(date) => field.onChange(date)}
                renderInput={(inputProps) => (
                  <TextField
                    {...inputProps}
                    onBlur={onBlur}
                    type="date"
                    name={name}
                    error={Boolean(formState.errors && formState.errors[name])}
                    helperText={formState.errors[name] ? helperText : null}
                    required={req}
                    {...restProps}
                    value={formattedValue} // Use formattedValue for the text field value
                    InputLabelProps={{
                      sx: {
                        color: theme.palette.text.primary,
                        "& .MuiFormLabel-asterisk": {
                          color: theme.palette.error.dark,
                        },
                      },
                    }}
                  />
                )}
              />
            </LocalizationProvider>
          </FormControl>
        );
      }}
      rules={rules}
    />
  );
};

export default CustomDateField;
