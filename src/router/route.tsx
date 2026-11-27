import { Routes, Route } from "react-router-dom";
import App from "../App";
import CreateTaskForm from "../components/task/CreateTaskForm";
import EditTaskForm from "../components/task/EditTaskForm";

export const AppRoutes = () => {
  return (
    <>
      <Routes>
        <Route path={"/"} element={<App />} />
        <Route path="/create" element={<CreateTaskForm />} />
        <Route path="/edit/:id" element={<EditTaskForm />} />
      </Routes>
    </>
  );
};
