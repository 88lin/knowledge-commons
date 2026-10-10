import { useState } from "react";
function SearchBar({ placeholder = "\u5168\u7AD9\u68C0\u7D22\uFF1A\u8BFE\u7A0B \xB7 \u7BC7\u76EE \xB7 \u8D44\u6599\u2026" }) {
  const [q, setQ] = useState("");
  const go = (e) => {
    e.preventDefault();
    const v = q.trim();
    if (v) location.href = "search.html?q=" + encodeURIComponent(v);
  };
  return <form className="searchbar" onSubmit={go}><input name="q" placeholder={placeholder} autoComplete="off" value={q} onChange={(e) => setQ(e.target.value)} /><button type="submit">检索</button></form>;
}
export {
  SearchBar
};
