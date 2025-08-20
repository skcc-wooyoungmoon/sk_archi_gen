
import React from 'react';

const Header: React.FC = () => {
  return (
    <header className="p-4 bg-gray-900/80 backdrop-blur-sm border-b border-gray-700 w-full fixed top-0 left-0 z-10">
      <div className="container mx-auto flex items-center">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-indigo-400 mr-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2L2 7l10 5 10-5-10-5z"/><path d="M2 17l10 5 10-5"/><path d="M2 12l10 5 10-5"/></svg>
        <h1 className="text-xl font-bold text-white tracking-wider">
          AI 아키텍처 정의서 생성기
        </h1>
      </div>
    </header>
  );
};

export default Header;
