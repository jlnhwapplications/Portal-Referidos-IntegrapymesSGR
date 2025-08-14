import React from 'react';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import { FormHelperText } from '@mui/material';
import Select from '@mui/material/Select';
import Checkbox from '@mui/material/Checkbox'; // Importa el componente Checkbox
import { Controller, useFormState } from 'react-hook-form';

const CustomSelectMultiple = ({ name, label, value, helperText, options, rules, variant = "outlined", ...restProps }) => {
  const formState = useFormState();

  return (
    <Controller
      name={name}
      render={({ field: { onChange, onBlur, value, ref } }) => (
        <FormControl variant={variant} fullWidth margin="normal" color="success" error={Boolean(formState.errors && formState.errors[name])}>
          <InputLabel id="demo-simple-select-error-label">{label}</InputLabel>
          <Select
            labelId="demo-simple-select-error-label"
            id="demo-simple-select-error"
            value={value || []} // Asegura que el valor sea un array
            color="success"
            error={Boolean(formState.errors && formState.errors[name])}
            label={label}
            onChange={onChange}
            onBlur={onBlur}
            fullWidth
            multiple // Permite la selección múltiple
            sx={{
              "& .MuiOutlinedInput-root": {
                borderRadius: 3,
              },
            }}
            renderValue={(selected) => (
              <div>
                {selected.map((value) => (
                  <span key={value}>{options.find((option) => option.value === value)?.label}, </span>
                ))}
              </div>
            )}
            {...restProps}
          >
            {options.map((option) => (
              <MenuItem key={option.value} value={option.value}>
                <Checkbox checked={value?.includes(option.value)} color='secondary' /> {/* Agrega un Checkbox */}
                {option.label}
              </MenuItem>
            ))}
          </Select>
          <FormHelperText>{formState.errors[name] ? helperText : null}</FormHelperText>
        </FormControl>
      )}
      rules={rules}
    />
  );
};

export default CustomSelectMultiple;