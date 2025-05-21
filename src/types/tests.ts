export type TestAnswer = {
  value: string;
  score: number;
  type?: string;
};

export type TestResult = {
  type: string;
  title: string;
  desc: string;
  subDesc?: string;
  recommend?: string[];
  imageDesc?: string;
  icon: string;
  [key: string]: any;
}; 