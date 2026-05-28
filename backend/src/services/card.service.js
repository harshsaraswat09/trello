import { cardRepository } from "../repositories/card.repository.js";
import { listRepository } from "../repositories/list.repository.js";
import { boardRepository } from "../repositories/board.repository.js";
import { workspaceMemberRepository } from "../repositories/workspace-member.repository.js";
import { WORKSPACE_ROLES } from "../constants/workspace-roles.js";
import { getOrderBetween } from "../utils/order.util.js";
import { logActivity } from "./activity.service.js";

const getMembershipFromList = async (listId, userId) => {
  const list = await listRepository.findById(listId);
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
  return { list, board, membership };
};

const assertCardWriteAccess = (membership, card, userId) => {
  if (!membership) {
    const error = new Error("Access denied");
    error.statusCode = 403;
    throw error;
  }
  if (membership.role === WORKSPACE_ROLES.VIEWER) {
    const error = new Error("Viewers have read-only access");
    error.statusCode = 403;
    throw error;
  }
  if (membership.role === WORKSPACE_ROLES.GUEST) {
    if (!card || !card.assignedUsers || !card.assignedUsers.some((id) => String(id) === String(userId))) {
      const error = new Error("Guests can only edit cards they are assigned to");
      error.statusCode = 403;
      throw error;
    }
  }
};

export const cardService = {
  async listByList(listId, userId) {
    const { board, membership } = await getMembershipFromList(listId, userId);
    if (!membership && board.visibility !== "public") {
      const error = new Error("Access denied");
      error.statusCode = 403;
      throw error;
    }

    return cardRepository.findByListId(listId);
  },

  async create(listId, userId, payload) {
    const { membership } = await getMembershipFromList(listId, userId);
    const canCreateCard =
      membership &&
      (membership.role === WORKSPACE_ROLES.OWNER ||
        membership.role === WORKSPACE_ROLES.ADMIN ||
        membership.role === WORKSPACE_ROLES.MEMBER);

    if (!canCreateCard) {
      const error = new Error("Only Owner, Admin, and Member can create cards");
      error.statusCode = 403;
      throw error;
    }

    const cards = await cardRepository.findByListId(listId);
    const last = cards[cards.length - 1];
    const order = getOrderBetween(last?.order ?? null, null);

    const card = await cardRepository.create({
      listId,
      title: payload.title,
      description: payload.description || "",
      dueDate: payload.dueDate || null,
      coverImage: payload.coverImage || "",
      labels: payload.labels || [],
      assignedUsers: payload.assignedUsers || [],
      order,
      createdBy: userId,
    });

    await logActivity("card_created", {
      cardId: card._id,
      listId,
      createdBy: userId,
    });

    return card;
  },

  async getById(id, userId) {
    const card = await cardRepository.findById(id);
    if (!card) {
      const error = new Error("Card not found");
      error.statusCode = 404;
      throw error;
    }

    const { board, membership } = await getMembershipFromList(card.listId, userId);
    if (!membership && board.visibility !== "public") {
      const error = new Error("Access denied");
      error.statusCode = 403;
      throw error;
    }

    return card;
  },

  async update(id, userId, payload) {
    const card = await cardRepository.findById(id);
    if (!card) {
      const error = new Error("Card not found");
      error.statusCode = 404;
      throw error;
    }

    const { membership } = await getMembershipFromList(card.listId, userId);
    assertCardWriteAccess(membership, card, userId);

    return cardRepository.updateById(id, payload);
  },

  async remove(id, userId) {
    const card = await cardRepository.findById(id);
    if (!card) {
      const error = new Error("Card not found");
      error.statusCode = 404;
      throw error;
    }

    const { membership } = await getMembershipFromList(card.listId, userId);
    const canDeleteCard =
      membership &&
      (membership.role === WORKSPACE_ROLES.OWNER ||
        membership.role === WORKSPACE_ROLES.ADMIN ||
        membership.role === WORKSPACE_ROLES.MEMBER);

    if (!canDeleteCard) {
      const error = new Error("Only Owner, Admin, and Member can delete cards");
      error.statusCode = 403;
      throw error;
    }

    await cardRepository.deleteById(id);
    return { deleted: true };
  },

  async move(id, userId, payload) {
    const card = await cardRepository.findById(id);
    if (!card) {
      const error = new Error("Card not found");
      error.statusCode = 404;
      throw error;
    }

    const { membership } = await getMembershipFromList(card.listId, userId);
    assertCardWriteAccess(membership, card, userId);

    const destinationListId = payload.listId || card.listId;
    const destinationInfo = await getMembershipFromList(destinationListId, userId);
    assertCardWriteAccess(destinationInfo.membership, card, userId);

    const previous = payload.previousId ? await cardRepository.findById(payload.previousId) : null;
    const next = payload.nextId ? await cardRepository.findById(payload.nextId) : null;

    if (previous && String(previous.listId) !== String(destinationListId)) {
      const error = new Error("Invalid previousId for target list");
      error.statusCode = 400;
      throw error;
    }

    if (next && String(next.listId) !== String(destinationListId)) {
      const error = new Error("Invalid nextId for target list");
      error.statusCode = 400;
      throw error;
    }

    const order = getOrderBetween(previous?.order ?? null, next?.order ?? null);
    const moved = await cardRepository.updateById(id, {
      listId: destinationListId,
      order,
    });

    await logActivity("card_moved", {
      cardId: id,
      fromListId: card.listId,
      toListId: destinationListId,
      order,
    });

    return moved;
  },

  async assign(id, userId, payload) {
    const card = await cardRepository.findById(id);
    if (!card) {
      const error = new Error("Card not found");
      error.statusCode = 404;
      throw error;
    }

    const { membership } = await getMembershipFromList(card.listId, userId);
    assertCardWriteAccess(membership, card, userId);

    return cardRepository.updateById(id, { assignedUsers: payload.assignedUsers });
  },

  async updateLabels(id, userId, payload) {
    const card = await cardRepository.findById(id);
    if (!card) {
      const error = new Error("Card not found");
      error.statusCode = 404;
      throw error;
    }

    const { membership } = await getMembershipFromList(card.listId, userId);
    assertCardWriteAccess(membership, card, userId);

    return cardRepository.updateById(id, { labels: payload.labels });
  },
};
