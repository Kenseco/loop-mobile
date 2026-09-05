const loadBranding = (env: Record<string, string | undefined>) => {
  jest.resetModules();
  const saved = { ...process.env };
  for (const key of Object.keys(process.env)) {
    if (key.startsWith('EXPO_PUBLIC_')) delete process.env[key];
  }
  Object.assign(process.env, env);
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  const branding = require('../branding');
  process.env = saved;
  return branding;
};

describe('branding defaults', () => {
  it('points at the Loop server when nothing is configured', () => {
    const b = loadBranding({});
    expect(b.DEFAULT_INSTALLATION_HOST).toBe('loop.axioagent.app');
    expect(b.DEFAULT_INSTALLATION_URL).toBe('https://loop.axioagent.app/');
    expect(b.DEFAULT_WEBSOCKET_URL).toBe('wss://loop.axioagent.app/cable');
    expect(b.HELP_URL).toBe('');
    expect(b.CLIENT_NAME).toBe('Loop Mobile');
  });

  it('treats no host as cloud by default (no SSO button, "self-hosted" label)', () => {
    const b = loadBranding({});
    expect(b.CLOUD_HOSTS).toEqual([]);
    expect(b.isCloudInstallation('https://loop.axioagent.app/')).toBe(false);
    expect(b.isCloudInstallation('https://app.chatwoot.com/')).toBe(false);
  });

  it('never mentions the upstream vendor', () => {
    const b = loadBranding({});
    for (const value of [b.DEFAULT_INSTALLATION_URL, b.DEFAULT_WEBSOCKET_URL, b.CLIENT_NAME]) {
      expect(value.toLowerCase()).not.toContain('chatwoot');
    }
  });
});

describe('branding overrides', () => {
  it('can blank the default host to force manual entry', () => {
    const b = loadBranding({ EXPO_PUBLIC_DEFAULT_INSTALLATION_HOST: '' });
    expect(b.DEFAULT_INSTALLATION_HOST).toBe('');
    expect(b.DEFAULT_INSTALLATION_URL).toBe('');
    expect(b.DEFAULT_WEBSOCKET_URL).toBe('');
  });

  it('reads cloud hosts as a trimmed comma list', () => {
    const b = loadBranding({
      EXPO_PUBLIC_CLOUD_HOSTS: ' cloud.example.com , other.example.com,, ',
    });
    expect(b.CLOUD_HOSTS).toEqual(['cloud.example.com', 'other.example.com']);
    expect(b.isCloudInstallation('https://cloud.example.com/')).toBe(true);
    expect(b.isCloudInstallation('https://loop.axioagent.app/')).toBe(false);
  });

  it('exposes the help URL when set', () => {
    const b = loadBranding({ EXPO_PUBLIC_HELP_URL: 'https://help.example.com' });
    expect(b.HELP_URL).toBe('https://help.example.com');
  });
});

describe('APP_SCHEME', () => {
  it('drives the SSO callback URL', () => {
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const { APP_SCHEME, SSO_CALLBACK_URL } = require('../index');
    expect(APP_SCHEME).toBe('loopapp');
    expect(SSO_CALLBACK_URL).toBe('loopapp://auth/saml');
  });
});
