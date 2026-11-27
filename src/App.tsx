import { useState } from "react";
import "./assets/styles/global.css";
import { Sidebar } from "./components/ui/Sidebar";
import { ListFilterPlus } from "lucide-react";
import { Container } from "./components/ui/Container";
import { DefaultState } from "./components/ui/DefaultState";
import CreateTaskForm from "./components/task/CreateTaskForm";
import EditTaskForm from "./components/task/EditTaskForm";
import { MotionBox } from "./components/motion components/motion";

type Pages = "default" | "filter";
function App() {
  const [mobileTray, setMobileTray] = useState(false);
  const [page, setPage] = useState<Pages>("default");

  const renderPage = () => {
    if (page === "default") {
      return <DefaultState />;
    }

    return <></>;
  };

  const changePage = (page: Pages) => {
    setPage(page);
  };
  return (
    <MotionBox className="home" sx={{}}>
      <button
        className={`tray-controller ${mobileTray && "no-show"}`}
        onClick={() => setMobileTray((p) => !p)}
      >
        <ListFilterPlus size={16} strokeWidth={1.75} />
      </button>
      <Sidebar mobileTray={mobileTray} />
      <Container children={renderPage()} />
    </MotionBox>
  );
}

export default App;
