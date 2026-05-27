import { listRepository } from "../repositories/list.repository.js";
import { boardRepository } from "../repositories/board.repository.js";
import { workspaceMemberRepository } from "../repositories/workspace-member.repository.js";
import { cardRepository } from "../repositories/card.repository.js";
import { WORKSPACE_ROLES } from "../constants/workspace-roles.js";
import { getOrderBetween } from "../utils/order.util.js";
import { hasMinimumRole } from "./permission.service.js";
import { logActivity } from "./activity.service.js";

const getMembershipFromBoard = async (boardId, userId) => {
  const board = await boardRepository.findById(boardId);
  if (!board) {
    const error = new Error("Board not found");
    error.statusCode = 404;
    throw error;
  }

  const membership = await workspaceMemberRepository.findByWorkspaceAndUser(board.workspaceId, userId);
  return { board, membership };
};

export const listService = {
  async listByBoard(boardId, userId) {
    const { board, membership } = await getMembershipFromBoard(boardId, userId);
    if (!membership && board.visibility !== "public") {
      const error = new Error("Access denied");
      error.statusCode = 403;
      throw error;
    }

    return listRepository.findByBoardId(boardId);
  },

  async create(boardId, userId, payload) {
    const { membership } = await getMembershipFromBoard(boardId, userId);
    if (!membership || !hasMinimumRole(membership.role, WORKSPACE_ROLES.ADMIN)) {
      const error = new Error("Only Owner/Admin can create lists");
      error.statusCode = 403;
      throw error;
    }

    const lists = await listRepository.findByBoardId(boardId);
    const last = lists[lists.length - 1];
    const order = getOrderBetween(last?.order ?? null, null);

    return listRepository.create({
      boardId,
      title: payload.title,
      order,
    });
  },

  async update(id, userId, payload) {
    const list = await listRepository.findById(id);
    if (!list) {
      const error = new Error("List not found");
      error.statusCode = 404;
      throw error;
    }

    const { membership } = await getMembershipFromBoard(list.boardId, userId);
    if (!membership || !hasMinimumRole(membership.role, WORKSPACE_ROLES.ADMIN)) {
      const error = new Error("Only Owner/Admin can update lists");
      error.statusCode = 403;
      throw error;
    }

    return listRepository.updateById(id, payload);
  },

  async remove(id, userId) {
    const list = await listRepository.findById(id);
    if (!list) {
      const error = new Error("List not found");
      error.statusCode = 404;
      throw error;
    }

    const { membership } = await getMembershipFromBoard(list.boardId, userId);
    if (!membership || !hasMinimumRole(membership.role, WORKSPACE_ROLES.ADMIN)) {
      const error = new Error("Only Owner/Admin can delete lists");
      error.statusCode = 403;
      throw error;
    }

    await cardRepository.deleteManyByListId(list._id);
    await listRepository.deleteById(id);
    return { deleted: true };
  },

  async reorder(id, userId, payload) {
    const list = await listRepository.findById(id);
    if (!list) {
      const error = new Error("List not found");
      error.statusCode = 404;
      throw error;
    }

    const { membership } = await getMembershipFromBoard(list.boardId, userId);
    if (!membership || !hasMinimumRole(membership.role, WORKSPACE_ROLES.ADMIN)) {
      const error = new Error("Only Owner/Admin can reorder lists");
      error.statusCode = 403;
      throw error;
    }

    const previous = payload.previousId ? await listRepository.findById(payload.previousId) : null;
    const next = payload.nextId ? await listRepository.findById(payload.nextId) : null;

    if (previous && String(previous.boardId) !== String(list.boardId)) {
      const error = new Error("Invalid previousId for this board");
      error.statusCode = 400;
      throw error;
    }

    if (next && String(next.boardId) !== String(list.boardId)) {
      const error = new Error("Invalid nextId for this board");
      error.statusCode = 400;
      throw error;
    }

    const order = getOrderBetween(previous?.order ?? null, next?.order ?? null);
    const updated = await listRepository.updateById(id, { order });

    await logActivity("list_reordered", {
      listId: id,
      boardId: list.boardId,
      order,
      previousId: payload.previousId || null,
      nextId: payload.nextId || null,
    });

    return updated;
  },
};
