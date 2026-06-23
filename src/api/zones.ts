import { api } from './client';

export interface Zone {
  id?: number;
  employee_name: string;
  x1: number;
  y1: number;
  x2: number;
  y2: number;
}

export const zonesApi = {
  list: () => api.get<Zone[]>('/zones'),
  create: (zone: Zone) => api.postJson<Zone>('/zones', zone),
};
