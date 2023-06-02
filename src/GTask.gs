function getAllTasksWithListData() {
  const taskLists = Tasks.Tasklists.list(taskListReqSettigs);
  if (!taskLists.items) {
    console.log("No task lists found.");
    return [];
  }

  let allTasks = [];
  for (const taskList of taskLists.items) {
    if (getExcludedTaskLists().includes(taskList.id)) continue;

    console.info(
      `Task list with title "${taskList.title}" and ID "${taskList.id}" was found.`
    );
    let tasks = getAllGTasks(taskList.id);

    if (tasks.items.length !== 0) {
      allTasks.push({
        id: taskList.id,
        title: taskList.title,
        tasks: tasks.items,
      });
    }
  }

  return allTasks;
}

function getAllGTasks(taskListId) {
  return Tasks.Tasks.list(taskListId, taskReqSettigs);
}
