package ru.asavan.connect4;

import android.app.Activity;
import android.os.Bundle;
import android.util.Log;

import java.util.LinkedHashMap;
import java.util.Map;


public class AndroidWebServerActivity extends Activity {
    private static final int STATIC_CONTENT_PORT = 8080;
    private static final int WEB_SOCKET_PORT = 8088;
    private static final String WEB_GAME_URL = "https://asavan.github.io/connect4/";
    public static final String LOCAL_IP = "127.0.0.1";
    public static final String LOCALHOST = "localhost";
    public static final String WEB_VIEW_URL = "file:///android_asset/www/index.html";
    public static final String MAIN_LOG_TAG = "connect4_TAG";
    private static final boolean secure = false;

    private BtnUtils btnUtils;

    @Override
    public void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.main);
        btnUtils = new BtnUtils(this, STATIC_CONTENT_PORT, WEB_SOCKET_PORT, secure);
        try {
            HostUtils hostUtils = new HostUtils(STATIC_CONTENT_PORT, WEB_SOCKET_PORT, secure);
            addButtons(IpUtils.getIPAddressSafe(), hostUtils);
            btnUtils.launchTwa(hostUtils.getStaticHost(LOCALHOST), null);
        } catch (Exception e) {
            Log.e(MAIN_LOG_TAG, "main", e);
        }
    }

    private void addButtons(String formattedIpAddress, HostUtils hostUtils) {
        final String localhost = hostUtils.getStaticHost(LOCALHOST);
        {
            final String host = hostUtils.getStaticHost(formattedIpAddress);
            final String webSocketHost = hostUtils.getSocketHost(formattedIpAddress);
            Map<String, String> b = new LinkedHashMap<>();
            b.put("wh", webSocketHost);
            b.put("sh", host);
            b.put("mode", "net");
            btnUtils.addButtonBrowser(host, b, R.id.button1);
            btnUtils.addButtonTwa(localhost, b, R.id.button4, host);
        }
        {
            Map<String, String> b = new LinkedHashMap<>();
            b.put("mode", "ai");
            btnUtils.addButtonTwa(hostUtils.getStaticHost(LOCALHOST), b, R.id.button2);
        }
        {
            Map<String, String> b = new LinkedHashMap<>();
            b.put("mode", "hotseat");
            btnUtils.addButtonTwa(hostUtils.getStaticHost(LOCALHOST), b, R.id.button3);
        }
    }

    @Override
    protected void onDestroy() {
        if (btnUtils != null) {
            btnUtils.onDestroy();
        }
        super.onDestroy();
    }
}
