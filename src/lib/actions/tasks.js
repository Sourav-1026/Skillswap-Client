"use server"
const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;
export const createPost = async (newPostData) => {
    const res = await fetch(`${baseUrl}/api/tasks`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(newPostData),
    })
    return res.json();
}