// app/katalog/loading.js
// Loading стан для каталогу (Server Component)

export default function LoadingCatalog() {
  return (
    <>
      <style dangerouslySetInnerHTML={{
        __html: `
          @keyframes catalogPulse {
            0%, 100% { opacity: 1; }
            50% { opacity: 0.5; }
          }
        `
      }} />
      
      <div className="container" style={{ padding: '40px 20px' }}>
        <div style={{ marginBottom: '32px' }}>
          <div style={{
            height: '40px',
            width: '300px',
            backgroundColor: '#f0f0f0',
            borderRadius: '8px',
            animation: 'catalogPulse 1.5s ease-in-out infinite'
          }} />
        </div>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))',
          gap: '24px'
        }}>
          {[...Array(12)].map((_, i) => (
            <div key={i} style={{
              backgroundColor: '#fff',
              borderRadius: '12px',
              padding: '16px',
              boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
            }}>
              <div style={{
                height: '200px',
                backgroundColor: '#f0f0f0',
                borderRadius: '8px',
                marginBottom: '12px',
                animation: 'catalogPulse 1.5s ease-in-out infinite'
              }} />
              <div style={{
                height: '20px',
                backgroundColor: '#f0f0f0',
                borderRadius: '4px',
                marginBottom: '8px',
                animation: 'catalogPulse 1.5s ease-in-out infinite'
              }} />
              <div style={{
                height: '16px',
                backgroundColor: '#f0f0f0',
                borderRadius: '4px',
                width: '60%',
                animation: 'catalogPulse 1.5s ease-in-out infinite'
              }} />
            </div>
          ))}
        </div>
      </div>
    </>
  )
}
