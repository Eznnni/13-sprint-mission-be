export const PORT = process.env.PORT || 3000;

export const ORDERBY = {
  recent: { createdAt: "desc" },
  oldest: { createdAt: "asc" },
  title: { title: "asc" },
};
