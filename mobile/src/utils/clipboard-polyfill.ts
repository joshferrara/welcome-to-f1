import * as Clipboard from "expo-clipboard";

type NavigatorWithClipboard = Navigator & {
  clipboard?: {
    writeText?: (text: string) => Promise<void>;
  };
};

const globalNavigator = globalThis.navigator as NavigatorWithClipboard | undefined;

if (globalNavigator && !globalNavigator.clipboard?.writeText) {
  globalNavigator.clipboard = {
    ...(globalNavigator.clipboard ?? {}),
    writeText: async (text: string) => {
      await Clipboard.setStringAsync(text);
    },
  };
}
