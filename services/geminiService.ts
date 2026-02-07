
import { GoogleGenAI } from "@google/genai";
import { ModuleInput } from "../types";

export const generateTeachingModule = async (input: ModuleInput): Promise<string> => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || 'FAKE_API_KEY_FOR_DEVELOPMENT' });
  
  const prompt = `
    Anda adalah AI ahli kurikulum dan perancang Modul Ajar Deep Learning Kurikulum Merdeka jenjang SMP.
    Buatlah MODUL AJAR PEMBELAJARAN DEEP LEARNING secara LENGKAP, SISTEMATIS, dan SIAP DIGUNAKAN GURU berdasarkan data berikut:

    === INPUT ===
    1. Nama Sekolah: ${input.schoolName}
    2. Nama Guru Mapel: ${input.teacherName}
    3. NIP Guru Mapel: ${input.teacherNIP}
    4. Nama Kepala Sekolah: ${input.principalName}
    5. NIP Kepala Sekolah: ${input.principalNIP}
    6. Kelas: ${input.grade}
    7. Semester: ${input.semester}
    8. Tahun Pelajaran: ${input.academicYear}
    9. Mata Pelajaran: ${input.subject}
    10. Materi Pokok: ${input.coreTopic}
    11. Sub Materi: ${input.subTopic}
    12. Alokasi Waktu: ${input.duration}
    13. Jumlah Pertemuan: ${input.meetingCount}
    14. Model Pembelajaran: ${input.teachingModel}
    15. Dimensi Profil Lulusan (DPL): ${input.selectedDPL.join(", ")}

    === KETENTUAN PENYUSUNAN ===
    1. Modul harus berbasis pendekatan Deep Learning: Mindful Learning, Meaningful Learning, Joyful Learning.
    2. Integrasikan Model Pembelajaran "${input.teachingModel}" secara eksplisit ke dalam sintaks kegiatan inti.
    3. Pembelajaran berpusat pada peserta didik.
    4. Kontekstual dengan lingkungan SMPN 3 Pakuhaji (sesuaikan dengan karakteristik pesisir/pedesaan jika relevan).
    5. Integrasikan DPL ke dalam Tujuan, Aktivitas, dan Asesmen.
    6. Gunakan Bahasa Indonesia formal-edukatif yang mudah dipahami guru.

    === STRUKTUR MODUL (WAJIB ADA SEMUA) ===
    A. Identitas Modul (Sertakan: Nama Sekolah, Kelas, Mata Pelajaran, Materi Pokok, Sub Materi, Alokasi Waktu, Semester, Tahun Pelajaran. PENTING: JANGAN sertakan Nama Guru, NIP, atau Kepala Sekolah di bagian identitas ini karena informasi tersebut dikhususkan untuk Lembar Pengesahan.)
    B. Kompetensi Awal
    C. Profil Pelajar (DPL)
    D. Sarana dan Prasarana
    E. Target Peserta Didik
    F. Model, Pendekatan, dan Metode (Sebutkan Deep Learning & ${input.teachingModel})
    G. Tujuan Pembelajaran (Terukur & Integrasi DPL)
    H. Pemahaman Bermakna (Meaningful Learning)
    I. Pertanyaan Pemantik (HOTS)
    J. Kegiatan Pembelajaran (Pendahuluan: Mindful, Inti: Deep dengan Sintaks ${input.teachingModel}, Penutup: Joyful & Refleksi)
    K. Asesmen Pembelajaran (Diagnostik, Formatif, Sumatif + Contoh Instrumen)
    L. Pengayaan dan Remedial
    M. Refleksi Guru dan Peserta Didik
    N. Bahan Bacaan Guru dan Peserta Didik
    O. Lampiran (LKPD, Rubrik, Contoh Soal)
    P. Lembar Pengesahan (WAJIB: Buatlah tempat tanda tangan yang SEJAJAR secara horizontal. Nama Kepala Sekolah [${input.principalName}] diletakkan di sebelah KIRI dan Nama Guru Mapel [${input.teacherName}] diletakkan di sebelah KANAN. Cantumkan NIP Kepala Sekolah [${input.principalNIP}] tepat di bawah nama Kepala Sekolah dan NIP Guru [${input.teacherNIP}] tepat di bawah nama guru. Gunakan tabel Markdown tanpa garis tepi atau format kolom yang sangat rapi untuk memastikan posisi kiri-kanan tersebut.)

    Hasilkan konten dalam format Markdown yang rapi dan profesional. Gunakan tabel jika diperlukan untuk rubrik penilaian.
  `;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: prompt,
      config: {
        temperature: 0.7,
        topP: 0.95,
        topK: 40,
      }
    });

    return response.text || "Gagal menghasilkan modul. Silakan coba lagi.";
  } catch (error) {
    console.error("Gemini API Error:", error);
    throw new Error("Terjadi kesalahan saat menghubungi AI. Periksa koneksi atau API Key Anda.");
  }
};
