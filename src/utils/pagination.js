export const offsetPagination = (page, limit) => {
  const pageNum = parseInt(page) || 1;
  const take = parseInt(limit) || 10;
  const skip = (pageNum - 1) * take;

  return { pageNum, take, skip };
};

export const cursorPagination = (limit, lastId) => {
  const take = parseInt(limit) || 3;
  const queryOptions = { take };

  if (lastId) {
    queryOptions.skip = 1;
    queryOptions.cursor = { id: parseInt(lastId) };
  }

  return queryOptions;
};
