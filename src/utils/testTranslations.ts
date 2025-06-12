// 테스트별 번역 파일 임포트
import speechstyleTranslations from '@/i18n/locales/tests/speechstyle.json';
import animalpersonalityTranslations from '@/i18n/locales/tests/animalpersonality.json';
import secretjobTranslations from '@/i18n/locales/tests/secretjob.json';
import pastlifeTranslations from '@/i18n/locales/tests/pastlife.json';
import lollaneTranslations from '@/i18n/locales/tests/lollane.json';
import dfclassTranslations from '@/i18n/locales/tests/dfclass.json';
import snslessTranslations from '@/i18n/locales/tests/snsless.json';
import mbtisnsTranslations from '@/i18n/locales/tests/mbtisns.json';
import egentetoTranslations from '@/i18n/locales/tests/egenteto.json';
import tralaleroTranslations from '@/i18n/locales/tests/tralalero.json';

const testTranslations: Record<string, any> = {
  speechstyle: speechstyleTranslations,
  animalpersonality: animalpersonalityTranslations,
  secretjob: secretjobTranslations,
  pastlife: pastlifeTranslations,
  lollane: lollaneTranslations,
  dfclass: dfclassTranslations,
  snsless: snslessTranslations,
  mbtisns: mbtisnsTranslations,
  egenteto: egentetoTranslations,
  tralalero: tralaleroTranslations,
};

// 특정 테스트의 특정 경로에서 번역 텍스트 가져오기 (순수 함수)
export function getTestTranslation(testCode: string, path: string, language: string) {
  const translation = testTranslations[testCode];
  if (!translation || !translation[language]) {
    return null;
  }
  
  const keys = path.split('.');
  let result = translation[language];
  
  for (const key of keys) {
    if (result && typeof result === 'object' && key in result) {
      result = result[key];
    } else {
      return null;
    }
  }
  
  return result;
}

// 테스트 데이터를 언어에 맞게 번역하여 반환 (순수 함수)
export function getTranslatedTestData(testCode: string, originalData: any, language: string) {
  const translation = testTranslations[testCode];
  if (!translation || !translation[language]) {
    return originalData;
  }

  const langData = translation[language];
  
  return {
    ...originalData,
    title: langData.title || originalData.title,
    description: langData.description || originalData.description,
    tags: langData.tags || originalData.tags,
    seoKeywords: langData.seoKeywords || originalData.seoKeywords,
    category: langData.category || originalData.category,
    questions: originalData.questions?.map((question: any, index: number) => ({
      ...question,
      question: langData.questions?.[index]?.question || question.question,
      options: question.options?.map((option: any, optIndex: number) => ({
        ...option,
        text: langData.questions?.[index]?.options?.[optIndex] || option.text,
      })) || question.options,
    })) || originalData.questions,
    results: originalData.results?.map((result: any, index: number) => ({
      ...result,
      title: langData.results?.[index]?.title || result.title,
      desc: langData.results?.[index]?.desc || result.desc,
      subDesc: langData.results?.[index]?.subDesc || result.subDesc,
      recommend: langData.results?.[index]?.recommend || result.recommend,
      imageDesc: langData.results?.[index]?.imageDesc || result.imageDesc,
      hashtags: langData.results?.[index]?.hashtags || result.hashtags,
    })) || originalData.results,
  };
} 