
import React, { useState, useRef } from 'react';
import { 
  BookOpen, Sparkles, FileText, CheckCircle2, 
  Copy, Download, FileType, FileDown, 
  Settings, Layout, GraduationCap,
  ChevronRight, User
} from 'lucide-react';
import { ModuleInput, DPL_OPTIONS, TEACHING_MODELS, GRADE_OPTIONS } from './types';
import { generateTeachingModule } from './services/geminiService';
import { Button } from './components/Button';
import { Card } from './components/Card';
import { marked } from 'marked';

const App: React.FC = () => {
  const [formData, setFormData] = useState<ModuleInput>({
    schoolName: '',
    teacherName: '',
    teacherNIP: '',
    principalName: '',
    principalNIP: '',
    grade: GRADE_OPTIONS[0],
    semester: 'Ganjil',
    academicYear: '2025/2026',
    subject: '',
    coreTopic: '',
    subTopic: '',
    duration: '',
    meetingCount: '',
    teachingModel: TEACHING_MODELS[2], // PBL as default
    selectedDPL: []
  });

  const [isLoading, setIsLoading] = useState(false);
  const [generatedContent, setGeneratedContent] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const contentRef = useRef<HTMLDivElement>(null);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleDPLToggle = (dpl: string) => {
    setFormData(prev => {
      const isSelected = prev.selectedDPL.includes(dpl);
      return {
        ...prev,
        selectedDPL: isSelected 
          ? prev.selectedDPL.filter(i => i !== dpl) 
          : [...prev.selectedDPL, dpl]
      };
    });
  };

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (
      !formData.schoolName || 
      !formData.teacherName || 
      !formData.principalName || 
      !formData.subject || 
      !formData.coreTopic || 
      formData.selectedDPL.length === 0
    ) {
      setError("Mohon lengkapi semua field wajib (Sekolah, Guru, Kepala Sekolah, Mapel, Materi Pokok), pilih Model Pembelajaran, dan pilih minimal satu DPL.");
      return;
    }

    setIsLoading(true);
    setError(null);
    try {
      const result = await generateTeachingModule(formData);
      setGeneratedContent(result);
    } catch (err: any) {
      setError(err.message || "Gagal membuat modul.");
    } finally {
      setIsLoading(false);
    }
  };

  const copyToClipboard = () => {
    if (generatedContent) {
      navigator.clipboard.writeText(generatedContent);
      alert("Konten Markdown berhasil disalin!");
    }
  };

  const downloadAsMarkdown = () => {
    if (generatedContent) {
      const blob = new Blob([generatedContent], { type: 'text/markdown' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `Modul_Ajar_${formData.subject}_${formData.coreTopic}.md`;
      a.click();
    }
  };

  const downloadAsWord = () => {
    if (generatedContent) {
      const htmlContent = marked.parse(generatedContent);
      const header = `
        <html xmlns:o='urn:schemas-microsoft-com:office:office' xmlns:w='urn:schemas-microsoft-com:office:word' xmlns='http://www.w3.org/TR/REC-html40'>
        <head><meta charset='utf-8'><title>Modul Ajar</title>
        <style>
          body { font-family: 'Arial', sans-serif; line-height: 1.5; }
          h1 { color: #1e40af; border-bottom: 2px solid #e0e7ff; padding-bottom: 5px; }
          table { border-collapse: collapse; width: 100%; }
          th, td { border: 1px solid black; padding: 8px; }
          th { background-color: #f3f4f6; }
        </style>
        </head><body>
      `;
      const footer = "</body></html>";
      const source = header + htmlContent + footer;
      
      const blob = new Blob(['\ufeff', source], {
        type: 'application/msword'
      });
      
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `Modul_Ajar_${formData.subject}.doc`;
      link.click();
    }
  };

  const printAsPDF = () => {
    if (generatedContent) {
      window.print();
    }
  };

  const inputClass = "w-full px-4 py-2 bg-blue-50/40 border border-blue-200 rounded-xl focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 focus:bg-white outline-none transition-all placeholder:text-slate-400 text-slate-700 font-medium appearance-none";

  return (
    <div className="min-h-screen pb-12 bg-slate-50 selection:bg-blue-100 selection:text-blue-900">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-md border-b border-slate-200 sticky top-0 z-50 no-print">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="bg-gradient-to-tr from-blue-600 to-blue-500 p-2.5 rounded-xl shadow-lg shadow-blue-200 ring-4 ring-blue-50">
              <BookOpen className="text-white h-6 w-6" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-slate-900 tracking-tight">AI Modul Ajar <span className="text-blue-600 italic">Deep Learning</span></h1>
              <p className="text-[10px] font-extrabold text-blue-500 uppercase tracking-[0.2em]">SMPN 3 Pakuhaji • Kurikulum Merdeka</p>
            </div>
          </div>
          <div className="hidden sm:flex items-center gap-4 text-xs font-bold text-slate-500">
            <span className="flex items-center gap-1.5"><Layout className="h-3.5 w-3.5" /> Mindful</span>
            <span className="flex items-center gap-1.5 text-blue-600"><GraduationCap className="h-3.5 w-3.5" /> Meaningful</span>
            <span className="flex items-center gap-1.5"><Sparkles className="h-3.5 w-3.5" /> Joyful</span>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-8 grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Form Panel */}
        <div className="lg:col-span-5 space-y-6 no-print">
          <Card className="border-blue-100/50 shadow-xl shadow-slate-200/50">
            <div className="flex items-center justify-between mb-8">
              <div className="flex items-center gap-2.5">
                <div className="bg-blue-100 p-2 rounded-lg">
                  <Settings className="text-blue-600 h-4 w-4" />
                </div>
                <h2 className="text-lg font-extrabold text-slate-800">Parameter Modul</h2>
              </div>
              <span className="text-[10px] font-bold px-2 py-1 bg-blue-50 text-blue-600 rounded-md border border-blue-100">Fase D (SMP)</span>
            </div>

            <form onSubmit={handleGenerate} className="space-y-5">
              <div className="space-y-1.5">
                <label className="text-[11px] font-black text-blue-700 uppercase tracking-widest ml-1">Nama Sekolah</label>
                <input 
                  type="text" 
                  name="schoolName"
                  placeholder="Contoh: SMPN 3 Pakuhaji"
                  className={inputClass}
                  value={formData.schoolName}
                  onChange={handleInputChange}
                  required
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-[11px] font-black text-blue-700 uppercase tracking-widest ml-1">Nama Guru Mapel</label>
                <input 
                  type="text" 
                  name="teacherName"
                  placeholder="Contoh: Budi Santoso, S.Pd."
                  className={inputClass}
                  value={formData.teacherName}
                  onChange={handleInputChange}
                  required
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-[11px] font-black text-blue-700 uppercase tracking-widest ml-1">NIP Guru Mapel</label>
                <input 
                  type="text" 
                  name="teacherNIP"
                  placeholder="Contoh: 19850101 201001 1 001"
                  className={inputClass}
                  value={formData.teacherNIP}
                  onChange={handleInputChange}
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-[11px] font-black text-blue-700 uppercase tracking-widest ml-1">Nama Kepala Sekolah</label>
                <input 
                  type="text" 
                  name="principalName"
                  placeholder="Contoh: Dr. Siti Aminah, M.Pd."
                  className={inputClass}
                  value={formData.principalName}
                  onChange={handleInputChange}
                  required
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-[11px] font-black text-blue-700 uppercase tracking-widest ml-1">NIP Kepala Sekolah</label>
                <input 
                  type="text" 
                  name="principalNIP"
                  placeholder="Contoh: 19750202 200501 2 002"
                  className={inputClass}
                  value={formData.principalNIP}
                  onChange={handleInputChange}
                />
              </div>

              <div className="space-y-1.5 relative">
                <label className="text-[11px] font-black text-blue-700 uppercase tracking-widest ml-1">Kelas</label>
                <select 
                  name="grade"
                  className={inputClass}
                  value={formData.grade}
                  onChange={handleInputChange}
                  required
                >
                  {GRADE_OPTIONS.map(grade => (
                    <option key={grade} value={grade}>{grade}</option>
                  ))}
                </select>
                <div className="absolute right-4 bottom-3 pointer-events-none text-blue-400">
                  <ChevronRight className="h-4 w-4 rotate-90" />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-[11px] font-black text-blue-700 uppercase tracking-widest ml-1">Semester</label>
                  <select 
                    name="semester"
                    className={inputClass}
                    value={formData.semester}
                    onChange={handleInputChange}
                  >
                    <option value="Ganjil">Ganjil</option>
                    <option value="Genap">Genap</option>
                  </select>
                </div>
                <div className="space-y-1.5">
                  <label className="text-[11px] font-black text-blue-700 uppercase tracking-widest ml-1">Tahun Pelajaran</label>
                  <input 
                    type="text" 
                    name="academicYear"
                    placeholder="2025/2026"
                    className={inputClass}
                    value={formData.academicYear}
                    onChange={handleInputChange}
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-[11px] font-black text-blue-700 uppercase tracking-widest ml-1">Mata Pelajaran</label>
                <input 
                  type="text" 
                  name="subject"
                  placeholder="Contoh: Matematika"
                  className={inputClass}
                  value={formData.subject}
                  onChange={handleInputChange}
                  required
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-[11px] font-black text-blue-700 uppercase tracking-widest ml-1">Materi Pokok</label>
                <input 
                  type="text" 
                  name="coreTopic"
                  placeholder="Contoh: Persamaan Linear"
                  className={inputClass}
                  value={formData.coreTopic}
                  onChange={handleInputChange}
                  required
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-[11px] font-black text-blue-700 uppercase tracking-widest ml-1">Sub Materi</label>
                <input 
                  type="text" 
                  name="subTopic"
                  placeholder="Contoh: Menyelesaikan SPLDV dengan Metode Substitusi"
                  className={inputClass}
                  value={formData.subTopic}
                  onChange={handleInputChange}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-[11px] font-black text-blue-700 uppercase tracking-widest ml-1">Durasi Pertemuan</label>
                  <input 
                    type="text" 
                    name="duration"
                    placeholder="Contoh: 2 x 40 Menit"
                    className={inputClass}
                    value={formData.duration}
                    onChange={handleInputChange}
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-[11px] font-black text-blue-700 uppercase tracking-widest ml-1">Jumlah Pertemuan</label>
                  <input 
                    type="text" 
                    name="meetingCount"
                    placeholder="Contoh: 2 Pertemuan"
                    className={inputClass}
                    value={formData.meetingCount}
                    onChange={handleInputChange}
                  />
                </div>
              </div>

              <div className="space-y-1.5 relative">
                <label className="text-[11px] font-black text-blue-700 uppercase tracking-widest ml-1">Model Pembelajaran</label>
                <select 
                  name="teachingModel"
                  className={inputClass}
                  value={formData.teachingModel}
                  onChange={handleInputChange}
                >
                  {TEACHING_MODELS.map(model => (
                    <option key={model} value={model}>{model}</option>
                  ))}
                </select>
                <div className="absolute right-4 bottom-3 pointer-events-none text-blue-400">
                  <ChevronRight className="h-4 w-4 rotate-90" />
                </div>
              </div>

              <div className="space-y-3 pt-2">
                <label className="text-[11px] font-black text-blue-700 uppercase tracking-widest ml-1">Dimensi Profil Lulusan (DPL)</label>
                <div className="flex flex-wrap gap-2">
                  {DPL_OPTIONS.map(dpl => (
                    <button
                      key={dpl}
                      type="button"
                      onClick={() => handleDPLToggle(dpl)}
                      className={`px-3 py-2 rounded-xl text-[10px] font-bold border transition-all duration-300 ${
                        formData.selectedDPL.includes(dpl)
                          ? "bg-blue-600 border-blue-600 text-white shadow-lg shadow-blue-200 -translate-y-0.5"
                          : "bg-white border-slate-200 text-slate-500 hover:border-blue-300 hover:text-blue-600"
                      }`}
                    >
                      {dpl}
                    </button>
                  ))}
                </div>
              </div>

              {error && (
                <div className="p-4 bg-red-50 text-red-600 text-xs rounded-xl border border-red-100 font-bold flex items-center gap-2">
                  <div className="w-1.5 h-1.5 bg-red-500 rounded-full animate-pulse"></div>
                  {error}
                </div>
              )}

              <Button 
                type="submit" 
                className="w-full h-14 mt-4 text-base font-black uppercase tracking-widest rounded-2xl shadow-xl shadow-blue-200/50" 
                isLoading={isLoading}
              >
                Hasilkan Modul
              </Button>
            </form>
          </Card>
        </div>

        {/* Right Preview Panel */}
        <div className="lg:col-span-7 h-full">
          <Card className="h-full min-h-[700px] flex flex-col p-0 overflow-hidden border-slate-200 shadow-2xl no-print">
            <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-white z-10 sticky top-0">
              <div className="flex items-center gap-2.5">
                <div className="bg-blue-50 p-2 rounded-lg">
                  <FileType className="text-blue-600 h-4 w-4" />
                </div>
                <h2 className="text-lg font-extrabold text-slate-800">Pratinjau Hasil</h2>
              </div>
              {generatedContent && (
                <div className="flex gap-2">
                  <Button variant="outline" className="h-9 px-3 text-[10px] gap-1.5 font-bold border-blue-100 text-blue-700 hover:bg-blue-50 rounded-lg" onClick={copyToClipboard}>
                    <Copy className="h-3.5 w-3.5" /> Salin
                  </Button>
                  <div className="flex bg-slate-100 p-1 rounded-lg">
                    <button onClick={downloadAsWord} className="p-1.5 text-blue-600 hover:bg-white rounded-md transition-all" title="Download Word">
                      <FileDown className="h-4 w-4" />
                    </button>
                    <button onClick={printAsPDF} className="p-1.5 text-blue-600 hover:bg-white rounded-md transition-all" title="Export PDF">
                      <FileText className="h-4 w-4" />
                    </button>
                    <button onClick={downloadAsMarkdown} className="p-1.5 text-blue-600 hover:bg-white rounded-md transition-all" title="Download Markdown">
                      <Download className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              )}
            </div>

            <div className="flex-1 p-4 sm:p-8 overflow-y-auto bg-slate-50/30">
              {!generatedContent && !isLoading && (
                <div className="h-full flex flex-col items-center justify-center text-center p-12">
                  <div className="bg-white p-8 rounded-[2.5rem] shadow-2xl shadow-blue-100/50 border border-blue-50 mb-8 group transition-all hover:rotate-2 hover:scale-105">
                    <Layout className="h-20 w-20 text-blue-100 group-hover:text-blue-400 transition-colors duration-500" />
                  </div>
                  <h3 className="text-slate-800 font-black text-2xl tracking-tight">Menunggu Kreativitas Anda</h3>
                  <p className="text-slate-400 max-w-xs mt-4 text-sm leading-relaxed font-semibold">
                    Lengkapi parameter pembelajaran di samping untuk meramu modul ajar otomatis berbasis AI.
                  </p>
                </div>
              )}

              {isLoading && (
                <div className="h-full flex flex-col items-center justify-center py-24 space-y-8">
                  <div className="relative">
                    <div className="h-32 w-32 border-[12px] border-blue-50 border-t-blue-600 rounded-full animate-spin"></div>
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
                       <Sparkles className="text-blue-500 h-10 w-10 animate-bounce" />
                    </div>
                  </div>
                  <div className="text-center animate-pulse">
                    <h3 className="text-2xl font-black text-slate-800">Menyusun Struktur Deep Learning...</h3>
                    <p className="text-sm text-slate-500 font-bold max-w-sm mt-3 uppercase tracking-widest">
                      Integrasi Sintaks {formData.teachingModel}
                    </p>
                  </div>
                </div>
              )}

              {generatedContent && !isLoading && (
                <div className="animate-in fade-in slide-in-from-bottom-8 duration-1000">
                  <div 
                    id="printable-content"
                    className="prose prose-blue max-w-none bg-white p-10 sm:p-14 rounded-[2rem] shadow-xl border border-blue-50 border-t-8 border-t-blue-600"
                    dangerouslySetInnerHTML={{ __html: marked.parse(generatedContent) }}
                  />
                </div>
              )}
            </div>
          </Card>

          {/* Hidden print container to ensure high quality PDF */}
          {generatedContent && (
            <div className="hidden print:block print-only prose max-w-none">
              <div dangerouslySetInnerHTML={{ __html: marked.parse(generatedContent) }} />
            </div>
          )}
        </div>
      </main>

      <footer className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-16 text-center text-slate-400 text-[10px] font-black uppercase tracking-[0.4em] border-t border-slate-100 pt-10 no-print">
        <p>&copy; 2026 SMPN 3 Pakuhaji AI LAB — MODUL AJAR DIGITAL GENERATOR</p>
      </footer>
    </div>
  );
};

export default App;
