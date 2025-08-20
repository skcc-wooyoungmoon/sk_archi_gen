
import React, { useState, useCallback } from 'react';

interface FileUploadProps {
  id: string;
  label: string;
  acceptedTypes: string;
  onFileSelect: (file: File | null) => void;
  file: File | null;
}

const FileIcon: React.FC = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
);

const UploadIcon: React.FC = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1"><path strokeLinecap="round" strokeLinejoin="round" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" /></svg>
);


const FileUpload: React.FC<FileUploadProps> = ({ id, label, acceptedTypes, onFileSelect, file }) => {
  const [isDragging, setIsDragging] = useState(false);

  const handleDragEnter = (e: React.DragEvent<HTMLLabelElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };
  const handleDragLeave = (e: React.DragEvent<HTMLLabelElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };
  const handleDragOver = (e: React.DragEvent<HTMLLabelElement>) => {
    e.preventDefault();
    e.stopPropagation();
  };
  const handleDrop = (e: React.DragEvent<HTMLLabelElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      onFileSelect(e.dataTransfer.files[0]);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      onFileSelect(e.target.files[0]);
    }
  };

  const removeFile = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    onFileSelect(null);
    const input = document.getElementById(id) as HTMLInputElement;
    if(input) input.value = '';
  }

  return (
    <div className="w-full">
      <label htmlFor={id} className="block text-sm font-medium text-gray-300 mb-2">{label}</label>
      {file ? (
        <div className="flex items-center justify-between p-3 bg-gray-800 border border-gray-600 rounded-lg">
          <div className="flex items-center min-w-0">
            <FileIcon />
            <span className="ml-3 text-sm font-medium text-gray-200 truncate">{file.name}</span>
          </div>
          <button onClick={removeFile} className="text-gray-400 hover:text-red-400 transition-colors duration-200 ml-4 flex-shrink-0">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>
          </button>
        </div>
      ) : (
        <label
          htmlFor={id}
          className={`flex flex-col items-center justify-center w-full h-32 px-4 transition bg-gray-800 border-2 border-gray-600 border-dashed rounded-lg cursor-pointer hover:border-indigo-400 hover:bg-gray-700/50 ${isDragging ? 'border-indigo-500 bg-gray-700' : ''}`}
          onDragEnter={handleDragEnter}
          onDragLeave={handleDragLeave}
          onDragOver={handleDragOver}
          onDrop={handleDrop}
        >
          <div className="flex flex-col items-center justify-center pt-5 pb-6 text-center">
            <UploadIcon />
            <p className="mb-2 text-sm text-gray-400"><span className="font-semibold">클릭하여 업로드</span> 또는 드래그 앤 드롭</p>
            <p className="text-xs text-gray-500">{acceptedTypes}</p>
          </div>
          <input id={id} type="file" className="hidden" accept={acceptedTypes} onChange={handleFileChange} />
        </label>
      )}
    </div>
  );
};

export default FileUpload;
