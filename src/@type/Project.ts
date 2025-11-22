export interface Project {
  id: string;
  title: string;
  description: string;
  client_id: string;

  categories: Category[];
  collaborators: Collaborator[];
  media_sources: MediaSource[];
  thematic_areas: ThematicArea[];
  report_avenues: ReportAvenue[];
  report_times: ReportTime[];
  report_consultations: ReportConsultation[];
}

/* -----------------------------
   Nested Types
----------------------------- */

export interface Category {
  id?: string;
  name?: string;
}

export interface Collaborator {
  id?: string;
  name?: string;
}

export interface MediaSource {
  id: string;
  name: string;
  category_name: string;
}

export interface ThematicArea {
  id: string;
  area: string;
  title: string;
  description: string;
  monitoring_objectives: string[];
}

export interface ReportAvenue {
  id: string;
  name: string;
}

export interface ReportTime {
  id: string;
  name: string;
}

export interface ReportConsultation {
  id: string;
  name: string;
}
