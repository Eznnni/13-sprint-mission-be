export const PORT = process.env.PORT || 3001;

export const ORDERBY = {
  recent: { createdAt: "desc" },
  oldest: { createdAt: "asc" },
  title: { title: "asc" },
  like: { likeCount: "desc" },
};
