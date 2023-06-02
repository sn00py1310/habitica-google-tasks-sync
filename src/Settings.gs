const properties = PropertiesService.getScriptProperties();
const aliasPrefix = "GTasks_";

function getLastRunTime() {
  return new Date(properties.getProperty("lastRun"));
}

function updateLastRunTime() {
  properties.setProperty("lastRun", new Date());
}

const excludedTaskLists = properties.getProperty("excludedTaskLists")
  ? properties.getProperty("excludedTaskLists").split(",")
  : [];
function getExcludedTaskLists() {
  return excludedTaskLists;
}

const habiticaTags = properties.getProperty("habitica_tags")
  ? properties.getProperty("habitica_tags").split(",")
  : [];

function clearAllProperties() {
  PropertiesService.getUserProperties().deleteAllProperties();
  PropertiesService.getScriptProperties().deleteAllProperties();
}

const taskListReqSettigs = {
  showHidden: true,
  maxResults: 100,
};

const taskReqSettigs = {
  showHidden: true,
  showDeleted: true,
  maxResults: 100,
  updatedMin: getLastRunTime().toISOString(),
};

const baseApi = "https://habitica.com/api/v4";

const baseHeaders = {
  "x-api-key": properties.getProperty("habitica_api_key"),
  "x-api-user": properties.getProperty("habitica_api_user"),
  "content-type": "application/json",
};

const defaultParams = {
  headers: baseHeaders,
  muteHttpExceptions: true,
};

function getDefaultParams() {
  return copyObj(defaultParams);
}

function copyObj(obj) {
  return JSON.parse(JSON.stringify(obj));
}
