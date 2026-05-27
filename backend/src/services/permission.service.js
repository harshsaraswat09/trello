import WorkspaceMember from "../models/workspace-member.model.js";
import { WORKSPACE_ROLES } from "../constants/workspace-roles.js";

const rolePriority = {
  [WORKSPACE_ROLES.OWNER]: 4,
  [WORKSPACE_ROLES.ADMIN]: 3,
  [WORKSPACE_ROLES.MEMBER]: 2,
  [WORKSPACE_ROLES.GUEST]: 1,
};

export const getWorkspaceMembership = async (workspaceId, userId) => {
  return WorkspaceMember.findOne({ workspaceId, userId });
};

export const hasMinimumRole = (role, minimumRole) => {
  return (rolePriority[role] || 0) >= (rolePriority[minimumRole] || 0);
};
