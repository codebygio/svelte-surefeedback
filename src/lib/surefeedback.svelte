<script lang="ts">
	import { onMount } from 'svelte';
	import { BROWSER } from 'esm-env';

	interface SureFeedbackProps {
		url: string;
		enabled?: boolean;
		debug?: boolean;
		timeout?: number;
		persistToken?: boolean;
		tokenKey?: string;
		onError?: (error: string) => void;
		onLoaded?: () => void;
	}

	let {
		url,
		enabled = true,
		debug = false,
		timeout = 10000,
		persistToken = true,
		tokenKey = 'ph_access_token',
		onError,
		onLoaded
	}: SureFeedbackProps = $props();

	let scriptLoaded = $state(false);
	let scriptId = `huddle-script-${Math.random().toString(36).substring(7)}`;
	let validationError: string | null = $state(null);

	const REQUIRED_PARAMS = [
		{ key: 'p', name: 'Project ID' },
		{ key: 'ph_apikey', name: 'API Key' }
	] as const;

	function log(...args: unknown[]) {
		if (debug) {
			console.log('[SureFeedback]', ...args);
		}
	}

	function validateUrl(urlString: string): string | null {
		try {
			if (!urlString) {
				return 'No URL provided';
			}

			const normalizedUrl = urlString.startsWith('//') ? `https:${urlString}` : urlString;

			const urlObj = new URL(normalizedUrl);
			const params = new URLSearchParams(urlObj.search);

			for (const { key, name } of REQUIRED_PARAMS) {
				if (!params.has(key) || !params.get(key)) {
					return `Missing ${name} (${key})`;
				}
			}

			if (!urlObj.hostname) {
				return 'Invalid URL structure: missing hostname';
			}

			return null;
		} catch (error) {
			return 'Invalid URL format';
		}
	}

	function handleError(error: string) {
		validationError = error;
		onError?.(error);
		log('Error:', error);
	}

	async function loadHuddleScript(): Promise<boolean> {
		try {
			const error = validateUrl(url);
			if (error) {
				handleError(error);
				return false;
			}

			// Check for existing script
			const existingScript = document.getElementById(scriptId);
			if (existingScript) {
				log('Script already loaded');
				scriptLoaded = true;
				onLoaded?.();
				return true;
			}

			let token: string | null = null;
			try {
				const tokenFromUrl = new URLSearchParams(window.location.search).get(tokenKey);
				if (tokenFromUrl && persistToken) {
					localStorage.setItem(tokenKey, tokenFromUrl);
					log('Token stored from URL');
				}
				token = localStorage.getItem(tokenKey);
			} catch (e) {
				log('LocalStorage not available:', e);
			}

			// Create script element
			const script = document.createElement('script');
			script.id = scriptId;
			script.type = 'text/javascript';
			script.async = true;
			script.defer = true;

			// Build URL with timestamp and token
			script.src = `${url}&v=${new Date().getTime()}${token ? `&${tokenKey}=${token}` : ''}`;

			// Load script with timeout
			const success = await new Promise<boolean>((resolve) => {
				const timeoutId = setTimeout(() => {
					handleError('Script loading timed out');
					resolve(false);
				}, timeout);

				script.onload = () => {
					clearTimeout(timeoutId);
					log('Script loaded successfully');
					resolve(true);
				};

				script.onerror = () => {
					clearTimeout(timeoutId);
					handleError('Failed to load script');
					resolve(false);
				};

				document.head.appendChild(script);
			});

			if (success) {
				scriptLoaded = true;
				validationError = null;
				onLoaded?.();
			}

			return success;
		} catch (error) {
			handleError('Failed to load Huddle script');
			return false;
		}
	}

	function cleanupScript(): void {
		if (BROWSER) {
			const script = document.getElementById(scriptId);
			if (script && script.parentNode) {
				script.parentNode.removeChild(script);
				scriptLoaded = false;
				log('Script cleaned up');
			}
		}
	}

	onMount(() => {
		if (BROWSER && enabled && url) {
			log('Initializing SureFeedback');
			loadHuddleScript();
		}

		return () => {
			if (BROWSER && enabled) {
				cleanupScript();
			}
		};
	});
</script>

{#if BROWSER && enabled}
	{#if validationError}
		<div
			role="alert"
			class="huddle-error"
			data-error-type="validation"
			aria-label="Huddle configuration error"
		>
			Configuration Error: {validationError}
		</div>
	{:else if url}
		<div
			data-huddle-container
			data-script-id={scriptId}
			data-status={scriptLoaded ? 'loaded' : 'loading'}
			data-debug={debug}
			aria-hidden="true"
		></div>
	{/if}
{/if}
