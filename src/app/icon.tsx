import { ImageResponse } from 'next/og'

// Route segment config
export const runtime = 'edge'

// Image metadata
export const size = {
  width: 32,
  height: 32,
}
export const contentType = 'image/png'

// Image generation
export default function Icon() {
  return new ImageResponse(
    (
      <div
        style={{
          fontSize: 24,
          background: '#0a0a0a',
          width: '100%',
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          borderRadius: '20%',
          border: '1px solid #333',
        }}
      >
        <div style={{ position: 'relative', width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          {/* Robot Judge */}
          <div style={{ fontSize: 20 }}>🤖</div>
          {/* Gavel overlay */}
          <div style={{ position: 'absolute', bottom: 0, right: 0, fontSize: 14 }}>🔨</div>
        </div>
      </div>
    ),
    {
      ...size,
    }
  )
}

