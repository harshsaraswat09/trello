# Trello Backend API Reference

## Setup

1. Start the backend server from `trello/backend`:

```bash
npm run dev
```

2. Ensure your `.env` has the required values:

- `MONGO_URI`
- `JWT_SECRET`
- `PORT` (optional, defaults to `5000`)
- `JWT_EXPIRES_IN` (optional, defaults to `7d`)

3. Seed the dummy user once:

```bash
npm run seed:dummy
```

If the user already exists, the script prints the existing user details and token.

---

## Dummy user credentials

- Email: `dummy.user@example.com`
- Password: `DummyPassword123!`
- Name: `Dummy User`
- Role: `employee`
- Department: `Engineering`

---

## Common request settings

- Base URL: `http://localhost:5000`
- Headers for JSON requests:
  - `Content-Type: application/json`
- Authenticated endpoints require:
  - `Authorization: Bearer <JWT_TOKEN>`

---

## Root endpoint

### GET `/`
- Returns a health check message.

Example response:

```json
{
  "success": true,
  "message": "Attendance API running"
}
```

---

## Authentication

### POST `/api/auth/register`
- Create a new user.
- Body:
  - `name` (required)
  - `email` (required, valid email)
  - `password` (required, min 6 chars)
  - `role` (optional: `employee`, `manager`, `admin`)
  - `department` (optional)

Example body:

```json
{
  "name": "New User",
  "email": "new.user@example.com",
  "password": "NewPassword123!",
  "role": "employee",
  "department": "Marketing"
}
```

Example response:

```json
{
  "success": true,
  "data": {
    "token": "<JWT_TOKEN>",
    "user": {
      "_id": "...",
      "name": "New User",
      "email": "new.user@example.com",
      "role": "employee",
      "department": "Marketing",
      "managerId": null
    }
  }
}
```

### POST `/api/auth/login`
- Log in with email and password.
- Body:
  - `email` (required, valid email)
  - `password` (required)

Example body:

```json
{
  "email": "dummy.user@example.com",
  "password": "DummyPassword123!"
}
```

Example response:

```json
{
  "success": true,
  "data": {
    "token": "<JWT_TOKEN>",
    "user": {
      "_id": "...",
      "name": "Dummy User",
      "email": "dummy.user@example.com",
      "role": "employee",
      "department": "Engineering",
      "managerId": null
    }
  }
}
```

### GET `/api/auth/me`
- Get current user details.
- Headers:
  - `Authorization: Bearer <JWT_TOKEN>`

Example response:

```json
{
  "success": true,
  "data": {
    "_id": "...",
    "name": "Dummy User",
    "email": "dummy.user@example.com",
    "role": "employee",
    "department": "Engineering",
    "managerId": null
  }
}
```

---

## Workspaces

All workspace endpoints require authentication.

### GET `/api/workspaces`
- List all workspaces for the current user.

### POST `/api/workspaces`
- Create a workspace.
- Body:
  - `name` (required)

Example body:

```json
{
  "name": "Product Team Workspace"
}
```

### GET `/api/workspaces/:id`
- Get workspace details by ID.\n
### PATCH `/api/workspaces/:id`
- Update workspace name.
- Body:
  - `name` (optional)

Example body:

```json
{
  "name": "Updated Workspace Name"
}
```

### DELETE `/api/workspaces/:id`
- Delete the workspace.

### POST `/api/workspaces/:id/invite`
- Invite a user to the workspace.
- Body:
  - `email` (required, valid email)
  - `role` (required, one of `Owner`, `Admin`, `Member`, `Guest`)

Example body:

```json
{
  "email": "invitee@example.com",
  "role": "Member"
}
```

---

## Boards

All board endpoints require authentication.

### GET `/api/workspaces/:workspaceId/boards`
- List boards inside a workspace.

### POST `/api/workspaces/:workspaceId/boards`
- Create a board in a workspace.
- Body:
  - `title` (required)
  - `visibility` (optional: `private`, `workspace`, `public`)

Example body:

```json
{
  "title": "Sprint Planning",
  "visibility": "workspace"
}
```

### GET `/api/boards/:id`
- Get board details by board ID.

### PATCH `/api/boards/:id`
- Update a board.
- Body:
  - `title` (optional)
  - `visibility` (optional: `private`, `workspace`, `public`)

Example body:

```json
{
  "title": "Updated Board Title"
}
```

### DELETE `/api/boards/:id`
- Delete a board.

---

## Lists

All list endpoints require authentication.

### GET `/api/boards/:boardId/lists`
- List lists in a board.

### POST `/api/boards/:boardId/lists`
- Create a list in a board.
- Body:
  - `title` (required)

Example body:

```json
{
  "title": "To Do"
}
```

### PATCH `/api/lists/:id`
- Update a list title.
- Body:
  - `title` (optional)

Example body:

```json
{
  "title": "In Progress"
}
```

### DELETE `/api/lists/:id`
- Delete a list.

### PATCH `/api/lists/:id/reorder`
- Reorder a list within the board.
- Body:
  - `previousId` (optional, valid list id or null)
  - `nextId` (optional, valid list id or null)

Example body:

```json
{
  "previousId": "643dexampleid1234567890ab",
  "nextId": null
}
```

---

## Cards

All card endpoints require authentication.

### GET `/api/lists/:listId/cards`
- List cards inside a list.

### POST `/api/lists/:listId/cards`
- Create a card in a list.
- Body:
  - `title` (required)
  - `description` (optional)
  - `dueDate` (optional, ISO 8601 string)
  - `coverImage` (optional)
  - `assignedUsers` (optional array of user IDs)
  - `labels` (optional array of label objects)

Example body:

```json
{
  "title": "Design login page",
  "description": "Create responsive login UI",
  "dueDate": "2026-06-30T12:00:00.000Z",
  "assignedUsers": ["643dexampleid1234567890ab"],
  "labels": [
    { "text": "UI", "color": "blue" },
    { "text": "High Priority", "color": "red" }
  ]
}
```

### GET `/api/cards/:id`
- Get card details by ID.

### PATCH `/api/cards/:id`
- Update a card.
- Body can include any of:
  - `title`
  - `description`
  - `dueDate`
  - `coverImage`
  - `assignedUsers`
  - `labels`

Example body:

```json
{
  "title": "Update login page",
  "description": "Add validation and loading state"
}
```

### DELETE `/api/cards/:id`
- Delete a card.

### PATCH `/api/cards/:id/move`
- Move a card to another list or reorder inside the list.
- Body:
  - `listId` (optional, valid list id)
  - `previousId` (optional, valid card id or null)
  - `nextId` (optional, valid card id or null)

Example body:

```json
{
  "listId": "643dexampleid1234567890ab",
  "previousId": "643dexampleid1234567890ac",
  "nextId": null
}
```

### POST `/api/cards/:id/assign`
- Assign users to a card.
- Body:
  - `assignedUsers` (required array of user IDs)

Example body:

```json
{
  "assignedUsers": ["643dexampleid1234567890ab"]
}
```

### POST `/api/cards/:id/labels`
- Update card labels.
- Body:
  - `labels` (required array of label objects)
    - `text` (required)
    - `color` (required)

Example body:

```json
{
  "labels": [
    { "text": "Bug", "color": "red" },
    { "text": "Review", "color": "yellow" }
  ]
}
```

---

## Notes

- Use the login token for any protected endpoint.
- For any request that requires a valid object ID, pass a 24-character MongoDB ObjectId string.
- If you need to test other protected endpoints, include the header:

```http
Authorization: Bearer <JWT_TOKEN>
```
