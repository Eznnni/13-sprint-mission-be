interface OffsetPaginationOptions {
  pageNum: number;
  take: number;
  skip: number;
}

export interface CursorPaginationOptions {
  take: number;
  skip?: number;
  cursor?: { id: number };
}

export const offsetPagination = (
  page: string | number | undefined,
  pageSize: string | number | undefined,
): OffsetPaginationOptions => {
  const pageNum = parseInt(String(page), 10) || 1;
  const take = parseInt(String(pageSize), 10) || 10;
  const skip = (pageNum - 1) * take;

  return { pageNum, take, skip };
};

export const cursorPagination = (
  limit: string | number | undefined,
  lastId?: string | number,
): CursorPaginationOptions => {
  const take = parseInt(String(limit), 10) || 3;
  const queryOptions: CursorPaginationOptions = { take };

  if (lastId) {
    queryOptions.skip = 1;
    queryOptions.cursor = { id: parseInt(String(lastId), 10) };
  }

  return queryOptions;
};
