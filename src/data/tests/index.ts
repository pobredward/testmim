import { EGENTETO_TEST } from "./egenteto";
import { SECRETJOB_TEST } from "./secretjob";
import { ANIMALPERSONALITY_TEST } from "./animalpersonality";
import { PASTLIFE_TEST } from "./pastlife";
import { SPEECHSTYLE_TEST } from "./speechstyle";

export const ALL_TESTS = [EGENTETO_TEST, SECRETJOB_TEST, ANIMALPERSONALITY_TEST, PASTLIFE_TEST, SPEECHSTYLE_TEST];

export function getTestByCode(code: string) {
  return ALL_TESTS.find((t) => t.code === code) || null;
}

export function getAllTests() {
  return ALL_TESTS;
}

export * from "./speechstyle"; 