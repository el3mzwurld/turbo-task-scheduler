import type React from "react";
import { MotionBox } from "../motion components/motion";

interface ContainerProps {
  children: React.ReactNode;
}
export const Container = ({ children }: ContainerProps) => {
  return (
    <MotionBox
      sx={{
        display: "block",
        overflowY: "auto",
        overflowX: "hidden",
        padding: { xs: "0.5em", md: "1.5rem" },
        flex: 1,
        width: "100%",
        backgroundColor: "primary.main",
      }}
    >
      {children}
    </MotionBox>
  );
};
