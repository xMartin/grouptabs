import { useCallback, useState } from "react";
import throttle from "lodash/throttle";

type ScrollIndicatorCallback = (node: HTMLElement | null) => void;

function useScrollIndicator(): [boolean, ScrollIndicatorCallback] {
  const [isScrolled, setIsScrolled] = useState<boolean>(false);

  const ref = useCallback<ScrollIndicatorCallback>((node) => {
    node?.addEventListener(
      "scroll",
      throttle(() => {
        setIsScrolled(!!node.scrollTop);
      }, 200)
    );
  }, []);

  return [isScrolled, ref];
}

export default useScrollIndicator;
