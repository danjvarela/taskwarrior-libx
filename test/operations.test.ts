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
  deleteTasks,
  deleteTask,
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
