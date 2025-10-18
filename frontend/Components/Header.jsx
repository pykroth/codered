import React from 'react';
import { Stethoscope, Brain } from 'lucide-react';

function Header() {
  return (
    <header className="bg-white shadow-sm border-b border-gray-200">
      <div className="container mx-auto px-4 py-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="flex items-center space-x-2">
              <Stethoscope className="h-8 w-8 text-primary-600" />
              <Brain className="h-6 w-6 text-medical-500" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">MedLens</h1>
              <p className="text-sm text-gray-600">Explain My Diagnosis</p>
            </div>
          </div>
          <div className="text-right">
            <p className="text-sm text-gray-500">AI-Powered Medical Education</p>
            <p className="text-xs text-gray-400">24h Hackathon MVP</p>
          </div>
        </div>
      </div>
    </header>
  );
}

export default Header;
