import { useEffect, useState } from "react";
import moment from "moment";
import {
  createStyles,
  Table,
  ScrollArea,
  UnstyledButton,
  Group,
  Text,
  Center,
  TextInput,
  rem,
  Anchor,
  Flex,
  Button,
  Menu,
} from "@mantine/core";
import {
  IconSelector,
  IconChevronDown,
  IconChevronUp,
  IconSearch,
  IconAlertCircle,
  IconDotsVertical,
  IconPlus,
} from "@tabler/icons-react";
import http from "../lib/http";
import { User } from "../types/users";
import CreateTransactionModal from "./CreateTransactionModal";
import { useDisclosure } from "@mantine/hooks";
import CreateNewUserModal from "./CreateNewUserModal";
import { useMutation, useQueryClient } from "@tanstack/react-query";

const useStyles = createStyles((theme) => ({
  th: {
    padding: "0 6px !important",
  },

  control: {
    width: "100%",
    padding: `${theme.spacing.xs} ${theme.spacing.xs}`,

    "&:hover": {
      backgroundColor:
        theme.colorScheme === "dark"
          ? theme.colors.dark[6]
          : theme.colors.gray[0],
    },
  },

  icon: {
    width: rem(21),
    height: rem(21),
    borderRadius: rem(21),
  },
}));

interface UsersTableProps {
  data: User[];
}

interface ThProps {
  children: React.ReactNode;
  reversed: boolean;
  sorted: boolean;
  onSort(): void;
}

function Th({ children, reversed, sorted, onSort }: ThProps) {
  const { classes } = useStyles();
  const Icon = sorted
    ? reversed
      ? IconChevronUp
      : IconChevronDown
    : IconSelector;
  return children ? (
    <th className={classes.th}>
      <UnstyledButton onClick={onSort} className={classes.control}>
        <Group position="apart">
          <Text fw={500} fz="sm">
            {children}
          </Text>
          <Center className={classes.icon}>
            <Icon size="0.9rem" stroke={1.5} />
          </Center>
        </Group>
      </UnstyledButton>
    </th>
  ) : (
    <></>
  );
}

function filterData(data: User[], search: string) {
  const query = search.toLowerCase().trim();
  return data.filter(
    (item) =>
      // Search by name
      item.name.toLowerCase().includes(query) ||
      item.balance.toString().toLowerCase().includes(query)
  );
}

function sortData(
  data: User[],
  payload: { sortBy: keyof User | null; reversed: boolean; search: string }
) {
  const { sortBy } = payload;

  if (!sortBy) {
    return filterData(data, payload.search);
  }

  return filterData(
    [...data].sort((a, b) => {
      let value1, value2;
      if (payload.reversed) {
        value1 = a[sortBy];
        value2 = b[sortBy];
      } else {
        value1 = b[sortBy];
        value2 = a[sortBy];
      }

      if (typeof value1 === "number" && typeof value2 === "number") {
        return value1 - value2;
      } else if (typeof value1 === "string" && typeof value2 === "string") {
        return value2.localeCompare(value1);
      } else {
        return 0;
      }
    }),
    payload.search
  );
}

export function UsersTable({ data }: UsersTableProps) {
  const [selectedUser, setSelectedUser] = useState<User | null>(null);

  const [search, setSearch] = useState("");
  const [sortedData, setSortedData] = useState(data);
  const [sortBy, setSortBy] = useState<keyof User | null>(null);
  const [reverseSortDirection, setReverseSortDirection] = useState(false);

  const setSorting = (field: keyof User) => {
    const reversed = field === sortBy ? !reverseSortDirection : false;
    setReverseSortDirection(reversed);
    setSortBy(field);
    setSortedData(sortData(data, { sortBy: field, reversed, search }));
  };

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = event.currentTarget;
    setSearch(value);
    setSortedData(
      sortData(data, { sortBy, reversed: reverseSortDirection, search: value })
    );
  };

  const handleUserSelect = (user: User) => {
    setSelectedUser(user);
  };

  const queryClient = useQueryClient();
  const deleteMutation = useMutation({
    mutationKey: ["deleteUser"],
    mutationFn: async (data: any) => {
      const res = await http.delete(`/users/${data.userId}`, data);
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["all-users"]);
    },
  });

  const handleDeleteUser = (data: any) => {
    const paramsData = { ...data, amount: data.balance };

    deleteMutation.mutate(paramsData);
  };

  const [
    openCreateUserModal,
    { close: closeCreateUserModal, open: OpenCreateUserModal },
  ] = useDisclosure(false);

  const rows = sortedData.map((user) => (
    <tr key={user.name}>
      <td>
        <Anchor component="button" onClick={() => handleUserSelect(user)}>
          {user.name}
        </Anchor>
      </td>
      <td>
        <Anchor href={`tel:${user.mobile}`}>{user.mobile}</Anchor>
      </td>
      <td>{user.balance}</td>
      <td>{user.interest}</td>
      <td>
        {moment(user.startDate, "DD-MM-YYYY HH:mm:ss").format("DD MMM YYYY")}
      </td>
      <td>
        {moment(user.endDate, "DD-MM-YYYY HH:mm:ss").format("DD MMM YYYY")}
      </td>
      <td>{user.remarks ? <IconAlertCircle color="red" /> : null}</td>
      <td style={{ padding: "6px 0 0 0" }}>
        <Menu shadow="md" width={160}>
          <Menu.Target>
            <Anchor>
              <IconDotsVertical size={24} />
            </Anchor>
          </Menu.Target>

          <Menu.Dropdown>
            <Menu.Item onClick={() => handleUserSelect(user)}>
              Create Transaction
            </Menu.Item>
            <Menu.Item color="red" onClick={() => handleDeleteUser(user)}>
              Delete User
            </Menu.Item>
          </Menu.Dropdown>
        </Menu>
      </td>
    </tr>
  ));

  useEffect(() => {
    setSortedData(
      sortData(data, { sortBy, reversed: reverseSortDirection, search })
    );
  }, [data, sortBy, reverseSortDirection, search, setSortedData]);

  return (
    <ScrollArea>
      <Flex gap="1rem">
        <TextInput
          placeholder="Search by any field"
          mb="md"
          icon={<IconSearch size="0.9rem" stroke={1.5} />}
          value={search}
          onChange={handleSearchChange}
          w="100%"
        />
        <Button
          leftIcon={<IconPlus />}
          disabled={openCreateUserModal}
          onClick={OpenCreateUserModal}
        >
          Add new user
        </Button>
      </Flex>
      <Table
        horizontalSpacing="md"
        verticalSpacing="xs"
        striped
        highlightOnHover
        miw={700}
      >
        <thead>
          <tr>
            <Th
              sorted={sortBy === "name"}
              reversed={reverseSortDirection}
              onSort={() => setSorting("name")}
            >
              Name
            </Th>
            <Th
              sorted={sortBy === "mobile"}
              reversed={reverseSortDirection}
              onSort={() => setSorting("mobile")}
            >
              Mobile No.
            </Th>
            <Th
              sorted={sortBy === "balance"}
              reversed={reverseSortDirection}
              onSort={() => setSorting("balance")}
            >
              Balance (₹)
            </Th>
            <Th
              sorted={sortBy === "interest"}
              reversed={reverseSortDirection}
              onSort={() => setSorting("interest")}
            >
              Interest (₹)
            </Th>
            <Th
              sorted={sortBy === "startDate"}
              reversed={reverseSortDirection}
              onSort={() => setSorting("startDate")}
            >
              Start Date
            </Th>
            <Th
              sorted={sortBy === "endDate"}
              reversed={reverseSortDirection}
              onSort={() => setSorting("endDate")}
            >
              End Date
            </Th>
            <Th
              sorted={sortBy === "remarks"}
              reversed={reverseSortDirection}
              onSort={() => setSorting("remarks")}
            >
              Remarks
            </Th>
          </tr>
        </thead>
        <tbody>
          {rows.length > 0 ? (
            rows
          ) : (
            <tr>
              <td colSpan={Object.keys(data[0]).length}>
                <Text weight={500} align="center">
                  Nothing found
                </Text>
              </td>
            </tr>
          )}
        </tbody>
      </Table>
      {selectedUser ? (
        <CreateTransactionModal
          close={() => setSelectedUser(null)}
          opened={selectedUser !== null}
          user={selectedUser}
        />
      ) : null}
      {openCreateUserModal ? (
        <CreateNewUserModal
          close={closeCreateUserModal}
          opened={openCreateUserModal}
        />
      ) : null}
    </ScrollArea>
  );
}

export default UsersTable;
