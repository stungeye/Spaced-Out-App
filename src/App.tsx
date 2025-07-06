import { Routes, Route } from "react-router-dom";
import Layout from "@/components/Layout";
import Decks from "@/pages/Decks";
import Deck from "@/pages/Deck";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route index element={<Decks />} />
        <Route path="deck/:id" element={<Deck />} />
      </Route>
    </Routes>
  );
}

export default App;
