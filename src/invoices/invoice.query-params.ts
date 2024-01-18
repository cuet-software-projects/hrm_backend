export const invoiceQueryParams = {
  allowedIncludes: ['user', 'received_by', 'parent_invoice', 'child_invoices'],
  allowedFilters: ['user_id', 'status'],
  allowedSorts: ['created_at', 'issue_date'],
};
