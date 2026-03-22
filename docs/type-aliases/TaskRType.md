[**taskwarrior-libx v0.0.1**](../README.md)

***

[taskwarrior-libx](../README.md) / TaskRType

# Type Alias: TaskRType

> **TaskRType** = `"periodic"` \| `"chained"`

Recurrence type for a recurring parent task.
- "periodic"  – child tasks are generated at fixed calendar intervals
- "chained"   – next child is generated relative to the completion date of
                the previous child
