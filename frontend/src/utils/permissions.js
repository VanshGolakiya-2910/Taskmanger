export const canUpdateTaskStatus = (user, task) => {
  if (!user) return false
  if (user.role === 'manager' || user.role === 'project_manager') return true
  // member can update only if assigned
  return task.assignedTo === user.id
}
