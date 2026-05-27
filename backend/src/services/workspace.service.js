import { workspaceRepository } from "../repositories/workspace.repository.js";
import { workspaceMemberRepository } from "../repositories/workspace-member.repository.js";
import { boardRepository } from "../repositories/board.repository.js";
import { listRepository } from "../repositories/list.repository.js";
import { cardRepository } from "../repositories/card.repository.js";
import User from "../models/user.model.js";
import { WORKSPACE_ROLES } from "../constants/workspace-roles.js";
import { hasMinimumRole } from "./permission.service.js";
import { logActivity } from "./activity.service.js";

const requireMembership = async (workspaceId, userId) => {
  const membership = await workspaceMemberRepository.findByWorkspaceAndUser(workspaceId, userId);
  if (!membership) {
    const error = new Error("Access denied");
    error.statusCode = 403;
    throw error;
  }
  return membership;
};

export const workspaceService = {
  async listForUser(userId) {
    const owned = await workspaceRepository.findByOwnerId(userId);
    const memberships = await workspaceMemberRepository.findByUserId(userId);
    const byId = new Map();

    owned.forEach((w) => byId.set(String(w._id), w));
    memberships.forEach((m) => {
      if (m.workspaceId) byId.set(String(m.workspaceId._id), m.workspaceId);
    });

    return Array.from(byId.values());
  },

  async create(userId, payload) {
    const workspace = await workspaceRepository.create({
      name: payload.name,
      ownerId: userId,
    });

    await workspaceMemberRepository.create({
      workspaceId: workspace._id,
      userId,
      role: WORKSPACE_ROLES.OWNER,
    });

    return workspace;
  },

  async getById(id, userId) {
    const workspace = await workspaceRepository.findById(id);
    if (!workspace) {
      const error = new Error("Workspace not found");
      error.statusCode = 404;
      throw error;
    }
    await requireMembership(id, userId);
    return workspace;
  },

  async update(id, userId, payload) {
    const membership = await requireMembership(id, userId);
    if (!hasMinimumRole(membership.role, WORKSPACE_ROLES.ADMIN)) {
      const error = new Error("Only Owner/Admin can update workspace");
      error.statusCode = 403;
      throw error;
    }

    const updated = await workspaceRepository.updateById(id, payload);
    if (!updated) {
      const error = new Error("Workspace not found");
      error.statusCode = 404;
      throw error;
    }

    return updated;
  },

  async remove(id, userId) {
    const membership = await requireMembership(id, userId);
    if (membership.role !== WORKSPACE_ROLES.OWNER) {
      const error = new Error("Only Owner can delete workspace");
      error.statusCode = 403;
      throw error;
    }

    const boards = await boardRepository.findByWorkspaceId(id);
    const boardIds = boards.map((b) => b._id);
    const lists = await Promise.all(boardIds.map((boardId) => listRepository.findByBoardId(boardId)));
    const listIds = lists.flat().map((l) => l._id);

    if (listIds.length) {
      await cardRepository.deleteManyByListIds(listIds);
    }

    if (boardIds.length) {
      await listRepository.deleteManyByBoardIds(boardIds);
      await boardRepository.deleteManyByWorkspaceId(id);
    }

    await workspaceMemberRepository.deleteByWorkspaceId(id);
    await workspaceRepository.deleteById(id);

    return { deleted: true };
  },

  async invite(workspaceId, userId, payload) {
    const membership = await requireMembership(workspaceId, userId);
    if (!hasMinimumRole(membership.role, WORKSPACE_ROLES.MEMBER)) {
      const error = new Error("Only Owner, Admin, and Member can invite users");
      error.statusCode = 403;
      throw error;
    }

    if (membership.role === WORKSPACE_ROLES.MEMBER) {
      if (payload.role === WORKSPACE_ROLES.OWNER || payload.role === WORKSPACE_ROLES.ADMIN) {
        const error = new Error("Members cannot invite Owners or Admins");
        error.statusCode = 403;
        throw error;
      }
    }

    const invitedUser = await User.findOne({ email: payload.email });
    if (!invitedUser) {
      const error = new Error("User not found");
      error.statusCode = 404;
      throw error;
    }

    const existing = await workspaceMemberRepository.findByWorkspaceAndUser(workspaceId, invitedUser._id);
    if (existing) {
      const error = new Error("User is already a workspace member");
      error.statusCode = 409;
      throw error;
    }

    const invited = await workspaceMemberRepository.create({
      workspaceId,
      userId: invitedUser._id,
      role: payload.role,
    });

    await logActivity("workspace_invited", {
      workspaceId,
      invitedBy: userId,
      invitedUserId: invitedUser._id,
      role: payload.role,
    });

    return invited;
  },
};
