import {
  Button,
  Container,
  Group,
  Stack,
  TextInput,
  PasswordInput,
  Text,
  Flex,
} from "@mantine/core";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { IconMoneybag } from "@tabler/icons-react";

const credentials = {
  password: import.meta.env.VITE_USER_PASSWORD,
  mobile: import.meta.env.VITE_USER_MOBILE,
};

type LoginProps = {
  setUserId: (userId: string) => void;
};

function Login(props: LoginProps) {
  const schema = z.object({
    mobile: z.string().min(1),
    password: z.string().min(8),
  });

  type FormDataType = z.infer<typeof schema>;

  const {
    register,
    handleSubmit,
    setError,
    formState: { errors, isValid },
  } = useForm<FormDataType>({
    resolver: zodResolver(schema),
  });

  const onSubmit = (data: FormDataType) => {
    if (data.mobile === credentials.mobile && data.password === credentials.password) {
      props.setUserId(data.mobile);
    } else {
      setError("mobile", {
        message: data.mobile === credentials.mobile ? "" : "Invalid Mobile",
      });
      setError("password", {
        message: data.password === credentials.password ? "" : "Invalid Password",
      });
    }
  };

  return (
    <Container mt="1.5rem" size="30rem">
      <Flex justify="center" align="center" gap="sm">
        <IconMoneybag color="blue" />
        <Text variant="gradient" size="xl" fw="bold">
          Micro Finance
        </Text>
      </Flex>
      <form onSubmit={handleSubmit(onSubmit)}>
        <Stack spacing="xl">
          <TextInput
            required
            type="tel"
            label="Mobile"
            placeholder="Enter here"
            error={errors.mobile?.message}
            {...register("mobile", {
              validate: (value) => value === credentials.mobile || "error message",
            })}
          />
          <PasswordInput
            required
            label="Password"
            placeholder="Enter here"
            error={errors.password?.message}
            {...register("password", {
              validate: (value) => value === credentials.password || "error message",
            })}
          />
          <Group position="center">
            <Button type="submit" disabled={!isValid}>
              Login
            </Button>
          </Group>
        </Stack>
      </form>
    </Container>
  );
}

export default Login;
