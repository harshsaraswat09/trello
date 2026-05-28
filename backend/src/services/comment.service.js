import { commentRepository } from "../repositories/comment.repository.js";
import { cardRepository } from "../repositories/card.repository.js";
import { listRepository } from "../repositories/list.repository.js";
import { boardRepository } from "../repositories/board.repository.js";
import { workspaceMemberRepository } from "../repositories/workspace-member.repository.js";
import { WORKSPACE_ROLES } from "../constants/workspace-roles.js";
import { hasMinimumRole } from "./permission.service.js";

const getMembershipFromCard = async (cardId, userId) => {
  const card = await cardRepository.findById(cardId);
  if (!card) {
    const error = new Error("Card not found");
    error.statusCode = 404;
    throw error;
  }

  const list = await listRepository.findById(card.listId);
  if (!list) {
    const error = new Error("List not found");
    error.statusCode = 404;
    throw error;
  }

  const board = await boardRepository.findById(list.boardId);
  if (!board) {
    const error = new Error("Board not found");
    error.statusCode = 404;
    throw error;
  }

  const membership = await workspaceMemberRepository.findByWorkspaceAndUser(board.workspaceId, userId);
  return { card, list, board, membership };
};

export const commentService = {
  async listByCard(cardId, userId) {
    const { board, membership } = await getMembershipFromCard(cardId, userId);
    if (!membership && board.visibility !== "public") {
      const error = new Error("Access denied");
      error.statusCode = 403;
      throw error;
    }

    return commentRepository.findByCardId(cardId);
  },

  async create(cardId, userId, payload) {
    const { membership } = await getMembershipFromCard(cardId, userId);
    if (!membership) {
      const error = new Error("Access denied");
      error.statusCode = 403;
      throw error;
    }

    if (membership.role === WORKSPACE_ROLES.VIEWER) {
      const error = new Error("Viewers are not allowed to comment");
      error.statusCode = 403;
      throw error;
    }

    return commentRepository.create({
      cardId,
      userId,
      content: payload.content,
    });
  },

  async update(id, userId, payload) {
    const comment = await commentRepository.findById(id);
    if (!comment) {
      const error = new Error("Comment not found");
      error.statusCode = 404;
      throw error;
    }

    if (String(comment.userId) !== String(userId)) {
      const error = new Error("Only the comment author can update this comment");
      error.statusCode = 403;
      throw error;
    }

    const { membership } = await getMembershipFromCard(comment.cardId, userId);
    if (!membership || membership.role === WORKSPACE_ROLES.VIEWER) {
      const error = new Error("Access denied");
      error.statusCode = 403;
      throw error;
    }

    return commentRepository.updateById(id, { content: payload.content });
  },

  async remove(id, userId) {
    const comment = await commentRepository.findById(id);
    if (!comment) {
      const error = new Error("Comment not found");
      error.statusCode = 404;
      throw error;
    }

    const { membership } = await getMembershipFromCard(comment.cardId, userId);
    if (!membership) {
      const error = new Error("Access denied");
      error.statusCode = 403;
      throw error;
    }

    const isAuthor = String(comment.userId) === String(userId);
    const isOwnerOrAdmin = hasMinimumRole(membership.role, WORKSPACE_ROLES.ADMIN);

    if (!isAuthor && !isOwnerOrAdmin) {
      const error = new Error("Only the author or a workspace Owner/Admin can delete this comment");
      error.statusCode = 403;
      throw error;
    }

    await commentRepository.deleteById(id);
    return { deleted: true };
  },
};
