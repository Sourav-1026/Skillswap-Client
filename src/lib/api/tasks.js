import { headers } from "next/headers";
import { auth } from "../auth";

const getServerToken = async () => {
  const headersList = await headers();
  const sessionRes = await auth.api.getSession({
    headers: headersList,
    returnHeaders: true,
  });
  return sessionRes?.headers?.get("set-auth-jwt");
};

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
  const token = await getServerToken();

  const res = await fetch(
    `${baseUrl}/api/proposals?freelancerEmail=${freelancerEmail}`,
    {
      headers: {
        "Content-Type": "application/json",
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
    },
  );

  const data = await res.json();
  return Array.isArray(data) ? data : data.proposals || [];
};
