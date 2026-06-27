"use server";

import { authFetch } from "../api";
import { authClient } from "../auth-client";

const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;
export const createPost = async (newPostData) => {
  // const { data: token } = await authClient.token();
  // console.log(token);
  const res = await fetch(`${baseUrl}/api/tasks`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(newPostData),
  });
  return res.json();
};

export const createProposal = async (newProposalData) => {
  const res = await fetch(`${baseUrl}/api/proposals`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(newProposalData),
  });
  return res.json();
};
