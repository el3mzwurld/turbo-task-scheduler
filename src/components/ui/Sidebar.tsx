import {
  AlarmClockPlus,
  CalendarClock,
  CalendarDays,
  ChevronLeft,
  ChevronRight,
  Pause,
  Pencil,
  type LucideIcon,
} from "lucide-react";
import { useEffect, useState } from "react";
import { MotionStack } from "../motion components/motion";

interface SidebarProps {
  mobileTray: boolean;
}

const filters: { name: string; icon: LucideIcon }[] = [];
export const Sidebar = ({ mobileTray }: SidebarProps) => {
  const [tray, setTray] = useState(true);
  useEffect(() => {
    if (window.innerWidth < 768) {
      setTray(mobileTray);
    }
  }, [mobileTray]);
  return (
    <aside className={`sidebar ${tray ? "" : "close"}`}>
      <header>
        <h2>Tempo</h2>
      </header>
      <MotionStack
        className="filters"
        sx={{
          margin: "0.5rem 0rem",
          width: "100%",
          flex: { xs: 1, lg: 0 },
        }}
      >
        <div className="filter">
          <span id="name">All Schedules</span>
          <div className={`ico ${tray ? "" : "show"}`}>
            <AlarmClockPlus size={16} strokeWidth={1.75} />
          </div>
          <span id="number">3</span>
        </div>
        <div className="filter">
          <span id="name">Today</span>
          <div className={`ico ${tray ? "" : "show"}`}>
            <CalendarDays size={16} strokeWidth={1.75} />
          </div>
          <span id="number">3</span>
        </div>
        <div className="filter">
          <span id="name">Upcoming</span>
          <div className={`ico ${tray ? "" : "show"}`}>
            <CalendarClock size={16} strokeWidth={1.75} />
          </div>
          <span id="number">3</span>
        </div>
        <div className="filter">
          <span id="name">Drafts</span>
          <div className={`ico ${tray ? "" : "show"}`}>
            <Pencil size={16} strokeWidth={1.75} />
          </div>
          <span id="number">3</span>
        </div>{" "}
        <div className="filter">
          <span id="name">Paused</span>
          <div className={`ico ${tray ? "" : "show"}`}>
            <Pause size={16} strokeWidth={1.75} />
          </div>
          <span id="number">3</span>
        </div>
      </MotionStack>
      <button onClick={() => setTray((p) => !p)}>
        {tray ? (
          <ChevronLeft size={16} strokeWidth={1.75} />
        ) : (
          <ChevronRight size={16} strokeWidth={1.75} />
        )}
      </button>
    </aside>
  );
};
