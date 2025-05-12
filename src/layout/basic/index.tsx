import { Outlet } from "react-router";
import "./basic-layout.css";

export const BasicLayout = () => {
  return (
    <div className="svq-layout--basic-container bg-zinc-900">
      <Outlet />
    </div>
  );
};
