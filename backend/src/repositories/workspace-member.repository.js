import WorkspaceMember from "../models/workspace-member.model.js";

export const workspaceMemberRepository = {
  create: (payload) => WorkspaceMember.create(payload),
  findByWorkspaceId: (workspaceId) => WorkspaceMember.find({ workspaceId }).populate("userId", "name email"),
  findByWorkspaceAndUser: (workspaceId, userId) => WorkspaceMember.findOne({ workspaceId, userId }),
  findByUserId: (userId) => WorkspaceMember.find({ userId }).populate("workspaceId"),
  updateRole: (workspaceId, userId, role) =>
    WorkspaceMember.findOneAndUpdate({ workspaceId, userId }, { role }, { new: true }),
  deleteByWorkspaceId: (workspaceId) => WorkspaceMember.deleteMany({ workspaceId }),
};
