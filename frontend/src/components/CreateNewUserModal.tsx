import { zodResolver } from "@hookform/resolvers/zod";
import {
  Modal,
  Button,
  Group,
  TextInput,
  Stack,
  NumberInput,
} from "@mantine/core";
import { Controller, useForm } from "react-hook-form";
import moment from "moment";
import { DatePickerInput } from "@mantine/dates";
import { z } from "zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import http from "../lib/http";

type CreateNewUserModalProps = {
  close: () => void;
  opened: boolean;
};

const schema = z.object({
  name: z.string().min(1),
  mobile: z
    .string()
    .regex(/^(0|91)?[6-9][0-9]{9}$/, { message: "Invalid Mobile" }),
  balance: z.number().min(3),
  startDate: z.any(),
});

type FormDataType = z.infer<typeof schema>;

function CreateNewUserModal(props: CreateNewUserModalProps) {
  const {
    register,
    handleSubmit,
    control,
    formState: { errors, isValid },
  } = useForm<FormDataType>({
    resolver: zodResolver(schema),
    defaultValues: {
      startDate: moment().toDate(),
    },
  });

  const queryClient = useQueryClient();
  const mutation = useMutation({
    mutationKey: ["createUser"],
    mutationFn: async (data: FormDataType) => {
      const res = await http.post("/users", data);
      return res.data;
    },
    onSuccess: () => {
      props.close();
      queryClient.invalidateQueries(["all-users"]);
    },
  });

  const onSubmit = (data: FormDataType) => {
    const paramsData = {
      ...data,
      startDate: `${moment(data.startDate).format("DD-MM-YYYY")} 00:00:00`,
    };

    mutation.mutate(paramsData);
  };

  return (
    <Modal opened={props.opened} onClose={props.close} title="Create User">
      <Stack>
        <form onSubmit={handleSubmit(onSubmit)}>
          <Stack>
            <TextInput
              required
              label="Name"
              error={errors.name?.message}
              {...register("name")}
            />
            <TextInput
              required
              type="tel"
              label="Mobile"
              error={errors.mobile?.message}
              {...register("mobile")}
            />
            <Controller
              name="balance"
              control={control}
              render={({ field }) => (
                <NumberInput
                  required
                  label="Balance"
                  {...field}
                  step={100}
                  error={errors.balance?.message}
                />
              )}
            />
            <Controller
              name="startDate"
              control={control}
              render={({ field }) => (
                <DatePickerInput
                  required
                  popoverProps={{ withinPortal: true }}
                  valueFormat="DD MMM YYYY"
                  label="Creation Date"
                  placeholder="Pick Date"
                  maxDate={moment().toDate()}
                  {...field}
                />
              )}
            />
            <Group pt="md" position="right">
              <Button
                type="submit"
                loading={mutation.isLoading}
                disabled={!isValid}
              >
                Submit
              </Button>
              <Button
                disabled={mutation.isLoading}
                variant="light"
                type="button"
                onClick={props.close}
              >
                Cancel
              </Button>
            </Group>
          </Stack>
        </form>
      </Stack>
    </Modal>
  );
}

export default CreateNewUserModal;
