import React from 'react'
import { Controller, useFormState, useFormContext } from 'react-hook-form';
import { RadioGroup, FormControlLabel, Radio } from '@mui/material';

const CustomRadioGroup = ({ name, label, options, helperText, req, ...restProps }) => {
    const { control } = useFormContext(); // obtén el control de useForm
    const formState = useFormState();

    return (
        <Controller
            name={name}
            control={control} // pasa el control de useForm
            render={({ field }) => (
                <RadioGroup
                    {...field}
                    row
                    {...restProps}
                >
                    {options.map((option) => (
                        <FormControlLabel
                            key={option.value}
                            value={option.value}
                            label={option.label}
                            control={<Radio color="primary" />}
                            disabled={option.value === null && formState.isSubmitted}
                        />
                    ))}
                </RadioGroup>
            )}
        />
    );
};

export default CustomRadioGroup;