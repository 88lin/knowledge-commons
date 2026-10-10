import { useEffect, useState } from "react";
const EMPTY = { groups: [], items: [] };
function loadLibData() {
  const [data, setData] = useState(
    () => window.LIB_DATA || EMPTY
  );
  useEffect(() => {
    if (window.LIB_DATA) return;
    const s = document.createElement("script");
    s.src = (import.meta.env.BASE_URL || '/') + 'app/library-data.js';
    s.onload = () => setData(window.LIB_DATA || EMPTY);
    s.onerror = () => setData(EMPTY);
    document.body.appendChild(s);
    return () => {
      s.remove();
    };
  }, []);
  return data;
}
export {
  loadLibData
};
