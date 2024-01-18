export type IDesignation = {
  id: string;
  name: string;
};

export type DesignationDto = {
  name: string;
};

export type UpdateDesignationDto = Partial<DesignationDto>;
