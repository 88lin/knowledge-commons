.class public Lcom/cloudstudy/app/InAppClient;
.super Landroid/webkit/WebViewClient;
.source "InAppClient.java"

# =========================================================
# InAppClient —— 「不跳出去」拦截器
#   http/https/file/data/blob/about → 留在本 WebView 内加载（返回 false）
#   其余全部 scheme（bilibili:// intent:// market:// tel: ...）→ 吞掉（返回 true），
#   绝不起外部 App / 浏览器 / 商店。
# =========================================================


# direct methods
.method public constructor <init>()V
    .locals 0

    invoke-direct {p0}, Landroid/webkit/WebViewClient;-><init>()V

    return-void
.end method


# virtual methods
.method public shouldOverrideUrlLoading(Landroid/webkit/WebView;Landroid/webkit/WebResourceRequest;)Z
    .locals 2

    invoke-interface {p2}, Landroid/webkit/WebResourceRequest;->getUrl()Landroid/net/Uri;

    move-result-object v0

    invoke-static {v0}, Lcom/cloudstudy/app/InAppClient;->isAllowed(Landroid/net/Uri;)Z

    move-result v0

    if-eqz v0, :block

    const/4 v0, 0x0

    return v0

    :block
    const/4 v0, 0x1

    return v0
.end method

.method public shouldOverrideUrlLoading(Landroid/webkit/WebView;Ljava/lang/String;)Z
    .locals 2

    invoke-static {p2}, Landroid/net/Uri;->parse(Ljava/lang/String;)Landroid/net/Uri;

    move-result-object v0

    invoke-static {v0}, Lcom/cloudstudy/app/InAppClient;->isAllowed(Landroid/net/Uri;)Z

    move-result v0

    if-eqz v0, :block

    const/4 v0, 0x0

    return v0

    :block
    const/4 v0, 0x1

    return v0
.end method

.method private static isAllowed(Landroid/net/Uri;)Z
    .locals 4

    const/4 v3, 0x0

    if-eqz p0, :ret

    invoke-virtual {p0}, Landroid/net/Uri;->getScheme()Ljava/lang/String;

    move-result-object v0

    if-eqz v0, :ret

    const-string v1, "http"

    invoke-virtual {v0, v1}, Ljava/lang/String;->equalsIgnoreCase(Ljava/lang/String;)Z

    move-result v2

    if-nez v2, :allow

    const-string v1, "https"

    invoke-virtual {v0, v1}, Ljava/lang/String;->equalsIgnoreCase(Ljava/lang/String;)Z

    move-result v2

    if-nez v2, :allow

    const-string v1, "file"

    invoke-virtual {v0, v1}, Ljava/lang/String;->equalsIgnoreCase(Ljava/lang/String;)Z

    move-result v2

    if-nez v2, :allow

    const-string v1, "data"

    invoke-virtual {v0, v1}, Ljava/lang/String;->equalsIgnoreCase(Ljava/lang/String;)Z

    move-result v2

    if-nez v2, :allow

    const-string v1, "blob"

    invoke-virtual {v0, v1}, Ljava/lang/String;->equalsIgnoreCase(Ljava/lang/String;)Z

    move-result v2

    if-nez v2, :allow

    const-string v1, "about"

    invoke-virtual {v0, v1}, Ljava/lang/String;->equalsIgnoreCase(Ljava/lang/String;)Z

    move-result v2

    if-nez v2, :allow

    goto :ret

    :allow
    const/4 v3, 0x1

    :ret
    return v3
.end method
