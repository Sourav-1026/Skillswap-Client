import { auth } from "@/lib/auth";
import { Button, Drawer } from "@heroui/react";
import { headers } from "next/headers";
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
  console.log(user);

  const navItems = {
    client: [
      { icon: BsHouse, label: "Home" },
      { icon: BiPlus, label: "Post a Task" },
      { icon: GoTasklist, label: "My Tasks" },
      { icon: IoBriefcase, label: "Proposals" },
    ],
    freelancer: [
      { icon: BsHouse, label: "Home" },
      { icon: GrTasks, label: "Tasks" },
      { icon: GoTasklist, label: "My Proposals" },
      { icon: GoProjectSymlink, label: "Projects" },
      { icon: FaRegMoneyBillAlt, label: "My Earnings" },
      { icon: FaUserEdit, label: "Edit Profile" },
    ],
    admin: [
      { icon: BsHouse, label: "Home" },
      { icon: MdManageAccounts, label: "Manage Users" },
      { icon: MdOutlineManageSearch, label: "Manage Tasks" },
      { icon: AiOutlineTransaction, label: "Transactions History" },
    ],
  };

  const navItemsForRole = navItems[user?.role] || [];

  const navContent = (
    <nav className="flex flex-col gap-1">
      {navItemsForRole.map((item) => (
        <button
          key={item.label}
          className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm text-text-secondary transition-colors hover:bg-default hover:text-accent-hover"
          type="button"
        >
          <item.icon className="size-5 text-accent hover:text-accent-hover" />
          {item.label}
        </button>
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
