const KEYS = {
  SOUND_ENABLED: "tradeos_notify_sound",
  TP_ENABLED: "tradeos_notify_tp",
  SL_ENABLED: "tradeos_notify_sl",
  BE_ENABLED: "tradeos_notify_be",
};

const DEFAULTS = {
  soundEnabled: true,
  tpEnabled: true,
  slEnabled: true,
  beEnabled: true,
};

function get(key, fallback) {
  const val = localStorage.getItem(key);
  return val !== null ? val === "true" : fallback;
}

export function getNotificationSettings() {
  return {
    soundEnabled: get(KEYS.SOUND_ENABLED, DEFAULTS.soundEnabled),
    tpEnabled: get(KEYS.TP_ENABLED, DEFAULTS.tpEnabled),
    slEnabled: get(KEYS.SL_ENABLED, DEFAULTS.slEnabled),
    beEnabled: get(KEYS.BE_ENABLED, DEFAULTS.beEnabled),
  };
}

export function setNotificationSettings(settings) {
  Object.entries(KEYS).forEach(([key, storageKey]) => {
    if (key in settings) {
      localStorage.setItem(storageKey, settings[key]);
    }
  });
}
