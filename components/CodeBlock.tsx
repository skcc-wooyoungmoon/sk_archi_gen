
import React, { useState } from 'react';

interface CodeBlockProps {
  children: React.ReactNode;
}

const CopyIcon: React.FC = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" /></svg>
);

const CheckIcon: React.FC = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>
);

const CodeBlock: React.FC<CodeBlockProps> = ({ children }) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    if (typeof children === 'string') {
      navigator.clipboard.writeText(children).then(() => {
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      });
    }
  };

  return (
    <div className="bg-gray-900/70 rounded-lg my-4 relative group">
      <button
        onClick={handleCopy}
        className="absolute top-2 right-2 p-1.5 bg-gray-700 rounded-md text-gray-300 hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-indigo-500 opacity-0 group-hover:opacity-100 transition-opacity"
        aria-label="Copy code"
      >
        {copied ? <CheckIcon /> : <CopyIcon />}
      </button>
      <pre className="p-4 overflow-x-auto text-sm text-gray-200">
        <code>{children}</code>
      </pre>
    </div>
  );
};

export default CodeBlock;
