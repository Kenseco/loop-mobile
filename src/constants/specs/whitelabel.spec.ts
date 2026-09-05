// Guards for the Loop white-label: these catch upstream merges that bring
// vendor branding back into user-visible places.
import fs from 'fs';
import path from 'path';
import appConfig from '../../../app.config';
import { settingsSlice } from '@/store/settings/settingsSlice';
import { selectIsChatwootCloud } from '@/store/settings/settingsSelectors';
import { RootState } from '@/store';

jest.mock('@sentry/react-native', () => ({ captureException: jest.fn() }));
jest.mock('react-native-permissions', () => jest.requireActual('react-native-permissions/mock'));
jest.mock('@react-native-firebase/messaging', () => jest.fn());
jest.mock('react-native-device-info', () => ({
  getSystemName: jest.fn(),
  getManufacturer: jest.fn(),
  getModel: jest.fn(),
  getApiLevel: jest.fn(),
  getBrand: jest.fn(),
  getBuildNumber: jest.fn(),
  getUniqueId: jest.fn(),
}));
jest.mock('@/i18n', () => ({ t: (key: string) => key }));
jest.mock('@/utils/toastUtils', () => ({ showToast: jest.fn() }));

const config = appConfig({ config: {} } as never);
const configJson = JSON.stringify(config).toLowerCase();

describe('app.config.ts', () => {
  it('is branded as Loop', () => {
    expect(config.name).toBe('Loop');
    expect(config.scheme).toBe('loopapp');
    expect(config.ios?.bundleIdentifier).toBe('app.axioagent.loop');
    expect(config.android?.package).toBe('app.axioagent.loop');
    expect(config.ios?.associatedDomains).toEqual(['applinks:loop.axioagent.app']);
  });

  it('deep-links to the Loop server only', () => {
    const hosts = (config.android?.intentFilters ?? [])
      .flatMap(filter => filter.data ?? [])
      .map(data => (Array.isArray(data) ? data : [data]))
      .flat()
      .map(data => data.host)
      .filter(Boolean);
    expect(hosts).toEqual(['loop.axioagent.app']);
  });

  it('carries no vendor identifiers', () => {
    expect(configJson).not.toContain('chatwoot');
  });
});

describe('settings defaults', () => {
  it('start at the Loop server', () => {
    const state = settingsSlice.getInitialState();
    expect(state.baseUrl).toBe('loop.axioagent.app');
    expect(state.installationUrl).toBe('https://loop.axioagent.app/');
    expect(state.webSocketUrl).toBe('wss://loop.axioagent.app/cable');
  });

  it('report a self-hosted (non-cloud) installation', () => {
    const state = { settings: settingsSlice.getInitialState() } as RootState;
    expect(selectIsChatwootCloud(state)).toBe(false);
  });
});

describe('locale files', () => {
  const dir = path.join(__dirname, '..', '..', 'i18n');
  const locales = fs.readdirSync(dir).filter(file => file.endsWith('.json'));

  it('cover the expected set of locales', () => {
    expect(locales.length).toBeGreaterThan(30);
    expect(locales).toEqual(expect.arrayContaining(['en.json', 'zh_TW.json']));
  });

  it.each(locales)('%s has no vendor wording', file => {
    const text = fs.readFileSync(path.join(dir, file), 'utf8');
    expect(text.toLowerCase()).not.toContain('chatwoot');
  });

  it('en and zh_TW keep the placeholders of the version warning', () => {
    for (const file of ['en.json', 'zh_TW.json']) {
      const json = JSON.parse(fs.readFileSync(path.join(dir, file), 'utf8'));
      expect(json.SERVER_UPGRADE.WARNING_FOR_ADMIN).toContain('%{minimumVersion}');
      expect(json.CONFIGURE_URL.DESCRIPTION).toContain('loop.axioagent.app');
    }
  });
});
