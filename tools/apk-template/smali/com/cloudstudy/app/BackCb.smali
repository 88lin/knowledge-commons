.class public Lcom/cloudstudy/app/BackCb;
.super Ljava/lang/Object;
.source "BackCb.java"

.implements Landroid/webkit/ValueCallback;

.field private act:Landroid/app/Activity;

# direct methods
.method public constructor <init>(Landroid/app/Activity;)V
    .locals 0

    invoke-direct {p0}, Ljava/lang/Object;-><init>()V

    iput-object p1, p0, Lcom/cloudstudy/app/BackCb;->act:Landroid/app/Activity;

    return-void
.end method

# virtual methods
.method public onReceiveValue(Ljava/lang/Object;)V
    .locals 1

    check-cast p1, Ljava/lang/String;

    const-string v0, "true"

    invoke-virtual {v0, p1}, Ljava/lang/String;->equals(Ljava/lang/Object;)Z

    move-result v0

    if-eqz v0, :fin

    return-void

    :fin
    iget-object v0, p0, Lcom/cloudstudy/app/BackCb;->act:Landroid/app/Activity;

    invoke-virtual {v0}, Landroid/app/Activity;->finish()V

    return-void
.end method
