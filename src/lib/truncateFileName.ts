export default function truncateFileName(name: string, maxBaseLength = 12) {
  const lastDot = name.lastIndexOf(".");
  if (lastDot === -1) return name;

  const base = name.slice(0, lastDot);
  const ext = name.slice(lastDot);

  if (base.length <= maxBaseLength) return name;

  return `${base.slice(0, maxBaseLength)}…${ext}`;
}
