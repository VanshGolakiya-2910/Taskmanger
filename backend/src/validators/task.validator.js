export const validateCreateTask = ({ title, assignedTo, projectId }) => {
  if (!title || !assignedTo || !projectId) {
    throw new Error("INVALID_TASK_DATA");
  }
};

export const validateStatusUpdate = ({ status }) => {
  if (!status) {
    throw new Error("INVALID_STATUS");
  }
};
