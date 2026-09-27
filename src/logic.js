/*
 * Device selection and button routing for the Omni Remote card.
 * Pure functions with no DOM access, so they can be tested in Node.
 */

export const DEFAULT_COMMANDS = {
  up: "up",
  down: "down",
  left: "left",
  right: "right",
  select: "select",
  back: "menu",
  home: "home",
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
  device.commands = { ...DEFAULT_COMMANDS, ...(device.commands || {}) };
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
 *
 * @param {Array} devices  normalised devices, in priority order
 * @param {Object} states  hass.states
 * @param {Object} [opts]  { pinned: entity id, tiers: array of state arrays }
 * @returns the chosen device or null when the list is empty
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
 * Build the service call a button should make for a given device.
 * Returns { domain, service, data } or null when the button does not apply.
 */
export function buildServiceCall(action, device, states) {
  if (!device) return null;
  const player = device.entity;
  const volumeTarget = device.volume_entity || player;
  const volumeState = states && states[volumeTarget];

  switch (action) {
    case "power": {
      const st = states && states[player];
      const off = !st || st.state === "off" || st.state === "standby";
      return {
        domain: "media_player",
        service: off ? "turn_on" : "turn_off",
        data: { entity_id: player },
      };
    }
    case "play_pause":
      return { domain: "media_player", service: "media_play_pause", data: { entity_id: player } };
    case "previous":
      return { domain: "media_player", service: "media_previous_track", data: { entity_id: player } };
    case "next":
      return { domain: "media_player", service: "media_next_track", data: { entity_id: player } };
    case "volume_up":
      return { domain: "media_player", service: "volume_up", data: { entity_id: volumeTarget } };
    case "volume_down":
      return { domain: "media_player", service: "volume_down", data: { entity_id: volumeTarget } };
    case "mute": {
      const muted = !!(volumeState && volumeState.attributes && volumeState.attributes.is_volume_muted);
      return {
        domain: "media_player",
        service: "volume_mute",
        data: { entity_id: volumeTarget, is_volume_muted: !muted },
      };
    }
    case "up":
    case "down":
    case "left":
    case "right":
    case "select":
    case "back":
    case "home": {
      if (!device.remote) return null;
      const command = (device.commands || DEFAULT_COMMANDS)[action];
      if (!command) return null;
      return {
        domain: "remote",
        service: "send_command",
        data: { entity_id: device.remote, command },
      };
    }
    default:
      return null;
  }
}
