import TaskCard from "@/components/dashboard/TaskCard";
import { getAllClientTasks } from "@/lib/api/tasks";
// import TaskCard from "@/components/freelancer/TaskCard";

const FreelancerBrowseTasksPage = async () => {
  const res = await getAllClientTasks();
  const tasks = res || [];
  console.log(tasks, "from tasks");

  return (
    <div className="p-6">
      {tasks.length === 0 ? (
        <p className="text-muted-foreground text-sm">
          No open tasks available right now.
        </p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {tasks.map((task) => (
            <TaskCard key={task._id} task={task} />
          ))}
        </div>
      )}
    </div>
  );
};

export default FreelancerBrowseTasksPage;
