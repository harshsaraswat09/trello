import { boardRepository } from "../repositories/board.repository.js";
import { workspaceRepository } from "../repositories/workspace.repository.js";
import { workspaceMemberRepository } from "../repositories/workspace-member.repository.js";
import { listRepository } from "../repositories/list.repository.js";
import { cardRepository } from "../repositories/card.repository.js";
import { WORKSPACE_ROLES } from "../constants/workspace-roles.js";
import { hasMinimumRole } from "./permission.service.js";
import { logActivity } from "./activity.service.js";

const getWorkspaceMembership = async (workspaceId, userId) => {
  return workspaceMemberRepository.findByWorkspaceAndUser(workspaceId, userId);
};

const requireBoardReadAccess = async (board, userId) => {
  const membership = await getWorkspaceMembership(board.workspaceId, userId);
  if (!membership && board.visibility !== "public") {
    const error = new Error("Access denied");
    error.statusCode = 403;
    throw error;
  }
  return membership;
};

export const boardService = {
  async listByWorkspace(workspaceId, userId) {
    const workspace = await workspaceRepository.findById(workspaceId);
    if (!workspace) {
      const error = new Error("Workspace not found");
      error.statusCode = 404;
      throw error;
    }

    const membership = await getWorkspaceMembership(workspaceId, userId);
    if (!membership) {
      const error = new Error("Access denied");
      error.statusCode = 403;
      throw error;
    }

    return boardRepository.findByWorkspaceId(workspaceId);
  },

  async create(workspaceId, userId, payload) {
    const membership = await getWorkspaceMembership(workspaceId, userId);
    if (!membership || !hasMinimumRole(membership.role, WORKSPACE_ROLES.ADMIN)) {
      const error = new Error("Only Owner/Admin can create boards");
      error.statusCode = 403;
      throw error;
    }

    const board = await boardRepository.create({
      workspaceId,
      title: payload.title,
      visibility: payload.visibility,
      createdBy: userId,
    });

    await logActivity("board_created", {
      boardId: board._id,
      workspaceId,
      createdBy: userId,
    });

    return board;
  },

  async getById(id, userId) {
    const board = await boardRepository.findById(id);
    if (!board) {
      const error = new Error("Board not found");
      error.statusCode = 404;
      throw error;
    }

    await requireBoardReadAccess(board, userId);
    return board;
  },

  async update(id, userId, payload) {
    const board = await boardRepository.findById(id);
    if (!board) {
      const error = new Error("Board not found");
      error.statusCode = 404;
      throw error;
    }

    const membership = await getWorkspaceMembership(board.workspaceId, userId);
    if (!membership || !hasMinimumRole(membership.role, WORKSPACE_ROLES.ADMIN)) {
      const error = new Error("Only Owner/Admin can update boards");
      error.statusCode = 403;
      throw error;
    }

    return boardRepository.updateById(id, payload);
  },

  async remove(id, userId) {
    const board = await boardRepository.findById(id);
    if (!board) {
      const error = new Error("Board not found");
      error.statusCode = 404;
      throw error;
    }

    const membership = await getWorkspaceMembership(board.workspaceId, userId);
    if (!membership || !hasMinimumRole(membership.role, WORKSPACE_ROLES.ADMIN)) {
      const error = new Error("Only Owner/Admin can delete boards");
      error.statusCode = 403;
      throw error;
    }

    const lists = await listRepository.findByBoardId(board._id);
    const listIds = lists.map((list) => list._id);
    if (listIds.length) {
      await cardRepository.deleteManyByListIds(listIds);
      await listRepository.deleteManyByBoardId(board._id);
    }

    await boardRepository.deleteById(id);
    return { deleted: true };
  },
};
