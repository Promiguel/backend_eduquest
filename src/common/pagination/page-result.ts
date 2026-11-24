export interface PageResult<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export function createPageResult<T>(
  data: T[],
  total: number,
  page: number,
  limit: number,
): PageResult<T> {
  return {
    data,
    total,
    page,
    limit,
    totalPages: Math.ceil(total / limit),
  };
}
