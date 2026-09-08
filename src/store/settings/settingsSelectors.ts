import { createSelector } from '@reduxjs/toolkit';
import { RootState } from '@/store';
import { isCloudInstallation } from '@/constants/branding';
import { resolveDeviceLocale } from '@/i18n/deviceLocale';

export const selectSettings = (state: RootState) => state.settings;

export const selectInstallationUrl = createSelector(
  selectSettings,
  settings => settings.installationUrl,
);

// Until the user picks a language explicitly, follow the device language.
export const selectLocale = createSelector(selectSettings, settings => {
  const locale = settings.uiFlags.isLocaleSet ? settings.localeValue : resolveDeviceLocale();
  return locale === 'zh' ? 'zh_CN' : locale;
});

export const selectIsLocaleSet = createSelector(
  selectSettings,
  settings => settings.uiFlags.isLocaleSet,
);

export const selectIsSettingUrl = createSelector(
  selectSettings,
  settings => settings.uiFlags.isSettingUrl,
);

export const selectBaseUrl = createSelector(selectSettings, settings => settings.baseUrl);

export const selectNotificationSettings = createSelector(
  selectSettings,
  settings => settings.notificationSettings,
);

export const selectWebSocketUrl = createSelector(selectSettings, settings => settings.webSocketUrl);

export const selectTheme = createSelector(selectSettings, settings => settings.theme);

export const selectIsChatwootCloud = createSelector(selectSettings, settings =>
  isCloudInstallation(settings.installationUrl),
);

export const selectChatwootVersion = createSelector(selectSettings, settings => settings.version);

export const selectPushToken = createSelector(selectSettings, settings => settings.pushToken);
