# DermaDetect - Setup Guide

This guide provides detailed instructions for setting up the DermaDetect development environment.

## Prerequisites

### System Requirements

- **Node.js**: Version 18.0.0 or higher
- **React Native**: CLI tools installed
- **Java Development Kit (JDK)**: Version 11 or 17
- **Android Studio**: Latest stable version with Android SDK
- **Xcode**: Version 14+ (macOS only, for iOS development)

### Development Environment Setup

#### Windows/Linux (Android Development)

1. Install Node.js from [nodejs.org](https://nodejs.org/)
2. Install Android Studio from [developer.android.com](https://developer.android.com/studio)
3. Configure Android SDK:
   - Go to SDK Manager
   - Install Android SDK Platform 33 (API 33)
   - Install Android SDK Build-Tools 33.0.0
4. Set environment variables:

   ```bash
   export ANDROID_HOME=$HOME/Android/Sdk
   export PATH=$PATH:$ANDROID_HOME/emulator
   export PATH=$PATH:$ANDROID_HOME/platform-tools
   ```

#### macOS (iOS Development)

1. Install Xcode from Mac App Store
2. Install Node.js using Homebrew:

   ```bash
   brew install node
   ```

3. Install CocoaPods:

   ```bash
   sudo gem install cocoapods
   ```

## Installation

### 1. Clone Repository

```bash
git clone https://github.com/C-Jalloh/DermaDetect.git
cd DermaDetect
```

### 2. Install Dependencies

```bash
npm install
```

### 3. iOS Setup (macOS only)

```bash
cd ios
pod install
cd ..
```

### 4. Android Setup

Ensure Android SDK is properly configured in Android Studio.

## Configuration

### Environment Variables

Create a `.env` file in the root directory:

```env
# Development settings
NODE_ENV=development
```

# API endpoints (when backend is available)
API_BASE_URL=http://localhost:3000/api

# Feature flags
ENABLE_MOCK_DATA=true
ENABLE_OFFLINE_MODE=true
```

### Android Configuration

#### AndroidManifest.xml Permissions
The app requires the following permissions (already configured):
- `android.permission.CAMERA` - For photo capture
- `android.permission.WRITE_EXTERNAL_STORAGE` - For saving photos
- `android.permission.READ_EXTERNAL_STORAGE` - For accessing gallery

#### Gradle Configuration
Key configurations in `android/app/build.gradle`:
```gradle
android {
    compileSdkVersion 33
    buildToolsVersion "33.0.0"

    defaultConfig {
        minSdkVersion 21
        targetSdkVersion 33
        // ... other configs
    }
}
```

### iOS Configuration

#### Info.plist Permissions
Required permissions in `ios/DermaDetect/Info.plist`:
```xml
<key>NSCameraUsageDescription</key>
<string>This app needs camera access to capture skin lesions for analysis.</string>
<key>NSPhotoLibraryUsageDescription</key>
<string>This app needs photo library access to select existing images.</string>
```

## Running the Application

### Development Server
```bash
npm start
# or
npx react-native start
```

### Android Development
```bash
# Start Android emulator first, then:
npm run android
# or
npx react-native run-android
```

### iOS Development (macOS only)
```bash
npm run ios
# or
npx react-native run-ios
```

## Testing

### Unit Tests
```bash
npm test
```

### Integration Tests
```bash
npm run test:e2e
```

### Linting
```bash
npm run lint
```

## Troubleshooting

### Common Issues

#### Metro Bundler Issues
```bash
# Clear Metro cache
npm start --reset-cache

# Clear node_modules and reinstall
rm -rf node_modules
npm install
```

#### Android Build Issues
```bash
# Clean Android build
cd android
./gradlew clean
cd ..
```

#### iOS Build Issues
```bash
# Clean iOS build
cd ios
rm -rf build
cd ..
```

### Device-Specific Issues

#### Camera Permissions
- **Android**: Check app permissions in device settings
- **iOS**: Ensure camera permissions are granted in iOS settings

#### Storage Permissions
- **Android**: Grant storage permissions when prompted
- **iOS**: Photo library permissions are handled automatically

## Development Workflow

### Code Quality
- Run `npm run lint` before committing
- Use TypeScript strict mode
- Follow React Native and Airbnb style guides

### Git Workflow
```bash
# Create feature branch
git checkout -b feature/your-feature-name

# Make changes and commit
git add .
git commit -m "feat: add your feature description"

# Push to remote
git push origin feature/your-feature-name
```

### Testing Checklist
- [ ] App builds successfully on Android
- [ ] App builds successfully on iOS (if applicable)
- [ ] All tests pass
- [ ] Linting passes
- [ ] Camera functionality works
- [ ] Navigation flows work correctly
- [ ] Offline functionality works

## Deployment

### Android APK Build
```bash
# Generate release APK
cd android
./gradlew assembleRelease
```

### iOS App Store Build
```bash
# Generate iOS archive
npx react-native run-ios --configuration Release
```

## Support

For additional help:
- Check existing GitHub issues
- Review React Native documentation
- Consult Android/iOS development guides

## Next Steps

After setup is complete:
1. Review the [Architecture Documentation](./ARCHITECTURE.md)
2. Explore the [Features Documentation](./FEATURES.md)
3. Start with [Development Guidelines](./DEVELOPMENT.md)</content>
<parameter name="filePath">/home/c_jalloh/Documents/Work/HexAI/DermaDetect/DermaDetect/docs/SETUP.md