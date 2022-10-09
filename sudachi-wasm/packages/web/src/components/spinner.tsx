import type React from "react";

export function Spinner({
  size,
}: {
  size: NonNullable<React.CSSProperties["width"]>;
}) {
  return (
    <div
      className="animate-spin rounded-full border-2 border-gray-500 border-top-gray-300 border-left-gray-300"
      style={{ width: size, height: size }}
    />
  );
}
