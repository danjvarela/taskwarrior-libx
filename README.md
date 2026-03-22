# taskwarrior-libx

A TypeScript library for interacting with [Taskwarrior](https://taskwarrior.org/) programmatically.

> **⚠️ Node.js only.** This library cannot be used in a browser — it shells out to the `task` CLI.

## Requirements

- **Taskwarrior v3+** must be installed and available in your `PATH`
  ```bash
  task --version  # should print 3.x.x or above
  ```

## Installation

```bash
npm install taskwarrior-libx
# or
pnpm add taskwarrior-libx
```

## Usage

All operations are available through a client created with `createTaskwarriorClient`. The `config` parameter is optional — omit it to use your system's default Taskwarrior config.

```ts
import { createTaskwarriorClient } from "taskwarrior-libx";

const client = createTaskwarriorClient({
  taskRc: "/path/to/.taskrc",   // optional
  taskData: "/path/to/data",    // optional
});
```

### Creating and retrieving tasks

```ts
// Create a task
const task = await client.createTask("Buy milk due:tomorrow priority:H project:Home");

// Get a single task by UUID or numeric ID
const task = await client.getTask("some-uuid");

// Get all tasks matching a filter
const tasks = await client.getTasks("status:pending project:Home");
```

### Modifying tasks

```ts
// Modify a single task
const updated = await client.modifyTask("some-uuid", "priority:L due:friday");

// Modify all tasks matching a filter
const updated = await client.modifyTasks("project:Home", "project:Personal");
```

### Lifecycle

```ts
// Start a task (adds a start timestamp, status stays "pending")
await client.startTask("some-uuid");

// Stop a task (clears the start timestamp)
await client.stopTask("some-uuid");

// Mark a task as done
await client.doneTask("some-uuid");
```

### Annotations

```ts
// Add an annotation
await client.annotateTask("some-uuid", "Check the fridge first");

// Remove an annotation (matched as substring)
await client.denotateTask("some-uuid", "Check the fridge first");
```

### Other operations

```ts
// Duplicate a task (optionally with modifications)
const copy = await client.duplicateTask("some-uuid", "project:Work");

// Delete tasks matching a filter
await client.deleteTasks("project:Home status:pending");

// Purge deleted tasks permanently (local-only, not synced)
const purgedUUIDs = await client.purgeTasks("status:deleted");

// Import tasks from JSON
const imported = await client.importTasks(JSON.stringify([
  { description: "Task one" },
  { description: "Task two" },
]));
```

## API Reference

See the [full API documentation](./docs/README.md).
