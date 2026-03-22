[**taskwarrior-libx v0.0.1**](../README.md)

***

[taskwarrior-libx](../README.md) / TaskStatus

# Type Alias: TaskStatus

> **TaskStatus** = `"pending"` \| `"completed"` \| `"deleted"` \| `"recurring"` \| `"waiting"`

Task status values.

Note: "waiting" is a virtual status — on disk a waiting task is stored as
"pending" with a `wait` date in the future. Taskwarrior exports it as
"waiting" for convenience, and reverts it to "pending" on import.
