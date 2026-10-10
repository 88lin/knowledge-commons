import { useEffect } from "react";
import { loadJSON, saveJSON } from "./hooks/useLocalState";
const INDEX_KEY = "kc:index";
function useKCEnhancer(courseId, nextUrl) {
  useEffect(() => {
    const lessons = Array.from(document.querySelectorAll(".lesson"));
    if (!lessons.length) return;
    const key = "kc:course:" + courseId;
    const st = loadJSON(key, {});
    st.done = st.done || {};
    lessons.forEach((L, i) => {
      if (!L.id) L.id = "l" + (i + 1);
    });
    let prog = document.getElementById("kc-progress");
    if (!prog) {
      prog = document.createElement("div");
      prog.id = "kc-progress";
      prog.className = "kc-progress";
      prog.innerHTML = "<i></i>";
      document.body.appendChild(prog);
    }
    const bar = prog.querySelector("i");
    let toastEl = document.getElementById("kc-toast");
    if (!toastEl) {
      toastEl = document.createElement("div");
      toastEl.id = "kc-toast";
      document.body.appendChild(toastEl);
    }
    let toastTimer = 0;
    const toast = (msg) => {
      toastEl.textContent = msg;
      toastEl.classList.add("on");
      window.clearTimeout(toastTimer);
      toastTimer = window.setTimeout(() => toastEl.classList.remove("on"), 2400);
    };
    const count = () => Object.keys(st.done).length;
    const allDone = () => count() >= lessons.length;
    const nextLesson = () => lessons.find((L) => !st.done[L.id]) ?? null;
    let fab = document.getElementById("kc-fab");
    if (!fab) {
      fab = document.createElement("button");
      fab.id = "kc-fab";
      fab.type = "button";
      document.body.appendChild(fab);
    }
    const refreshFab = () => {
      const sub = document.createElement("span");
      sub.className = "kc-fab-n";
      sub.textContent = `\u8FDB\u5EA6 ${count()}/${lessons.length} \u8BB2`;
      fab.innerHTML = "";
      fab.appendChild(sub);
      fab.append(allDone() ? "\u7EE7\u7EED\u4E0B\u4E00\u518C \u2192" : "\u4E0B\u4E00\u8BB2 \u21A7");
      fab.classList.toggle("alldone", allDone());
    };
    const onScroll = () => fab.classList.toggle("show", window.scrollY > 320);
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    fab.onclick = () => {
      const nx = nextLesson();
      if (nx) {
        nx.scrollIntoView({ behavior: "smooth", block: "start" });
        return;
      }
      if (nextUrl) location.href = nextUrl;
      else toast("\u5DF2\u5230\u6700\u540E\u4E00\u8BB2 \u2713");
    };
    const refresh = () => {
      bar.style.width = count() / lessons.length * 100 + "%";
      refreshFab();
    };
    const syncIndex = () => {
      const idx = loadJSON(INDEX_KEY, {});
      if (count() === 0) {
        if (idx[courseId]) {
          delete idx[courseId];
          saveJSON(INDEX_KEY, idx);
        }
        return;
      }
      const nx = nextLesson();
      idx[courseId] = {
        title: document.title.replace(/ · 知识公社.*$/, ""),
        done: count(),
        total: lessons.length,
        ts: Date.now(),
        url: location.pathname.split("/").pop(),
        nextId: nx ? nx.id : null
      };
      saveJSON(INDEX_KEY, idx);
    };
    lessons.forEach((L) => {
      const b = document.createElement("button");
      b.type = "button";
      b.className = "kc-done";
      b.textContent = st.done[L.id] ? "\u2713 \u672C\u8BB2\u5DF2\u5B66\u5B8C\uFF08\u70B9\u51FB\u64A4\u9500\uFF09" : "\u6807\u8BB0\u672C\u8BB2\u5B66\u5B8C \u2713";
      b.onclick = () => {
        if (st.done[L.id]) delete st.done[L.id];
        else {
          st.done[L.id] = 1;
          if (allDone()) toast(`\u{1F389} \u672C\u518C ${lessons.length} \u8BB2\u5168\u90E8\u5B66\u5B8C\uFF0C\u5389\u5BB3\uFF01`);
        }
        saveJSON(key, st);
        syncIndex();
        b.textContent = st.done[L.id] ? "\u2713 \u672C\u8BB2\u5DF2\u5B66\u5B8C\uFF08\u70B9\u51FB\u64A4\u9500\uFF09" : "\u6807\u8BB0\u672C\u8BB2\u5B66\u5B8C \u2713";
        L.classList.toggle("kc-ldone", !!st.done[L.id]);
        refresh();
      };
      L.appendChild(b);
      if (st.done[L.id]) L.classList.add("kc-ldone");
    });
    document.addEventListener("click", function(e) {
      const t = e.target;
      if (!t.classList.contains("qz-o")) return;
      const box = t.closest(".qz");
      if (!box || box.dataset.done) return;
      const pick = +t.dataset.a;
      if (pick === 1) {
        box.dataset.done = "1";
        box.classList.add("done");
        t.classList.add("ok");
        const why = box.querySelector(".qz-why");
        if (why) why.hidden = false;
      } else {
        t.classList.add("no");
        window.setTimeout(() => t.classList.remove("no"), 450);
      }
    });
    const hash = location.hash.slice(1);
    if (hash) {
      const target = lessons.find((L) => L.id === hash);
      if (target) window.setTimeout(() => target.scrollIntoView({ block: "start" }), 60);
    }
    refresh();
    return () => {
      window.removeEventListener("scroll", onScroll);
      prog.remove();
      fab.remove();
    };
  }, [courseId, nextUrl]);
}
export {
  useKCEnhancer
};
