# cronscribe

> Convert natural language to cron expressions via a simple REST API and browser extension.

## Installation

```bash
npm install cronscribe
```

## Usage

### JavaScript / Node.js

```js
const cronscribe = require('cronscribe');

const expression = cronscribe.parse('every weekday at 9am');
console.log(expression); // → "0 9 * * 1-5"
```

### REST API

Start the local server:

```bash
npx cronscribe --serve --port 3000
```

Make a request:

```bash
curl -X POST http://localhost:3000/parse \
  -H "Content-Type: application/json" \
  -d '{"input": "every Monday at midnight"}'
```

Response:

```json
{
  "input": "every Monday at midnight",
  "cron": "0 0 * * 1"
}
```

### Browser Extension

Install the extension from the [Chrome Web Store](#) or [Firefox Add-ons](#), then click the cronscribe icon in your toolbar to convert natural language directly in your browser.

## Supported Phrases

| Natural Language | Cron Expression |
|---|---|
| every day at noon | `0 12 * * *` |
| every 5 minutes | `*/5 * * * *` |
| every weekday at 9am | `0 9 * * 1-5` |
| first day of every month | `0 0 1 * *` |

## Contributing

Pull requests are welcome. Please open an issue first to discuss any major changes.

## License

[MIT](LICENSE)