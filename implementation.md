# Implementation Plan — Collaborative Workflow System

> "Not a Trello clone — a collaborative distributed workflow operating system."

---

## 1. Project Vision

Build a real-time collaborative workflow platform where teams can organize, assign, and track work across boards, lists, and cards — with instant sync, role-based access, and activity transparency.

---

## 2. Problem Statement

Multiple people trying to organize work together without a shared system leads to chaos — missed deadlines, unclear ownership, and no visibility into progress. This app solves that with a structured, real-time, permission-aware workspace.

---

## 3. Core Features

### MVP (Phase 1–2)
- User authentication (signup, login, JWT sessions)
- Workspaces — group boards by team/project
- Boards — project containers
- Lists — workflow stage columns (Todo, In Progress, Done, etc.)
- Cards — full task objects with title, description, due date, assignees, labels, checklists, comments, attachments, activity history
- Drag and drop cards/lists with persistent ordering
- Activity log per board and card

### Collaboration Layer (Phase 3–4)
- Real-time sync via WebSockets / Socket.IO
- Presence tracking (who's online, who's viewing a board)
- Optimistic UI with rollback on failure
- Comments with @mentions and notifications
- In-app + email notifications

### Advanced (Phase 5+)
- Role-based access control (Owner, Admin, Member, Guest, Viewer)
- File attachments (S3 / Cloudinary)
- Search and filtering (cards, labels, members, due dates)
- Automation rules (e.g. move card → notify manager)
- AI features: task summaries, sprint planning, smart deadlines
- Analytics dashboard (completion rate, overdue tasks, productivity)
- Calendar and Timeline/Gantt views

---

## 4. User Roles & Permissions

| Action              | Owner | Admin | Member | Guest | Viewer |
|---------------------|-------|-------|--------|-------|--------|
| Delete board        | ✅    | ✅    | ❌     | ❌    | ❌     |
| Edit card           | ✅    | ✅    | ✅     | ⚠️    | ❌     |
| Invite users        | ✅    | ✅    | ⚠️     | ❌    | ❌     |
| Comment             | ✅    | ✅    | ✅     | ✅    | ❌     |
| View board          | ✅    | ✅    | ✅     | ✅    | ✅     |

> ⚠️ = Limited access. All permission checks enforced on the backend — never trust frontend.

---

## 5. System Architecture

```
Frontend (React + Next.js)
    ↕ REST API (CRUD)
    ↕ WebSocket (real-time events)
Backend (Node.js + Express / NestJS)
    ↕ PostgreSQL / MongoDB  (persistent data)
    ↕ Redis                 (pub/sub, presence, caching)
    ↕ S3 / Cloudinary       (file storage)
```

---

## 6. Database Schema

### Users
```js
{
  id, name, email, passwordHash, avatar, createdAt
}
```

### Workspaces
```js
{
  id, name, ownerId, createdAt
}
```

### WorkspaceMembers
```js
{
  workspaceId, userId, role   // Owner | Admin | Member | Guest
}
```

### Boards
```js
{
  id, workspaceId, title, visibility,  // private | workspace | public
  createdBy, createdAt
}
```

### Lists
```js
{
  id, boardId, title, order,  // fractional index (e.g. 1000, 2000, 1500)
  createdAt
}
```

### Cards
```js
{
  id, listId, title, description,
  order,          // fractional index
  assignedUsers,  // array of userIds
  labels,         // array of label objects
  dueDate,
  coverImage,
  createdBy, createdAt, updatedAt
}
```

### Checklists
```js
{
  id, cardId, title, items: [{ id, text, done }]
}
```

### Comments
```js
{
  id, cardId, userId, content,  // supports @mentions
  createdAt, updatedAt
}
```

### Activities
```js
{
  id, userId, action,       // e.g. "CARD_MOVED", "COMMENT_CREATED"
  entityType,               // "card" | "list" | "board"
  entityId,
  metadata,                 // { from, to, value, ... }
  timestamp
}
```

### Notifications
```js
{
  id, userId, type,         // mention | assignment | due_date | invite
  entityType, entityId,
  read, createdAt
}
```

### Attachments
```js
{
  id, cardId, uploadedBy,
  fileName, fileUrl, fileType, fileSize,
  createdAt
}
```

---

## 7. Real-Time Collaboration Design

### WebSocket Event Flow
```
User performs action (e.g. drags card)
  ↓
Frontend emits socket event immediately (optimistic UI update)
  ↓
Backend receives event → validates → updates DB
  ↓
Backend broadcasts event to all board subscribers
  ↓
All connected clients update their UI
```

### Socket Events

| Event                | Direction         | Payload                          |
|----------------------|-------------------|----------------------------------|
| `card:moved`         | client → server → clients | `{ cardId, fromListId, toListId, newOrder }` |
| `card:updated`       | client → server → clients | `{ cardId, changes }`            |
| `card:created`       | client → server → clients | `{ card }`                       |
| `card:deleted`       | client → server → clients | `{ cardId }`                     |
| `list:reordered`     | client → server → clients | `{ listId, newOrder }`           |
| `presence:join`      | client → server → clients | `{ userId, boardId }`            |
| `presence:leave`     | client → server → clients | `{ userId, boardId }`            |
| `user:typing`        | client → server → clients | `{ userId, cardId }`             |
| `notification:new`   | server → client   | `{ notification }`               |

### Optimistic UI
- UI updates immediately on user action (no waiting for backend).
- On backend failure: rollback UI to previous state and show error toast.

### Conflict Resolution Strategy
- Use `updatedAt` timestamps on all mutable entities.
- Last-write-wins for simple edits (card title, description).
- For concurrent card moves: server timestamp is source of truth, broadcast resolved state to all clients.

### Presence System
- On board join: store `{ userId, boardId, socketId }` in Redis with TTL.
- Heartbeat pings every 30s to refresh TTL.
- On disconnect: remove from Redis, broadcast `presence:leave`.

---

## 8. API Design

### Auth
```
POST   /api/auth/signup
POST   /api/auth/login
POST   /api/auth/logout
GET    /api/auth/me
```

### Workspaces
```
GET    /api/workspaces
POST   /api/workspaces
GET    /api/workspaces/:id
PATCH  /api/workspaces/:id
DELETE /api/workspaces/:id
POST   /api/workspaces/:id/invite
```

### Boards
```
GET    /api/workspaces/:workspaceId/boards
POST   /api/workspaces/:workspaceId/boards
GET    /api/boards/:id
PATCH  /api/boards/:id
DELETE /api/boards/:id
```

### Lists
```
GET    /api/boards/:boardId/lists
POST   /api/boards/:boardId/lists
PATCH  /api/lists/:id
DELETE /api/lists/:id
PATCH  /api/lists/:id/reorder
```

### Cards
```
GET    /api/lists/:listId/cards
POST   /api/lists/:listId/cards
GET    /api/cards/:id
PATCH  /api/cards/:id
DELETE /api/cards/:id
PATCH  /api/cards/:id/move          // { toListId, newOrder }
POST   /api/cards/:id/assign
POST   /api/cards/:id/labels
```

### Comments
```
GET    /api/cards/:cardId/comments
POST   /api/cards/:cardId/comments
PATCH  /api/comments/:id
DELETE /api/comments/:id
```

### Attachments
```
POST   /api/cards/:cardId/attachments
DELETE /api/attachments/:id
```

### Notifications
```
GET    /api/notifications
PATCH  /api/notifications/:id/read
PATCH  /api/notifications/read-all
```

### Activity
```
GET    /api/boards/:boardId/activity
GET    /api/cards/:cardId/activity
```

---

## 9. Drag and Drop & Ordering System

- Use **fractional indexing** for `order` values — never plain integer indexes.
- Example: items at `1000`, `2000`, `3000` — insert between as `1500`.
- This avoids updating all sibling positions on reorder.
- Library: `dnd-kit` (recommended) or `react-beautiful-dnd`.
- On drop: emit `card:moved` socket event, update DB order, broadcast to all clients.

---

## 10. Security

- All routes protected by JWT middleware.
- Board/card-level permission checks via `checkPermission(user, entity, action)` middleware.
- Never expose sensitive fields (passwordHash, etc.) in API responses.
- Rate limiting on auth routes and comment/card creation endpoints.
- File uploads: validate type and size before passing to S3/Cloudinary.
- Sanitize comment content to prevent XSS (use DOMPurify or similar).
- Environment variables for all secrets — never hardcode.

---

## 11. Scalability Plan

| Concern             | Solution                                      |
|---------------------|-----------------------------------------------|
| Real-time at scale  | Redis Pub/Sub — multiple backend instances share socket events |
| DB read load        | Read replicas + Redis caching for board/card data |
| File storage        | S3 / Cloudinary — never store files in DB     |
| Large boards        | Paginate card fetches, lazy-load lists        |
| Search              | MongoDB text indexes (MVP) → MeiliSearch / Elasticsearch (scale) |
| Background jobs     | Bull queue (email notifications, automation rules) |

---

## 12. UI/UX Flow

```
Landing Page → Signup/Login
  ↓
Dashboard → My Workspaces → Select Workspace
  ↓
Workspace View → Board List → Create / Open Board
  ↓
Board View
  ├── Lists rendered as columns
  ├── Cards inside lists (drag/droppable)
  ├── Online members shown (presence avatars)
  └── Activity feed sidebar
  ↓
Card Detail Modal
  ├── Title / Description (inline edit)
  ├── Assignees / Labels / Due Date
  ├── Checklist
  ├── Attachments
  ├── Comments (@mention support)
  └── Activity history
```

---

## 13. Suggested Implementation Order

### Phase 1 — Core CRUD
- [ ] Auth (signup, login, JWT)
- [ ] Workspace + Board + List + Card APIs
- [ ] Basic UI — board view with static lists and cards

### Phase 2 — Drag/Drop & Order
- [ ] Implement dnd-kit on frontend
- [ ] Fractional ordering on backend
- [ ] Activity logs (write events on every mutation)

### Phase 3 — Real-Time Collaboration
- [ ] Socket.IO setup (server + client)
- [ ] Emit + receive card/list events
- [ ] Presence system via Redis

### Phase 4 — Notifications & Comments
- [ ] Comment API + @mention parsing
- [ ] In-app notification system
- [ ] Email notifications via Resend / Nodemailer

### Phase 5 — Scale & Polish
- [ ] Redis caching for hot boards
- [ ] Rate limiting
- [ ] File upload (S3/Cloudinary)
- [ ] Search and filtering
- [ ] Automation rules engine
- [ ] AI features (summaries, sprint planning)

---

## 14. Tech Stack

| Layer         | Technology                             |
|---------------|----------------------------------------|
| Frontend      | React, Tailwind CSS, Zustand  |
| Drag & Drop   | dnd-kit                                |
| Backend       | Node.js, Express / NestJS              |
| Real-Time     | Socket.IO                              |
| Database      | MongoDB (primary)       |
| Cache / PubSub| Redis                                  |
| File Storage  | AWS S3 or Cloudinary                   |
| Email         | Resend or Nodemailer                   |
| Deployment    | Vercel (frontend), Railway / AWS (backend), Docker |

---

## 15. Standout Features to Add Later

- AI sprint planning — auto-generate cards from a project description
- GitHub commit linking — reference commits inside cards
- Daily standup generator — AI-summarized from yesterday's activity
- Time tracking — log hours per card
- Focus mode — hide all cards not assigned to you
- Voice notes — record audio inside cards
- Developer workflow — code review pipelines, CI status in cards

---

## 16. Future Scope

- Mobile app (React Native)
- Offline support with sync-on-reconnect
- Calendar and Gantt/Timeline views
- Public board sharing (read-only link)
- Webhooks for third-party integrations
- Marketplace for automation templates
