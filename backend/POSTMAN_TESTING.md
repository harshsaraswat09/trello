# Postman Testing Guide (Trello Backend)

## Base URL
`http://localhost:5000/api`

## Dummy User
- Email: `dummy.user@example.com`
- Password: `DummyPassword123!`
- Seed command: `npm run seed:dummy`

## 1) Auth

### Login
`POST /auth/login`

```json
{
  "email": "dummy.user@example.com",
  "password": "DummyPassword123!"
}
```

Save `data.token` from response and set Postman header:
`Authorization: Bearer <token>`

## 2) Workspace

### Create workspace
`POST /workspaces`

```json
{
  "name": "QA Workspace"
}
```

### Invite user with role
`POST /workspaces/:id/invite`

```json
{
  "email": "another.user@example.com",
  "role": "Viewer"
}
```

Allowed roles: `Owner | Admin | Member | Guest | Viewer`

## 3) Board

### Create board
`POST /workspaces/:workspaceId/boards`

```json
{
  "title": "Sprint Board",
  "visibility": "workspace"
}
```

### Get boards in workspace
`GET /workspaces/:workspaceId/boards`

### Get single board
`GET /boards/:id`

### Delete board
`DELETE /boards/:id`

## 4) List

### Create list
`POST /boards/:boardId/lists`

```json
{
  "title": "To Do"
}
```

### Reorder list
`PATCH /lists/:id/reorder`

```json
{
  "previousId": "<listIdOrNull>",
  "nextId": "<listIdOrNull>"
}
```

## 5) Card

### Create card
`POST /lists/:listId/cards`

```json
{
  "title": "Implement API",
  "description": "Workspace + Board + List + Card",
  "dueDate": "2026-06-15T10:00:00.000Z",
  "assignedUsers": [],
  "labels": [
    { "text": "backend", "color": "blue" }
  ],
  "coverImage": ""
}
```

### Edit card
`PATCH /cards/:id`

```json
{
  "title": "Implement API v2",
  "description": "Updated description"
}
```

### Move card
`PATCH /cards/:id/move`

```json
{
  "listId": "<targetListId>",
  "previousId": null,
  "nextId": null
}
```

### Assign users
`POST /cards/:id/assign`

```json
{
  "assignedUsers": ["<userId>"]
}
```

### Update labels
`POST /cards/:id/labels`

```json
{
  "labels": [
    { "text": "urgent", "color": "red" }
  ]
}
```

## 6) Comments

### Add comment
`POST /cards/:cardId/comments`

```json
{
  "content": "Please pick this up today."
}
```

### List comments
`GET /cards/:cardId/comments`

## Role Permission Matrix Implemented

| Action | Owner | Admin | Member | Guest | Viewer |
|---|---|---|---|---|---|
| Delete board | ? | ? | ? | ? | ? |
| Edit card | ? | ? | ? | ?? assigned cards only | ? |
| Invite users | ? | ? | ?? cannot invite Owner/Admin | ? | ? |
| Comment | ? | ? | ? | ? | ? |
| View board | ? | ? | ? | ? | ? |

## Suggested Postman Variables
- `baseUrl` = `http://localhost:5000/api`
- `token` = auth token
- `workspaceId`
- `boardId`
- `listId`
- `cardId`
- `userId`
