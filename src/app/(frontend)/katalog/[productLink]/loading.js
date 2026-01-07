
// app/katalog/[productLink]/loading.js
// Loading стан для сторінки товару (Server Component)

export default function LoadingProduct() {
  return (
    <>
      <style dangerouslySetInnerHTML={{
        __html: `
          @keyframes productPulse {
            0%, 100% { opacity: 1; }
            50% { opacity: 0.5; }
          }
          @media (max-width: 768px) {
            .product-loading-grid {
              grid-template-columns: 1fr !important;
            }
          }
        `
      }} />
      
      <div className="container" style={{ padding: '40px 20px' }}>
        <div className="product-loading-grid" style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: '48px',
          maxWidth: '1200px',
          margin: '0 auto'
        }}>
          {/* Зображення */}
          <div style={{
            height: '500px',
            backgroundColor: '#f0f0f0',
            borderRadius: '12px',
            animation: 'productPulse 1.5s ease-in-out infinite'
          }} />

          {/* Інформація */}
          <div>
            <div style={{
              height: '32px',
              backgroundColor: '#f0f0f0',
              borderRadius: '8px',
              marginBottom: '16px',
              animation: 'productPulse 1.5s ease-in-out infinite'
            }} />
            <div style={{
              height: '24px',
              backgroundColor: '#f0f0f0',
              borderRadius: '8px',
              width: '70%',
              marginBottom: '24px',
              animation: 'productPulse 1.5s ease-in-out infinite'
            }} />
            <div style={{
              height: '48px',
              backgroundColor: '#f0f0f0',
              borderRadius: '8px',
              width: '40%',
              marginBottom: '32px',
              animation: 'productPulse 1.5s ease-in-out infinite'
            }} />
            <div style={{
              height: '56px',
              backgroundColor: '#f0f0f0',
              borderRadius: '8px',
              animation: 'productPulse 1.5s ease-in-out infinite'
            }} />
          </div>
        </div>
      </div>
    </>
  )
}