import { ImageResponse } from 'next/og';

export const runtime = 'edge';

export const alt = '나랑가 - 현지인 맛집 기록 앱';
export const size = {
  width: 1200,
  height: 630,
};

export const contentType = 'image/png';

export default async function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          fontSize: 128,
          background: 'linear-gradient(135deg, #FF8A4C 0%, #FF6B35 100%)',
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '80px',
          position: 'relative',
        }}
      >
        {/* 배경 장식 */}
        <div
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'radial-gradient(circle at 20% 30%, rgba(255, 255, 255, 0.15) 0%, transparent 50%)',
            display: 'flex',
          }}
        />
        <div
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'radial-gradient(circle at 80% 70%, rgba(255, 138, 76, 0.3) 0%, transparent 50%)',
            display: 'flex',
          }}
        />

        {/* 메인 컨텐츠 */}
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            textAlign: 'center',
            zIndex: 1,
            background: 'rgba(255, 255, 255, 0.95)',
            borderRadius: '40px',
            padding: '60px 80px',
            boxShadow: '0 20px 60px rgba(0, 0, 0, 0.2)',
          }}
        >
          {/* 이모지 아이콘 */}
          <div
            style={{
              fontSize: 120,
              marginBottom: 20,
              display: 'flex',
            }}
          >
            🍜
          </div>

          {/* 타이틀 */}
          <div
            style={{
              fontSize: 72,
              fontWeight: 900,
              background: 'linear-gradient(135deg, #FF8A4C 0%, #FF6B35 100%)',
              backgroundClip: 'text',
              WebkitBackgroundClip: 'text',
              color: 'transparent',
              marginBottom: 20,
              display: 'flex',
              letterSpacing: '-2px',
            }}
          >
            나랑가
          </div>

          {/* 서브 타이틀 */}
          <div
            style={{
              fontSize: 32,
              color: '#666',
              fontWeight: 600,
              display: 'flex',
              marginBottom: 30,
            }}
          >
            현지인 맛집 기록 앱
          </div>

          {/* 태그들 */}
          <div
            style={{
              display: 'flex',
              gap: 15,
              flexWrap: 'wrap',
              justifyContent: 'center',
            }}
          >
            {['회원가입', '맛집 관리', '즐겨찾기', '검색'].map((tag) => (
              <div
                key={tag}
                style={{
                  background: 'rgba(255, 138, 76, 0.15)',
                  color: '#FF6B35',
                  padding: '8px 20px',
                  borderRadius: '20px',
                  fontSize: 24,
                  fontWeight: 700,
                  border: '2px solid rgba(255, 138, 76, 0.3)',
                  display: 'flex',
                }}
              >
                #{tag}
              </div>
            ))}
          </div>
        </div>

        {/* 하단 기술 스택 */}
        <div
          style={{
            position: 'absolute',
            bottom: 40,
            display: 'flex',
            gap: 20,
            fontSize: 20,
            color: 'rgba(255, 255, 255, 0.9)',
            fontWeight: 600,
          }}
        >
          <span style={{ display: 'flex' }}>Next.js</span>
          <span style={{ display: 'flex' }}>•</span>
          <span style={{ display: 'flex' }}>TypeScript</span>
          <span style={{ display: 'flex' }}>•</span>
          <span style={{ display: 'flex' }}>Supabase</span>
          <span style={{ display: 'flex' }}>•</span>
          <span style={{ display: 'flex' }}>Tailwind CSS</span>
        </div>
      </div>
    ),
    {
      ...size,
    }
  );
}
