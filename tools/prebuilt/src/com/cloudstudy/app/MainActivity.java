package com.cloudstudy.app;

import android.app.Activity;
import android.os.Bundle;
import android.webkit.WebSettings;
import android.webkit.WebView;

public class MainActivity extends Activity {

    private WebView webView;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        WebView.setWebContentsDebuggingEnabled(true);

        WebView wv = new WebView(this);
        this.webView = wv;

        WebSettings s = wv.getSettings();
        s.setJavaScriptEnabled(true);
        s.setDomStorageEnabled(true);
        s.setAllowFileAccess(true);
        s.setAllowFileAccessFromFileURLs(true);
        s.setAllowUniversalAccessFromFileURLs(true);
        s.setUseWideViewPort(true);
        s.setLoadWithOverviewMode(true);

        wv.setBackgroundColor(-16448248);

        wv.setWebViewClient(new InAppClient());
        wv.setWebChromeClient(new WebChrome(this, wv));

        setContentView(wv);
        wv.loadUrl("file:///android_asset/study.html");
    }

    @Override
    public void onBackPressed() {
        WebView wv = this.webView;
        if (wv != null) {
            wv.evaluateJavascript("window.__bk?window.__bk():0", new BackCb(this));
            return;
        }
        super.onBackPressed();
    }

    @Override
    protected void onPause() {
        super.onPause();
        WebView wv = this.webView;
        if (wv != null) {
            wv.onPause();
            wv.evaluateJavascript("document.querySelectorAll('video').forEach(function(v){try{v.pause()}catch(e){}});0", null);
        }
    }

    @Override
    protected void onResume() {
        super.onResume();
        WebView wv = this.webView;
        if (wv != null) {
            wv.onResume();
        }
    }
}
