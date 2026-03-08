package zyrax.fit;

import android.os.Bundle;
import android.view.View;
import android.webkit.WebSettings;
import android.webkit.WebView;
import com.getcapacitor.BridgeActivity;
import com.getcapacitor.Bridge;

public class MainActivity extends BridgeActivity {
    @Override
    public void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        // Enable WebView debugging
        WebView.setWebContentsDebuggingEnabled(true);
    }

    @Override
    public void onStart() {
        super.onStart();

        // Get the WebView from Capacitor Bridge
        Bridge bridge = this.getBridge();
        if (bridge != null && bridge.getWebView() != null) {
            WebView webView = bridge.getWebView();
            WebSettings settings = webView.getSettings();

            // Enable hardware acceleration
            webView.setLayerType(View.LAYER_TYPE_HARDWARE, null);

            // Performance optimizations
            settings.setRenderPriority(WebSettings.RenderPriority.HIGH);
            settings.setCacheMode(WebSettings.LOAD_DEFAULT);
            settings.setDomStorageEnabled(true);
            settings.setDatabaseEnabled(true);

            // Optimize scrolling and zooming
            webView.setScrollBarStyle(View.SCROLLBARS_INSIDE_OVERLAY);
            settings.setBuiltInZoomControls(false);
            settings.setDisplayZoomControls(false);
            settings.setSupportZoom(false);
        }
    }
}
