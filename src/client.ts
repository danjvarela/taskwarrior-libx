import {
  getTasks,
  getTask,
  createTask,
  modifyTasks,
  modifyTask,
  deleteTasks,
  deleteTask,
  annotateTasks,
  annotateTask,
  denotateTasks,
  denotateTask,
} from "./operations.js";
import type { Config } from "./config.js";

/**
 * Creates a Taskwarrior client bound to the provided configuration.
 * Each method accepts an optional `customConfig` to override the base config for that call.
 *
 * @param config - Base Taskwarrior configuration (e.g. paths to `taskrc` and `taskdata`).
 * @returns An object with methods for interacting with Taskwarrior.
 */
export function createTaskwarriorClient(config: Config) {
  return {
    /**
     * Retrieves all tasks matching the given filter string.
     *
     * @param filters - A Taskwarrior filter expression (e.g. `"status:pending project:work"`).
     * @param customConfig - Optional config overrides for this call.
     * @returns A promise resolving to an array of matching tasks.
     */
    async getTasks(filters: string, customConfig?: Config) {
      return await getTasks(filters, { ...config, ...customConfig });
    },

    /**
     * Retrieves a single task by its numeric ID or UUID.
     *
     * @param idOrUUID - The task's numeric ID or UUID string.
     * @param customConfig - Optional config overrides for this call.
     * @returns A promise resolving to the matching task, or `null` if not found.
     */
    async getTask(idOrUUID: string, customConfig?: Config) {
      return await getTask(idOrUUID, { ...config, ...customConfig });
    },

    /**
     * Creates a new task with the given arguments.
     *
     * @param args - A string of Taskwarrior `add` arguments (e.g. `"Buy milk due:tomorrow"`).
     * @param customConfig - Optional config overrides for this call.
     * @returns A promise resolving to the newly created task.
     */
    async createTask(args: string, customConfig?: Config) {
      return await createTask(args, { ...config, ...customConfig });
    },

    /**
     * Modifies all tasks matching the given filter with the provided modifications.
     *
     * @param filters - A Taskwarrior filter expression to select tasks to modify.
     * @param modifications - A string of Taskwarrior modification arguments (e.g. `"priority:H due:tomorrow"`).
     * @param customConfig - Optional config overrides for this call.
     * @returns A promise resolving to an array of the modified tasks.
     */
    async modifyTasks(
      filters: string,
      modifications: string,
      customConfig?: Config,
    ) {
      return await modifyTasks(filters, modifications, {
        ...config,
        ...customConfig,
      });
    },

    /**
     * Modifies a single task identified by its numeric ID or UUID.
     *
     * @param idOrUUID - The task's numeric ID or UUID string.
     * @param modifications - A string of Taskwarrior modification arguments (e.g. `"priority:H due:tomorrow"`).
     * @param customConfig - Optional config overrides for this call.
     * @returns A promise resolving to the modified task, or `null` if not found.
     */
    async modifyTask(
      idOrUUID: string,
      modifications: string,
      customConfig?: Config,
    ) {
      return await modifyTask(idOrUUID, modifications, {
        ...config,
        ...customConfig,
      });
    },

    /**
     * Deletes all tasks matching the given filter string.
     *
     * @param filters - A Taskwarrior filter expression to select tasks to delete (e.g. `"project:work status:pending"`).
     * @param customConfig - Optional config overrides for this call.
     * @returns A promise that resolves when the deletion is complete.
     */
    async deleteTasks(filters: string, customConfig?: Config) {
      return await deleteTasks(filters, { ...config, ...customConfig });
    },

    /**
     * Deletes a single task identified by its numeric ID or UUID.
     * Does nothing if the task does not exist.
     *
     * @param idOrUUID - The task's numeric ID or UUID string.
     * @param customConfig - Optional config overrides for this call.
     * @returns A promise that resolves when the deletion is complete.
     */
    async deleteTask(idOrUUID: string, customConfig?: Config): Promise<void> {
      return await deleteTask(idOrUUID, { ...config, ...customConfig });
    },

    /**
     * Adds an annotation to all tasks matching the given filter string.
     *
     * @param filters - A Taskwarrior filter expression to select tasks to annotate (e.g. `"project:work status:pending"`).
     * @param annotation - The annotation text to add.
     * @param customConfig - Optional config overrides for this call.
     * @returns A promise resolving to an array of the annotated tasks.
     */
    async annotateTasks(
      filters: string,
      annotation: string,
      customConfig?: Config,
    ) {
      return await annotateTasks(filters, annotation, {
        ...config,
        ...customConfig,
      });
    },

    /**
     * Adds an annotation to a single task identified by its numeric ID or UUID.
     *
     * @param idOrUUID - The task's numeric ID or UUID string.
     * @param annotation - The annotation text to add.
     * @param customConfig - Optional config overrides for this call.
     * @returns A promise resolving to the annotated task, or `null` if not found.
     */
    async annotateTask(
      idOrUUID: string,
      annotation: string,
      customConfig?: Config,
    ) {
      return await annotateTask(idOrUUID, annotation, {
        ...config,
        ...customConfig,
      });
    },

    /**
     * Removes a matching annotation from all tasks matching the given filter string.
     *
     * @param filters - A Taskwarrior filter expression to select tasks to denotate (e.g. `"project:work status:pending"`).
     * @param annotation - The annotation text to remove (matched as a substring).
     * @param customConfig - Optional config overrides for this call.
     * @returns A promise that resolves when the denotation is complete.
     */
    async denotateTasks(
      filters: string,
      annotation: string,
      customConfig?: Config,
    ): Promise<void> {
      return await denotateTasks(filters, annotation, {
        ...config,
        ...customConfig,
      });
    },

    /**
     * Removes a matching annotation from a single task identified by its numeric ID or UUID.
     * Does nothing if the task does not exist.
     *
     * @param idOrUUID - The task's numeric ID or UUID string.
     * @param annotation - The annotation text to remove (matched as a substring).
     * @param customConfig - Optional config overrides for this call.
     * @returns A promise that resolves when the denotation is complete.
     */
    async denotateTask(
      idOrUUID: string,
      annotation: string,
      customConfig?: Config,
    ): Promise<void> {
      return await denotateTask(idOrUUID, annotation, {
        ...config,
        ...customConfig,
      });
    },
  };
}
