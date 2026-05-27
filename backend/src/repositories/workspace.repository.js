import Workspace from "../models/workspace.model.js";

export const workspaceRepository = {
  create: (payload) => Workspace.create(payload),
  findById: (id) => Workspace.findById(id),
  findByOwnerId: (ownerId) => Workspace.find({ ownerId }).sort({ createdAt: -1 }),
  updateById: (id, payload) => Workspace.findByIdAndUpdate(id, payload, { new: true }),
  deleteById: (id) => Workspace.findByIdAndDelete(id),
};
