export default function Features() {
  const features = [
    {
      icon: '🤖',
      title: 'AI-Powered',
      description: 'Intelligent agents help you find exactly what you need',
    },
    {
      icon: '⚡',
      title: 'Lightning Fast',
      description: 'Experience blazing-fast search and recommendations',
    },
    {
      icon: '🎯',
      title: 'Personalized',
      description: 'Get recommendations tailored to your preferences',
    },
    {
      icon: '🔒',
      title: 'Secure',
      description: 'Your data and transactions are always protected',
    },
  ];

  return (
    <section className="features">
      <div className="container">
        <h2 className="section-title">Why Choose Shoplytic?</h2>
        <div className="features-grid">
          {features.map((feature, index) => (
            <div key={index} className="feature-card">
              <div className="feature-icon">{feature.icon}</div>
              <h3 className="feature-title">{feature.title}</h3>
              <p className="feature-description">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

