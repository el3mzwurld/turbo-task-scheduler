import type React from "react";
import { MotionBox } from "../motion components/motion";

interface ContainerProps {
  children: React.ReactNode;
}
export const Container = ({ children }: ContainerProps) => {
  return (
    <MotionBox
      sx={{
        display: "flex",
        height: "100dvh",
        overflowY: "auto",
        overflowX: "hidden",
        padding: "1.5rem",
        flex: 1,
        width: "100%",
      }}
    >
      {children}
    </MotionBox>
  );
};
