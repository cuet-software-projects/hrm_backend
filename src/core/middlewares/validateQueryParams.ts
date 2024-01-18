import { NextFunction, Request, Response } from 'express';
import ApiError from '../../utils/ApiError';
import catchAsync from '../../utils/catchAsync';
import {
  getForbiddenFilters,
  getForbiddenIncludes,
  getForbiddenSorts,
} from '../../utils/utils';

type QueryParamsType = {
  allowedIncludes: string[];
  allowedFilters: string[];
  allowedSorts: string[];
};
export const validateQueryParams = (queryParams: QueryParamsType) =>
  catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const { includes, filters, sorts } = req.query;

    const forbiddenFilters = getForbiddenFilters(
      filters as Record<string, any>,
      queryParams.allowedFilters,
    );

    if (forbiddenFilters.length > 0) {
      throw new ApiError(400, `Invalid filters: ${forbiddenFilters.join(', ')}`);
    }
    // Check if any forbidden includes are included in 'includes' parameter
    const forbiddenIncludes = getForbiddenIncludes(includes, queryParams.allowedIncludes);
    if (forbiddenIncludes.length > 0) {
      throw new ApiError(400, `Invalid includes: ${forbiddenIncludes.join(', ')}`);
    }

    // Check if any forbidden sorts are included in 'sorts' parameter
    const forbiddenSorts = getForbiddenSorts(sorts, queryParams.allowedSorts);
    if (forbiddenSorts.length > 0) {
      throw new ApiError(400, `Invalid sorts: ${forbiddenSorts.join(', ')}`);
    }

    next();
  });
