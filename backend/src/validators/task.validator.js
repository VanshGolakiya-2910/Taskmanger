export const validateCreateTask = (data) => {
  const { title, assignedTo } = data;

  if (!title || !assignedTo) {
    throw new ApiError(400, 'INVALID_TASK_DATA');
  }
};

export const validateStatusUpdate = ({ status }) => {
  if (!status) {
    throw new Error("INVALID_STATUS");
  }
};
