import { headers } from "next/headers";

const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;

export const getClientTasks = async (clientEmail, status = "") => {
  const statusQuery = status ? `&status=${status}` : "";
  const res = await fetch(
    `${baseUrl}/api/tasks?clientEmail=${clientEmail}${statusQuery}`,
  );
  const data = await res.json();
  return data.tasks || [];
};

export const getAllClientTasks = async (status = "Open") => {
  const res = await fetch(`${baseUrl}/api/tasks?status=${status}`);
  const data = await res.json();
  return data.tasks || [];
};

export const getSingleTask = async (taskId) => {
  const res = await fetch(`${baseUrl}/api/tasks/${taskId}`);
  return res.json();
};

export const getfreelancerProposals = async (freelancerEmail) => {
  const headersList = await headers();
  const cookie = headersList.get("cookie");

  const res = await fetch(
    `${baseUrl}/api/proposals?freelancerEmail=${freelancerEmail}`,
    {
      headers: cookie ? { Cookie: cookie } : {},
    },
  );

  const data = await res.json();
  return Array.isArray(data) ? data : data.proposals || [];
};
