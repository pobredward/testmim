import { ImageResponse } from 'next/og';
import { getTestByCode } from '@/data/tests';

// 이미지 크기 설정
export const size = {
  width: 1200,
  height: 630,
};

export const contentType = 'image/png';

export default async function Image({ params }: { params: Promise<{ testCode: string }> }) {
  const { testCode } = await params;
  const testData = getTestByCode(testCode);

  if (!testData) {
    // 기본 이미지
    return new ImageResponse(
      (
        <div
          style={{
            fontSize: 60,
            background: 'linear-gradient(to bottom right, #667eea 0%, #764ba2 100%)',
            width: '100%',
            height: '100%',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'white',
            textAlign: 'center',
          }}
        >
          <div style={{ fontSize: 40, marginBottom: 20 }}>🧠</div>
          <div style={{ fontSize: 60, fontWeight: 'bold', marginBottom: 20 }}>
            테스트밈
          </div>
          <div style={{ fontSize: 30, opacity: 0.9 }}>
            무료 심리테스트 플랫폼
          </div>
        </div>
      ),
      size
    );
  }

  return new ImageResponse(
    (
      <div
        style={{
          fontSize: 48,
          background: testData.bgGradient 
            ? `linear-gradient(to bottom right, ${testData.mainColor} 0%, ${testData.mainColor}cc 100%)`
            : `linear-gradient(to bottom right, #667eea 0%, #764ba2 100%)`,
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          color: 'white',
          textAlign: 'center',
          padding: 60,
        }}
      >
        {/* 테스트 아이콘 */}
        <div style={{ fontSize: 80, marginBottom: 30 }}>
          {testData.icon || '🧠'}
        </div>
        
        {/* 테스트 제목 */}
        <div style={{ 
          fontSize: 50, 
          fontWeight: 'bold', 
          marginBottom: 20,
          lineHeight: 1.2,
          maxWidth: '90%'
        }}>
          {testData.title}
        </div>
        
        {/* 테스트 설명 */}
        <div style={{ 
          fontSize: 28, 
          opacity: 0.9, 
          marginBottom: 30,
          lineHeight: 1.3,
          maxWidth: '85%'
        }}>
          {testData.description}
        </div>
        
        {/* 브랜딩 */}
        <div style={{ 
          position: 'absolute',
          bottom: 40,
          right: 60,
          display: 'flex',
          alignItems: 'center',
          fontSize: 24,
          opacity: 0.8
        }}>
          <div style={{ marginRight: 15 }}>🧠</div>
          <div>testmim.com</div>
        </div>
        
        {/* 태그들 */}
        {testData.tags && testData.tags.length > 0 && (
          <div style={{
            position: 'absolute',
            top: 40,
            left: 60,
            display: 'flex',
            flexWrap: 'wrap',
            gap: 15,
            fontSize: 20,
          }}>
            {testData.tags.slice(0, 3).map((tag: string, index: number) => (
              <div
                key={index}
                style={{
                  background: 'rgba(255, 255, 255, 0.2)',
                  padding: '8px 16px',
                  borderRadius: '20px',
                  backdropFilter: 'blur(10px)',
                }}
              >
                #{tag}
              </div>
            ))}
          </div>
        )}
      </div>
    ),
    size
  );
} 