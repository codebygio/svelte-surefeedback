# Svelte SureFeedback

A Svelte wrapper component for SureFeedback (ProjectHuddle) that provides seamless integration with your Svelte applications.

## Installation

```bash
npm install svelte-surefeedback
```

## Features

- 🚀 Easy integration with Svelte applications
- 🔒 Type-safe with full TypeScript support
- 🎯 Automatic script loading and cleanup
- 🔄 Token persistence management
- 🐛 Debug mode for troubleshooting
- ⏱️ Configurable timeout handling
- 🎭 Event callbacks for load and error states

## Usage

Basic usage:

```svelte
<script>
  import { SureFeedback } from 'svelte-surefeedback';
</script>

<SureFeedback 
  url="//feedback.mindhyv.com/?p=YOUR_PROJECT_ID&ph_apikey=YOUR_API_KEY" 
/>
```

Advanced usage with all options:

```svelte
<script>
  import { SureFeedback } from 'svelte-surefeedback';

  function handleError(error) {
    console.error('SureFeedback error:', error);
  }

  function handleLoaded() {
    console.log('SureFeedback loaded successfully');
  }
</script>

<SureFeedback 
  url="//feedback.mindhyv.com/?p=YOUR_PROJECT_ID&ph_apikey=YOUR_API_KEY"
  enabled={true}
  debug={true}
  timeout={15000}
  persistToken={true}
  tokenKey="ph_access_token"
  onError={handleError}
  onLoaded={handleLoaded}
/>
```

## Configuration Options

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `url` | `string` | Required | The SureFeedback URL with your project ID and API key |
| `enabled` | `boolean` | `true` | Enable/disable the feedback widget |
| `debug` | `boolean` | `false` | Enable debug mode for detailed logging |
| `timeout` | `number` | `10000` | Script loading timeout in milliseconds |
| `persistToken` | `boolean` | `true` | Whether to persist the access token in localStorage |
| `tokenKey` | `string` | `'ph_access_token'` | Custom key for storing the token |
| `onError` | `(error: string) => void` | `undefined` | Callback function for error handling |
| `onLoaded` | `() => void` | `undefined` | Callback function when script loads successfully |

## Error Handling

The component includes built-in error handling for:
- Invalid URLs
- Missing required parameters
- Script loading failures
- Timeout issues
- LocalStorage access problems

Errors are displayed in a clear message and can be caught using the `onError` callback.

## Debug Mode

When debug mode is enabled, the component will log detailed information about:
- Script loading process
- Token management
- Error states
- Cleanup operations

Enable debug mode during development:

```svelte
<SureFeedback 
  url="your-url"
  debug={true}
/>
```

## TypeScript Support

The package includes full TypeScript definitions. You can import types:

```typescript
import type { SureFeedbackProps } from 'svelte-surefeedback';
```

## Requirements

- Svelte 5.x
- SureFeedback/ProjectHuddle account and API credentials

## License

MIT

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.