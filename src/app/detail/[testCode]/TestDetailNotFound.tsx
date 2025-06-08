"use client";

import { useTranslation } from 'react-i18next';

export default function TestDetailNotFound() {
  const { t } = useTranslation();

  return (
    <div className="flex flex-col items-center justify-center min-h-[40vh] text-gray-400">
      {t('testDetail.notFound')}
    </div>
  );
} 