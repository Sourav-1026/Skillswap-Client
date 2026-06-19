import { getfreelancerProposals } from "@/lib/api/tasks";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import React from "react";

const FreelancerMyProposalsPage = async () => {
  const session = await auth.api.getSession({
    headers: await headers(), // you need to pass the headers object.
  });
  const user = session?.user;
  // console.log(user);
  const freelancerEmail = user?.email;
  console.log(freelancerEmail);
  const res = await getfreelancerProposals(freelancerEmail);
  console.log(res, "from proposals");
  return (
    <div>
      <h1>This is freelanceer my proposals page</h1>
    </div>
  );
};

export default FreelancerMyProposalsPage;
