"use client";

import { useTranslation } from 'react-i18next';

export default function Footer() {
  const { t } = useTranslation();

  return (
    <footer className="w-full border-t bg-white text-center text-xs text-gray-400 py-6 mt-8">
      <div className="mb-2 font-semibold text-gray-600">{t('footer.copyright')}</div>
      <div className="flex flex-col items-center gap-1 text-[11px] sm:text-xs">
        <div>
          <span className="font-medium">{t('footer.company')}</span>: 온마인드랩 | <span className="font-medium">{t('footer.representative')}</span>: 신선용
        </div>
        <div>
          <span className="font-medium">{t('footer.business_number')}</span>: 166-22-02407 | <span className="font-medium">{t('footer.contact')}</span>: 010-6711-7933
        </div>
        <div>
          <span className="font-medium">{t('footer.address')}</span>: 경기도 성남시 분당구 야탑로139번길 5-1, 203호(야탑동)
        </div>
        <div>
          <span className="font-medium">{t('footer.business_type')}</span>: 도매 및 소매업 | <span className="font-medium">{t('footer.business_item')}</span>: 전자상거래 소매업
        </div>
      </div>
      <div className="mt-2 border-t border-gray-200 pt-2 text-[10px] text-gray-300">{t('footer.copyright_notice')}</div>
    </footer>
  );
} 