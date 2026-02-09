export function formatRetryTime(seconds: number): string {
  if (seconds < 60) {
    return `${Math.ceil(seconds)} second${Math.ceil(seconds) !== 1 ? "s" : ""}`;
  }
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = Math.ceil(seconds % 60);
  return `${minutes} minute${minutes !== 1 ? "s" : ""} and ${remainingSeconds} second${remainingSeconds !== 1 ? "s" : ""}`;
}
