import { useLoading } from "@/providers/LoadingProvider";
import { submitData } from "@/shared/lib/fetchers/submit";
import { GeneralInput, methodType, RowType } from "@/shared/utlis/types";
import {
  Box,
  Button,
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
type FormType = {
  inputs: GeneralInput[];
  onSubmitData: (data: FieldValues) => void;
  href: string;
  method?: methodType;
  submitButtonLabel?: string;
  initialValues?: Partial<RowType> | null;
};
export default function MainForm({
  inputs,
  onSubmitData,
  href,
  method,
  submitButtonLabel = "ارسال",
  initialValues,
}: FormType) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: initialValues ?? {},
  });
  const { loading, setLoading } = useLoading();
  async function onSubmit(data: FieldValues) {
    const req = await submitData({
      data,
      setLoading,
      path: href,
      method: method || "post",
      toastMessage: "جاري تحديث البيانات",
    });
    if (req && onSubmitData) {
      onSubmitData(data);
    }
  }
  return (
    <Box>
      <form onSubmit={handleSubmit(onSubmit)}>
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
        <Button type="submit" disabled={!!errors || loading}>
          {submitButtonLabel}
        </Button>
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
