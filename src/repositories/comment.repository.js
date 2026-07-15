import prisma from "../config/prisma.js";

export const findCommentsAndCount = async ({
  queryOptions,
  where,
  orderBy,
}) => {
  return await Promise.all([
    prisma.comment.findMany({
      ...queryOptions,
      where,
      orderBy,
      include: {
        writer: true,
      },
    }),
    prisma.comment.count({ where }),
  ]);
};

export const createComment = async (data) => {
  return await prisma.comment.create({ data });
};

export const updateComment = async (id, data) => {
  return await prisma.comment.update({
    where: { id },
    data,
  });
};

export const deleteComment = async (id) => {
  return await prisma.comment.delete({ where: { id } });
};
