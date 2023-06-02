function main() {
  const lastRun = getLastRunTime();
  Logger.log(lastRun);

  try {
    tasksHandler();
    updateLastRunTime();
  } catch (e) {
    console.warn(e.message);
  }
}

function tasksHandler() {
  let gTasksListsFiltered = getAllTasksWithListData();
  if (!gTasksListsFiltered) return;

  let hTaskDict = {};
  let hTasks = getAllTasksApi();
  for (const hTask of hTasks) {
    hTaskDict[hTask.alias] = hTask;
  }

  for (const gTasksWithListData of gTasksListsFiltered) {
    const listId = gTasksWithListData.id;
    const listTitle = gTasksWithListData.title;
    const gTasks = gTasksWithListData.tasks;

    for (const gTask of gTasks) {
      let alias = aliasPrefix + gTask.id;

      let customTask = new CustomTask(gTask, listTitle, listId);
      if (hTaskDict[alias]) updateHTasks(customTask, hTaskDict[alias]);
      else createHTask(customTask);
    }
    console.info(`Updated ${gTasks.length} tasks in ${listTitle} [${listId}]`);
  }
}

function updateHTasks(customTask, hTask) {
  if (customTask.gTask.deleted) {
    deleteTaskApi(customTask.getId());
    return;
  }

  updateTaskApi(customTask.patchPayload(), customTask.getId());
  taskScorer(customTask, hTask.completed);
}

function createHTask(customTask) {
  if (customTask.gTask.deleted) return;

  createTaskApi(customTask.createPayload());
  taskScorer(customTask, false);
}

function taskScorer(customTask, hTaskCompleted) {
  const gTask = customTask.gTask;
  let gTaskCompleted = gTask.status == "completed";

  if (gTaskCompleted != hTaskCompleted) {
    let direction = gTaskCompleted ? "up" : "down";
    scoreTaskApi(customTask.getId(), direction);
  }
}
