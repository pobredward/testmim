import { EGENTETO_TEST } from "./egenteto";
import { SECRETJOB_TEST } from "./secretjob";
import { ANIMALPERSONALITY_TEST } from "./animalpersonality";
import { PASTLIFE_TEST } from "./pastlife";
import { SPEECHSTYLE_TEST } from "./speechstyle";
import { LOLLANE_TEST } from "./lollane";
import { DFCLASS_TEST } from "./dfclass";
import { SNSLESS_TEST } from "./snsless";
import { MBTISNS_TEST } from "./mbtisns";

export const ALL_TESTS = [EGENTETO_TEST, SECRETJOB_TEST, ANIMALPERSONALITY_TEST, PASTLIFE_TEST, SPEECHSTYLE_TEST, LOLLANE_TEST, DFCLASS_TEST, SNSLESS_TEST, MBTISNS_TEST];

export function getTestByCode(code: string) {
  return ALL_TESTS.find((t) => t.code === code) || null;
}

export function getAllTests() {
  return ALL_TESTS;
}

export * from "./speechstyle";
export * from "./lollane";
export * from "./dfclass";
export * from "./snsless"; 
export * from "./mbtisns";
export * from "./egenteto";
export * from "./secretjob";
export * from "./animalpersonality";
export * from "./pastlife";
