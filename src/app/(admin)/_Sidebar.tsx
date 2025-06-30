"use client";

import logMeOut from "@/actions/logMeOut";
import { Button } from "@/components/ui/button";
import { routes } from "@/config";
import cn from "@/utils/cn";
import {
  ShoppingBag,
  Package,
  Users,
  LogOut,
  LayoutDashboard,
} from "lucide-react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { toast } from "sonner";

// navs
const navs = [
  {
    ...routes.dashboard,
    icon: <LayoutDashboard />,
  },
  {
    ...routes.orders,
    icon: <ShoppingBag />,
  },
  {
    ...routes.products,
    icon: <Package />,
  },
  {
    ...routes.customers,
    icon: <Users />,
  },
];

const Sidebar = () => {
  // Pathname
  const pathname = usePathname();

  // Router
  const router = useRouter();

  // Render
  return (
    <aside className="sidebar max-md:hidden w-[17rem] border-r h-full flex flex-col justify-between gap-2 [&_svg]:w-8 bg-white">
      {/* Navs */}
      <nav className="sidebar-menu w-full flex flex-col gap-2 h-5 grow overflow-y-auto p-2 ">
        {navs.map((nav) => {
          // Is current
          const isCurrent =
            nav.pathname != "/"
              ? pathname.startsWith(nav.pathname)
              : pathname == nav.pathname;
          // render
          return (
            <Link key={nav.id} href={nav.url}>
              <Button
                className={cn(
                  "bg-transparent text-para border-0 w-full justify-start",
                  isCurrent && "bg-primary/20 text-primary"
                )}
              >
                {/* Icon */}
                {nav.icon}

                {/* Name */}
                {nav.name}
              </Button>
            </Link>
          );
        })}
      </nav>

      {/* Logout */}
      <div className="p-2 border-t">
        <Button
          className="w-full text-error bg-error/10"
          onClick={async () => {
            // log out
            const response = await logMeOut();

            // if success, redirect to login
            if (response?.status) {
              router.push(routes.login.url);
            } else {
              // show msg,
              toast.error(response.message);
            }
          }}
        >
          <LogOut />
          Logout
        </Button>
      </div>
    </aside>
  );
};

export default Sidebar;
