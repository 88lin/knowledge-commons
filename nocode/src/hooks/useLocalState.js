import { useCallback, useEffect, useState } from "react";
function loadJSON(key, fallback) {
  try {
    const v = JSON.parse(localStorage.getItem(key) ?? "");
    return v == null ? fallback : v;
  } catch {
    return fallback;
  }
}
function saveJSON(key, value) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch {
  }
}
function useLocalState(key, initial) {
  const [v, setV] = useState(() => loadJSON(key, initial));
  const set = useCallback(
    (next) => {
      setV((prev) => {
        const n = typeof next === "function" ? next(prev) : next;
        saveJSON(key, n);
        return n;
      });
    },
    [key]
  );
  return [v, set];
}
function useScrollTop(threshold = 320) {
  const [show, setShow] = useState(false);
  useEffect(() => {
    const on = () => setShow(window.scrollY > threshold);
    window.addEventListener("scroll", on, { passive: true });
    on();
    return () => window.removeEventListener("scroll", on);
  }, [threshold]);
  return show;
}
function scrollTop(smooth = true) {
  window.scrollTo({ top: 0, behavior: smooth ? "smooth" : "auto" });
}
export {
  loadJSON,
  saveJSON,
  scrollTop,
  useLocalState,
  useScrollTop
};
