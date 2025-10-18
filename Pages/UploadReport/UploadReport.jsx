
import Header from './components/Header';
import FileUpload from './components/FileUpload';
import ResultsPanel from './components/ResultsPanel';
import QASection from './components/QASection';
import Footer from './components/Footer';
import { MedicalProvider } from './context/MedicalContext';

export default function UploadReport() {
 return (
  <MedicalProvider>
      <div className="min-h-screen bg-gray-50">
        <Header />
        <main className="container mx-auto px-4 py-8">
          <div className="max-w-4xl mx-auto space-y-8">
            <FileUpload />
            <ResultsPanel />
            <QASection />
          </div>
        </main>
        <Footer />
      </div>
    </MedicalProvider>
  );
}
