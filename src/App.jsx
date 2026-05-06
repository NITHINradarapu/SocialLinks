import { Routes, Route } from "react-router-dom";
import { useLinks } from "./hooks/useLinks";
import Navbar from "./components/Navbar";
import LinkList from "./components/LinkList";
import AddLink from "./components/AddLink";

export default function App() {
  const { links, addLink, updateLink, deleteLink } = useLinks();

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar linkCount={links.length} />
      <main className="flex-1 w-full max-w-2xl mx-auto px-5 sm:px-6 py-8">
        <Routes>
          <Route
            path="/"
            element={<LinkList links={links} onDelete={deleteLink} onEdit={updateLink} />}
          />
          <Route path="/add" element={<AddLink onAdd={addLink} />} />
        </Routes>
      </main>
      <footer
        className="text-center py-5 text-[11px]"
        style={{ color: "var(--text-tertiary)" }}
      >
        Built with <span style={{ color: "var(--accent)" }}>♥</span> — LinkHub
      </footer>
    </div>
  );
}
