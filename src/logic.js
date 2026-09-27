/*
 * Device selection and button routing for the Omni Remote card.
 * Pure functions with no DOM access, so they can be tested in Node.
 */

// Bits of the media_player supported_features attribute.
export const FEATURES = {
  PAUSE: 1,
  VOLUME_SET: 4,
  VOLUME_MUTE: 8,
  PREVIOUS_TRACK: 16,
  NEXT_TRACK: 32,
  TURN_ON: 128,
  TURN_OFF: 256,
  VOLUME_STEP: 1024,
  SELECT_SOURCE: 2048,
  STOP: 4096,
  PLAY: 16384,
};

export const DPAD_KEYS = ["up", "down", "left", "right", "select", "back", "home", "menu"];

/*
 * Navigation presets. Each one says which service to call, whether it goes to the
 * remote entity or the media player itself, which field carries the key, and the
 * key names that integration understands.
 */
export const PRESETS = {
  generic: {
    label: "Generic remote",
    service: "remote.send_command",
    target: "remote",
    field: "command",
    keys: { up: "up", down: "down", left: "left", right: "right", select: "select", back: "back", home: "home", menu: "menu" },
  },
  apple_tv: {
    label: "Apple TV",
    service: "remote.send_command",
    target: "remote",
    field: "command",
    keys: { up: "up", down: "down", left: "left", right: "right", select: "select", back: "menu", home: "home", menu: "top_menu" },
  },
  android_tv: {
    label: "Android TV / Google TV / Shield (Android TV Remote)",
    service: "remote.send_command",
    target: "remote",
    field: "command",
    keys: { up: "DPAD_UP", down: "DPAD_DOWN", left: "DPAD_LEFT", right: "DPAD_RIGHT", select: "DPAD_CENTER", back: "BACK", home: "HOME", menu: "MENU" },
  },
  android_adb: {
    label: "Android TV / Fire TV (ADB)",
    service: "androidtv.adb_command",
    target: "player",
    field: "command",
    keys: { up: "UP", down: "DOWN", left: "LEFT", right: "RIGHT", select: "CENTER", back: "BACK", home: "HOME", menu: "MENU" },
  },
  roku: {
    label: "Roku",
    service: "remote.send_command",
    target: "remote",
    field: "command",
    keys: { up: "up", down: "down", left: "left", right: "right", select: "select", back: "back", home: "home", menu: "info" },
  },
  lg_webos: {
    label: "LG webOS TV",
    service: "webostv.button",
    target: "player",
    field: "button",
    keys: { up: "UP", down: "DOWN", left: "LEFT", right: "RIGHT", select: "ENTER", back: "BACK", home: "HOME", menu: "MENU" },
  },
  samsung_tv: {
    label: "Samsung TV",
    service: "remote.send_command",
    target: "remote",
    field: "command",
    keys: { up: "KEY_UP", down: "KEY_DOWN", left: "KEY_LEFT", right: "KEY_RIGHT", select: "KEY_ENTER", back: "KEY_RETURN", home: "KEY_HOME", menu: "KEY_MENU" },
  },
  sony_bravia: {
    label: "Sony Bravia",
    service: "remote.send_command",
    target: "remote",
    field: "command",
    keys: { up: "Up", down: "Down", left: "Left", right: "Right", select: "Confirm", back: "Return", home: "Home", menu: "Options" },
  },
  philips_tv: {
    label: "Philips TV",
    service: "remote.send_command",
    target: "remote",
    field: "command",
    keys: { up: "CursorUp", down: "CursorDown", left: "CursorLeft", right: "CursorRight", select: "Confirm", back: "Back", home: "Home", menu: "Options" },
  },
  kodi: {
    label: "Kodi",
    service: "kodi.call_method",
    target: "player",
    field: "method",
    keys: { up: "Input.Up", down: "Input.Down", left: "Input.Left", right: "Input.Right", select: "Input.Select", back: "Input.Back", home: "Input.Home", menu: "Input.ContextMenu" },
  },
};

// Home Assistant integration (entity registry platform) to preset.
export const INTEGRATION_PRESETS = {
  apple_tv: "apple_tv",
  androidtv_remote: "android_tv",
  androidtv: "android_adb",
  roku: "roku",
  webostv: "lg_webos",
  samsungtv: "samsung_tv",
  braviatv: "sony_bravia",
  philips_js: "philips_tv",
  kodi: "kodi",
};

export const DEFAULT_TIERS = [
  ["playing", "buffering"],
  ["paused"],
  ["on", "idle"],
];

export const DOMAIN_ICONS = {
  tv: "mdi:television",
  speaker: "mdi:speaker",
  receiver: "mdi:audio-video",
};

const OFF_STATES = ["off", "standby", "unavailable", "unknown"];

/**
 * Normalise a device entry from the card config.
 * Accepts either a plain entity id string or an object.
 */
export function normalizeDevice(entry) {
  const device = typeof entry === "string" ? { entity: entry } : { ...entry };
  if (!device.entity || !String(device.entity).startsWith("media_player.")) {
    throw new Error(
      `Omni Remote: every item in "entities" needs a media_player entity (got ${JSON.stringify(entry)})`
    );
  }
  if (device.platform && device.platform !== "auto" && !PRESETS[device.platform]) {
    throw new Error(
      `Omni Remote: unknown platform "${device.platform}" for ${device.entity}. Use one of: auto, ${Object.keys(PRESETS).join(", ")}`
    );
  }
  return device;
}

/**
 * Pick the device the remote should control.
 *
 * Rules, in order:
 *   1. A device the user pinned by tapping its chip wins, as long as it is still in the list.
 *   2. Otherwise walk the state tiers (playing, then paused, then merely on).
 *      Within a tier the order of the "entities" list is the priority.
 *   3. If nothing is on, fall back to the first device so power can turn it on.
 */
export function pickActiveDevice(devices, states, opts = {}) {
  if (!devices || devices.length === 0) return null;
  const { pinned, tiers = DEFAULT_TIERS } = opts;

  if (pinned) {
    const pin = devices.find((d) => d.entity === pinned);
    if (pin) return pin;
  }

  for (const tier of tiers) {
    const hit = devices.find((d) => {
      const st = states && states[d.entity];
      return st && tier.includes(st.state);
    });
    if (hit) return hit;
  }
  return devices[0];
}

/**
 * Work out how to navigate a device: which preset applies and which remote entity to use.
 * With platform "auto" (the default) the integration is read from the entity registry,
 * and a remote entity on the same device is found automatically.
 */
export function resolveDevice(device, hass) {
  const entities = (hass && hass.entities) || {};
  const entry = entities[device.entity];

  let presetKey = device.platform && device.platform !== "auto" ? device.platform : null;
  if (!presetKey && entry && INTEGRATION_PRESETS[entry.platform]) {
    presetKey = INTEGRATION_PRESETS[entry.platform];
  }

  let remote = device.remote || null;
  if (!remote && entry && entry.device_id) {
    const sibling = Object.values(entities).find(
      (e) => e.device_id === entry.device_id && e.entity_id && e.entity_id.startsWith("remote.")
    );
    if (sibling) remote = sibling.entity_id;
  }

  if (!presetKey && remote) presetKey = "generic";
  const preset = presetKey ? PRESETS[presetKey] : null;
  const keys = preset ? { ...preset.keys, ...(device.commands || {}) } : { ...(device.commands || {}) };
  const dpad = !!preset && (preset.target === "player" || !!remote);
  return { presetKey, preset, remote, keys, dpad };
}

/** True when the entity advertises the feature. Unknown feature sets count as supported. */
export function supports(stateObj, feature) {
  if (!stateObj || !stateObj.attributes) return true;
  const bits = stateObj.attributes.supported_features;
  if (bits === undefined || bits === null) return true;
  return (bits & feature) !== 0;
}

/**
 * Which buttons make sense for this device. Anything with a custom action is always shown.
 */
export function availableButtons(device, hass, resolved = resolveDevice(device, hass)) {
  const states = (hass && hass.states) || {};
  const player = states[device.entity];
  const vol = states[device.volume_entity || device.entity];
  const custom = device.actions || {};
  const hide = new Set(device.hide || []);
  const show = new Set();
  const add = (key, ok) => {
    if (!hide.has(key) && (ok || custom[key])) show.add(key);
  };

  add("power", supports(player, FEATURES.TURN_ON | FEATURES.TURN_OFF) || !!resolved.remote);
  add("previous", supports(player, FEATURES.PREVIOUS_TRACK));
  add("play_pause", supports(player, FEATURES.PAUSE | FEATURES.PLAY));
  add("next", supports(player, FEATURES.NEXT_TRACK));
  const stepVolume = supports(vol, FEATURES.VOLUME_STEP | FEATURES.VOLUME_SET);
  add("volume_down", stepVolume);
  add("volume_up", stepVolume);
  add("mute", supports(vol, FEATURES.VOLUME_MUTE));
  const hasLevel = !!(vol && vol.attributes && typeof vol.attributes.volume_level === "number");
  add("volume_set", hasLevel && supports(vol, FEATURES.VOLUME_SET));
  const sources = player && player.attributes && player.attributes.source_list;
  add("source", supports(player, FEATURES.SELECT_SOURCE) && Array.isArray(sources) && sources.length > 0);
  for (const key of DPAD_KEYS) add(key, resolved.dpad && !!resolved.keys[key]);
  return show;
}

function splitService(name) {
  const [domain, ...rest] = String(name).split(".");
  return { domain, service: rest.join(".") };
}

/** Turn a user supplied action ({service|action|perform_action, data, target}) into a call. */
export function customCall(action) {
  const name = action && (action.perform_action || action.service || action.action);
  if (!name || !String(name).includes(".")) return null;
  return { ...splitService(name), data: { ...(action.target || {}), ...(action.data || {}) } };
}

/**
 * Build the service call a button should make for a given device.
 * Returns { domain, service, data } or null when the button does not apply.
 * `value` carries the level for volume_set and the source name for source.
 */
export function buildServiceCall(action, device, hass, value, resolved) {
  if (!device) return null;
  if (device.actions && device.actions[action]) return customCall(device.actions[action]);

  const states = (hass && hass.states) || {};
  const r = resolved || resolveDevice(device, hass);
  const player = device.entity;
  const volumeTarget = device.volume_entity || player;
  const mp = (service, data) => ({ domain: "media_player", service, data });

  switch (action) {
    case "power": {
      const st = states[player];
      const off = !st || OFF_STATES.includes(st.state);
      const wanted = off ? FEATURES.TURN_ON : FEATURES.TURN_OFF;
      if (!supports(st, wanted) && r.remote) {
        return { domain: "remote", service: off ? "turn_on" : "turn_off", data: { entity_id: r.remote } };
      }
      return mp(off ? "turn_on" : "turn_off", { entity_id: player });
    }
    case "play_pause":
      return mp("media_play_pause", { entity_id: player });
    case "previous":
      return mp("media_previous_track", { entity_id: player });
    case "next":
      return mp("media_next_track", { entity_id: player });
    case "volume_up":
      return mp("volume_up", { entity_id: volumeTarget });
    case "volume_down":
      return mp("volume_down", { entity_id: volumeTarget });
    case "mute": {
      const vs = states[volumeTarget];
      const muted = !!(vs && vs.attributes && vs.attributes.is_volume_muted);
      return mp("volume_mute", { entity_id: volumeTarget, is_volume_muted: !muted });
    }
    case "volume_set": {
      const level = Math.min(1, Math.max(0, Number(value)));
      if (Number.isNaN(level)) return null;
      return mp("volume_set", { entity_id: volumeTarget, volume_level: level });
    }
    case "source":
      if (!value) return null;
      return mp("select_source", { entity_id: player, source: value });
    default: {
      if (!DPAD_KEYS.includes(action) || !r.dpad) return null;
      const key = r.keys[action];
      if (!key) return null;
      const target = r.preset.target === "player" ? player : r.remote;
      return { ...splitService(r.preset.service), data: { entity_id: target, [r.preset.field]: key } };
    }
  }
}
