import { resolveDeviceLocale } from '../deviceLocale';

jest.mock('expo-localization', () => ({
  getLocales: () => [{ languageCode: 'zh', languageScriptCode: 'Hant', languageRegionCode: 'TW' }],
}));

describe('resolveDeviceLocale', () => {
  it('reads the device locales when none are given', () => {
    expect(resolveDeviceLocale()).toBe('zh_TW');
  });

  it('maps Traditional Chinese by script or region', () => {
    expect(resolveDeviceLocale([{ languageCode: 'zh', languageScriptCode: 'Hant' }])).toBe('zh_TW');
    expect(resolveDeviceLocale([{ languageCode: 'zh', languageRegionCode: 'HK' }])).toBe('zh_TW');
  });

  it('maps other Chinese variants to Simplified', () => {
    expect(resolveDeviceLocale([{ languageCode: 'zh', languageRegionCode: 'CN' }])).toBe('zh_CN');
    expect(resolveDeviceLocale([{ languageCode: 'zh' }])).toBe('zh_CN');
  });

  it('prefers a regional translation when one is bundled', () => {
    expect(resolveDeviceLocale([{ languageCode: 'pt', languageRegionCode: 'BR' }])).toBe('pt_BR');
    expect(resolveDeviceLocale([{ languageCode: 'pt', languageRegionCode: 'PT' }])).toBe('pt');
  });

  it('falls back through the preference list to English', () => {
    expect(
      resolveDeviceLocale([
        { languageCode: 'xx' },
        { languageCode: 'ja', languageRegionCode: 'JP' },
      ]),
    ).toBe('ja');
    expect(resolveDeviceLocale([{ languageCode: 'xx' }])).toBe('en');
    expect(resolveDeviceLocale([])).toBe('en');
    expect(resolveDeviceLocale([{ languageCode: null }])).toBe('en');
  });
});
