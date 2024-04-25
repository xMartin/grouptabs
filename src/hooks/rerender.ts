import { useEffect, useState } from "react";

export function useRerenderInterval(intervalMs: number) {
  const [, setMockState] = useState(true);

  useEffect(() => {
    const intervalHandle = setInterval(
      () => setMockState((mockState) => !mockState),
      intervalMs,
    );
    return () => clearInterval(intervalHandle);
  }, [intervalMs]);
}
