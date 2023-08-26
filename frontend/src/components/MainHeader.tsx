import { useState } from "react";
import {
  createStyles,
  Header,
  Container,
  Group,
  Burger,
  rem,
  Text,
  Flex,
  Menu,
  Anchor,
} from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { IconMoneybag } from "@tabler/icons-react";

const useStyles = createStyles((theme) => ({
  header: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    height: "100%",
  },

  links: {
    [theme.fn.smallerThan("xs")]: {
      display: "none",
    },
  },

  burger: {
    [theme.fn.largerThan("xs")]: {
      display: "none",
    },
  },
  menu: {
    [theme.fn.largerThan("xs")]: {
      display: "none",
    },
  },

  link: {
    display: "block",
    lineHeight: 1,
    padding: `${rem(8)} ${rem(12)}`,
    borderRadius: theme.radius.sm,
    textDecoration: "none",
    color:
      theme.colorScheme === "dark"
        ? theme.colors.dark[0]
        : theme.colors.gray[7],
    fontSize: theme.fontSizes.sm,
    fontWeight: 500,

    "&:hover": {
      backgroundColor:
        theme.colorScheme === "dark"
          ? theme.colors.dark[6]
          : theme.colors.gray[0],
    },
  },

  linkActive: {
    "&, &:hover": {
      backgroundColor: theme.fn.variant({
        variant: "light",
        color: theme.primaryColor,
      }).background,
      color: theme.fn.variant({ variant: "light", color: theme.primaryColor })
        .color,
    },
  },
}));

type MainHeaderProps = {
  setUserId: (userId: string) => void;
};

function MainHeader(props: MainHeaderProps) {
  const links = [
    {
      label: "Log out",
      link: "/",
      onClick: () => props.setUserId(""),
    },
  ];
  const [opened, { toggle }] = useDisclosure(false);
  const [active, setActive] = useState(links[0].link);
  const { classes, cx } = useStyles();

  const items = links.map((link) => (
    <a
      key={link.label}
      href={link.link}
      className={cx(classes.link, {
        [classes.linkActive]: active === link.link,
      })}
      onClick={(event) => {
        event.preventDefault();
        setActive(link.link);
        link.onClick();
      }}
    >
      {link.label}
    </a>
  ));

  return (
    <Header height={60} mb={120}>
      <Container size="xl" className={classes.header}>
        <Flex justify="center" align="center" gap="sm">
          <IconMoneybag color="blue" />
          <Text variant="gradient" size="xl" fw="bold">
            Micro Finance
          </Text>
        </Flex>
        <Group spacing={5} className={classes.links}>
          {items}
        </Group>

        <div className={classes.menu}>
          <Menu shadow="md" width={160}>
            <Menu.Target>
              <Anchor>
                <Burger
                  opened={opened}
                  onClick={toggle}
                  className={classes.burger}
                  size="sm"
                />
              </Anchor>
            </Menu.Target>

            <Menu.Dropdown>
              <Menu.Item onClick={() => props.setUserId("")}>Log out</Menu.Item>
            </Menu.Dropdown>
          </Menu>
        </div>
      </Container>
    </Header>
  );
}

export default MainHeader;
