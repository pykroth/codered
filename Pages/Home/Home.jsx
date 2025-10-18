import { Upload, FileText, MessageSquare, Globe, Shield, ArrowRight, BookOpen, Heart } from 'lucide-react';

export default function MedLensHome() {
  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <div className="max-w-5xl mx-auto px-6 pt-24 pb-16">
        <div className="mb-20">
          <div className="inline-flex items-center gap-2 mb-4 px-3 py-1 bg-blue-50 rounded-full text-sm text-blue-700 font-medium">
            <BookOpen className="w-4 h-4" />
            Health Literacy for Everyone
          </div>
          
          <h1 className="text-6xl font-bold mb-6 text-gray-900">
            Learn what your<br />medical reports mean.
          </h1>
          
          <p className="text-xl text-gray-600 mb-8 max-w-xl">
            Understanding your health shouldn't require a medical degree. Upload any diagnosis or lab result and learn what it means—in plain language, in any language.
          </p>

          <button className="px-6 py-3 bg-blue-600 text-white rounded-md font-medium hover:bg-blue-700 inline-flex items-center gap-2">
            Upload a report
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

        {/* Problem Statement */}
        <div className="mb-20 bg-blue-50 rounded-lg p-8 border-l-4 border-blue-600">
          <h3 className="text-lg font-semibold text-gray-900 mb-3">
            Health literacy is a barrier to care
          </h3>
          <p className="text-gray-700 mb-3">
           Most adults struggle to understand their medical documents. Terms like "hypercholesterolemia" or "elevated LDL" create confusion, leading to medication errors, missed follow-ups, and unnecessary anxiety.
          </p>
          <p className="text-gray-600">
            For non-native English speakers, elderly patients, pateints with disabillities, and caregivers—this barrier is even higher. MedLens makes health education accessible to everyone.
          </p>
        </div>

        {/* Who This Helps */}
        <div className="mb-20">
          <h2 className="text-3xl font-bold mb-8 text-gray-900">
            Who benefits from accessible health education
          </h2>
          
          <div className="grid md:grid-cols-3 gap-6">
            <div className="border border-gray-200 rounded-lg p-6">
              <Globe className="w-8 h-8 text-blue-600 mb-3" />
              <h3 className="font-semibold text-gray-900 mb-2">Non-Native Speakers</h3>
              <p className="text-sm text-gray-600">Immigrants and refugees deserve to understand their health in their native language.</p>
            </div>
            
            <div className="border border-gray-200 rounded-lg p-6">
              <Heart className="w-8 h-8 text-blue-600 mb-3" />
              <h3 className="font-semibold text-gray-900 mb-2">Elderly Patients</h3>
              <p className="text-sm text-gray-600">Simplified explanations help seniors manage complex chronic conditions independently.</p>
            </div>
            
            <div className="border border-gray-200 rounded-lg p-6">
              <BookOpen className="w-8 h-8 text-blue-600 mb-3" />
              <h3 className="font-semibold text-gray-900 mb-2">Caregivers</h3>
              <p className="text-sm text-gray-600">Family members caring for loved ones need clear information to provide proper support.</p>
            </div>
          </div>
        </div>

        {/* How It Works */}
        <div className="mb-20">
          <h2 className="text-3xl font-bold mb-8 text-gray-900">
            From confusion to clarity
          </h2>
          
          <div className="space-y-8">
            <div className="flex gap-6">
              <div className="flex-shrink-0">
                <div className="w-10 h-10 bg-blue-100 rounded flex items-center justify-center font-semibold text-blue-600">
                  1
                </div>
              </div>
              <div>
                <h3 className="text-xl font-semibold mb-2 text-gray-900">Upload your medical document</h3>
                <p className="text-gray-600">Take a photo or upload a PDF of any diagnosis, lab result, discharge summary, or prescription. Our OCR technology extracts the medical text instantly.</p>
              </div>
            </div>

            <div className="flex gap-6">
              <div className="flex-shrink-0">
                <div className="w-10 h-10 bg-blue-100 rounded flex items-center justify-center font-semibold text-blue-600">
                  2
                </div>
              </div>
              <div>
                <h3 className="text-xl font-semibold mb-2 text-gray-900">Get a simple explanation</h3>
                <p className="text-gray-600">AI breaks down complex medical jargon into plain language anyone can understand—accurate, reassuring, and educational.</p>
              </div>
            </div>

            <div className="flex gap-6">
              <div className="flex-shrink-0">
                <div className="w-10 h-10 bg-blue-100 rounded flex items-center justify-center font-semibold text-blue-600">
                  3
                </div>
              </div>
              <div>
                <h3 className="text-xl font-semibold mb-2 text-gray-900">Ask questions to learn more</h3>
                <p className="text-gray-600">Still confused? Chat with MedLens to explore terms, understand your results, and learn about your condition. All answers come with trusted medical sources.</p>
              </div>
            </div>

            <div className="flex gap-6">
              <div className="flex-shrink-0">
                <div className="w-10 h-10 bg-blue-100 rounded flex items-center justify-center font-semibold text-blue-600">
                  4
                </div>
              </div>
              <div>
                <h3 className="text-xl font-semibold mb-2 text-gray-900">Read in your language</h3>
                <p className="text-gray-600">Translate explanations into Spanish, Arabic, Urdu, Mandarin, or 50+ languages—removing language as a barrier to health literacy.</p>
              </div>
            </div>
          </div>
        </div>

        {/* Example */}
        <div className="mb-20">
          <h2 className="text-3xl font-bold mb-8 text-gray-900">
            See it in action
          </h2>
          
          <div className="bg-gray-50 rounded-lg p-8 space-y-6">
            <div>
              <div className="text-sm font-medium text-gray-500 mb-2">What your doctor wrote:</div>
              <div className="bg-white border border-gray-200 rounded p-4 font-mono text-sm text-gray-700">
                Diagnosis: Type II Diabetes Mellitus<br />
                HbA1c: 8.2%<br />
                Recommendation: Start Metformin 500mg BID
              </div>
            </div>

            <div className="flex items-center justify-center py-2">
              <ArrowRight className="w-5 h-5 text-gray-400" />
            </div>

            <div>
              <div className="text-sm font-medium text-gray-500 mb-2">What MedLens teaches you:</div>
              <div className="bg-white border border-blue-200 rounded p-4 text-gray-700">
                <p className="mb-3">
                  <strong>You have Type 2 Diabetes.</strong> This means your body has trouble controlling blood sugar levels.
                </p>
                <p className="mb-3">
                  <strong>Your HbA1c is 8.2%.</strong> This measures your average blood sugar over 3 months. The ideal range is below 6.5%, so yours is higher than recommended.
                </p>
                <p>
                  <strong>Your doctor prescribed Metformin.</strong> This medication helps lower blood sugar. You'll take 500mg twice a day (BID means "twice daily"). This condition is manageable with medication, diet, and exercise.
                </p>
              </div>
            </div>
          </div>

          <div className="mt-6 bg-white border border-gray-200 rounded-lg p-6">
            <div className="flex items-start gap-3">
              <MessageSquare className="w-5 h-5 text-blue-600 flex-shrink-0 mt-1" />
              <div>
                <p className="text-sm font-medium text-gray-900 mb-2">Then ask questions like:</p>
                <ul className="text-sm text-gray-600 space-y-1">
                  <li>• "What foods should I avoid with diabetes?"</li>
                  <li>• "Are there side effects of Metformin?"</li>
                  <li>• "How often should I check my blood sugar?"</li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        {/* CTA */}
        <div className="text-center mb-16 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl p-12">
          <h2 className="text-3xl font-bold mb-4 text-gray-900">Ready to understand your health?</h2>
          <p className="text-gray-600 mb-6 max-w-xl mx-auto">Join thousands learning to take control of their healthcare through accessible education.</p>
          <button className="px-8 py-4 bg-blue-600 text-white rounded-md font-medium hover:bg-blue-700 text-lg inline-flex items-center gap-2">
            Try MedLens now
            <ArrowRight className="w-5 h-5" />
          </button>
        </div>

        {/* Disclaimer */}
        <div className="border-t border-gray-200 pt-8">
          <div className="flex gap-3 text-sm text-gray-600">
            <Shield className="w-5 h-5 text-gray-400 flex-shrink-0" />
            <p>
              <span className="font-medium text-gray-900">Educational Tool:</span> MedLens provides educational explanations to improve health literacy, not medical advice. Always consult your healthcare provider for medical decisions.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}