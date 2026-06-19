const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;


export const getClientJobs = async (clientId, status = 'Open') => {
    const res = await fetch(`${baseUrl}/api/tasks?clientId=${clientId}&status=${status}`);
    return res.json();
}