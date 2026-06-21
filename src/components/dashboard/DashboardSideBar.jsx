import { auth } from "@/lib/auth";
import { Button, Drawer } from "@heroui/react";
import { headers } from "next/headers";
import Link from "next/link";
import { AiOutlineTransaction, AiTwotoneProject } from "react-icons/ai";
import { BiBell, BiEnvelope, BiPlus } from "react-icons/bi";
import { BsHouse, BsPerson } from "react-icons/bs";
import { FaBars, FaRegMoneyBillAlt, FaUserEdit } from "react-icons/fa";
import { FaMagnifyingGlass } from "react-icons/fa6";
import { GiEarbuds } from "react-icons/gi";
import { GoProjectSymlink, GoTasklist } from "react-icons/go";
import { GrTasks } from "react-icons/gr";
import { IoBriefcase } from "react-icons/io5";
import { MdManageAccounts, MdOutlineManageSearch } from "react-icons/md";

export default async function DashboardSideBar() {
  const session = await auth.api.getSession({
    headers: await headers(), // you need to pass the headers object.
  });

  const user = session?.user;
  // console.log(user);

  const navItems = {
    client: [
      { icon: BsHouse, label: "Home", href: "/dashboard/client" },
      {
        icon: BiPlus,
        label: "Post a Task",
        href: "/dashboard/client/tasks/new",
      },
      { icon: GoTasklist, label: "My Tasks", href: "/dashboard/client/tasks" },
      {
        icon: IoBriefcase,
        label: "Proposals",
        href: "/dashboard/client/proposals",
      },
    ],
    freelancer: [
      { icon: BsHouse, label: "Home", href: "/dashboard/freelancer" },
      { icon: GrTasks, label: "Tasks", href: "/dashboard/freelancer/tasks" },
      {
        icon: GoTasklist,
        label: "My Proposals",
        href: "/dashboard/freelancer/my-proposals",
      },
      {
        icon: GoProjectSymlink,
        label: "Projects",
        href: "/dashboard/freelancer/projects",
      },
      {
        icon: FaRegMoneyBillAlt,
        label: "My Earnings",
        href: "/dashboard/freelancer/my-earnings",
      },
      {
        icon: FaUserEdit,
        label: "Edit Profile",
        href: "/dashboard/freelancer/edit-profile",
      },
    ],
    admin: [
      { icon: BsHouse, label: "Home", href: "/dashboard/admin" },
      {
        icon: MdManageAccounts,
        label: "Manage Users",
        href: "/dashboard/admin/manage-users",
      },
      {
        icon: MdOutlineManageSearch,
        label: "Manage Tasks",
        href: "/dashboard/admin/manage-tasks",
      },
      {
        icon: AiOutlineTransaction,
        label: "Transactions History",
        href: "/dashboard/admin/transactions",
      },
    ],
  };

  const navItemsForRole = navItems[user?.role] || [];

  const navContent = (
    <nav className="flex flex-col gap-1">
      {navItemsForRole.map((item) => (
        <Link
          href={item.href || "#"}
          key={item.label}
          className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm text-text-secondary transition-colors hover:bg-default hover:text-accent-hover"
          type="button"
        >
          <item.icon className="size-5 text-accent hover:text-accent-hover" />
          {item.label}
        </Link>
      ))}
    </nav>
  );

  return (
    <>
      <aside className="hidden w-64 shrink-0 border-r border-accent p-4 lg:block">
        {navContent}
      </aside>
      <Drawer>
        <Button className={"lg:hidden"} variant="secondary">
          <FaBars />
          Menu
        </Button>
        <Drawer.Backdrop>
          <Drawer.Content placement="left">
            <Drawer.Dialog>
              <Drawer.CloseTrigger />
              <Drawer.Header>
                <Drawer.Heading>Navigation</Drawer.Heading>
              </Drawer.Header>
              <Drawer.Body>{navContent}</Drawer.Body>
            </Drawer.Dialog>
          </Drawer.Content>
        </Drawer.Backdrop>
      </Drawer>
    </>
  );
}
