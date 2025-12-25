# Manual testing notes

- Install deps: `npm install`
- Start dev server: `npm run dev`
- The app expects `window.storage` for persistence; localStorage is used as fallback.
- To test wallet flows, either use a browser with MetaMask available or mock `window.ethereum` in the console:

```js
window.ethereum = {
  request: async ({ method }) => {
    if (method === 'eth_requestAccounts') return ['0x1234...abcd']
    if (method === 'eth_chainId') return '0xa86a'
  }
}
```

- The project is tailwind-based; edit `src/index.css` to change theme.
