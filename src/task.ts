/** ISO 8601 combined date/time in UTC: YYYYMMDDTHHMMSSZ */
export type TaskDate = string;

/** UUID: xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx */
export type TaskUUID = string;

/** Duration string as accepted by Taskwarrior (e.g. "3wks", "daily", "4hrs") */
export type TaskDuration = string;

/**
 * Task status values.
 *
 * Note: "waiting" is a virtual status — on disk a waiting task is stored as
 * "pending" with a `wait` date in the future. Taskwarrior exports it as
 * "waiting" for convenience, and reverts it to "pending" on import.
 */
export type TaskStatus =
  | "pending"
  | "completed"
  | "deleted"
  | "recurring"
  | "waiting";

export type TaskPriority = "H" | "M" | "L";

/**
 * Recurrence type for a recurring parent task.
 * - "periodic"  – child tasks are generated at fixed calendar intervals
 * - "chained"   – next child is generated relative to the completion date of
 *                 the previous child
 */
export type TaskRType = "periodic" | "chained";

export interface TaskAnnotation {
  /** Timestamp when the annotation was added (ISO 8601). */
  entry: TaskDate;
  description: string;
}

/**
 * Represents a single Taskwarrior task as it appears in the JSON
 * import/export format (e.g. `task export`).
 *
 * Dates use ISO 8601 UTC format: `YYYYMMDDTHHMMSSZ`.
 */
export interface Task {
  /** Unique identifier. Assigned on creation and never modified. */
  uuid: TaskUUID;

  /**
   * Short local integer ID. Present in `task export` output but ephemeral —
   * it is only valid until the next garbage collection and is ignored on import.
   */
  id?: number;

  /** Current state of the task. */
  status: TaskStatus;

  /** Task creation date. */
  entry: TaskDate;

  /** Human-readable summary. Must not contain newline characters. */
  description: string;

  /**
   * Completion or deletion date.
   * Required when status is "completed" or "deleted".
   */
  end?: TaskDate;

  /**
   * Due date.
   * Required when status is "recurring" (the parent template's due date seeds
   * child due dates).
   */
  due?: TaskDate;

  /**
   * Date the waiting task becomes visible (reverts to "pending") again.
   * Required when status is "waiting".
   */
  wait?: TaskDate;

  /**
   * Recurrence period (duration string, e.g. "weekly", "3days").
   * Required when status is "recurring".
   */
  recur?: TaskDuration;

  /**
   * Recurrence type. Auto-set to "periodic" if omitted on a recurring task.
   * Required (implicitly) when status is "recurring".
   */
  rtype?: TaskRType;

  /**
   * UUID of the recurring parent task.
   * Required on recurring child tasks.
   */
  parent?: TaskUUID;

  /**
   * Zero-based index into the parent task's `mask` string.
   * Required on recurring child tasks.
   */
  imask?: number;

  /**
   * Last modification date. Set automatically on every change.
   * (Stored internally as "modification"; exported as "modified".)
   */
  modified?: TaskDate;

  /**
   * Recurrence status mask on parent recurring tasks. Each character encodes
   * the state of the corresponding child:
   * `-` pending · `+` completed · `X` deleted · `W` waiting
   */
  mask?: string;

  /**
   * Numeric index used by the recurring-parent's mask to track generated
   * children. Present on recurring parent tasks (deprecated alias for imask
   * tracking in older versions).
   */
  last?: number;

  /** Date when work on the task began. Presence indicates the task is active. */
  start?: TaskDate;

  /** Date after which no more child tasks are generated from a recurring parent. */
  until?: TaskDate;

  /** Date when the task becomes available to start ("ready" once past). */
  scheduled?: TaskDate;

  /** Project name. Dot-separated segments imply hierarchy (e.g. "Home.Kitchen"). */
  project?: string;

  /** Priority level. Absence means no priority. */
  priority?: TaskPriority;

  /**
   * UUIDs of tasks that must be completed before this one.
   * Exported as a JSON array of UUID strings.
   * (Older Taskwarrior versions and Taskserver may use a comma-separated
   * string; both are accepted on import.)
   */
  depends?: TaskUUID[];

  /** Single-word tags (no spaces). */
  tags?: string[];

  /** Timestamped notes attached to the task. */
  annotations?: TaskAnnotation[];

  /**
   * Computed urgency score. Only present when the JSON is produced with the
   * "decorate" option (e.g. `task export`). Not stored on disk.
   */
  urgency?: number;

  /** User Defined Attributes (UDAs) and any unrecognised fields that MUST be preserved. */
  [uda: string]: unknown;
}
