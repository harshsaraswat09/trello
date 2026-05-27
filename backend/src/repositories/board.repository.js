import Board from "../models/board.model.js";

export const boardRepository = {
  create: (payload) => Board.create(payload),
  findById: (id) => Board.findById(id),
  findByWorkspaceId: (workspaceId) => Board.find({ workspaceId }).sort({ createdAt: -1 }),
  updateById: (id, payload) => Board.findByIdAndUpdate(id, payload, { new: true }),
  deleteById: (id) => Board.findByIdAndDelete(id),
  deleteManyByWorkspaceId: (workspaceId) => Board.deleteMany({ workspaceId }),
};
