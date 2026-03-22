import { describe, it, expect, beforeEach, afterEach } from "vitest";
import { mkdtemp, rm, writeFile } from "fs/promises";
import { join } from "path";
import { tmpdir } from "os";
import {
  getTasks,
  getTask,
  createTask,
  modifyTasks,
  modifyTask,
  doneTasks,
  doneTask,
  startTasks,
  startTask,
  stopTasks,
  stopTask,
  deleteTasks,
  deleteTask,
  annotateTasks,
  annotateTask,
  denotateTasks,
  denotateTask,
  importTasks,
  duplicateTask,
} from "../src/operations";
import type { Config } from "../src/config";

let config: Config;

beforeEach(async () => {
  const dir = await mkdtemp(join(tmpdir(), "tw-test-"));
  const taskRc = join(dir, ".taskrc");
  await writeFile(taskRc, "");
  config = { taskData: dir, taskRc };
});

afterEach(async () => {
  await rm(config.taskData!, { recursive: true, force: true });
});

describe("getTasks", () => {
  it("returns an empty array when no tasks exist", async () => {
    const tasks = await getTasks("status:pending", config);
    expect(tasks).toEqual([]);
  });

  it("returns an array of all matching tasks", async () => {
    await createTask("Buy milk", config);
    await createTask("Walk the dog", config);

    const tasks = await getTasks("status:pending", config);
    expect(Array.isArray(tasks)).toBe(true);
    expect(tasks).toHaveLength(2);
  });

  it("filters tasks by the given filter string", async () => {
    await createTask("Buy milk project:Home", config);
    await createTask("Walk the dog", config);

    const tasks = await getTasks("project:Home", config);
    expect(tasks).toHaveLength(1);
    expect(tasks[0].project).toBe("Home");
  });

  it("returns an empty array when no tasks match the filter", async () => {
    await createTask("Buy milk", config);
    await createTask("Walk the dog", config);

    const tasks = await getTasks("project:Home", config);
    expect(tasks).toEqual([]);
  });

  it("returns tasks with the expected shape", async () => {
    await createTask("Buy milk", config);

    const [task] = await getTasks("status:pending", config);
    expect(task.uuid).toBeDefined();
    expect(task.description).toBe("Buy milk");
    expect(task.status).toBe("pending");
  });
});

describe("createTask", () => {
  it("returns the created task", async () => {
    const task = await createTask("Buy milk", config);
    expect(task).toMatchObject({
      description: "Buy milk",
      status: "pending",
    });
    expect(task.uuid).toBeDefined();
  });

  it("creates the task with additional attributes", async () => {
    const task = await createTask("Buy milk project:Home priority:H", config);
    expect(task.project).toBe("Home");
    expect(task.priority).toBe("H");
  });

  it("newly created task can be retrieved via getTasks", async () => {
    const created = await createTask("Buy milk", config);
    const tasks = await getTasks("status:pending", config);
    expect(tasks.some((t) => t.uuid === created.uuid)).toBe(true);
  });
});

describe("getTask", () => {
  it("returns the task for a given UUID", async () => {
    const created = await createTask("Buy milk", config);

    const task = await getTask(created.uuid, config);
    expect(task).toMatchObject({ uuid: created.uuid, description: "Buy milk" });
  });

  it("returns the task for a given numeric id", async () => {
    const created = await createTask("Buy milk", config);

    const task = await getTask(String(created.id), config);
    expect(task).toMatchObject({ description: "Buy milk" });
  });

  it("returns null when the task does not exist", async () => {
    const task = await getTask("00000000-0000-0000-0000-000000000000", config);
    expect(task).toBeNull();
  });
});

describe("modifyTasks", () => {
  it("returns the modified tasks with updated attributes", async () => {
    const created = await createTask("Buy milk", config);

    const modified = await modifyTasks(
      `uuid:${created.uuid}`,
      "priority:H",
      config,
    );

    expect(modified).toHaveLength(1);
    expect(modified[0].uuid).toBe(created.uuid);
    expect(modified[0].priority).toBe("H");
  });

  it("returns multiple modified tasks", async () => {
    await createTask("Buy milk project:Home", config);
    await createTask("Walk the dog project:Home", config);

    const modified = await modifyTasks("project:Home", "priority:L", config);

    expect(modified).toHaveLength(2);
    expect(modified.every((t) => t.priority === "L")).toBe(true);
  });

  it("returns an empty array when no tasks match the filter", async () => {
    const modified = await modifyTasks(
      "project:Nonexistent",
      "priority:H",
      config,
    );
    expect(modified).toEqual([]);
  });

  it("each returned task has a uuid", async () => {
    const created = await createTask("Buy milk", config);

    const modified = await modifyTasks(
      `uuid:${created.uuid}`,
      "project:Home",
      config,
    );

    expect(modified[0].uuid).toBeDefined();
    expect(modified[0].project).toBe("Home");
  });
});

describe("modifyTask", () => {
  it("returns the modified task with updated attributes by UUID", async () => {
    const created = await createTask("Buy milk", config);

    const modified = await modifyTask(created.uuid, "priority:H", config);

    expect(modified).not.toBeNull();
    expect(modified!.uuid).toBe(created.uuid);
    expect(modified!.priority).toBe("H");
  });

  it("returns the modified task with updated attributes by numeric id", async () => {
    const created = await createTask("Buy milk", config);

    const modified = await modifyTask(String(created.id), "priority:L", config);

    expect(modified).not.toBeNull();
    expect(modified!.uuid).toBe(created.uuid);
    expect(modified!.priority).toBe("L");
  });

  it("can modify multiple attributes at once", async () => {
    const created = await createTask("Buy milk", config);

    const modified = await modifyTask(
      created.uuid,
      "project:Home priority:H",
      config,
    );

    expect(modified).not.toBeNull();
    expect(modified!.project).toBe("Home");
    expect(modified!.priority).toBe("H");
  });

  it("preserves unmodified attributes", async () => {
    const created = await createTask("Buy milk project:Home", config);

    const modified = await modifyTask(created.uuid, "priority:H", config);

    expect(modified).not.toBeNull();
    expect(modified!.project).toBe("Home");
    expect(modified!.description).toBe("Buy milk");
  });

  it("returns the task with expected shape", async () => {
    const created = await createTask("Buy milk", config);

    const modified = await modifyTask(created.uuid, "priority:M", config);

    expect(modified).not.toBeNull();
    expect(modified!.uuid).toBeDefined();
    expect(modified!.description).toBe("Buy milk");
    expect(modified!.status).toBe("pending");
  });

  it("returns null when the task does not exist", async () => {
    const result = await modifyTask(
      "00000000-0000-0000-0000-000000000000",
      "priority:H",
      config,
    );
    expect(result).toBeNull();
  });
});

describe("deleteTasks", () => {
  it("removes matching tasks from the pending list", async () => {
    const created = await createTask("Buy milk", config);

    await deleteTasks(`uuid:${created.uuid}`, config);

    const tasks = await getTasks("status:pending", config);
    expect(tasks.some((t) => t.uuid === created.uuid)).toBe(false);
  });

  it("sets deleted tasks to status deleted", async () => {
    const created = await createTask("Buy milk", config);

    await deleteTasks(`uuid:${created.uuid}`, config);

    const deleted = await getTask(created.uuid, config);
    expect(deleted?.status).toBe("deleted");
  });

  it("deletes multiple tasks matching the filter", async () => {
    await createTask("Buy milk project:Home", config);
    await createTask("Walk the dog project:Home", config);

    await deleteTasks("project:Home", config);

    const remaining = await getTasks("project:Home status:pending", config);
    expect(remaining).toHaveLength(0);
  });

  it("does nothing when no tasks match the filter", async () => {
    await createTask("Buy milk", config);

    await expect(
      deleteTasks("project:Nonexistent", config),
    ).resolves.not.toThrow();

    const tasks = await getTasks("status:pending", config);
    expect(tasks).toHaveLength(1);
  });

  it("only deletes tasks matching the filter, leaving others intact", async () => {
    const keep = await createTask("Buy milk project:Home", config);
    await createTask("Walk the dog project:Outdoor", config);

    await deleteTasks("project:Outdoor", config);

    const remaining = await getTasks("status:pending", config);
    expect(remaining).toHaveLength(1);
    expect(remaining[0].uuid).toBe(keep.uuid);
  });
});

describe("deleteTask", () => {
  it("removes the task from the pending list by UUID", async () => {
    const created = await createTask("Buy milk", config);

    await deleteTask(created.uuid, config);

    const tasks = await getTasks("status:pending", config);
    expect(tasks.some((t) => t.uuid === created.uuid)).toBe(false);
  });

  it("removes the task from the pending list by numeric id", async () => {
    const created = await createTask("Buy milk", config);

    await deleteTask(String(created.id), config);

    const tasks = await getTasks("status:pending", config);
    expect(tasks.some((t) => t.uuid === created.uuid)).toBe(false);
  });

  it("sets the task status to deleted", async () => {
    const created = await createTask("Buy milk", config);

    await deleteTask(created.uuid, config);

    const deleted = await getTask(created.uuid, config);
    expect(deleted?.status).toBe("deleted");
  });

  it("does nothing when the task does not exist", async () => {
    await expect(
      deleteTask("00000000-0000-0000-0000-000000000000", config),
    ).resolves.not.toThrow();
  });

  it("only deletes the specified task, leaving others intact", async () => {
    const keep = await createTask("Buy milk", config);
    const toDelete = await createTask("Walk the dog", config);

    await deleteTask(toDelete.uuid, config);

    const remaining = await getTasks("status:pending", config);
    expect(remaining).toHaveLength(1);
    expect(remaining[0].uuid).toBe(keep.uuid);
  });
});

describe("annotateTask", () => {
  it("adds an annotation to a task by UUID", async () => {
    const created = await createTask("Buy milk", config);

    const annotated = await annotateTask(created.uuid, "Check expiry date", config);

    expect(annotated).not.toBeNull();
    expect(annotated!.annotations).toHaveLength(1);
    expect(annotated!.annotations![0].description).toBe("Check expiry date");
  });

  it("adds an annotation to a task by numeric id", async () => {
    const created = await createTask("Buy milk", config);

    const annotated = await annotateTask(String(created.id), "Check expiry date", config);

    expect(annotated).not.toBeNull();
    expect(annotated!.annotations).toHaveLength(1);
    expect(annotated!.annotations![0].description).toBe("Check expiry date");
  });

  it("preserves existing task attributes", async () => {
    const created = await createTask("Buy milk project:Home", config);

    const annotated = await annotateTask(created.uuid, "Check expiry date", config);

    expect(annotated).not.toBeNull();
    expect(annotated!.project).toBe("Home");
    expect(annotated!.description).toBe("Buy milk");
  });

  it("returns null when the task does not exist", async () => {
    const result = await annotateTask(
      "00000000-0000-0000-0000-000000000000",
      "Some note",
      config,
    );
    expect(result).toBeNull();
  });
});

describe("annotateTasks", () => {
  it("adds an annotation to all matching tasks", async () => {
    await createTask("Buy milk project:Home", config);
    await createTask("Walk the dog project:Home", config);

    const annotated = await annotateTasks("project:Home", "Needs attention", config);

    expect(annotated).toHaveLength(2);
    expect(annotated.every((t) => t.annotations?.some((a) => a.description === "Needs attention"))).toBe(true);
  });

  it("returns an empty array when no tasks match the filter", async () => {
    const annotated = await annotateTasks("project:Nonexistent", "Some note", config);
    expect(annotated).toEqual([]);
  });

  it("returns tasks with the annotation and preserves existing attributes", async () => {
    const created = await createTask("Buy milk project:Home", config);

    const [annotated] = await annotateTasks(`uuid:${created.uuid}`, "Check stock", config);

    expect(annotated.uuid).toBe(created.uuid);
    expect(annotated.project).toBe("Home");
    expect(annotated.annotations).toHaveLength(1);
    expect(annotated.annotations![0].description).toBe("Check stock");
  });
});

describe("denotateTask", () => {
  it("removes an annotation from a task by UUID", async () => {
    const created = await createTask("Buy milk", config);
    await annotateTask(created.uuid, "Check expiry date", config);

    await denotateTask(created.uuid, "Check expiry date", config);

    const task = await getTask(created.uuid, config);
    expect(task!.annotations ?? []).toHaveLength(0);
  });

  it("removes an annotation from a task by numeric id", async () => {
    const created = await createTask("Buy milk", config);
    await annotateTask(created.uuid, "Check expiry date", config);

    await denotateTask(String(created.id), "Check expiry date", config);

    const task = await getTask(created.uuid, config);
    expect(task!.annotations ?? []).toHaveLength(0);
  });

  it("does nothing when the task does not exist", async () => {
    await expect(
      denotateTask("00000000-0000-0000-0000-000000000000", "Some note", config),
    ).resolves.not.toThrow();
  });
});

describe("denotateTasks", () => {
  it("removes a matching annotation from all matching tasks", async () => {
    await createTask("Buy milk project:Home", config);
    await createTask("Walk the dog project:Home", config);
    await annotateTasks("project:Home", "Needs attention", config);

    await denotateTasks("project:Home", "Needs attention", config);

    const tasks = await getTasks("project:Home", config);
    expect(tasks.every((t) => (t.annotations ?? []).length === 0)).toBe(true);
  });

  it("does nothing when no tasks match the filter", async () => {
    await expect(
      denotateTasks("project:Nonexistent", "Some note", config),
    ).resolves.not.toThrow();
  });
});

describe("doneTask", () => {
  it("marks the task as completed by UUID", async () => {
    const created = await createTask("Buy milk", config);

    const completed = await doneTask(created.uuid, config);

    expect(completed).not.toBeNull();
    expect(completed!.status).toBe("completed");
    expect(completed!.uuid).toBe(created.uuid);
  });

  it("marks the task as completed by numeric id", async () => {
    const created = await createTask("Buy milk", config);

    const completed = await doneTask(String(created.id), config);

    expect(completed).not.toBeNull();
    expect(completed!.status).toBe("completed");
  });

  it("sets the end timestamp", async () => {
    const created = await createTask("Buy milk", config);

    const completed = await doneTask(created.uuid, config);

    expect(completed!.end).toBeDefined();
  });

  it("returns null when the task does not exist", async () => {
    const result = await doneTask("00000000-0000-0000-0000-000000000000", config);
    expect(result).toBeNull();
  });
});

describe("doneTasks", () => {
  it("marks all matching tasks as completed", async () => {
    await createTask("Buy milk project:Home", config);
    await createTask("Walk the dog project:Home", config);

    const completed = await doneTasks("project:Home", config);

    expect(completed).toHaveLength(2);
    expect(completed.every((t) => t.status === "completed")).toBe(true);
  });

  it("returns an empty array when no tasks match the filter", async () => {
    const completed = await doneTasks("project:Nonexistent", config);
    expect(completed).toEqual([]);
  });

  it("only completes tasks matching the filter, leaving others pending", async () => {
    await createTask("Buy milk project:Home", config);
    await createTask("Walk the dog project:Outdoor", config);

    await doneTasks("project:Home", config);

    const remaining = await getTasks("status:pending", config);
    expect(remaining).toHaveLength(1);
    expect(remaining[0].project).toBe("Outdoor");
  });
});

describe("startTask", () => {
  it("sets the start timestamp by UUID", async () => {
    const created = await createTask("Buy milk", config);

    const started = await startTask(created.uuid, config);

    expect(started).not.toBeNull();
    expect(started!.start).toBeDefined();
  });

  it("sets the start timestamp by numeric id", async () => {
    const created = await createTask("Buy milk", config);

    const started = await startTask(String(created.id), config);

    expect(started).not.toBeNull();
    expect(started!.start).toBeDefined();
  });

  it("preserves status as pending", async () => {
    const created = await createTask("Buy milk", config);

    const started = await startTask(created.uuid, config);

    expect(started!.status).toBe("pending");
  });

  it("returns null when the task does not exist", async () => {
    const result = await startTask("00000000-0000-0000-0000-000000000000", config);
    expect(result).toBeNull();
  });
});

describe("startTasks", () => {
  it("sets the start timestamp on all matching tasks", async () => {
    await createTask("Buy milk project:Home", config);
    await createTask("Walk the dog project:Home", config);

    const started = await startTasks("project:Home", config);

    expect(started).toHaveLength(2);
    expect(started.every((t) => t.start !== undefined)).toBe(true);
  });

  it("returns an empty array when no tasks match the filter", async () => {
    const started = await startTasks("project:Nonexistent", config);
    expect(started).toEqual([]);
  });
});

describe("stopTask", () => {
  it("clears the start timestamp by UUID", async () => {
    const created = await createTask("Buy milk", config);
    await startTask(created.uuid, config);

    const stopped = await stopTask(created.uuid, config);

    expect(stopped).not.toBeNull();
    expect(stopped!.start).toBeUndefined();
  });

  it("clears the start timestamp by numeric id", async () => {
    const created = await createTask("Buy milk", config);
    await startTask(created.uuid, config);

    const stopped = await stopTask(String(created.id), config);

    expect(stopped).not.toBeNull();
    expect(stopped!.start).toBeUndefined();
  });

  it("returns null when the task does not exist", async () => {
    const result = await stopTask("00000000-0000-0000-0000-000000000000", config);
    expect(result).toBeNull();
  });
});

describe("stopTasks", () => {
  it("clears the start timestamp on all matching started tasks", async () => {
    await createTask("Buy milk project:Home", config);
    await createTask("Walk the dog project:Home", config);
    await startTasks("project:Home", config);

    const stopped = await stopTasks("project:Home +ACTIVE", config);

    expect(stopped).toHaveLength(2);
    expect(stopped.every((t) => t.start === undefined)).toBe(true);
  });

  it("returns an empty array when no tasks match the filter", async () => {
    const stopped = await stopTasks("project:Nonexistent", config);
    expect(stopped).toEqual([]);
  });
});

describe("importTasks", () => {
  it("returns an empty array when given an empty JSON array", async () => {
    const result = await importTasks("[]", config);
    expect(result).toEqual([]);
  });

  it("creates new tasks from a JSON array", async () => {
    const json = JSON.stringify([
      { description: "Imported task one" },
      { description: "Imported task two" },
    ]);

    const result = await importTasks(json, config);

    expect(result).toHaveLength(2);
    expect(result.map((t) => t.description)).toEqual(
      expect.arrayContaining(["Imported task one", "Imported task two"]),
    );
  });

  it("returns tasks with the expected shape", async () => {
    const json = JSON.stringify([{ description: "Shape check task" }]);

    const [task] = await importTasks(json, config);

    expect(task.uuid).toBeDefined();
    expect(task.description).toBe("Shape check task");
    expect(task.status).toBe("pending");
  });

  it("updates an existing task when the UUID matches", async () => {
    const created = await createTask("Original description", config);

    const json = JSON.stringify([
      {
        uuid: created.uuid,
        description: "Updated description",
        status: "pending",
        entry: created.entry,
      },
    ]);

    const [updated] = await importTasks(json, config);

    expect(updated.uuid).toBe(created.uuid);
    expect(updated.description).toBe("Updated description");
  });

  it("creates tasks with a specified UUID", async () => {
    const uuid = "aaaaaaaa-bbbb-cccc-dddd-eeeeeeeeeeee";
    const json = JSON.stringify([{ uuid, description: "UUID task" }]);

    const [task] = await importTasks(json, config);

    expect(task.uuid).toBe(uuid);
  });
});

describe("duplicateTask", () => {
  it("returns a new task with the same description", async () => {
    const original = await createTask("Buy milk", config);
    const duplicate = await duplicateTask(original.uuid, undefined, config);

    expect(duplicate).not.toBeNull();
    expect(duplicate!.uuid).not.toBe(original.uuid);
    expect(duplicate!.description).toBe(original.description);
  });

  it("works with a numeric id", async () => {
    const original = await createTask("Walk the dog", config);
    const duplicate = await duplicateTask(String(original.id), undefined, config);

    expect(duplicate).not.toBeNull();
    expect(duplicate!.uuid).not.toBe(original.uuid);
    expect(duplicate!.description).toBe(original.description);
  });

  it("inherits all attributes of the original", async () => {
    const original = await createTask("Buy milk project:Home priority:H", config);
    const duplicate = await duplicateTask(original.uuid, undefined, config);

    expect(duplicate!.project).toBe(original.project);
    expect(duplicate!.priority).toBe(original.priority);
  });

  it("applies modifications to the duplicate", async () => {
    const original = await createTask("Buy milk project:Home priority:H", config);
    const duplicate = await duplicateTask(original.uuid, "project:Work priority:L", config);

    expect(duplicate!.description).toBe(original.description);
    expect(duplicate!.project).toBe("Work");
    expect(duplicate!.priority).toBe("L");
  });

  it("does not modify the original task", async () => {
    const original = await createTask("Buy milk project:Home", config);
    await duplicateTask(original.uuid, "project:Work", config);

    const unchanged = await getTask(original.uuid, config);
    expect(unchanged!.project).toBe("Home");
  });

  it("returns null when the task does not exist", async () => {
    const result = await duplicateTask("00000000-0000-0000-0000-000000000000", undefined, config);
    expect(result).toBeNull();
  });
});
