import { execFile } from "child_process";
import { promisify } from "util";

const execFileAsync = promisify(execFile);

interface Config {
  taskRc?: string;
  taskData?: string;
}

function buildEnv(env?: { taskRc?: string; taskData?: string }) {
  return {
    ...process.env,
    ...(env?.taskRc ? { TASKRC: env.taskRc } : {}),
    ...(env?.taskData ? { TASKDATA: env.taskData } : {}),
  };
}

async function getTasks(filters: string, config?: Config) {
  const filtersSplit = filters.split(" ");
  const res = await execFileAsync("task", [...filtersSplit, "export"], {
    env: buildEnv(config),
  });
  return JSON.parse(res.stdout);
}

async function createTask(args: string, config?: Config) {
  const argsSplit = args.split(" ");

  // stdout here returns:
  // "Created task <uuid-of-created-task>"
  const createdRes = await execFileAsync(
    "task",
    ["rc.verbose=new-uuid", "add", ...argsSplit],
    {
      env: buildEnv(config),
    },
  );
  const match = createdRes.stdout.match(/Created task ([a-f0-9-]+)\./);
  const uuid = match?.[1] ?? null;
  if (!uuid) throw new Error("Failed task creation");
  const res = await execFileAsync("task", [uuid, "export"], {
    env: buildEnv(config),
  });
  return JSON.parse(res.stdout)[0];
}

export function createTaskwarriorClient(config: Config) {
  return {
    async getTasks(filters: string, customConfig?: Config) {
      return await getTasks(filters, { ...config, ...customConfig });
    },
    async createTask(args: string, customConfig?: Config) {
      return await createTask(args, { ...config, ...customConfig });
    },
  };
}
