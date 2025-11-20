## Android build & install guide

1. **Install prerequisites**
   - [Android Studio](https://developer.android.com/studio) (installs the Android SDK + platform tools).
   - A JDK that matches React Native’s requirement (JDK 17 works with RN 0.81).
   - Enable USB debugging on your device and install the OEM USB driver if you are on Windows.
   - Optional but recommended: add `platform-tools` to your `PATH` so `adb` is available everywhere.

2. **Install JS dependencies**
   ```bash
   cd react_native_app
   npm install
   ```

3. **Generate the native Android project (only needed if `android/` is missing)**
   ```bash
   npx expo prebuild --platform android
   ```

4. **Build a debug APK**
   ```bash
   cd android
   # Expo’s config plugins expect NODE_ENV to be set.
   $env:NODE_ENV = "development"   # PowerShell
   # or: NODE_ENV=development ./gradlew assembleDebug   # bash
   ./gradlew assembleDebug
   ```
   - The unsigned debug APK will be located at `android/app/build/outputs/apk/debug/app-debug.apk`.
   - For a release build use `./gradlew assembleRelease` instead (requires a keystore configured in `android/app/build.gradle`).
   - To upload to the Play Console you will typically run `./gradlew bundleRelease` which produces an `.aab`.

5. **Install on a device without Expo Go**
   ```bash
   # Make sure `adb devices` lists your phone
   adb install -r app/build/outputs/apk/debug/app-debug.apk
   ```
   - If you built a release APK replace the path accordingly.
   - You can also let Gradle push the app in one go with `npm run android`, which wraps `expo run:android` and launches it on the connected device/emulator.

6. **(Optional) Signed release build**
   1. Generate a keystore (`keytool -genkeypair ...`).
   2. Place it in `android/app/` and add its credentials to `~/.gradle/gradle.properties` (`MYAPP_UPLOAD_STORE_FILE`, etc.).
   3. Configure the `signingConfigs.release` block inside `android/app/build.gradle` to use those properties.
   4. Run `./gradlew assembleRelease` and distribute the resulting APK/AAB.

That’s all—once the APK is on your phone you can launch it exactly like a regular installed application, no Expo Go required.
