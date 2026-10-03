/* 把 study.html 以二进制方式嵌入（incbin），供 launcher.c 引用（ELF 用 .rodata） */
    .section .rodata,"a"
    .globl STUDY_HTML
STUDY_HTML:
    .incbin "study.html"
    .globl STUDY_HTML_END
STUDY_HTML_END:
