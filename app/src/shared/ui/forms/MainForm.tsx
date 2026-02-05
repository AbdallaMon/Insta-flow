import { GeneralInput } from "@/shared/utlis/types";
import {
  Box,
  FormControl,
  FormLabel,
  InputLabel,
  MenuItem,
  Select,
  SelectChangeEvent,
  TextField,
} from "@mui/material";
import { useState } from "react";
import {
  useForm,
  FieldErrors,
  UseFormRegister,
  FieldValues,
} from "react-hook-form";

export default function MainForm({
  inputs,
  onSubmitData,
}: {
  inputs: GeneralInput[];
  onSubmitData: (data: FieldValues) => void;
}) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  return (
    <Box>
      <form onSubmit={handleSubmit(onSubmitData)}>
        {inputs.map((item) => {
          const input = item.input;

          return (
            <Box key={input.id}>
              <RenderInput
                inputItem={item}
                errors={errors}
                register={register}
              />
              {errors[input.id] && (
                <span>
                  {item.pattern?.required?.message ||
                    item.pattern?.pattern?.message}
                </span>
              )}
            </Box>
          );
        })}
      </form>
    </Box>
  );
}
function RenderInput({
  inputItem,
  errors,
  register,
}: {
  inputItem: GeneralInput;
  errors: FieldErrors;
  register: UseFormRegister<FieldValues>;
}) {
  const { input, pattern } = inputItem;
  if (input.type === "text") {
    return (
      <FormControl key={input.id} error={!!errors[input.id]} fullWidth>
        <TextField
          id={input.id}
          label={input.label}
          placeholder={input.placeholder}
          {...register(input.id || "", {
            required: pattern?.required?.value,
            pattern: pattern?.pattern?.value,
          })}
          error={!!errors[input.id]}
        />
      </FormControl>
    );
  }
  if (input.type === "textarea") {
    return (
      <FormControl key={input.id} error={!!errors[input.id]} fullWidth>
        <TextField
          id={input.id}
          label={input.label}
          placeholder={input.placeholder}
          {...register(input.id || "", {
            required: pattern?.required?.value,
            pattern: pattern?.pattern?.value,
          })}
          multiline
          error={!!errors[input.id]}
        />
      </FormControl>
    );
  }
  if (input.type === "select") {
    return (
      <BasicSelect inputItem={inputItem} errors={errors} register={register} />
    );
  }
  return null;
}
function BasicSelect({
  errors,
  inputItem,
  register,
}: {
  inputItem: GeneralInput;
  errors: FieldErrors;
  register: UseFormRegister<FieldValues>;
}) {
  const { input, pattern } = inputItem;
  const [value, setValue] = useState("");

  const { onChange, ...rest } = register(input.id || "", {
    required: pattern?.required?.value,
    pattern: pattern?.pattern?.value,
  });

  const handleChange = (event: SelectChangeEvent) => {
    setValue(event.target.value as string);
    onChange({
      target: {
        name: input.id || "",
        value: event.target.value,
      },
      type: "change",
    });
  };

  return (
    <FormControl fullWidth error={!!errors[input.id]}>
      <InputLabel id="demo-simple-select-label">{input.label}</InputLabel>
      <Select
        labelId={input.name}
        id={input.id}
        value={value}
        label={input.label}
        {...rest}
        onChange={handleChange}
      >
        {input.options?.map((option) => {
          return (
            <MenuItem value={option.value} key={option.value}>
              {option.label}
            </MenuItem>
          );
        })}
      </Select>
    </FormControl>
  );
}
