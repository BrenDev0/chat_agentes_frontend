export function timeToId(time: string) {
  const uiId = new Date(time).getTime().toString(36);
  return uiId;
}
