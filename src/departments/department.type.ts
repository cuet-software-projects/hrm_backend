export type IDepartment = {
  id: string;
  name: string;
  code: string;
  description: string | null;
  prefix_code: string;
};

export type DepartmentDto = {
  name: string;
  code: string;
  description: string;
  prefix_code: string;
};

export type UpdateDepartmentDto = Partial<DepartmentDto>;
