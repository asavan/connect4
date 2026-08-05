plugins {
    alias(libs.plugins.android.application)
}

android {
    namespace = "ru.asavan.collect4"
    compileSdk {
        version = release(37) {
            minorApiLevel = 1
        }
    }

    defaultConfig {
        applicationId = "ru.asavan.collect4"
        minSdk = 24
        targetSdk = 37
        versionCode = 3
        versionName = "0.0.3"

        testInstrumentationRunner = "androidx.test.runner.AndroidJUnitRunner"
    }

    packaging {
        jniLibs {
            pickFirsts += "META-INF/nanohttpd/*"
        }
        resources {
            pickFirsts += "META-INF/nanohttpd/*"
        }
    }

    buildTypes {
        release {
            optimization {
                enable = false
            }
        }
    }

    compileOptions {
        sourceCompatibility = JavaVersion.VERSION_11
        targetCompatibility = JavaVersion.VERSION_11
    }
}

dependencies {
    implementation(libs.nanohttpd)
    implementation(libs.androidbrowserhelper)
    implementation(libs.nanohttpd.nanohttpd.websocket)
    implementation(libs.ndefemulation.android)
    testImplementation(libs.junit)
    androidTestImplementation(libs.espresso.core)
    androidTestImplementation(libs.ext.junit)
}
