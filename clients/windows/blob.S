/* 把 study.html 以二进制方式嵌入（.incbin），供 launcher.c 引用 */
    .section .rdata,"dr"
    .globl STUDY_HTML
STUDY_HTML:
    .incbin "study.html"
    .globl STUDY_HTML_END
STUDY_HTML_END:
