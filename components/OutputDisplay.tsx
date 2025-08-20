
import React, { useEffect, useRef } from 'react';
import { GenerationState } from '../types';
import CodeBlock from './CodeBlock';

interface OutputDisplayProps {
  generationState: GenerationState;
  generatedContent: string;
  loadingMessage: string;
  error: string | null;
}

const OutputDisplay: React.FC<OutputDisplayProps> = ({ generationState, generatedContent, loadingMessage, error }) => {
  const endOfContentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    endOfContentRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [generatedContent, generationState]);

  const renderContent = () => {
    if (generationState === GenerationState.Loading && !generatedContent) {
      return (
        <div className="flex flex-col items-center justify-center h-full text-center">
          <svg className="animate-spin -ml-1 mr-3 h-10 w-10 text-indigo-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          <p className="mt-4 text-lg font-medium text-gray-300">{loadingMessage}</p>
        </div>
      );
    }

    if (generationState === GenerationState.Error) {
      return (
        <div className="flex items-center justify-center h-full text-center">
            <div className="bg-red-900/20 border border-red-500/50 text-red-300 p-4 rounded-lg">
                <p className="font-bold">오류가 발생했습니다</p>
                <p className="mt-2 text-sm">{error}</p>
            </div>
        </div>
      );
    }
    
    if (generationState === GenerationState.Idle && !generatedContent) {
        return (
             <div className="flex flex-col items-center justify-center h-full text-center text-gray-500">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1"><path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /><path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                <p className="mt-4 text-lg">생성된 아키텍처 정의서가 여기에 표시됩니다.</p>
                <p className="text-sm">왼쪽 패널에서 필요한 파일들을 업로드하고 생성 버튼을 누르세요.</p>
            </div>
        )
    }

    const lines = generatedContent.split('\n');
    let inCodeBlock = false;
    let codeBlockContent = '';
    const contentElements: React.ReactNode[] = [];

    lines.forEach((line, index) => {
        if (line.trim().startsWith('```')) {
            if (inCodeBlock) {
                contentElements.push(<CodeBlock key={index}>{codeBlockContent.trim()}</CodeBlock>);
                codeBlockContent = '';
            }
            inCodeBlock = !inCodeBlock;
        } else if (inCodeBlock) {
            codeBlockContent += line + '\n';
        } else {
            if (line.startsWith('# ')) {
                contentElements.push(<h1 key={index} className="text-3xl font-bold mt-6 mb-3 border-b border-gray-700 pb-2">{line.substring(2)}</h1>);
            } else if (line.startsWith('## ')) {
                contentElements.push(<h2 key={index} className="text-2xl font-bold mt-5 mb-2 border-b border-gray-700 pb-1">{line.substring(3)}</h2>);
            } else if (line.startsWith('### ')) {
                contentElements.push(<h3 key={index} className="text-xl font-bold mt-4 mb-2">{line.substring(4)}</h3>);
            } else if (line.trim().startsWith('- ')) {
                 contentElements.push(<li key={index} className="ml-5 list-disc">{line.substring(2)}</li>);
            } else {
                contentElements.push(<p key={index} className="my-1 leading-relaxed">{line}</p>);
            }
        }
    });

    if (inCodeBlock) {
        contentElements.push(<CodeBlock key="last-block">{codeBlockContent.trim()}</CodeBlock>);
    }


    return (
        <div className="prose prose-invert max-w-none prose-h1:text-indigo-400 prose-h2:text-indigo-300">
            {contentElements}
            {generationState === GenerationState.Loading && <div className="inline-block w-2 h-4 bg-indigo-400 animate-pulse ml-1" />}
        </div>
    );
  };

  return (
    <div className="bg-gray-800/50 rounded-lg p-6 overflow-y-auto h-full relative">
      {renderContent()}
      <div ref={endOfContentRef} />
    </div>
  );
};

export default OutputDisplay;

