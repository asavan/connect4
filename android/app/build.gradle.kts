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
        versionCode = 5
        versionName = "0.0.5"

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

    androidResources {
        ignoreAssetsPatterns.clear()
        // Передаем список, содержащий только одну пустую строку
        ignoreAssetsPatterns.addAll(listOf(""))
    }

    buildTypes {
        release {
            optimization {
                enable = true
            }
        }
    }

    compileOptions {
        sourceCompatibility = JavaVersion.VERSION_17
        targetCompatibility = JavaVersion.VERSION_17
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
