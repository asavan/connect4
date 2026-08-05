package ru.asavan.collect4;

import android.content.Context;

import androidx.test.platform.app.InstrumentationRegistry;
import androidx.test.ext.junit.runners.AndroidJUnit4;

import org.junit.Test;
import org.junit.runner.RunWith;

import static org.junit.Assert.*;

import fi.iki.elonen.NanoHTTPD;

/**
 * Instrumented test, which will execute on an Android device.
 *
 * @see <a href="http://d.android.com/tools/testing">Testing documentation</a>
 */
@RunWith(AndroidJUnit4.class)
public class ExampleInstrumentedTest {
    @Test
    public void useAppContext() {
        // Context of the app under test.
        Context appContext = InstrumentationRegistry.getInstrumentation().getTargetContext();
        assertEquals("ru.asavan.collect4", appContext.getPackageName());
    }

    @Test
    public void mimeTypes() {
        // Context of the app under test.
        assertEquals("text/javascript", NanoHTTPD.getMimeTypeForFile("main.js"));
        assertEquals("text/html", NanoHTTPD.getMimeTypeForFile("index.html"));
        assertEquals("application/json", NanoHTTPD.getMimeTypeForFile("assetlinks.json"));
        assertEquals("application/manifest+json", NanoHTTPD.getMimeTypeForFile("app.webmanifest"));
    }
}
