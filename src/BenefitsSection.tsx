import React from 'react';

const benefits = [
  {
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="10"/>
        <polyline points="12,6 12,12 16,14"/>
      </svg>
    ),
    title: 'Save Time & Costs',
    description: 'No more expensive trips or wasted time. Get things done without leaving your location.',
  },
  {
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
      </svg>
    ),
    title: 'Trustworthy & Verified',
    description: 'All task performers are background-checked and verified with real reviews from users.',
  },
  {
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/>
      </svg>
    ),
    title: 'Tech & Non-Tech Tasks',
    description: 'From router setup to grocery pickup, our network handles any type of task you need.',
  },
  {
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/>
        <circle cx="12" cy="10" r="3"/>
      </svg>
    ),
    title: 'GPS-Based Matching',
    description: 'Smart location-based matching ensures you get the fastest and most reliable service.',
  },
  {
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/>
        <circle cx="9" cy="7" r="4"/>
      </svg>
    ),
    title: 'Dual-Role Platform',
    description: 'Post tasks when you need help, or earn money by completing tasks in your area.',
  },
  {
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/>
        <polyline points="22 4 12 14.01 9 11"/>
      </svg>
    ),
    title: 'High Success Rate',
    description: 'Thousands of tasks completed with a 98%+ satisfaction rate.',
  },
];

const BenefitsSection = () => {
  return (
    <section id="benefits" style={{ padding: '64px 0 80px 0', background: '#fff' }}>
      <div style={{ maxWidth: 1200, margin: '0 auto', padding: '0 24px' }}>
        <div style={{ textAlign: 'center', marginBottom: 48 }}>
          <h2 style={{ fontSize: 40, fontWeight: 700, color: '#000', marginBottom: 16, fontFamily: 'Inter, sans-serif' }}>
            Why Choose <span style={{ color: '#f9b233' }}>Extrahand</span>?
          </h2>
          <p style={{ fontSize: 20, color: '#374151cc', maxWidth: 700, margin: '0 auto', fontFamily: 'Inter, sans-serif' }}>
            We've built the most reliable platform for remote task delegation, designed with trust, efficiency, and user experience at its core.
          </p>
        </div>
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
          gap: 32,
          maxWidth: 1100,
          margin: '0 auto',
        }}>
          {benefits.map((feature, idx) => (
            <div
              key={idx}
              style={{
                borderRadius: 24,
                boxShadow: '0 4px 24px #0001',
                background: '#fff',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                padding: 32,
                minHeight: 'auto',
                border: '1px solid #e5e7eb',
                transition: 'box-shadow 0.2s, transform 0.2s',
                cursor: 'pointer',
              }}
              onMouseOver={e => {
                e.currentTarget.style.boxShadow = '0 8px 32px #f9b23344';
                e.currentTarget.style.transform = 'translateY(-4px) scale(1.03)';
              }}
              onMouseOut={e => {
                e.currentTarget.style.boxShadow = '0 4px 24px #0001';
                e.currentTarget.style.transform = 'none';
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 16 }}>
                <div style={{
                  width: 56,
                  height: 56,
                  borderRadius: 16,
                  background: '#e3e8f7',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginRight: 0,
                }}>
                  <div style={{ color: '#1a237e' }}>
                    {feature.icon}
                  </div>
                </div>
                <h3 style={{ fontSize: 24, fontWeight: 800, color: '#222', margin: 0, fontFamily: 'Inter, sans-serif' }}>{feature.title}</h3>
              </div>
              <p style={{ fontSize: 16, color: '#374151', margin: 0, fontFamily: 'Inter, sans-serif', lineHeight: 1.5 }}>{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default BenefitsSection; 