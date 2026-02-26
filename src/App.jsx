import { useState, useEffect } from "react";
import {
ChevronRight,
ChevronLeft,
ChevronUp,
Search,
GraduationCap,
Maximize2,
Minimize2,
} from "lucide-react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeRaw from "rehype-raw";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { atomDark } from "react-syntax-highlighter/dist/esm/styles/prism";
import logo from "./images/docker_Logo.png";

const modules = import.meta.glob("./docs/*/*.md", {
query: "?raw",
import: "default",
eager: true,
});

const allSections = Object.entries(modules)
.map(([path, content]) => {
const folder = path.split("/")[2];
const match = folder.match(/^(\d{2})-/);
const sortOrder = match ? Number(match[1]) : 999;

const smallWords = new Set(["ve", "ile", "veya", "and", "or", "of", "to", "in"]);
const title = folder
.replace(/^\d{2}-/, "")
.toLowerCase()
.split("-")
.map((w, i) => {
if (!w) return w;
if (i > 0 && smallWords.has(w)) return w;
return w.charAt(0).toUpperCase() + w.slice(1);
})
.join(" ");

return { id: folder, title, content, sortOrder };
})
.sort((a, b) => a.sortOrder - b.sortOrder);

const getIdFromPath = () => {
const m = window.location.pathname.match(/^\/docs\/([^/]+)$/);
return m ? decodeURIComponent(m[1]) : null;
};

const setPathFromId = (id) => {
const next = `/docs/${encodeURIComponent(id)}`;
if (window.location.pathname !== next) {
window.history.pushState({}, "", next);
}
};

function App() {
const [isSidebarOpen, setIsSidebarOpen] = useState(false);
const [isMobileSearchOpen, setIsMobileSearchOpen] = useState(false);
const [isCollapsed, setIsCollapsed] = useState(false);
const [searchTerm, setSearchTerm] = useState("");

const [selectedSection, setSelectedSection] = useState(() => {
const fromUrl = getIdFromPath();
if (fromUrl) {
const hit = allSections.find((s) => s.id === fromUrl);
if (hit) return hit;
}

const saved = localStorage.getItem("lastDockerSectionId");
if (saved) {
const hit = allSections.find((s) => s.id === saved);
if (hit) return hit;
}

return allSections[0] || null;
});

useEffect(() => {
const handleResize = () => {
if (window.innerWidth >= 1024) {
setIsSidebarOpen(false);
setIsMobileSearchOpen(false);
}
};
window.addEventListener("resize", handleResize);
return () => window.removeEventListener("resize", handleResize);
}, []);

useEffect(() => {
if (selectedSection) {
setTimeout(() => {
const main = document.querySelector("main");
if (main) {
const savedScroll = sessionStorage.getItem(`scroll-${selectedSection.id}`);
if (savedScroll) {
main.scrollTo({ top: parseInt(savedScroll, 10) });
} else {
main.scrollTo({ top: 0, behavior: "smooth" });
}
}
}, 100);
}
}, [selectedSection]);

useEffect(() => {
const main = document.querySelector("main");
if (!main) return;
const handleScroll = () => {
if (selectedSection) {
sessionStorage.setItem(`scroll-${selectedSection.id}`, String(main.scrollTop));
}
};
main.addEventListener("scroll", handleScroll);
return () => main.removeEventListener("scroll", handleScroll);
}, [selectedSection]);

useEffect(() => {
const onPopState = () => {
const fromUrl = getIdFromPath();
if (!fromUrl) return;
const hit = allSections.find((s) => s.id === fromUrl);
if (hit) setSelectedSection(hit);
};

window.addEventListener("popstate", onPopState);
return () => window.removeEventListener("popstate", onPopState);
}, []);

const filteredSections = allSections.filter(
(section) =>
section.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
section.content.toLowerCase().includes(searchTerm.toLowerCase())
);

const handlePageChange = (section) => {
setSelectedSection(section);
setIsSidebarOpen(false);
setIsMobileSearchOpen(false);

if (section) {
localStorage.setItem("lastDockerSectionId", section.id);
setPathFromId(section.id);
} else {
localStorage.removeItem("lastDockerSectionId");
if (window.location.pathname !== "/") window.history.pushState({}, "", "/");
}

setTimeout(() => {
const main = document.querySelector("main");
if (main) main.scrollTop = 0;
}, 0);
};

const handleNextPage = () => {
if (!selectedSection) return;
const idx = allSections.findIndex((s) => s.id === selectedSection.id);
if (idx < allSections.length - 1) handlePageChange(allSections[idx + 1]);
};

const handlePrevPage = () => {
if (!selectedSection) return;
const idx = allSections.findIndex((s) => s.id === selectedSection.id);
if (idx > 0) handlePageChange(allSections[idx - 1]);
};

const handleScrollToTop = () => {
const main = document.querySelector("main");
if (main) main.scrollTo({ top: 0, behavior: "smooth" });
};

return (
<div className="flex flex-col lg:flex-row h-screen w-screen bg-[#0f172a] text-white font-sans overflow-hidden">
<header className="lg:hidden bg-[#1e293b] border-b border-slate-700 z-50">
<div className="px-4 py-3 flex justify-between items-center">
<div className="flex items-center gap-2 cursor-pointer" onClick={() => handlePageChange(null)}>
<img src={logo} alt="Docker" className="w-10 h-10 object-contain" style={{ margin: 0, maxWidth: "none" }} />
<span className="text-sm font-bold uppercase">Docker Rehberi TR</span>
</div>
<div className="flex items-center gap-2">
<button onClick={() => setIsMobileSearchOpen(!isMobileSearchOpen)} className="text-[#FF9900] p-2">
<Search size={18} />
</button>
<button
onClick={() => setIsSidebarOpen(!isSidebarOpen)}
className="text-[#FF9900] text-xs font-bold uppercase border border-[#FF9900]/30 px-3 py-1 rounded"
>
{isSidebarOpen ? "Close" : "Menu"}
</button>
</div>
</div>
{isMobileSearchOpen && (
<div className="px-4 pb-3">
<input
type="text"
placeholder="Search..."
className="w-full bg-[#0f172a] border border-slate-700 rounded-lg py-2.5 px-4 text-sm"
value={searchTerm}
onChange={(e) => setSearchTerm(e.target.value)}
/>
</div>
)}
</header>

<aside
className={`${isSidebarOpen ? "translate-x-0" : "-translate-x-full"} lg:translate-x-0 ${
isCollapsed ? "lg:hidden" : "lg:flex"
} fixed lg:static top-14 lg:top-0 left-0 w-80 h-[calc(100vh-56px)] lg:h-screen bg-[#1e293b] border-r border-slate-700 transition-transform z-40 flex flex-col overflow-hidden`}
>
<div className="p-6 flex-1 flex flex-col overflow-hidden">
<div className="hidden lg:flex flex-col items-center mb-8 cursor-pointer" onClick={() => handlePageChange(null)}>
<img src={logo} alt="Docker" className="w-16 h-16 mb-4 object-contain" style={{ margin: 0, maxWidth: "none" }} />
<h1 className="text-2xl font-extrabold uppercase">Docker</h1>
<span className="text-xs text-[#FF9900] font-semibold mt-2">Egitim Rehberi</span>
<span className="text-xs text-slate-400 mt-4 border-t border-slate-700 pt-3">Yavuz Barış Özgün</span>
</div>

<div className="relative mb-6 hidden lg:block">
<Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
<input
type="text"
placeholder="Search..."
className="w-full bg-[#0f172a] border border-slate-700 rounded-lg py-2.5 pl-10 pr-4 text-sm"
value={searchTerm}
onChange={(e) => setSearchTerm(e.target.value)}
/>
</div>

<nav className="flex-1 space-y-1 overflow-y-auto pr-2 custom-scrollbar">
{filteredSections.map((section) => (
<button
key={section.id}
onClick={() => handlePageChange(section)}
className={`w-full text-left px-4 py-3 rounded-lg flex justify-between text-sm transition ${
selectedSection?.id === section.id
? "bg-[#FF9900] text-[#1e293b] font-bold"
: "text-slate-400 hover:text-white hover:bg-slate-800"
}`}
>
<span>
{String(section.sortOrder).padStart(2, "0")} - {section.title}
</span>
<ChevronRight size={16} />
</button>
))}
</nav>

<div className="mt-6 pt-4 border-t border-slate-700 text-center text-[10px] text-slate-500">
© 2026{" "}
<a
href="https://github.com/BozgunBer-2506"
target="_blank"
rel="noopener noreferrer"
className="text-[#FF9900]"
>
The_Bozgun
</a>
</div>
</div>
</aside>

<main className="flex-1 overflow-y-auto px-6 py-10 relative">
<button
onClick={() => setIsCollapsed(!isCollapsed)}
className="hidden lg:flex fixed top-6 right-8 z-[70] items-center gap-2 bg-slate-800/80 hover:bg-[#FF9900] text-slate-300 hover:text-white px-3 py-1.5 rounded-full border border-slate-700 transition-all shadow-xl backdrop-blur-sm"
>
{isCollapsed ? <Maximize2 size={16} /> : <Minimize2 size={16} />}
<span className="text-[10px] font-bold uppercase tracking-widest">{isCollapsed ? "Expand" : "Focus Mode"}</span>
</button>

{selectedSection ? (
<article className="max-w-4xl mx-auto space-y-6">
<div className="text-xs font-semibold text-[#FF9900] uppercase">
Bölüm {String(selectedSection.sortOrder).padStart(2, "0")}
</div>

<h1 className="text-4xl lg:text-5xl font-extrabold">{selectedSection.title}</h1>

<div className="prose prose-invert max-w-none">
<ReactMarkdown
remarkPlugins={[remarkGfm]}
rehypePlugins={[rehypeRaw]}
components={{
h1: () => null,
h2: ({ children }) => (
<h2 className="text-2xl lg:text-3xl font-semibold mt-6 mb-3 border-b border-slate-800 pb-2">
{children}
</h2>
),
h3: ({ children }) => (
<h3 className="text-xl lg:text-2xl font-semibold mt-4 mb-2 text-[#FF9900]">{children}</h3>
),
p: ({ children }) => (
<p className="text-base lg:text-lg text-slate-300 mb-4 leading-relaxed">{children}</p>
),
code({ inline, className, children, ...props }) {
const match = /language-(\w+)/.exec(className || "");
return !inline && match ? (
<div className="rounded-lg overflow-hidden border border-slate-800 my-6">
<SyntaxHighlighter
style={atomDark}
language={match[1]}
PreTag="div"
customStyle={{ margin: 0, padding: "20px", background: "#0d1117" }}
{...props}
>
{String(children).replace(/\n$/, "")}
</SyntaxHighlighter>
</div>
) : (
<code className="bg-slate-800 text-[#FF9900] px-1.5 py-0.5 rounded text-sm font-mono">
{children}
</code>
);
},
details: ({ children }) => (
<details className="bg-[#1e293b]/50 border border-slate-700 rounded-lg mb-6 overflow-hidden">
{children}
</details>
),
summary: ({ children }) => (
<summary className="flex items-center justify-between cursor-pointer px-4 py-3 font-bold text-[#FF9900] list-none hover:bg-slate-800/50">
<div className="flex items-center gap-2 text-xs font-black uppercase">
<GraduationCap size={16} />
{children}
</div>
<ChevronRight size={16} />
</summary>
),
}}
>
{selectedSection.content}
</ReactMarkdown>
</div>

<div className="flex justify-between pt-10 border-t border-slate-800">
<button
onClick={handlePrevPage}
disabled={allSections.findIndex((s) => s.id === selectedSection.id) === 0}
className="flex items-center gap-2 text-sm text-slate-500 hover:text-[#FF9900] disabled:opacity-0 transition"
>
<ChevronLeft size={16} /> Önceki Sayfa
</button>
<button
onClick={handleNextPage}
disabled={allSections.findIndex((s) => s.id === selectedSection.id) === allSections.length - 1}
className="flex items-center gap-2 text-sm text-[#FF9900] hover:text-orange-400 disabled:opacity-0 transition"
>
Sonraki Sayfa <ChevronRight size={16} />
</button>
</div>
</article>
) : (
<div className="flex flex-col items-center justify-center h-full text-center px-6">
<img src={logo} alt="Docker" className="w-40 h-40 mb-8 object-contain" style={{ margin: 0, maxWidth: "none" }} />
<h2 className="text-5xl font-extrabold mb-4">Docker</h2>
<h3 className="text-2xl text-[#FF9900] font-bold mb-8 tracking-widest">Egitim Rehberi</h3>
<p className="text-lg text-slate-400">Menüden bir başlık seçerek öğrenmeye başlayın.</p>
</div>
)}

{selectedSection && (
<button
onClick={handleScrollToTop}
className="fixed bottom-6 right-6 bg-[#FF9900] text-[#1e293b] p-3 rounded-lg hover:bg-orange-400 transition shadow-2xl z-50"
>
<ChevronUp size={20} />
</button>
)}
</main>
</div>
);
}

export default App;