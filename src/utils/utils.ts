import dayjs from 'dayjs';
import { ZodError } from 'zod';
import { getS3BaseUrl } from '../configs/env-config';
import { Request, Response, NextFunction } from 'express';
const BASE_URL = getS3BaseUrl().BASE_URL;
export function formatToThreeDigits(value: number): string {
  // Ensure the value is a number
  const numValue = Number(value);

  if (isNaN(numValue)) {
    throw new Error('Invalid input, not a number');
  }

  if (numValue < 0 || numValue > 999) {
    throw new Error('Value is out of range for three digits');
  }

  // Convert to a string and add leading zeros
  const formattedValue = ('00' + numValue).slice(-3);

  return formattedValue;
}

export function buildIncludesObject(relations: string[]): any {
  const result: any = {};

  for (const relation of relations) {
    const relationParts = relation.split('.').filter((relation) => !!relation);
    let currentObj = result;

    for (let i = 0; i < relationParts.length; i++) {
      const part = relationParts[i];
      if (i === relationParts.length - 1) {
        // Last part of the relation
        currentObj[part] = true;
      } else {
        // Nested relation
        currentObj[part] = currentObj[part] || {};
        currentObj[part].include = currentObj[part].include || {};
        currentObj = currentObj[part].include;
      }
    }
  }

  return result;
}

export function buildWhereObject(
  filters: Record<string, any>,
  dateFieldName: string = 'created_at',
) {
  const where = {};
  const DATE_PREFIXES = ['start_date', 'end_date'];

  if (filters) {
    for (const key in filters) {
      if (Object.hasOwnProperty.call(filters, key) && !!filters[key]) {
        const splittArray = filters[key]?.split(',') ?? [];
        if (splittArray.length > 1) {
          if (key === 'user_roles') {
            where[key] = {
              some: {
                role_id: {
                  in: splittArray,
                },
              },
            };
          } else {
            where[key] = {
              in: splittArray,
            };
          }
        } else {
          const matchPrefix = DATE_PREFIXES.find((prefix) => key === prefix);
          if (matchPrefix) {
            const dateField = matchPrefix === DATE_PREFIXES[0] ? 'gte' : 'lte';
            const dateFilter =
              dateField === 'lte'
                ? dayjs(filters[key]).toDate().toISOString()
                : dayjs(filters[key]).subtract(1, 'day').toDate().toISOString();
            where[dateFieldName] = {
              ...where[dateFieldName],
              [dateField]: dateFilter,
            };
          } else {
            if (key === 'user_roles') {
              where[key] = {
                some: {
                  role_id: filters[key],
                },
              };
            } else {
              where[key] = {
                equals: filters[key],
              };
            }
          }
        }
      }
    }
  }

  return where;
}

export function buildSearchQuery(search: string | undefined, fields: string[]) {
  let searchQuery = {};

  if (!!search) {
    searchQuery = {
      OR: fields.map((field) => ({
        [field]: {
          contains: search,
        },
      })),
    };
  }

  return searchQuery;
}

export function getForbiddenIncludes(includes, allowedIncludes: string[]) {
  return ((includes || '') as string)
    .split(',')
    .filter((include) => !!include)
    .filter((include) => !allowedIncludes.includes(include));
}
export function getForbiddenSorts(sorts, allowedSorts: string[]) {
  return ((sorts || '') as string)
    .split(',')
    .filter((sort) => !!sort)
    .map((sort) => sort.replace(/^-/, ''))
    .filter((sort) => !allowedSorts.includes(sort));
}

export function getForbiddenFilters(
  filters: Record<string, any> = {},
  allowedFilters: string[],
): string[] {
  return Object.keys(filters).filter((filterKey) => !allowedFilters.includes(filterKey));
}

export function simplifyZodError(error: ZodError): string {
  const errorMessages = error.issues.map((issue) => {
    if (issue.code === 'invalid_type') {
      return `Invalid or missing ${issue.path.join('.')} parameter. ${issue.message}`;
    } else {
      return `Validation error for ${issue.path.join('.')}: ${issue.message}`;
    }
  });

  return errorMessages.join('\n');
}

export const isValidUUID = (value: string) => {
  const uuidRegex =
    /^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-4[0-9a-fA-F]{3}-[89abAB][0-9a-fA-F]{3}-[0-9a-fA-F]{12}$/;
  return uuidRegex.test(value);
};

export const isValidDate = (date: string) => {
  const dateRegex = /^\d{4}-(0[1-9]|1[0-2])-([0-2][0-9]|3[01])$/;

  const isoDateStringRegex = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}.\d{3}Z?$/; // ISO string format

  if (dateRegex.test(date)) {
    return dayjs(date).isValid(); // Validate "yyyy-mm-dd" format
  } else if (isoDateStringRegex.test(date)) {
    return dayjs(date).isValid(); // Validate ISO string format
  } else {
    return false; // Return false for any other format
  }
};

// This will check whether the time is following this format: h:mm a
export const isValidTime = (time) => {
  const timeRegex = /^(0?[1-9]|1[0-2]):[0-5][0-9] (AM|PM)$/i;
  return timeRegex.test(time);
};

// This will check whether the date is an ISO string or not
export const isValidIso = (dateString: string): boolean => {
  const isoRegex: RegExp = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(\.\d{3})?Z$/;
  return isoRegex.test(dateString) && dayjs(dateString).isValid();
};

export function buildSortObject(
  sorts: string | undefined,
): { [key: string]: 'asc' | 'desc' }[] {
  if (!sorts) {
    return [];
  }

  const sortArr = sorts.split(',');

  return sortArr.map((sort) => {
    if (sort.startsWith('-')) {
      return { [sort.slice(1)]: 'desc' };
    } else {
      return { [sort]: 'asc' };
    }
  });
}

export function findSortingType(sortType: string | undefined): 'asc' | 'desc' {
  if (sortType.split(',').length > 1) {
    return 'desc';
  }
  if (!sortType) {
    return 'desc';
  } else {
    if (sortType.startsWith('-')) {
      return 'desc';
    } else {
      return 'asc';
    }
  }
}

export function generateFileUrl(filepath: string): string {
  // Generate a public URL directly
  const publicUrl = `${BASE_URL}${filepath}`;
  return publicUrl;
}

// Parse recipient ids from body
export function parseRecipientIds(req: Request, rest: Response, next: NextFunction) {
  if (req.body.recipient_ids) {
    req.body.recipient_ids = JSON.parse(req.body.recipient_ids);
  }
  next();
}
