#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

console.log('🔧 Setting up single .env file configuration');
console.log('============================================\n');

const envPath = path.join(__dirname, '.env');

// Check if .env file exists
if (fs.existsSync(envPath)) {
  console.log('✅ .env file already exists');
  console.log('📝 Current environment variables:');
  
  const envContent = fs.readFileSync(envPath, 'utf8');
  const lines = envContent.split('\n');
  
  lines.forEach(line => {
    if (line.trim() && !line.startsWith('#')) {
      const [key] = line.split('=');
      console.log(`   ${key}`);
    }
  });
} else {
  console.log('❌ .env file not found');
  console.log('📝 Creating .env file with development configuration...\n');
  
  const envContent = `# Frontend Environment Configuration
# Environment (development or production)
NODE_ENV=development
REACT_APP_ENV=development

# API Configuration
REACT_APP_API_BASE_URL=https://extrahandbackend.llp.trizenventures.com

# Firebase Configuration
REACT_APP_FIREBASE_API_KEY=AIzaSyAFo3Su1b9CoW3BS-D-Cvoi9fuNrdHw0Yw
REACT_APP_FIREBASE_PROJECT_ID=extrahand-app
REACT_APP_FIREBASE_AUTH_DOMAIN=extrahand-app.firebaseapp.com
REACT_APP_FIREBASE_STORAGE_BUCKET=extrahand-app.appspot.com
REACT_APP_FIREBASE_MESSAGING_SENDER_ID=961487777082
REACT_APP_FIREBASE_APP_ID=1:961487777082:web:dd95fe5a7658b0e3b1f403
REACT_APP_FIREBASE_MEASUREMENT_ID=G-GXB3LSMR5B

# Development Settings
REACT_APP_DEBUG=true
REACT_APP_LOG_LEVEL=debug`;

  fs.writeFileSync(envPath, envContent);
  console.log('✅ .env file created successfully!');
}

console.log('\n📋 Configuration Summary:');
console.log('- Webpack now loads from single .env file');
console.log('- No more separate env.development/env.production files');
console.log('- Environment variables will be loaded correctly');

console.log('\n🚀 Next Steps:');
console.log('1. Restart your development server: npm run web');
console.log('2. Check browser console for environment variable debug info');
console.log('3. Verify that REACT_APP_ENV shows as "development"');

console.log('\n🔍 To switch to production:');
console.log('1. Change NODE_ENV=production in .env file');
console.log('2. Change REACT_APP_ENV=production in .env file');
console.log('3. Change REACT_APP_API_BASE_URL to your production backend URL');
console.log('4. Restart the development server');
