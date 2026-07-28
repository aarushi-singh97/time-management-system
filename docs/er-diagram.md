# Time Management System ER Diagram

```text
Users
 ├──< Appointments
 ├──< Leave_Requests
 ├──< Personal_Tasks
 ├──< Notifications
 ├──< Projects (created_by)
 ├──< Meetings (scheduled_by)
 └──< Meeting_Participants >── Meetings
                                  │
                                  └── belongs to one Project (optional)
```

## Relationships

- A user can create many appointments. Each appointment belongs to one user.
- A user can create many projects. Each project records the user who created it.
- A project can have many meetings. A meeting may also be independent of a project, so `project_id` is optional.
- A user can schedule many meetings. `scheduled_by` records which user made the meeting.
- Users and meetings have a many-to-many relationship. `meeting_participants` connects them and stores each participant's response.
- A user can submit many leave requests. A second user may review a leave request.
- A user can have many personal tasks and receive many notifications.

## Why the foreign keys matter

Foreign keys prevent records from pointing to users, projects, or meetings that do not exist. Cascade deletion is used for personal records such as appointments, tasks, and notifications because they should not remain after their owner is removed. Restrict deletion is used for a project creator and meeting scheduler so important historical records are not deleted accidentally. For a meeting's project and a leave reviewer, `SET NULL` keeps the meeting or leave request even if the linked optional record is removed.

## Table purpose

- `users`: stores login identity, role, and account status.
- `projects`: stores projects that can be associated with meetings.
- `appointments`: stores an individual executive's calendar entry.
- `meetings`: stores shared scheduled meetings.
- `meeting_participants`: stores the people invited to each meeting.
- `leave_requests`: stores absence periods and their approval result.
- `personal_tasks`: stores an executive's work items.
- `notifications`: stores in-app messages such as meeting and leave updates.
