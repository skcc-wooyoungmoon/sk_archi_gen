
import { GoogleGenAI } from "@google/genai";

const fileToBase64 = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
      const result = reader.result as string;
      // Remove "data:image/jpeg;base64," prefix
      resolve(result.split(',')[1]);
    };
    reader.onerror = (error) => reject(error);
  });
};

const fileToText = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsText(file, 'UTF-8');
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = (error) => reject(error);
  });
};

const fullPrompt = `
# 아키텍처 정의서(ADD) 생성 통합 프롬프트

## 페르소나

당신은 3O년 경력의 세계제일의 수석 아키텍트이다. 당신의 경력은 헥사고날, MSA, 웹, 금융, 증권, 공공, 서비스 등 다양한 도메인의 컨설팅부터 구축, 운영까지 경험했고, 최근에는 클라우드 네이티브 시스템 설계와 구축까지 가능하다. 복잡한 요구사항을 분석하여 4+1 뷰 모델과 C4 모델에 기반한 명확하고 체계적인 아키텍처 정의서를 작성하는 데 매우 능숙합니다.

## 목표

아래에 제공되는 프로젝트 정보를 바탕으로, **Scenarios View를 중심축으로 하는 4+1 뷰 아키텍처 정의서(ADD)**를 생성합니다. 모든 다이어그램은 **UML이나 MERMAID**으로 생성하고, 각 뷰에 대한 상세한 설명을 포함해야 합니다. 또한 각 뷰는 가능한 체계적으로 상세하게 레벨로 구축되어야 한다.

## 핵심 설계 원칙

### 1. Scenarios View 중심 설계 (+1)
- **모든 아키텍처 설계는 Scenarios View를 중심축으로 진행**
- 시퀀스 다이어그램을 통해 시나리오를 구체화하고, 이를 다른 4개 뷰의 핵심 입력값으로 활용
- 요구사항 → 시나리오 → 시퀀스 다이어그램 → 4개 뷰 도출의 체계적 접근

### 2. 구조와 행위의 명확한 분리
- **구조적 측면(정적)**: 시퀀스 다이어그램의 참여 객체(Participants) → **Logical View + Development View**
- **행위적 측면(동적)**: 메시지 흐름, 생명주기, 동시성 → **Process View + Physical View**

### 3. Top-Down 체계적 상세화
- **Level 1 (고수준)**: 시스템 전체 관점의 개요 다이어그램
- **Level 2 (저수준)**: 각 구성요소의 내부 상세 다이어그램
- 항상 큰 그림에서 시작하여 점진적으로 상세화
---
## 출력 형식 템플릿

\`\`\`markdown
# [프로젝트명] 아키텍처 정의서 (ADD)

## 문서 정보
- **작성일**: [날짜]
- **버전**: 1.0
- **작성자**: [작성자명]
- **검토자**: [검토자명]
- **승인자**: [승인자명]

## 1. 개요 및 설계 원칙
... (전체 템플릿 내용)

## 10. 향후 개선 계획
... (전체 템플릿 내용)
\`\`\`
---
이제 위의 지시사항과 아래에 첨부된 사용자 문서들을 바탕으로 아키텍처 정의서 초안 작성을 시작하세요.
`;


export async function* generateADDStream(
    files: {
        requirements: File;
        sequenceDiagram: File;
        configImage: File;
    }
): AsyncGenerator<string> {
    const apiKey = process.env.API_KEY;
    if (!apiKey) {
        throw new Error("API_KEY environment variable not set");
    }

    const ai = new GoogleGenAI({ apiKey });

    const requirementsText = await fileToText(files.requirements);
    const sequenceDiagramText = await fileToText(files.sequenceDiagram);
    const imageBase64 = await fileToBase64(files.configImage);
    
    const imagePart = {
        inlineData: {
            mimeType: files.configImage.type,
            data: imageBase64,
        },
    };

    const promptParts = [
      { text: fullPrompt },
      { text: "\n\n--- USER UPLOADED DOCUMENTS ---\n\n" },
      { text: `## 1. 요구사항 정의서 내용:\n\n\`\`\`\n${requirementsText}\n\`\`\`\n\n` },
      { text: `## 2. 시퀀스 다이어그램 내용:\n\n\`\`\`\n${sequenceDiagramText}\n\`\`\`\n\n` },
      { text: `## 3. 통합 구성도 이미지:\n\n` },
      imagePart,
    ];

    const result = await ai.models.generateContentStream({
        model: 'gemini-2.5-flash',
        contents: { parts: promptParts },
    });

    for await (const chunk of result) {
        yield chunk.text;
    }
}
