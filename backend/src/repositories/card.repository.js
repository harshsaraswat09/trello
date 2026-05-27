import Card from "../models/card.model.js";

export const cardRepository = {
  create: (payload) => Card.create(payload),
  findById: (id) => Card.findById(id),
  findByListId: (listId) => Card.find({ listId }).sort({ order: 1 }),
  updateById: (id, payload) => Card.findByIdAndUpdate(id, payload, { new: true }),
  deleteById: (id) => Card.findByIdAndDelete(id),
  deleteManyByListId: (listId) => Card.deleteMany({ listId }),
  deleteManyByListIds: (listIds) => Card.deleteMany({ listId: { $in: listIds } }),
};
