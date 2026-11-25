import { useState } from "react";
import "./assets/styles/global.css";
import { Sidebar } from "./components/ui/Sidebar";
import { ListFilterPlus } from "lucide-react";
import { Container } from "./components/ui/Container";
import { DefaultState } from "./components/ui/DefaultState";

type Pages = "default" | "filter" | "create" | "edit";
function App() {
  const [mobileTray, setMobileTray] = useState(false);
  const [page, setPage] = useState<Pages>("default");

  const renderPage = () => {
    if (page === "default") {
      return <DefaultState />;
    }
    return <></>;
  };
  return (
    <div className="home">
      <button
        className={`tray-controller ${mobileTray && "no-show"}`}
        onClick={() => setMobileTray((p) => !p)}
      >
        <ListFilterPlus size={16} strokeWidth={1.75} />
      </button>
      <Sidebar mobileTray={mobileTray} />

      <Container children={renderPage()} />
    </div>
  );
}

export default App;
