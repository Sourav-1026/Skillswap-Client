import ClientTasksTable from "@/components/dashboard/ClientTasksTable";
import { getClientJobs } from "@/lib/api/tasks";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import React from "react";

const ClientTasksPage = async () => {
  const session = await auth.api.getSession({
    headers: await headers(),
  });
  const user = session?.user;
  const tasks = await getClientJobs(user?.id);
  console.log(tasks);
  return (
    <div>
      {/* <h1>This is client all tasks page</h1> */}
      <ClientTasksTable tasks={tasks} />
    </div>
  );
};

export default ClientTasksPage;
