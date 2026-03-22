[**taskwarrior-libx v0.0.1**](../README.md)

***

[taskwarrior-libx](../README.md) / createTaskwarriorClient

# Function: createTaskwarriorClient()

> **createTaskwarriorClient**(`config`): `object`

Creates a Taskwarrior client bound to the provided configuration.
Each method accepts an optional `customConfig` to override the base config for that call.

## Parameters

### config

[`Config`](../interfaces/Config.md)

Base Taskwarrior configuration (e.g. paths to `taskrc` and `taskdata`).

## Returns

An object with methods for interacting with Taskwarrior.

### annotateTask()

> **annotateTask**(`idOrUUID`, `annotation`, `customConfig?`): `Promise`\<[`Task`](../interfaces/Task.md) \| `null`\>

Adds an annotation to a single task identified by its numeric ID or UUID.

#### Parameters

##### idOrUUID

`string`

The task's numeric ID or UUID string.

##### annotation

`string`

The annotation text to add.

##### customConfig?

[`Config`](../interfaces/Config.md)

Optional config overrides for this call.

#### Returns

`Promise`\<[`Task`](../interfaces/Task.md) \| `null`\>

A promise resolving to the annotated task, or `null` if not found.

### annotateTasks()

> **annotateTasks**(`filters`, `annotation`, `customConfig?`): `Promise`\<[`Task`](../interfaces/Task.md)[]\>

Adds an annotation to all tasks matching the given filter string.

#### Parameters

##### filters

`string`

A Taskwarrior filter expression to select tasks to annotate (e.g. `"project:work status:pending"`).

##### annotation

`string`

The annotation text to add.

##### customConfig?

[`Config`](../interfaces/Config.md)

Optional config overrides for this call.

#### Returns

`Promise`\<[`Task`](../interfaces/Task.md)[]\>

A promise resolving to an array of the annotated tasks.

### createTask()

> **createTask**(`args`, `customConfig?`): `Promise`\<[`Task`](../interfaces/Task.md)\>

Creates a new task with the given arguments.

#### Parameters

##### args

`string`

A string of Taskwarrior `add` arguments (e.g. `"Buy milk due:tomorrow"`).

##### customConfig?

[`Config`](../interfaces/Config.md)

Optional config overrides for this call.

#### Returns

`Promise`\<[`Task`](../interfaces/Task.md)\>

A promise resolving to the newly created task.

### deleteTask()

> **deleteTask**(`idOrUUID`, `customConfig?`): `Promise`\<`void`\>

Deletes a single task identified by its numeric ID or UUID.
Does nothing if the task does not exist.

#### Parameters

##### idOrUUID

`string`

The task's numeric ID or UUID string.

##### customConfig?

[`Config`](../interfaces/Config.md)

Optional config overrides for this call.

#### Returns

`Promise`\<`void`\>

A promise that resolves when the deletion is complete.

### deleteTasks()

> **deleteTasks**(`filters`, `customConfig?`): `Promise`\<`void`\>

Deletes all tasks matching the given filter string.

#### Parameters

##### filters

`string`

A Taskwarrior filter expression to select tasks to delete (e.g. `"project:work status:pending"`).

##### customConfig?

[`Config`](../interfaces/Config.md)

Optional config overrides for this call.

#### Returns

`Promise`\<`void`\>

A promise that resolves when the deletion is complete.

### denotateTask()

> **denotateTask**(`idOrUUID`, `annotation`, `customConfig?`): `Promise`\<`void`\>

Removes a matching annotation from a single task identified by its numeric ID or UUID.
Does nothing if the task does not exist.

#### Parameters

##### idOrUUID

`string`

The task's numeric ID or UUID string.

##### annotation

`string`

The annotation text to remove (matched as a substring).

##### customConfig?

[`Config`](../interfaces/Config.md)

Optional config overrides for this call.

#### Returns

`Promise`\<`void`\>

A promise that resolves when the denotation is complete.

### denotateTasks()

> **denotateTasks**(`filters`, `annotation`, `customConfig?`): `Promise`\<`void`\>

Removes a matching annotation from all tasks matching the given filter string.

#### Parameters

##### filters

`string`

A Taskwarrior filter expression to select tasks to denotate (e.g. `"project:work status:pending"`).

##### annotation

`string`

The annotation text to remove (matched as a substring).

##### customConfig?

[`Config`](../interfaces/Config.md)

Optional config overrides for this call.

#### Returns

`Promise`\<`void`\>

A promise that resolves when the denotation is complete.

### doneTask()

> **doneTask**(`idOrUUID`, `customConfig?`): `Promise`\<[`Task`](../interfaces/Task.md) \| `null`\>

Marks a single task identified by its numeric ID or UUID as completed.
Does nothing if the task does not exist.

#### Parameters

##### idOrUUID

`string`

The task's numeric ID or UUID string.

##### customConfig?

[`Config`](../interfaces/Config.md)

Optional config overrides for this call.

#### Returns

`Promise`\<[`Task`](../interfaces/Task.md) \| `null`\>

A promise resolving to the completed task, or `null` if not found.

### doneTasks()

> **doneTasks**(`filters`, `customConfig?`): `Promise`\<[`Task`](../interfaces/Task.md)[]\>

Marks all tasks matching the given filter as completed.

#### Parameters

##### filters

`string`

A Taskwarrior filter expression to select tasks to complete (e.g. `"project:work status:pending"`).

##### customConfig?

[`Config`](../interfaces/Config.md)

Optional config overrides for this call.

#### Returns

`Promise`\<[`Task`](../interfaces/Task.md)[]\>

A promise resolving to an array of the completed tasks.

### duplicateTask()

> **duplicateTask**(`idOrUUID`, `modifications?`, `customConfig?`): `Promise`\<[`Task`](../interfaces/Task.md) \| `null`\>

Duplicates a single task identified by its numeric ID or UUID.
The duplicate is a new task with a new UUID that inherits all attributes from the original.
Optional modifications are applied to the duplicate, leaving the original unchanged.

#### Parameters

##### idOrUUID

`string`

The task's numeric ID or UUID string.

##### modifications?

`string`

Optional string of Taskwarrior modification arguments to apply to the duplicate (e.g. `"project:Work priority:L"`).

##### customConfig?

[`Config`](../interfaces/Config.md)

Optional config overrides for this call.

#### Returns

`Promise`\<[`Task`](../interfaces/Task.md) \| `null`\>

A promise resolving to the duplicated task, or `null` if the original was not found.

### getTask()

> **getTask**(`idOrUUID`, `customConfig?`): `Promise`\<[`Task`](../interfaces/Task.md) \| `null`\>

Retrieves a single task by its numeric ID or UUID.

#### Parameters

##### idOrUUID

`string`

The task's numeric ID or UUID string.

##### customConfig?

[`Config`](../interfaces/Config.md)

Optional config overrides for this call.

#### Returns

`Promise`\<[`Task`](../interfaces/Task.md) \| `null`\>

A promise resolving to the matching task, or `null` if not found.

### getTasks()

> **getTasks**(`filters`, `customConfig?`): `Promise`\<[`Task`](../interfaces/Task.md)[]\>

Retrieves all tasks matching the given filter string.

#### Parameters

##### filters

`string`

A Taskwarrior filter expression (e.g. `"status:pending project:work"`).

##### customConfig?

[`Config`](../interfaces/Config.md)

Optional config overrides for this call.

#### Returns

`Promise`\<[`Task`](../interfaces/Task.md)[]\>

A promise resolving to an array of matching tasks.

### importTasks()

> **importTasks**(`json`, `customConfig?`): `Promise`\<[`Task`](../interfaces/Task.md)[]\>

Imports tasks from a JSON string (a single task object or an array of task objects).
Tasks without a UUID are created; tasks with an existing UUID are updated.

#### Parameters

##### json

`string`

A JSON string of a single task object or an array of task objects.

##### customConfig?

[`Config`](../interfaces/Config.md)

Optional config overrides for this call.

#### Returns

`Promise`\<[`Task`](../interfaces/Task.md)[]\>

A promise resolving to an array of the imported/updated tasks.

### modifyTask()

> **modifyTask**(`idOrUUID`, `modifications`, `customConfig?`): `Promise`\<[`Task`](../interfaces/Task.md) \| `null`\>

Modifies a single task identified by its numeric ID or UUID.

#### Parameters

##### idOrUUID

`string`

The task's numeric ID or UUID string.

##### modifications

`string`

A string of Taskwarrior modification arguments (e.g. `"priority:H due:tomorrow"`).

##### customConfig?

[`Config`](../interfaces/Config.md)

Optional config overrides for this call.

#### Returns

`Promise`\<[`Task`](../interfaces/Task.md) \| `null`\>

A promise resolving to the modified task, or `null` if not found.

### modifyTasks()

> **modifyTasks**(`filters`, `modifications`, `customConfig?`): `Promise`\<[`Task`](../interfaces/Task.md)[]\>

Modifies all tasks matching the given filter with the provided modifications.

#### Parameters

##### filters

`string`

A Taskwarrior filter expression to select tasks to modify.

##### modifications

`string`

A string of Taskwarrior modification arguments (e.g. `"priority:H due:tomorrow"`).

##### customConfig?

[`Config`](../interfaces/Config.md)

Optional config overrides for this call.

#### Returns

`Promise`\<[`Task`](../interfaces/Task.md)[]\>

A promise resolving to an array of the modified tasks.

### purgeTasks()

> **purgeTasks**(`filters`, `customConfig?`): `Promise`\<`string`[]\>

Permanently removes all deleted tasks matching the given filter from the database.
Tasks must already have `status:deleted` before they can be purged.
Purge is local-only — changes are not synced.

#### Parameters

##### filters

`string`

A Taskwarrior filter expression to select tasks to purge (e.g. `"status:deleted project:Work"`).

##### customConfig?

[`Config`](../interfaces/Config.md)

Optional config overrides for this call.

#### Returns

`Promise`\<`string`[]\>

A promise resolving to an array of UUIDs that were successfully purged.

### startTask()

> **startTask**(`idOrUUID`, `customConfig?`): `Promise`\<[`Task`](../interfaces/Task.md) \| `null`\>

Starts a single task identified by its numeric ID or UUID, recording a start timestamp.
Started tasks remain in `pending` status but gain a `start` field.
Does nothing if the task does not exist.

#### Parameters

##### idOrUUID

`string`

The task's numeric ID or UUID string.

##### customConfig?

[`Config`](../interfaces/Config.md)

Optional config overrides for this call.

#### Returns

`Promise`\<[`Task`](../interfaces/Task.md) \| `null`\>

A promise resolving to the started task, or `null` if not found.

### startTasks()

> **startTasks**(`filters`, `customConfig?`): `Promise`\<[`Task`](../interfaces/Task.md)[]\>

Starts all tasks matching the given filter, recording a start timestamp on each.
Started tasks remain in `pending` status but gain a `start` field.

#### Parameters

##### filters

`string`

A Taskwarrior filter expression to select tasks to start (e.g. `"project:work status:pending"`).

##### customConfig?

[`Config`](../interfaces/Config.md)

Optional config overrides for this call.

#### Returns

`Promise`\<[`Task`](../interfaces/Task.md)[]\>

A promise resolving to an array of the started tasks.

### stopTask()

> **stopTask**(`idOrUUID`, `customConfig?`): `Promise`\<[`Task`](../interfaces/Task.md) \| `null`\>

Stops a single task identified by its numeric ID or UUID, clearing its start timestamp.
Does nothing if the task does not exist.

#### Parameters

##### idOrUUID

`string`

The task's numeric ID or UUID string.

##### customConfig?

[`Config`](../interfaces/Config.md)

Optional config overrides for this call.

#### Returns

`Promise`\<[`Task`](../interfaces/Task.md) \| `null`\>

A promise resolving to the stopped task, or `null` if not found.

### stopTasks()

> **stopTasks**(`filters`, `customConfig?`): `Promise`\<[`Task`](../interfaces/Task.md)[]\>

Stops all tasks matching the given filter, clearing their start timestamp.

#### Parameters

##### filters

`string`

A Taskwarrior filter expression to select tasks to stop (e.g. `"+ACTIVE project:work"`).

##### customConfig?

[`Config`](../interfaces/Config.md)

Optional config overrides for this call.

#### Returns

`Promise`\<[`Task`](../interfaces/Task.md)[]\>

A promise resolving to an array of the stopped tasks.
