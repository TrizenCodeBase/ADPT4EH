#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

console.log('🔧 Environment Setup Script');
console.log('==========================\n');

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
  console.log('📝 Creating .env file with template...\n');
  
  const envTemplate = `# Firebase Configuration
# Replace these values with your actual Firebase project configuration
REACT_APP_FIREBASE_API_KEY=your_firebase_api_key_here
REACT_APP_FIREBASE_AUTH_DOMAIN=your_project_id.firebaseapp.com
REACT_APP_FIREBASE_PROJECT_ID=your_project_id
REACT_APP_FIREBASE_STORAGE_BUCKET=your_project_id.appspot.com
REACT_APP_FIREBASE_MESSAGING_SENDER_ID=your_messaging_sender_id
REACT_APP_FIREBASE_APP_ID=your_app_id
REACT_APP_FIREBASE_MEASUREMENT_ID=your_measurement_id

# Environment
NODE_ENV=development
`;

  fs.writeFileSync(envPath, envTemplate);
  console.log('✅ .env file created successfully!');
  console.log('📝 Please update the values with your actual Firebase configuration');
}

console.log('\n📋 Next Steps:');
console.log('1. Go to Firebase Console: https://console.firebase.google.com/');
console.log('2. Select your project');
console.log('3. Go to Project Settings (gear icon)');
console.log('4. Scroll down to "Your apps" section');
console.log('5. Copy the configuration values to your .env file');
console.log('6. Restart your development server: npm run web');
console.log('\n🔍 To check if environment is working:');
console.log('   - Look for "Firebase Environment Debug" in browser console');
console.log('   - Verify all Firebase operations work correctly');
