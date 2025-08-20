
import React, { useState, useEffect, useCallback } from 'react';
import Header from './components/Header';
import FileUpload from './components/FileUpload';
import OutputDisplay from './components/OutputDisplay';
import { GenerationState, UploadedFiles } from './types';
import { generateADDStream } from './services/geminiService';

const loadingMessages = [
    "요구사항 분석 중...",
    "시퀀스 다이어그램 해석 중...",
    "아키텍처 뷰 생성 중...",
    "논리적 뷰 설계 중...",
    "프로세스 뷰 구성 중...",
    "물리적 뷰 배치 중...",
    "거의 다 됐습니다..."
];

const App: React.FC = () => {
    const [files, setFiles] = useState<UploadedFiles>({
        requirements: null,
        sequenceDiagram: null,
        configImage: null,
    });
    const [generationState, setGenerationState] = useState<GenerationState>(GenerationState.Idle);
    const [generatedContent, setGeneratedContent] = useState<string>('');
    const [loadingMessage, setLoadingMessage] = useState<string>(loadingMessages[0]);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        let interval: NodeJS.Timeout;
        if (generationState === GenerationState.Loading) {
            interval = setInterval(() => {
                setLoadingMessage(prev => {
                    const currentIndex = loadingMessages.indexOf(prev);
                    const nextIndex = (currentIndex + 1) % loadingMessages.length;
                    return loadingMessages[nextIndex];
                });
            }, 2500);
        }
        return () => {
            if (interval) {
                clearInterval(interval);
            }
        };
    }, [generationState]);

    const handleFileSelect = useCallback((fileType: keyof UploadedFiles, file: File | null) => {
        setFiles(prev => ({ ...prev, [fileType]: file }));
    }, []);
    
    const handleGenerate = async () => {
        if (!files.requirements || !files.sequenceDiagram || !files.configImage) {
            setError("모든 파일을 업로드해야 합니다.");
            setGenerationState(GenerationState.Error);
            return;
        }

        setGenerationState(GenerationState.Loading);
        setGeneratedContent('');
        setError(null);
        setLoadingMessage(loadingMessages[0]);

        try {
            const stream = generateADDStream({
                requirements: files.requirements,
                sequenceDiagram: files.sequenceDiagram,
                configImage: files.configImage,
            });

            for await (const chunk of stream) {
                setGeneratedContent(prev => prev + chunk);
            }

            setGenerationState(GenerationState.Finished);

        } catch (err: unknown) {
            console.error(err);
            const errorMessage = err instanceof Error ? err.message : "알 수 없는 오류가 발생했습니다.";
            setError(`생성 중 오류 발생: ${errorMessage}`);
            setGenerationState(GenerationState.Error);
        }
    };

    const isButtonDisabled = generationState === GenerationState.Loading || !files.requirements || !files.sequenceDiagram || !files.configImage;
    
    return (
        <div className="min-h-screen bg-gray-900 flex flex-col">
            <Header />
            <main className="flex-grow container mx-auto p-4 pt-20 flex flex-col lg:flex-row gap-6">
                <div className="lg:w-1/3 w-full flex-shrink-0">
                    <div className="bg-gray-800/50 rounded-lg p-6 space-y-6 sticky top-20">
                        <h2 className="text-lg font-semibold text-white border-b border-gray-700 pb-3">입력 자료</h2>
                        <FileUpload
                            id="requirements"
                            label="1. 요구사항 정의서"
                            acceptedTypes=".txt, .md"
                            file={files.requirements}
                            onFileSelect={(file) => handleFileSelect('requirements', file)}
                        />
                        <FileUpload
                            id="sequenceDiagram"
                            label="2. 시퀀스 다이어그램"
                            acceptedTypes=".txt, .md, .puml"
                            file={files.sequenceDiagram}
                            onFileSelect={(file) => handleFileSelect('sequenceDiagram', file)}
                        />
                        <FileUpload
                            id="configImage"
                            label="3. 통합 구성도 (이미지)"
                            acceptedTypes="image/png, image/jpeg, image/webp"
                            file={files.configImage}
                            onFileSelect={(file) => handleFileSelect('configImage', file)}
                        />
                        <button
                            onClick={handleGenerate}
                            disabled={isButtonDisabled}
                            className="w-full flex items-center justify-center bg-indigo-600 text-white font-bold py-3 px-4 rounded-lg hover:bg-indigo-500 disabled:bg-gray-500 disabled:cursor-not-allowed transition-all duration-200"
                        >
                            {generationState === GenerationState.Loading ? (
                                <>
                                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                    </svg>
                                    생성 중...
                                </>
                            ) : (
                                "아키텍처 정의서 생성"
                            )}
                        </button>
                    </div>
                </div>
                <div className="flex-grow lg:w-2/3 w-full min-h-[60vh] lg:min-h-0">
                     <OutputDisplay 
                        generationState={generationState}
                        generatedContent={generatedContent}
                        loadingMessage={loadingMessage}
                        error={error}
                     />
                </div>
            </main>
        </div>
    );
};

export default App;
