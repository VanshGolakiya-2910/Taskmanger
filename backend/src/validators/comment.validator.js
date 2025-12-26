export const validateCreateComment = ({ content }) => {
  if (!content || !content.trim()) {
    throw new Error("INVALID_COMMENT");
  }
};
