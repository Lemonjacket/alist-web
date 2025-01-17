import { Box, Flex, Heading, HStack, Icon, VStack } from "@hope-ui/solid";
import { createSignal, For, Show } from "solid-js";
import { useRouter, useT } from "~/hooks";
import { BiSolidRightArrow } from "solid-icons/bi";
import { IconTypes } from "solid-icons/lib/browser/IconWrapper";
import { onClose } from "./Header";
import { UserMethods, UserRole } from "~/types";
import { user } from "~/store";
import { AnchorWithBase } from "~/components";
import { Link } from "@solidjs/router";

export interface SideMenuItemProps {
  title: string;
  to: string;
  icon?: IconTypes;
  children?: SideMenuItemProps[];
  role?: number;
}

const SideMenuItem = (props: SideMenuItemProps) => {
  if (!UserMethods.is_admin(user())) {
    if (props.role === undefined) return null;
    else if (props.role === UserRole.GENERAL && !UserMethods.is_general(user()))
      return null;
  }
  return (
    <Show when={props.children} fallback={<SideMenuItemWithTo {...props} />}>
      <SideMenuItemWithChildren {...props} />
    </Show>
  );
};

const SideMenuItemWithTo = (props: SideMenuItemProps) => {
  const { to, pathname } = useRouter();
  const t = useT();
  const isActive = () => pathname() === props.to;
  return (
    <AnchorWithBase
      display="flex"
      as={Link}
      href={props.to}
      onClick={() => {
        // to(props.to!);
        onClose();
      }}
      w="$full"
      alignItems="center"
      _hover={{
        bgColor: isActive() ? "$info4" : "$neutral4",
        textDecoration: "none",
      }}
      p="$2"
      rounded="$md"
      cursor="pointer"
      bgColor={isActive() ? "$info4" : ""}
      color={isActive() ? "$info11" : ""}
      // _active={{ transform: "scale(.95)", transition: "0.1s" }}
    >
      <Show when={props.icon}>{<Icon mr="$2" as={props.icon} />}</Show>
      <Heading>{t(props.title)}</Heading>
    </AnchorWithBase>
  );
};

const SideMenuItemWithChildren = (props: SideMenuItemProps) => {
  const { pathname } = useRouter();
  const [open, setOpen] = createSignal(pathname().includes(props.to));
  const t = useT();
  return (
    <Box w="$full">
      <Flex
        justifyContent="space-between"
        onClick={() => {
          setOpen(!open());
        }}
        w="$full"
        alignItems="center"
        _hover={{
          bgColor: "$neutral4",
        }}
        p="$2"
        rounded="$md"
        cursor="pointer"
      >
        <HStack>
          <Show when={props.icon}>{<Icon mr="$2" as={props.icon} />}</Show>
          <Heading>{t(props.title)}</Heading>
        </HStack>
        <Icon
          as={BiSolidRightArrow}
          transform={open() ? "rotate(90deg)" : "none"}
          transition="transform 0.2s"
        />
      </Flex>
      <Show when={open()}>
        <Box pl="$2">
          <SideMenu items={props.children!} />
        </Box>
      </Show>
    </Box>
  );
};

export const SideMenu = (props: { items: SideMenuItemProps[] }) => {
  return (
    <VStack p="$2" w="$full" color="$neutral11">
      <For each={props.items}>
        {(item, i) => {
          return <SideMenuItem {...item} />;
        }}
      </For>
    </VStack>
  );
};
