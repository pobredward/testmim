"use client";
import { useEffect } from 'react';
import { onCLS, onINP, onFCP, onLCP, onTTFB } from 'web-vitals';

// Web Vitals 측정 및 보고
export default function PerformanceOptimizer() {
  useEffect(() => {
    // Core Web Vitals 측정
    const sendToAnalytics = (metric: any) => {
      // Google Analytics 4로 전송
      if (typeof window !== 'undefined' && (window as any).gtag) {
        (window as any).gtag('event', 'web_vitals', {
          event_category: 'Web Vitals',
          event_label: metric.name,
          value: Math.round(metric.value),
          metric_id: metric.id,
          metric_value: metric.value,
          metric_delta: metric.delta,
        });
      }
      
      // 콘솔에도 출력 (개발 환경)
      if (process.env.NODE_ENV === 'development') {
        console.log('Web Vital:', metric);
      }
    };

    // CLS (Cumulative Layout Shift) - 레이아웃 이동
    onCLS(sendToAnalytics);
    
    // INP (Interaction to Next Paint) - 상호작용에서 다음 페인트까지 (FID 대체)
    onINP(sendToAnalytics);
    
    // FCP (First Contentful Paint) - 첫 번째 콘텐츠 표시
    onFCP(sendToAnalytics);
    
    // LCP (Largest Contentful Paint) - 최대 콘텐츠 표시
    onLCP(sendToAnalytics);
    
    // TTFB (Time to First Byte) - 첫 번째 바이트까지의 시간
    onTTFB(sendToAnalytics);

    // 폰트 로딩 최적화
    if ('fonts' in document) {
      Promise.all([
        document.fonts.load('400 16px Geist'),
        document.fonts.load('700 16px Geist'),
      ]).then(() => {
        document.documentElement.classList.add('fonts-loaded');
      });
    }

    // 이미지 지연 로딩 폴백 (브라우저 지원하지 않는 경우)
    if (!('loading' in HTMLImageElement.prototype)) {
      const script = document.createElement('script');
      script.src = 'https://polyfill.io/v3/polyfill.min.js?features=IntersectionObserver';
      document.head.appendChild(script);
    }

    // 크리티컬 리소스 힌트 추가
    const criticalResources = [
      'https://fonts.googleapis.com',
      'https://www.testmim.com',
    ];

    criticalResources.forEach(url => {
      const link = document.createElement('link');
      link.rel = 'preconnect';
      link.href = url;
      link.crossOrigin = 'anonymous';
      document.head.appendChild(link);
    });

  }, []);

  return null; // 렌더링하지 않는 유틸리티 컴포넌트
}

// 이미지 최적화 컴포넌트
export function OptimizedImage({ 
  src, 
  alt, 
  width, 
  height, 
  priority = false,
  className = '',
  ...props 
}: {
  src: string;
  alt: string;
  width: number;
  height: number;
  priority?: boolean;
  className?: string;
  [key: string]: any;
}) {
  return (
    <img
      src={src}
      alt={alt}
      width={width}
      height={height}
      loading={priority ? 'eager' : 'lazy'}
      decoding="async"
      className={className}
      style={{
        aspectRatio: `${width}/${height}`,
        objectFit: 'cover',
        ...props.style
      }}
      {...props}
    />
  );
}

// 지연 로딩 스크립트 컴포넌트
export function LazyScript({ 
  src, 
  strategy = 'afterInteractive',
  onLoad,
  children
}: {
  src?: string;
  strategy?: 'beforeInteractive' | 'afterInteractive' | 'lazyOnload';
  onLoad?: () => void;
  children?: string;
}) {
  useEffect(() => {
    const loadScript = () => {
      const script = document.createElement('script');
      
      if (src) {
        script.src = src;
      }
      
      if (children) {
        script.textContent = children;
      }
      
      script.async = true;
      script.defer = true;
      
      if (onLoad) {
        script.onload = onLoad;
      }
      
      document.head.appendChild(script);
    };

    if (strategy === 'beforeInteractive') {
      loadScript();
    } else if (strategy === 'afterInteractive') {
      if (document.readyState === 'complete') {
        loadScript();
      } else {
        window.addEventListener('load', loadScript);
        return () => window.removeEventListener('load', loadScript);
      }
    } else if (strategy === 'lazyOnload') {
      const timer = setTimeout(loadScript, 1000);
      return () => clearTimeout(timer);
    }
  }, [src, strategy, onLoad, children]);

  return null;
} 