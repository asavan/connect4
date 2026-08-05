package ru.asavan.collect4;

import android.app.Activity;
import android.os.Bundle;
import android.util.Log;

import java.util.LinkedHashMap;
import java.util.Map;

import com.luigivampa92.ndefemulation.NdefEmulation;
import com.luigivampa92.ndefemulation.ndef.UriNdefData;


public class AndroidWebServerActivity extends Activity {
    public static final String MAIN_LOG_TAG = "COLLECT4_TAG";
    private static final int PORT = 8080;
    private static final boolean SECURE = false;

    private BtnUtils btnUtils;

    private NdefEmulation ndefEmulation;

    @Override
    public void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.main);
        btnUtils = new BtnUtils(this, PORT);
        ndefEmulation = new NdefEmulation(this);
        try {
            addButtons(IpUtils.getIPAddressSafe());
        } catch (Exception e) {
            Log.e(MAIN_LOG_TAG, "main", e);
        }
    }

    private void addButtons(String formattedIpAddress) {
        HostUtils hostUtils = new HostUtils(PORT, PORT, SECURE);
        final String host = hostUtils.getStaticHost(formattedIpAddress);
        final String localhost = hostUtils.getStaticHost(IpUtils.LOCALHOST);

        Map<String, String> mainParams = new LinkedHashMap<>();
        mainParams.put("wh", hostUtils.getSocketHost(IpUtils.LOCALHOST));
        mainParams.put("sh", host);
        btnUtils.addButtonTwa(localhost, mainParams, R.id.twa_real_ip, host);
        {
            Map<String, String> b = new LinkedHashMap<>();
            b.put("mode", "ai");
            btnUtils.addButtonTwa(localhost, b, R.id.ai);
        }
        ndefEmulation.setCurrentEmulatedNdefData(new UriNdefData(host));
        btnUtils.launchTwa(localhost, mainParams);
    }

    @Override
    protected void onDestroy() {
        if (btnUtils != null) {
            btnUtils.onDestroy();
        }
        ndefEmulation.setCurrentEmulatedNdefData(null);
        super.onDestroy();
    }
}
