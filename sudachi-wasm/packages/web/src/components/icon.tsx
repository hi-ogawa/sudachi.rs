import type React from "react";

export function Icon(
  props: { name: keyof typeof DATA } & React.SVGProps<SVGSVGElement>
) {
  const { name, ...rest } = props;
  return <svg dangerouslySetInnerHTML={{ __html: DATA[name] }} {...rest} />;
}

// prettier-ignore
const DATA = {
  "Logos/github-fill": Object.values(import.meta.glob("remixicon/icons/Logos/github-fill.svg", { as: "raw", eager: true }))[0]!,
  "System/error-warning-line": Object.values(import.meta.glob("remixicon/icons/System/error-warning-line.svg", { as: "raw", eager: true }))[0]!,
  "System/close-circle-line": Object.values(import.meta.glob("remixicon/icons/System/close-circle-line.svg", { as: "raw", eager: true }))[0]!,
  "close": Object.values(import.meta.glob("remixicon/icons/System/close-line.svg", { as: "raw", eager: true }))[0]!,
}
