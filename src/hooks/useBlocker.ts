/**
 * Prompts a user when they exit the page
 */

import { useContext, useEffect } from 'react';
import { UNSAFE_NavigationContext as NavigationContext } from 'react-router-dom';

export function useConfirmExit(blocker: any, when = true) {
  const { navigator } = useContext(NavigationContext);

  useEffect(() => {
    if (!when) {
      return;
    }

    const push = navigator.push;

    navigator.push = (...args: Parameters<typeof push>) => {
      blocker(args);
    };

    return () => {
      navigator.push = push;
    };
  }, [navigator, blocker, when]);
}

export function useBlocker(blocker: any, when = true) {
  // const { navigator } = useContext(NavigationContext);
  useEffect(() => {
    if (when) {
      window.onbeforeunload = function () {
        return blocker;
      };
    }

    return () => {
      window.onbeforeunload = null;
    };
  }, [blocker, when]);
  useConfirmExit(blocker, when);
}
