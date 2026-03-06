// Cloudflare Pages 환경에서는 브라우저에서 직접 API 호출
export const translateText = async (text: string, targetLang: string) => {
  return text; // 번역 기능 비활성화
};

export const getFAQResponse = async (question: string, lang: string) => {
  return lang === 'ko' 
    ? "K & V Connect는 베트남 한국 소상공인 홍보 플랫폼입니다. 무료로 상점을 등록하고 홍보할 수 있습니다."
    : "K & V Connect is a promotion platform for Korean small businesses in Vietnam. Register your shop for free!";
};

export const analyzeMedicalImage = async (base64Image: string, mimeType: string, lang: string) => {
  return {
    normal: lang === 'ko' 
      ? "의료 영상 분석 기능은 현재 준비 중입니다." 
      : "Medical image analysis is currently in development.",
    medical: lang === 'ko'
      ? "전문가 분석 기능은 곧 제공될 예정입니다."
      : "Professional analysis will be available soon."
  };
};

export const restorePhotoAI = async (base64Image: string, mimeType: string) => {
  return {
    description: "Photo restoration feature coming soon!",
    restoredImageUrl: `data:${mimeType};base64,${base64Image}`,
    videoUrl: ""
  };
};
