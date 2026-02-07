
export interface ModuleInput {
  schoolName: string;
  teacherName: string;
  teacherNIP: string;
  principalName: string;
  principalNIP: string;
  grade: string;
  semester: 'Ganjil' | 'Genap';
  academicYear: string;
  subject: string;
  coreTopic: string;
  subTopic: string;
  duration: string;
  meetingCount: string;
  teachingModel: string;
  selectedDPL: string[];
}

export const DPL_OPTIONS = [
  "Keimanan dan Ketakwaan terhadap Tuhan YME",
  "Kewargaan",
  "Penalaran Kritis",
  "Kreativitas",
  "Kolaborasi",
  "Kemandirian",
  "Kesehatan Jasmani dan Mental",
  "Literasi dan Numerasi",
  "Kepedulian terhadap Lingkungan"
];

export const TEACHING_MODELS = [
  "Discovery Learning",
  "Inquiry Learning",
  "Problem Based Learning (PBL)",
  "Project Based Learning (PjBL)",
  "Pembelajaran Diferensiasi",
  "Contextual Teaching and Learning (CTL)",
  "Cooperative Learning"
];

export const GRADE_OPTIONS = ["VII", "VIII", "IX"];

export interface GeneratedModule {
  content: string;
}
