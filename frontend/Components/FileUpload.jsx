import React, { useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { Upload, FileText, Image, AlertCircle } from 'lucide-react';
import { useMedical } from '../context/MedicalContext';
import { uploadFile } from '../services/api';

function FileUpload() {
  const { state, dispatch } = useMedical();
  const { isProcessing, error } = state;

  const onDrop = useCallback(async (acceptedFiles) => {
    const file = acceptedFiles[0];
    if (!file) return;

    dispatch({ type: 'SET_PROCESSING', payload: true });
    dispatch({ type: 'SET_ERROR', payload: null });

    try {
      const formData = new FormData();
      formData.append('file', file);

      const response = await uploadFile(formData);
      
      if (response.success) {
        dispatch({ type: 'SET_EXTRACTED_TEXT', payload: response.extracted_text });
      } else {
        dispatch({ type: 'SET_ERROR', payload: 'Failed to extract text from file' });
      }
    } catch (err) {
      console.error('Upload error:', err);
      dispatch({ 
        type: 'SET_ERROR', 
        payload: err.response?.data?.detail || 'Failed to process file' 
      });
    } finally {
      dispatch({ type: 'SET_PROCESSING', payload: false });
    }
  }, [dispatch]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'application/pdf': ['.pdf'],
      'image/jpeg': ['.jpg', '.jpeg'],
      'image/png': ['.png']
    },
    maxFiles: 1,
    disabled: isProcessing
  });

  return (
    <div className="card">
      <div className="text-center mb-6">
        <h2 className="text-2xl font-semibold text-gray-900 mb-2">
          Upload Your Medical Report
        </h2>
        <p className="text-gray-600">
          Upload a PDF or image of your medical report to get started
        </p>
      </div>

      {error && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-center space-x-2">
          <AlertCircle className="h-5 w-5 text-red-500" />
          <p className="text-red-700">{error}</p>
        </div>
      )}

      <div
        {...getRootProps()}
        className={`
          border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-colors
          ${isDragActive 
            ? 'border-primary-500 bg-primary-50' 
            : 'border-gray-300 hover:border-primary-400 hover:bg-gray-50'
          }
          ${isProcessing ? 'opacity-50 cursor-not-allowed' : ''}
        `}
      >
        <input {...getInputProps()} />
        
        <div className="flex flex-col items-center space-y-4">
          {isProcessing ? (
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
          ) : (
            <Upload className="h-12 w-12 text-gray-400" />
          )}
          
          <div>
            <p className="text-lg font-medium text-gray-900">
              {isProcessing 
                ? 'Processing your file...' 
                : isDragActive 
                  ? 'Drop your file here' 
                  : 'Drag & drop your file here'
              }
            </p>
            <p className="text-sm text-gray-500 mt-1">
              or click to browse files
            </p>
          </div>
          
          <div className="flex items-center space-x-4 text-sm text-gray-500">
            <div className="flex items-center space-x-1">
              <FileText className="h-4 w-4" />
              <span>PDF</span>
            </div>
            <div className="flex items-center space-x-1">
              <Image className="h-4 w-4" />
              <span>JPG, PNG</span>
            </div>
          </div>
        </div>
      </div>

      {state.extractedText && (
        <div className="mt-6 p-4 bg-green-50 border border-green-200 rounded-lg">
          <p className="text-green-700 font-medium">
            ✅ Text extracted successfully! ({state.extractedText.length} characters)
          </p>
        </div>
      )}
    </div>
  );
}

export default FileUpload;
