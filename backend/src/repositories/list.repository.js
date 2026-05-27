import List from "../models/list.model.js";

export const listRepository = {
  create: (payload) => List.create(payload),
  findById: (id) => List.findById(id),
  findByBoardId: (boardId) => List.find({ boardId }).sort({ order: 1 }),
  updateById: (id, payload) => List.findByIdAndUpdate(id, payload, { new: true }),
  deleteById: (id) => List.findByIdAndDelete(id),
  deleteManyByBoardId: (boardId) => List.deleteMany({ boardId }),
  deleteManyByBoardIds: (boardIds) => List.deleteMany({ boardId: { $in: boardIds } }),
};
