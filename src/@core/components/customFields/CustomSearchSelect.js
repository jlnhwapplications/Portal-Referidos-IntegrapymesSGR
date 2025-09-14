import { FormHelperText, useMediaQuery, useTheme, alpha } from "@mui/material";
import GlobalStyles from "@mui/material/GlobalStyles";
import Autocomplete from "@mui/material/Autocomplete";
import CircularProgress from "@mui/material/CircularProgress";
import FormControl from "@mui/material/FormControl";
import TextField from "@mui/material/TextField";
import React, { useContext } from "react";
import { Controller, useFormState } from "react-hook-form";

const CustomSearchSelect = ({
  name,
  lab,
  value,
  helperText,
  rules,
  options,
  ultimaOpcion,
  placeholder,
  handleChange = null,
  disabled = false,
  req = false,
  variant = "outlined",
  ...restProps
}) => {
  const formState = useFormState();
  const control = formState ? formState.control : null;
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
    '& li': { padding: theme.spacing(1, 2) },
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
    <Controller
      name={name}
      control={control}
      render={({ field: { onChange, onBlur, value, ref, ...field } }) => (
        <FormControl
          variant={variant}
          fullWidth
          margin="normal"
          color="success"
          error={Boolean(formState.errors && formState.errors[name])}
        >
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
                '& li': { padding: theme.spacing(1, 2) },
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
            disabled={disabled}
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
            isOptionEqualToValue={(option, value) => option.value === value.value}
            onOpen={() => {
              setOpen(true);
            }}
            onClose={() => {
              setOpen(false);
            }}
            value={value || ""}
            loading={loading}
            loadingText="Cargando..."
            options={options}
            getOptionSelected={(option, value) => option.value === value}
            getOptionLabel={(option) => option.label || ""}
            onChange={(_, data) => {
              onChange(data);
              handleChange && handleChange(data);
            }}
            onBlur={onBlur}
            fullWidth
            size={esPantallaChica ? 'small' : 'medium'}
            sx={{
              "& .MuiOutlinedInput-root": {
                borderRadius: 3,
              },
              "& .MuiOutlinedInput-notchedOutline": {
                borderRadius: 3,
              },
              "& .MuiAutocomplete-paper": {
                borderRadius: 3,
                overflow: 'hidden',
              },
            }}
            renderInput={(params) => (
              <TextField
                {...params}
                label={lab}
                variant="outlined"
                error={Boolean(formState.errors && formState.errors[name])}
                required={req}
                placeholder={placeholder}
                sx={{
                  // Asegura el borde redondeado del input outlined
                  '& .MuiOutlinedInput-root': {
                    borderRadius: 3,
                  },
                  '& .MuiOutlinedInput-notchedOutline': {
                    borderRadius: 3,
                  },
                  '& fieldset': {
                    borderRadius: 3,
                  },
                  // Evita que el borde corte el label cuando está shrink
                  '& .MuiInputLabel-root': {
                    zIndex: 1,
                    '&.MuiInputLabel-shrink': {
                      px: 0.5,
                      // backgroundColor: theme.palette.background.paper,
                      display: 'inline-block',
                    },
                    '& .MuiFormLabel-asterisk': {
                      color: theme.palette.error.dark,
                    },
                  },
                }}
                InputProps={{
                  ...params.InputProps,
                  notched: true,
                  endAdornment: (
                    <React.Fragment>
                      {loading ? <CircularProgress color="inherit" size={20} /> : null}
                      {params.InputProps.endAdornment}
                    </React.Fragment>
                  ),
                }}
                InputLabelProps={{
                  shrink: true,
                  sx: {
                    color: theme.palette.text.primary,
                  },
                }}
              />
            )}
          />
          <FormHelperText>{formState.errors[name] ? helperText : null}</FormHelperText>
        </FormControl>
      )}
      rules={rules}
      {...restProps}
    />
  );
};

export default CustomSearchSelect;
