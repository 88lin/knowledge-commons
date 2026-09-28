package com.cloudstudy.app;

import android.app.Activity;
import android.util.Log;
import android.view.View;
import android.view.ViewGroup;
import android.widget.FrameLayout;
import android.webkit.WebChromeClient;
import android.webkit.WebView;

/* WebChrome —— 视频全屏支持（HTML5 video / iframe 播放器的全屏请求都走这里） */
public class WebChrome extends WebChromeClient {

    private final Activity act;
    private final WebView wv;
    private View full;
    private CustomViewCallback cb;

    public WebChrome(Activity a, WebView w) {
        this.act = a;
        this.wv = w;
    }

    @Override
    public void onShowCustomView(View view, CustomViewCallback callback) {
        Log.e("CloudStudy", "FS_SHOW");
        if (full != null) {
            callback.onCustomViewHidden();
            return;
        }
        full = view;
        cb = callback;
        FrameLayout fl = new FrameLayout(act);
        fl.setBackgroundColor(0xFF000000);
        fl.addView(view, new FrameLayout.LayoutParams(-1, -1));
        ViewGroup content = (ViewGroup) act.findViewById(android.R.id.content);
        content.addView(fl, new ViewGroup.LayoutParams(-1, -1));
        if (wv != null) wv.setVisibility(View.GONE);
    }

    @Override
    public void onHideCustomView() {
        Log.e("CloudStudy", "FS_HIDE");
        if (full == null) return;
        ViewGroup content = (ViewGroup) act.findViewById(android.R.id.content);
        View parent = null;
        try {
            parent = (View) full.getParent();
        } catch (Throwable t) {
        }
        if (parent != null && parent != wv) {
            content.removeView(parent);
        } else {
            content.removeView(full);
        }
        full = null;
        if (wv != null) wv.setVisibility(View.VISIBLE);
        if (cb != null) {
            cb.onCustomViewHidden();
            cb = null;
        }
    }
}
