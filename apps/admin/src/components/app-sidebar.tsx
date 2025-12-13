import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";
import { useIsMobile } from "@/hooks/use-mobile";
import { List, useNavData } from "@/layouts/dashboard/config-navigation";
import { cn } from "@/lib/utils";
import { useActiveLink, usePathname, useRouter } from "@/routes/hooks";
import paths from "@/routes/paths";
import { AppDispatch, RootState } from "@/stores";
import { logout } from "@/stores/auth";
import { LogOutIcon, MoreVerticalIcon, SettingsIcon } from "lucide-react";
import { useEffect, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { mutate } from "swr";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const { setOpenMobile, openMobile } = useSidebar();

  const pathname = usePathname();
  const datas = useNavData();

  useEffect(() => {
    if (openMobile) {
      setOpenMobile(false);
    }
  }, [pathname]);

  return (
    <Sidebar collapsible="offcanvas" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              asChild
              className="h-auto w-max data-[slot=sidebar-menu-button]:!p-1.5"
            >
              <Link to={paths.dashboard.root}>
                <img src="/images/logo.png" alt="logo" className="h-14" />
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <NavList items={datas} />

        <NavList
          items={[
            {
              title: "Settings",
              path: paths.dashboard.settings,
              icon: <SettingsIcon />,
            },
          ]}
          className="mt-auto"
        />
      </SidebarContent>
      <SidebarFooter>
        <NavUser />
      </SidebarFooter>
    </Sidebar>
  );
}

function NavList({
  items,
  ...other
}: { items: List[] } & React.ComponentPropsWithoutRef<typeof SidebarGroup>) {
  return (
    <>
      <SidebarGroup {...other}>
        <SidebarMenu>
          {items.map((item) => {
            return <NavItem key={item.title} item={item} />;
          })}
        </SidebarMenu>
      </SidebarGroup>
    </>
  );
}

function NavItem({ item }: { item: List }) {
  const activeLink = useActiveLink(item.path, false);

  return (
    <>
      <SidebarMenuItem>
        <SidebarMenuButton asChild isActive={activeLink}>
          <Link to={item.path}>
            <>{item.icon}</>
            <span>{item.title}</span>
          </Link>
        </SidebarMenuButton>
      </SidebarMenuItem>
    </>
  );
}

function NavUser() {
  const isMobile = useIsMobile();

  const user = useSelector((state: RootState) => state.auth.user);
  const dispatch = useDispatch<AppDispatch>();
  const router = useRouter();

  const avatarFallback = useMemo<string>(() => {
    const name = user?.name ?? "";
    const firstLetter = name
      .split(" ")
      .map((word) => word[0]?.toUpperCase())
      .join("");
    return firstLetter;
  }, [user?.name]);

  async function handleLogout() {
    await dispatch(logout());
    mutate(() => true, undefined, { revalidate: false });
    router.replace(paths.auth.login);
  }

  function RenderAvatar({ className }: { className?: string }) {
    return (
      <>
        <Avatar className={cn("h-8 w-8 rounded-lg", className)}>
          <AvatarImage src={user?.imageUrl ?? ""} alt={user?.name} />
          <AvatarFallback className="rounded-lg">
            {avatarFallback}
          </AvatarFallback>
        </Avatar>
      </>
    );
  }

  return (
    <>
      <SidebarMenu>
        <SidebarMenuItem>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <SidebarMenuButton
                size="lg"
                className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
              >
                <RenderAvatar className="grayscale" />
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-medium">{user?.name}</span>
                  <span className="text-muted-foreground truncate text-xs">
                    {user?.email}
                  </span>
                </div>
                <MoreVerticalIcon className="ml-auto size-4" />
              </SidebarMenuButton>
            </DropdownMenuTrigger>
            <DropdownMenuContent
              className="w-[--radix-dropdown-menu-trigger-width] min-w-56 rounded-lg"
              side={isMobile ? "bottom" : "right"}
              align="end"
              sideOffset={4}
            >
              <DropdownMenuLabel className="p-0 font-normal">
                <div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
                  <RenderAvatar />
                  <div className="grid flex-1 text-left text-sm leading-tight">
                    <span className="truncate font-medium">{user?.name}</span>
                    <span className="text-muted-foreground truncate text-xs">
                      {user?.email}
                    </span>
                  </div>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem onSelect={handleLogout}>
                <LogOutIcon />
                Log out
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </SidebarMenuItem>
      </SidebarMenu>
    </>
  );
}
