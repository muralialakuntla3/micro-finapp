import { zodResolver } from "@hookform/resolvers/zod";
import {
  Modal,
  Button,
  Group,
  Textarea,
  Stack,
  Text,
  NumberInput,
  Grid,
  Anchor,
  Loader,
  Alert,
  Table,
  Space,
} from "@mantine/core";
import moment from "moment";
import { useToggle } from "@mantine/hooks";
import { useQuery } from "@tanstack/react-query";
import { Controller, useForm } from "react-hook-form";

import { z } from "zod";
import { User } from "../types/users";
import { Transaction } from "../types/transaction";
import { IconAlertCircle, IconArrowLeft } from "@tabler/icons-react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import http from "../lib/http";

type CreateTransactionModalProps = {
  close: () => void;
  opened: boolean;
  user: User;
};

interface ThProps {
  children: string;
}

const schema = z.object({
  user: z.object({
    userId: z.string().min(1),
  }),
  amountPaid: z.number().min(100),
  comment: z.string().optional(),
});

type FormDataType = z.infer<typeof schema>;

function CreateTransactionModal(props: CreateTransactionModalProps) {
  const {
    register,
    handleSubmit,
    control,
    formState: { errors, isValid },
  } = useForm<FormDataType>({
    resolver: zodResolver(schema),
    defaultValues: {
      amountPaid: 100,
    },
  });

  function Th({ children }: ThProps) {
    return (
      <th>
        <Text
          fw={500}
          fz="sm"
          align={!["Name", "Comment"].includes(children) ? "center" : "start"}
        >
          {children}
        </Text>
      </th>
    );
  }

  const [arePreviousTransactionsVisible, togglePreviousTransactionsVisible] =
    useToggle([false, true]);
  const [fetchTransactionsEnabled, toggelFetchTransactionsEnabled] = useToggle([
    false,
    true,
  ]);

  const transactionsQuery = useQuery({
    queryKey: ["all-transactions"],
    queryFn: async () => {
      const res = await http.get<Transaction[]>(
        `/transactions/user/${props.user.userId}`
      );
      return res.data;
    },
    enabled: fetchTransactionsEnabled,
  });

  const transactionRows = transactionsQuery.data?.length ? (
    transactionsQuery.data?.map((transaction) => (
      <tr key={transaction.transactionId}>
        <td>{props.user.name}</td>
        <td className="text-center">
          {moment(transaction.transactionDate, "DD-MM-YYYY HH:mm:ss").format(
            "DD MMM YYYY"
          )}
        </td>
        <td className="text-center">{transaction.amountPaid}</td>
        <td className="text-center">{transaction.balance}</td>
        <td>{transaction.comment}</td>
      </tr>
    ))
  ) : (
    <></>
  );

  const queryClient = useQueryClient();
  const mutation = useMutation({
    mutationKey: ["createTransaction"],
    mutationFn: async (data: FormDataType) => {
      const res = await http.post("/transactions", data);
      return res.data;
    },
    onSuccess: () => {
      props.close();
      queryClient.invalidateQueries(["all-users"]);
    },
  });

  const onSubmit = (data: FormDataType) => {
    mutation.mutate(data);
  };

  return (
    <Modal
      opened={props.opened}
      onClose={() => {
        props.close();
        toggelFetchTransactionsEnabled();
      }}
      title={
        arePreviousTransactionsVisible
          ? "Previous Transactions"
          : "Create Transaction"
      }
      size={arePreviousTransactionsVisible ? "xl" : "md"}
    >
      <Stack>
        {!arePreviousTransactionsVisible ? (
          <div>
            <Grid>
              <Grid.Col span={6}>
                <Text size="sm">
                  <b>Name</b>: {props.user.name}
                </Text>
              </Grid.Col>
              <Grid.Col span={6}>
                <Text fw={500} size="sm" align="right">
                  <Anchor
                    onClick={() => {
                      togglePreviousTransactionsVisible();
                      toggelFetchTransactionsEnabled();
                    }}
                  >
                    Previous Transactions
                  </Anchor>
                </Text>
              </Grid.Col>
            </Grid>
            <Space h="sm" />
            <form onSubmit={handleSubmit(onSubmit)}>
              <Stack>
                <input
                  hidden
                  value={props.user.userId}
                  {...register("user.userId")}
                />
                <Controller
                  name="amountPaid"
                  control={control}
                  render={({ field }) => (
                    <NumberInput
                      required
                      label="Amount"
                      {...field}
                      step={100}
                      error={errors.amountPaid?.message}
                    />
                  )}
                />

                <Textarea
                  label="Comment"
                  {...register("comment")}
                  error={errors.comment?.message}
                />
                <Group pt="md" position="right">
                  <Button
                    loading={mutation.isLoading}
                    type="submit"
                    disabled={!isValid}
                  >
                    Submit
                  </Button>
                  <Button
                    disabled={mutation.isLoading}
                    variant="light"
                    type="button"
                    onClick={() => {
                      props.close();
                      toggelFetchTransactionsEnabled();
                    }}
                  >
                    Cancel
                  </Button>
                </Group>
              </Stack>
            </form>
          </div>
        ) : (
          <div>
            <Text>
              <Anchor
                fw="500"
                size="sm"
                onClick={() => togglePreviousTransactionsVisible()}
              >
                <IconArrowLeft size={10} /> Back
              </Anchor>
            </Text>

            {transactionsQuery.status === "loading" ? (
              <Grid justify="center">
                <Loader />
              </Grid>
            ) : null}
            {transactionsQuery.status === "error" ? (
              <Alert icon={<IconAlertCircle />} color="red">
                Something went wrong!
              </Alert>
            ) : null}
            <Space h="xs" />
            {!!transactionsQuery.data ? (
              <div>
                <Table horizontalSpacing="md" verticalSpacing="xs" striped>
                  <thead>
                    <tr>
                      <Th>Name</Th>
                      <Th>Transaction Date</Th>
                      <Th>Amount Paid (₹)</Th>
                      <Th>Balance (₹)</Th>
                      <Th>Comment</Th>
                    </tr>
                  </thead>

                  <tbody>
                    {transactionsQuery.data?.length > 0 ? (
                      transactionRows
                    ) : (
                      <tr>
                        <td
                          colSpan={
                            Object.keys(transactionsQuery.data[0]).length
                          }
                        >
                          <Text weight={500} align="center">
                            Nothing found
                          </Text>
                        </td>
                      </tr>
                    )}
                  </tbody>
                </Table>
              </div>
            ) : null}
          </div>
        )}
      </Stack>
    </Modal>
  );
}

export default CreateTransactionModal;
