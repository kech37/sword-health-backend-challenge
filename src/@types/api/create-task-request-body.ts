export interface CreateTaskRequestBody {
  summary: string;
  managerId?: UUID;
  technicianId?: UUID;
}
