import { AppShell, Container, MantineProvider } from "@mantine/core";
import { QueryClientProvider } from "@tanstack/react-query";
import queryClient from "../lib/query-client";
import MainHeader from "../components/MainHeader";

type MainLayoutProps = {
  children: React.ReactNode;
  setUserId: (userId: string) => void;
};

function MainLayout(props: MainLayoutProps) {
  return (
    <QueryClientProvider client={queryClient}>
      <MantineProvider withGlobalStyles withNormalizeCSS>
        <AppShell header={<MainHeader setUserId={props.setUserId} />}>
          <Container size="xl">{props.children}</Container>
        </AppShell>
      </MantineProvider>
    </QueryClientProvider>
  );
}

export default MainLayout;
