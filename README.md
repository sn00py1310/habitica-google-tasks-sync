# Habitica Google Tasks Sync

## Features
- Rate Limit efficient, only changes updated Google Tasks
- One-way synchronization from Google Tasks to Habitica
    - Syncs tasks that have been unmarked again (with a limit of Habitica auto delete and only 30 latest marked tasks)
    - Auto deletes Habitica tasks when Google Task got deleted
- Add default Tags for easy searching

## Limitations
- No synchronization when a Task is moved to excluded Task Lists
- Subtasks a treated as their individual tasks
- No due date implementation
- If too many changes between the executions the script can crash.

## Setup
### Installation
1. Go to the [latest release](./releases/latest) and download the .zip or .tar.gz file.
2. Create a Google App Script (GAS) Project [here](https://script.google.com).
3. Copy the content of the `src` folder in the downloaded release to the create GAS Project.
4. Get your Habitica API user and token from [here](https://habitica.com/user/settings/api).
5. Add the "Tasks API" service to the Apps Script project.
        From within the project, select the "Services" + then scroll down and add the "Tasks API" service.

7. Setup the project variables for the GAS Project under the settings, see [Setting](#settings).
8. In the GAS Project create a trigger for the function main. Set the repeating time to 5min.
9. Go to the main file and run the main method once, now you should get a pop-up to request access to your Task and to send external requests.
10. See the Tasks sync to Habitica.


### Settings
| Optional | Key | Value |
| --- | --- | --- |
| :x: | `habitica_api_key` | The Api key for your Habitica account |
| :x: | `habitica_api_user` | The Api user for your Habitica account |
| :heavy_check_mark: | `habitica_tags` | A comma (`,`) separated list of tags to add to the Tasks |
| :heavy_check_mark: | `excludedTaskLists` | A comma (`,`) separated list of Google Tasks List id to exclude (no spaces). See tutorial below |
| :heavy_check_mark: | `lastRun` | `System Setting` A timestamp to keep track of the last runs, to only get update Google Tasks. You don't need to create it, it will be done automatically |



#### Getting Google Task IDs
The simplest way to obtain the IDs for the lists we don't want to consider, is to run the tool once and write them down. Please note that this will write all of those tasks in Habitica, so you may need to manually remove them to finish your set-up.

1. Go to [GAS](https://script.google.com/home) and select your project
2. In the code editor, select `main.py`
3. After having completed up to step 7 from the **Installation** tutorial, execute `main.py`
4. Scroll down to find your lists' names and IDs
5. Fill in `excludedTaskLists` within the **Settings**. Simply copy the IDs. Do not include spaces between the items.
   
    *Example: R22gbHZENWt3amJMDPZQL,MQE1Nzc0NjA1OTE2MzutNTk0N6MDow,T26ybHZENWt3amJMWXZQLQ*
7. Rerun `main.py`and check it is working as intended
