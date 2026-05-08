export const asyncHandler = (fn) => {
  return async (req, res) => {
    try {
      await fn(req, res);
    } catch (error) {
      if (error.name === "ValidationError") {
        res.status(400).json({ message: error.message });
      } else if (error.name === "CastError") {
        res.status(404).json({ message: "해당 id를 찾을 수 없어요." });
      } else {
        res.status(500).json({ message: error.message });
      }
    }
  };
};
