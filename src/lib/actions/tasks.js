"use server";
const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;
export const createPost = async (newPostData) => {
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

// export const updateStatus = async () => {
//     const res = await fetch(, {
//         method: "UPDATE",
//         headers: {
//             "Content-Type" : "application/json",
//         },
//         body: JSON.stringify(),
//     })
//     return res.json();

// }
