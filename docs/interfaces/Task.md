[**taskwarrior-libx v0.0.1**](../README.md)

***

[taskwarrior-libx](../README.md) / Task

# Interface: Task

Represents a single Taskwarrior task as it appears in the JSON
import/export format (e.g. `task export`).

Dates use ISO 8601 UTC format: `YYYYMMDDTHHMMSSZ`.

## Indexable

> \[`uda`: `string`\]: `unknown`

User Defined Attributes (UDAs) and any unrecognised fields that MUST be preserved.

## Properties

### annotations?

> `optional` **annotations?**: [`TaskAnnotation`](TaskAnnotation.md)[]

Timestamped notes attached to the task.

***

### depends?

> `optional` **depends?**: `string`[]

UUIDs of tasks that must be completed before this one.
Exported as a JSON array of UUID strings.
(Older Taskwarrior versions and Taskserver may use a comma-separated
string; both are accepted on import.)

***

### description

> **description**: `string`

Human-readable summary. Must not contain newline characters.

***

### due?

> `optional` **due?**: `string`

Due date.
Required when status is "recurring" (the parent template's due date seeds
child due dates).

***

### end?

> `optional` **end?**: `string`

Completion or deletion date.
Required when status is "completed" or "deleted".

***

### entry

> **entry**: `string`

Task creation date.

***

### id?

> `optional` **id?**: `number`

Short local integer ID. Present in `task export` output but ephemeral —
it is only valid until the next garbage collection and is ignored on import.

***

### imask?

> `optional` **imask?**: `number`

Zero-based index into the parent task's `mask` string.
Required on recurring child tasks.

***

### last?

> `optional` **last?**: `number`

Numeric index used by the recurring-parent's mask to track generated
children. Present on recurring parent tasks (deprecated alias for imask
tracking in older versions).

***

### mask?

> `optional` **mask?**: `string`

Recurrence status mask on parent recurring tasks. Each character encodes
the state of the corresponding child:
`-` pending · `+` completed · `X` deleted · `W` waiting

***

### modified?

> `optional` **modified?**: `string`

Last modification date. Set automatically on every change.
(Stored internally as "modification"; exported as "modified".)

***

### parent?

> `optional` **parent?**: `string`

UUID of the recurring parent task.
Required on recurring child tasks.

***

### priority?

> `optional` **priority?**: [`TaskPriority`](../type-aliases/TaskPriority.md)

Priority level. Absence means no priority.

***

### project?

> `optional` **project?**: `string`

Project name. Dot-separated segments imply hierarchy (e.g. "Home.Kitchen").

***

### recur?

> `optional` **recur?**: `string`

Recurrence period (duration string, e.g. "weekly", "3days").
Required when status is "recurring".

***

### rtype?

> `optional` **rtype?**: [`TaskRType`](../type-aliases/TaskRType.md)

Recurrence type. Auto-set to "periodic" if omitted on a recurring task.
Required (implicitly) when status is "recurring".

***

### scheduled?

> `optional` **scheduled?**: `string`

Date when the task becomes available to start ("ready" once past).

***

### start?

> `optional` **start?**: `string`

Date when work on the task began. Presence indicates the task is active.

***

### status

> **status**: [`TaskStatus`](../type-aliases/TaskStatus.md)

Current state of the task.

***

### tags?

> `optional` **tags?**: `string`[]

Single-word tags (no spaces).

***

### until?

> `optional` **until?**: `string`

Date after which no more child tasks are generated from a recurring parent.

***

### urgency?

> `optional` **urgency?**: `number`

Computed urgency score. Only present when the JSON is produced with the
"decorate" option (e.g. `task export`). Not stored on disk.

***

### uuid

> **uuid**: `string`

Unique identifier. Assigned on creation and never modified.

***

### wait?

> `optional` **wait?**: `string`

Date the waiting task becomes visible (reverts to "pending") again.
Required when status is "waiting".
