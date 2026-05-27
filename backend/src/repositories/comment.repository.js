import Comment from "../models/comment.model.js";

export const commentRepository = {
  create: (payload) => Comment.create(payload),
  findById: (id) => Comment.findById(id),
  findByCardId: (cardId) => Comment.find({ cardId }).populate("userId", "name email").sort({ createdAt: 1 }),
  updateById: (id, payload) => Comment.findByIdAndUpdate(id, payload, { new: true }),
  deleteById: (id) => Comment.findByIdAndDelete(id),
};
