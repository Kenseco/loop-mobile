import { getLocales } from 'expo-localization';
import i18n from '@/i18n';

interface DeviceLocale {
  languageCode: string | null;
  languageScriptCode?: string | null;
  languageRegionCode?: string | null;
}

const TRADITIONAL_CHINESE_REGIONS = ['TW', 'HK', 'MO'];

const isSupported = (locale: string) => locale in i18n.translations;

// Maps one device locale onto a bundled translation key, or null when none fits.
const matchLocale = ({
  languageCode,
  languageScriptCode,
  languageRegionCode,
}: DeviceLocale): string | null => {
  if (!languageCode) return null;
  const language = languageCode.toLowerCase();
  const region = languageRegionCode?.toUpperCase() ?? '';

  if (language === 'zh') {
    const traditional =
      languageScriptCode?.toLowerCase() === 'hant' || TRADITIONAL_CHINESE_REGIONS.includes(region);
    return traditional ? 'zh_TW' : 'zh_CN';
  }
  if (region && isSupported(`${language}_${region}`)) return `${language}_${region}`;
  return isSupported(language) ? language : null;
};

// First device language (in the user's preference order) that the app has
// translations for; English when there is none.
export const resolveDeviceLocale = (locales: DeviceLocale[] = getLocales()): string => {
  for (const locale of locales) {
    const match = matchLocale(locale);
    if (match) return match;
  }
  return 'en';
};
