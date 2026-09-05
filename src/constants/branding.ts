// White-label settings for the Loop build.
//
// Everything that ties the app to a specific deployment lives here so the
// rest of the code base stays identical to upstream chatwoot-mobile-app.
// Values can be overridden per build through EXPO_PUBLIC_* variables.

// Host of the Loop server pre-filled on the "configure URL" screen.
// Leave EXPO_PUBLIC_DEFAULT_INSTALLATION_HOST empty to force manual entry.
export const DEFAULT_INSTALLATION_HOST: string =
  process.env.EXPO_PUBLIC_DEFAULT_INSTALLATION_HOST ?? 'loop.axioagent.app';

export const DEFAULT_INSTALLATION_URL: string = DEFAULT_INSTALLATION_HOST
  ? `https://${DEFAULT_INSTALLATION_HOST}/`
  : '';

export const DEFAULT_WEBSOCKET_URL: string = DEFAULT_INSTALLATION_HOST
  ? `wss://${DEFAULT_INSTALLATION_HOST}/cable`
  : '';

// Hosts that count as the vendor's own cloud (enables SSO button, "cloud" label).
// Loop has no hosted cloud, so this is empty unless a build sets it.
export const CLOUD_HOSTS: string[] = String(process.env.EXPO_PUBLIC_CLOUD_HOSTS ?? '')
  .split(',')
  .map((host: string) => host.trim())
  .filter(Boolean);

export const isCloudInstallation = (installationUrl: string): boolean =>
  CLOUD_HOSTS.some(host => installationUrl.includes(host));

// "Read docs" entry in Settings → Support. Hidden when empty.
export const HELP_URL: string = process.env.EXPO_PUBLIC_HELP_URL ?? '';

// Name reported to the server in the X-Chatwoot-Client-Name header.
export const CLIENT_NAME: string = 'Loop Mobile';
