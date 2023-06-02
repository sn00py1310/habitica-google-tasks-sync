function fechtTasksApi(todoType) {
  const response = UrlFetchApp.fetch(
    `${baseApi}/tasks/user?type=${todoType}`,
    getDefaultParams()
  );

  let resData = JSON.parse(response.getContentText());
  if (!resData.success) {
    throw new Error(
      `Request Error, ${response.getResponseCode()} - ${response.getContentText()}`
    );
  }
  return skipOtherTasks(resData.data);
}

function getAllTasksApi() {
  let allTasks = [];
  for (const type of ["todos", "completedTodos"]) {
    allTasks = allTasks.concat(fechtTasksApi(type));
  }
  return allTasks;
}

function skipOtherTasks(data) {
  let tasks = [];
  for (const t of data) {
    if (!t.alias || !t.alias.startsWith(aliasPrefix)) continue;
    tasks.push(t);
  }
  return tasks;
}

function createTaskApi(payload) {
  let params = getDefaultParams();
  params.method = "post";
  params.payload = JSON.stringify(payload);

  const response = UrlFetchApp.fetch(`${baseApi}/tasks/user`, params);
  let resData = JSON.parse(response.getContentText());
  if (!resData.success) {
    throw new Error(
      `Request Error, ${response.getResponseCode()} - ${response.getContentText()}`
    );
  }
}

function updateTaskApi(payload, taskId) {
  let params = getDefaultParams();
  params.method = "put";
  params.payload = JSON.stringify(payload);

  const response = UrlFetchApp.fetch(`${baseApi}/tasks/${taskId}`, params);
  let resData = JSON.parse(response.getContentText());
  if (!resData.success) {
    throw new Error(
      `Request Error, ${response.getResponseCode()} - ${response.getContentText()}`
    );
  }
}

function deleteTaskApi(taskId) {
  let params = getDefaultParams();
  params.method = "delete";

  const response = UrlFetchApp.fetch(`${baseApi}/tasks/${taskId}`, params);
  let resData = JSON.parse(response.getContentText());
  if (!resData.success) {
    throw new Error(
      `Request Error, ${response.getResponseCode()} - ${response.getContentText()}`
    );
  }
}

function scoreTaskApi(taskId, direction) {
  let params = getDefaultParams();
  params.method = "post";

  const response = UrlFetchApp.fetch(
    `${baseApi}/tasks/${taskId}/score/${direction}`,
    params
  );

  let resData = JSON.parse(response.getContentText());
  if (!resData.success) {
    throw new Error(
      `Request Error, ${response.getResponseCode()} - ${response.getContentText()}`
    );
  }
}

class CustomTask {
  constructor(gTask, listTitle, listId) {
    this.gTask = gTask;
    this.listTitle = listTitle;
    this.listId = listId;
  }

  getId() {
    return aliasPrefix + this.gTask.id;
  }

  patchPayload() {
    const g = this.gTask;
    let p = {};
    p.type = "todo";
    p.text = `[${this.listTitle}] ${g.title} (GTasks)`;
    if (habiticaTags) p.tags = habiticaTags;

    p.notes = `${g.notes ?? ""} (Last Updated: ${new Date().toLocaleString()})`;

    return p;
  }

  createPayload() {
    let p = this.patchPayload();
    p.alias = this.getId();
    return p;
  }
}
