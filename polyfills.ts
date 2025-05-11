import { getRandomValues as expoCryptoGetRandomValues } from "expo-crypto";

// eslint-disable-next-line @typescript-eslint/no-require-imports
global.Buffer = require('buffer').Buffer;

// eslint-disable-next-line @typescript-eslint/no-require-imports
global.TextEncoder = require("text-encoding").TextEncoder;

// getRandomValues polyfill
class Crypto {
    getRandomValues = expoCryptoGetRandomValues;
}

const webCrypto = typeof crypto !== "undefined" ? crypto : new Crypto();

(() => {
    if (typeof crypto === "undefined") {
        Object.defineProperty(window, "crypto", {
            configurable: true,
            enumerable: true,
            get: () => webCrypto,
        });
    }
})();