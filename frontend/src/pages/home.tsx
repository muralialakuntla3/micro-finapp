import { Alert, Loader, Stack, Grid } from "@mantine/core";
import { useQuery } from "@tanstack/react-query";
import http from "../lib/http";
import { User } from "../types/users";
import UsersTable from "../components/UsersTable";
import { IconAlertCircle } from "@tabler/icons-react";

function Home() {
  const query = useQuery({
    queryKey: ["all-users"],
    queryFn: async () => {
      const res = await http.get<User[]>("/users/enabled");
      return res.data;
    },
  });

  if (query.status === "error") {
    return (
      <Alert icon={<IconAlertCircle />} color="red">
        Something went wrong!
      </Alert>
    );
  }

  if (query.status === "loading") {
    return (
      <Grid justify="center">
        <Loader />
      </Grid>
    );
  }

  return (
    <Stack>
      <UsersTable data={query.data} />
    </Stack>
  );
}

export default Home;
