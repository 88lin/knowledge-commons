package com.cloudstudy.app;

import android.net.Uri;
import android.webkit.WebResourceRequest;
import android.webkit.WebView;
import android.webkit.WebViewClient;

/* InAppClient —— 「不跳出去」拦截器：http/https/file/data/blob/about 留在本 WebView；其余 scheme 吞掉 */
public class InAppClient extends WebViewClient {

    private static boolean isAllowed(Uri u) {
        if (u == null) return false;
        String scheme = u.getScheme();
        if (scheme == null) return false;
        return scheme.equalsIgnoreCase("http")
                || scheme.equalsIgnoreCase("https")
                || scheme.equalsIgnoreCase("file")
                || scheme.equalsIgnoreCase("data")
                || scheme.equalsIgnoreCase("blob")
                || scheme.equalsIgnoreCase("about");
    }

    @Override
    public boolean shouldOverrideUrlLoading(WebView view, WebResourceRequest request) {
        Uri u = request.getUrl();
        if (isAllowed(u)) {
            return false;
        }
        return true;
    }

    @Override
    public boolean shouldOverrideUrlLoading(WebView view, String url) {
        Uri u = Uri.parse(url);
        if (isAllowed(u)) {
            return false;
        }
        return true;
    }
}
