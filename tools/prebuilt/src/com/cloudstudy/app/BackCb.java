package com.cloudstudy.app;

import android.app.Activity;
import android.webkit.ValueCallback;

/* BackCb —— 页面能处理返回（__bk 返回 "true"）就让它处理，否则退出 */
public class BackCb implements ValueCallback<String> {

    private final Activity act;

    public BackCb(Activity a) {
        this.act = a;
    }

    @Override
    public void onReceiveValue(String value) {
        if ("true".equals(value)) {
            return;
        }
        act.finish();
    }
}
