import { POLITICS_TEST } from "./politics";
import { EGENTETO_TEST } from "./egenteto";
import { EGENTETONAM_TEST } from "./egentetonam";
import { SECRETJOB_TEST } from "./secretjob";
import { ANIMALPERSONALITY_TEST } from "./animalpersonality";
import { PASTLIFE_TEST } from "./pastlife";
import { SPEECHSTYLE_TEST } from "./speechstyle";
import { LOLLANE_TEST } from "./lollane";
import { DFCLASS_TEST } from "./dfclass";
import { SNSLESS_TEST } from "./snsless";
import { MBTISNS_TEST } from "./mbtisns";
import { TRALALERO_TEST } from "./tralalero";
import { getTranslatedTestData } from "@/utils/testTranslations";

export const ALL_TESTS = [POLITICS_TEST, EGENTETO_TEST, EGENTETONAM_TEST, SECRETJOB_TEST, ANIMALPERSONALITY_TEST, PASTLIFE_TEST, SPEECHSTYLE_TEST, LOLLANE_TEST, DFCLASS_TEST, SNSLESS_TEST, MBTISNS_TEST, TRALALERO_TEST];

export function getTestByCode(code: string, language: string = 'ko') {
  const test = ALL_TESTS.find((t) => t.code === code);
  if (!test) return null;
  
  return getTranslatedTestData(code, test, language);
}

export function getAllTests(language: string = 'ko') {
  return ALL_TESTS.map(test => getTranslatedTestData(test.code, test, language));
}

export * from "./politics";
export * from "./speechstyle";
export * from "./lollane";
export * from "./dfclass";
export * from "./snsless"; 
export * from "./mbtisns";
export * from "./egenteto";
export * from "./egentetonam";
export * from "./secretjob";
export * from "./animalpersonality";
export * from "./pastlife";
export * from "./tralalero";
