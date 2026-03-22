import { execFile, spawn } from "child_process";
import { promisify } from "util";
import type { Task } from "./task.js";
import type { Config } from "./config.js";

const execFileAsync = promisify(execFile);

async function exportTasks(args: string[], config?: Config): Promise<Task[]> {
  const res = await execFileAsync("task", [...args, "export"], {
    env: buildEnv(config),
  });
  return JSON.parse(res.stdout || "[]") as Task[];
}

function buildEnv(env?: {
  taskRc?: string;
  taskData?: string;
}): NodeJS.ProcessEnv {
  return {
    ...process.env,
    ...(env?.taskRc ? { TASKRC: env.taskRc } : {}),
    ...(env?.taskData ? { TASKDATA: env.taskData } : {}),
  };
}

export async function getTasks(
  filters: string,
  config?: Config,
): Promise<Task[]> {
  const filtersSplit = filters.split(" ");
  return await exportTasks(filtersSplit, config);
}

export async function getTask(
  idOrUUID: string,
  config?: Config,
): Promise<Task | null> {
  const [task] = await exportTasks([idOrUUID], config);
  return task ?? null;
}

export async function createTask(args: string, config?: Config): Promise<Task> {
  const argsSplit = args.split(" ");
  const createdRes = await execFileAsync(
    "task",
    ["rc.verbose=new-uuid", "add", ...argsSplit],
    {
      env: buildEnv(config),
    },
  );

  const match = createdRes.stdout.match(/Created task ([a-f0-9-]+)\./);

  const createdUUID = match?.[1]!;

  const [created] = await exportTasks([createdUUID], config);
  return created;
}

export async function modifyTasks(
  filters: string,
  modifications: string,
  config?: Config,
): Promise<Task[]> {
  const filtersSplit = filters.split(" ");
  const modificationsSplit = modifications.split(" ");

  const tasksBeforeModify = await exportTasks(filtersSplit, config);
  const uuids = tasksBeforeModify.map((t) => t.uuid);

  if (uuids.length === 0) return [];

  await execFileAsync(
    "task",
    ["rc.confirmation=off", ...filtersSplit, "modify", ...modificationsSplit],
    { env: buildEnv(config) },
  );

  return await exportTasks(uuids, config);
}

export async function modifyTask(
  idOrUUID: string,
  modifications: string,
  config?: Config,
): Promise<Task | null> {
  const modificationsSplit = modifications.split(" ");

  const [taskToModify] = await exportTasks([idOrUUID], config);
  if (!taskToModify) return null;

  await execFileAsync(
    "task",
    ["rc.confirmation=off", idOrUUID, "modify", ...modificationsSplit],
    { env: buildEnv(config) },
  );

  const [updated] = await exportTasks([idOrUUID], config);
  return updated;
}

export async function annotateTasks(
  filters: string,
  annotation: string,
  config?: Config,
): Promise<Task[]> {
  const filtersSplit = filters.split(" ");

  const tasksBeforeAnnotate = await exportTasks(filtersSplit, config);
  const uuids = tasksBeforeAnnotate.map((t) => t.uuid);

  if (uuids.length === 0) return [];

  await execFileAsync(
    "task",
    ["rc.confirmation=off", ...filtersSplit, "annotate", annotation],
    { env: buildEnv(config) },
  );

  return await exportTasks(uuids, config);
}

export async function annotateTask(
  idOrUUID: string,
  annotation: string,
  config?: Config,
): Promise<Task | null> {
  const [taskToAnnotate] = await exportTasks([idOrUUID], config);
  if (!taskToAnnotate) return null;

  await execFileAsync(
    "task",
    ["rc.confirmation=off", idOrUUID, "annotate", annotation],
    { env: buildEnv(config) },
  );

  const [updated] = await exportTasks([idOrUUID], config);
  return updated;
}

export async function denotateTasks(
  filters: string,
  annotation: string,
  config?: Config,
): Promise<void> {
  const filtersSplit = filters.split(" ");

  const tasksToDenotate = await exportTasks(filtersSplit, config);
  if (!tasksToDenotate.length) return;

  await execFileAsync(
    "task",
    ["rc.confirmation=off", ...filtersSplit, "denotate", annotation],
    { env: buildEnv(config) },
  );
}

export async function denotateTask(
  idOrUUID: string,
  annotation: string,
  config?: Config,
): Promise<void> {
  const [taskToDenotate] = await exportTasks([idOrUUID], config);
  if (!taskToDenotate) return;

  await execFileAsync(
    "task",
    ["rc.confirmation=off", idOrUUID, "denotate", annotation],
    { env: buildEnv(config) },
  );
}

export async function doneTasks(
  filters: string,
  config?: Config,
): Promise<Task[]> {
  const filtersSplit = filters.split(" ");

  const tasksBeforeDone = await exportTasks(filtersSplit, config);
  const uuids = tasksBeforeDone.map((t) => t.uuid);

  if (uuids.length === 0) return [];

  await execFileAsync(
    "task",
    ["rc.confirmation=off", ...filtersSplit, "done"],
    { env: buildEnv(config) },
  );

  return await exportTasks(uuids, config);
}

export async function doneTask(
  idOrUUID: string,
  config?: Config,
): Promise<Task | null> {
  const [taskToComplete] = await exportTasks([idOrUUID], config);
  if (!taskToComplete) return null;

  await execFileAsync("task", ["rc.confirmation=off", idOrUUID, "done"], {
    env: buildEnv(config),
  });

  const [completed] = await exportTasks([taskToComplete.uuid], config);
  return completed;
}

export async function startTasks(
  filters: string,
  config?: Config,
): Promise<Task[]> {
  const filtersSplit = filters.split(" ");

  const tasksBeforeStart = await exportTasks(filtersSplit, config);
  const uuids = tasksBeforeStart.map((t) => t.uuid);

  if (uuids.length === 0) return [];

  await execFileAsync(
    "task",
    ["rc.confirmation=off", ...filtersSplit, "start"],
    { env: buildEnv(config) },
  );

  return await exportTasks(uuids, config);
}

export async function startTask(
  idOrUUID: string,
  config?: Config,
): Promise<Task | null> {
  const [taskToStart] = await exportTasks([idOrUUID], config);
  if (!taskToStart) return null;

  await execFileAsync("task", ["rc.confirmation=off", idOrUUID, "start"], {
    env: buildEnv(config),
  });

  const [started] = await exportTasks([idOrUUID], config);
  return started;
}

export async function stopTasks(
  filters: string,
  config?: Config,
): Promise<Task[]> {
  const filtersSplit = filters.split(" ");

  const tasksBeforeStop = await exportTasks(filtersSplit, config);
  const uuids = tasksBeforeStop.map((t) => t.uuid);

  if (uuids.length === 0) return [];

  await execFileAsync(
    "task",
    ["rc.confirmation=off", ...filtersSplit, "stop"],
    { env: buildEnv(config) },
  );

  return await exportTasks(uuids, config);
}

export async function stopTask(
  idOrUUID: string,
  config?: Config,
): Promise<Task | null> {
  const [taskToStop] = await exportTasks([idOrUUID], config);
  if (!taskToStop) return null;

  await execFileAsync("task", ["rc.confirmation=off", idOrUUID, "stop"], {
    env: buildEnv(config),
  });

  const [stopped] = await exportTasks([idOrUUID], config);
  return stopped;
}

export async function deleteTasks(
  filters: string,
  config?: Config,
): Promise<void> {
  const filtersSplit = filters.split(" ");

  const tasksToBeDeleted = await exportTasks(filtersSplit, config);
  if (!tasksToBeDeleted.length) return;

  await execFileAsync(
    "task",
    ["rc.confirmation=off", ...filtersSplit, "delete"],
    { env: buildEnv(config) },
  );
}

export async function deleteTask(
  idOrUUID: string,
  config?: Config,
): Promise<void> {
  const [taskToDelete] = await exportTasks([idOrUUID], config);
  if (!taskToDelete) return;

  await execFileAsync("task", ["rc.confirmation=off", idOrUUID, "delete"], {
    env: buildEnv(config),
  });
}

export async function importTasks(
  json: string,
  config?: Config,
): Promise<Task[]> {
  if (json === "[]") return [];

  const stdout = await new Promise<string>((resolve, reject) => {
    const proc = spawn("task", ["import"], { env: buildEnv(config) });
    let out = "";
    proc.stdout.on("data", (d: Buffer) => (out += d.toString()));
    proc.on("close", (code) =>
      code === 0
        ? resolve(out)
        : reject(new Error(`task import exited ${code}`)),
    );
    proc.on("error", reject);
    proc.stdin.write(json);
    proc.stdin.end();
  });

  const uuids = [...stdout.matchAll(/^\s+(?:add|mod)\s+([a-f0-9-]{36})/gm)].map(
    (m) => m[1],
  );

  return await exportTasks(uuids, config);
}
