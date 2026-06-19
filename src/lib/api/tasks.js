const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;


export const getClientTasks = async (clientId, status = 'Open') => {
    const res = await fetch(`${baseUrl}/api/tasks?clientId=${clientId}&status=${status}`);
    return res.json();
}

export const getAllClientTasks = async (status = "Open")=> {
    const res = await fetch(`${baseUrl}/api/tasks?status=${status}`);
    return res.json();
}

export const getSingleTask = async (taskId) => {
    const res = await fetch(`${baseUrl}/api/tasks/${taskId}`);
    return res.json();
}

export const getfreelancerProposals = async ( freelancerEmail) => {
    const res = await fetch(`${baseUrl}/api/proposals?freelancerEmail=${freelancerEmail}`);
    return res.json();
}