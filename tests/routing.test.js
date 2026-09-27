import { test } from "node:test";
import assert from "node:assert/strict";
import {
  normalizeDevice,
  pickActiveDevice,
  resolveDevice,
  availableButtons,
  buildServiceCall,
  FEATURES,
  PRESETS,
} from "../src/logic.js";

const s = (state, attributes = {}) => ({ state, attributes });
const ALL = Object.values(FEATURES).reduce((a, b) => a | b, 0);

const devices = [
  { entity: "media_player.living_room_tv", remote: "remote.living_room_tv", platform: "apple_tv", volume_entity: "media_player.soundbar" },
  { entity: "media_player.kitchen_speakers" },
  { entity: "media_player.bedroom" },
].map(normalizeDevice);

const hassOf = (states, entities = {}) => ({ states, entities });

test("playing device wins over a higher-priority paused device", () => {
  const states = {
    "media_player.living_room_tv": s("paused"),
    "media_player.kitchen_speakers": s("playing"),
    "media_player.bedroom": s("off"),
  };
  assert.equal(pickActiveDevice(devices, states).entity, "media_player.kitchen_speakers");
});

test("list order breaks ties inside the same tier", () => {
  const states = {
    "media_player.living_room_tv": s("playing"),
    "media_player.kitchen_speakers": s("playing"),
  };
  assert.equal(pickActiveDevice(devices, states).entity, "media_player.living_room_tv");
});

test("paused beats merely on, on beats off", () => {
  assert.equal(
    pickActiveDevice(devices, { "media_player.living_room_tv": s("on"), "media_player.bedroom": s("paused") }).entity,
    "media_player.bedroom"
  );
  assert.equal(
    pickActiveDevice(devices, { "media_player.living_room_tv": s("off"), "media_player.kitchen_speakers": s("idle") }).entity,
    "media_player.kitchen_speakers"
  );
});

test("falls back to the first device when everything is off or missing", () => {
  assert.equal(pickActiveDevice(devices, { "media_player.bedroom": s("unavailable") }).entity, "media_player.living_room_tv");
  assert.equal(pickActiveDevice([], {}), null);
});

test("a pinned device overrides the automatic choice, unknown pins are ignored", () => {
  const states = { "media_player.kitchen_speakers": s("playing") };
  assert.equal(pickActiveDevice(devices, states, { pinned: "media_player.bedroom" }).entity, "media_player.bedroom");
  assert.equal(pickActiveDevice(devices, states, { pinned: "media_player.gone" }).entity, "media_player.kitchen_speakers");
});

test("volume goes to volume_entity when set, else to the player", () => {
  assert.deepEqual(buildServiceCall("volume_up", devices[0], hassOf({})), {
    domain: "media_player", service: "volume_up", data: { entity_id: "media_player.soundbar" },
  });
  assert.equal(buildServiceCall("volume_down", devices[1], hassOf({})).data.entity_id, "media_player.kitchen_speakers");
});

test("mute toggles based on the volume target's current state", () => {
  const call = buildServiceCall("mute", devices[0], hassOf({ "media_player.soundbar": s("on", { is_volume_muted: true }) }));
  assert.deepEqual(call.data, { entity_id: "media_player.soundbar", is_volume_muted: false });
});

test("volume slider and source picker build the right calls", () => {
  assert.deepEqual(buildServiceCall("volume_set", devices[1], hassOf({}), 0.42).data, {
    entity_id: "media_player.kitchen_speakers", volume_level: 0.42,
  });
  assert.equal(buildServiceCall("volume_set", devices[1], hassOf({}), 7).data.volume_level, 1);
  assert.deepEqual(buildServiceCall("source", devices[1], hassOf({}), "Spotify").data, {
    entity_id: "media_player.kitchen_speakers", source: "Spotify",
  });
});

test("power turns on when off and off when on, falling back to the remote", () => {
  const h = (st) => hassOf({ "media_player.kitchen_speakers": st });
  assert.equal(buildServiceCall("power", devices[1], h(s("off"))).service, "turn_on");
  assert.equal(buildServiceCall("power", devices[1], h(s("playing"))).service, "turn_off");
  const noPower = hassOf({ "media_player.living_room_tv": s("off", { supported_features: FEATURES.PAUSE }) });
  assert.deepEqual(buildServiceCall("power", devices[0], noPower), {
    domain: "remote", service: "turn_on", data: { entity_id: "remote.living_room_tv" },
  });
});

test("every preset routes the d-pad to the right service and key", () => {
  const expected = {
    apple_tv: ["remote", "send_command", "remote.x", "command", "up", "menu"],
    android_tv: ["remote", "send_command", "remote.x", "command", "DPAD_UP", "BACK"],
    android_adb: ["androidtv", "adb_command", "media_player.x", "command", "UP", "BACK"],
    roku: ["remote", "send_command", "remote.x", "command", "up", "back"],
    lg_webos: ["webostv", "button", "media_player.x", "button", "UP", "BACK"],
    samsung_tv: ["remote", "send_command", "remote.x", "command", "KEY_UP", "KEY_RETURN"],
    sony_bravia: ["remote", "send_command", "remote.x", "command", "Up", "Return"],
    philips_tv: ["remote", "send_command", "remote.x", "command", "CursorUp", "Back"],
    kodi: ["kodi", "call_method", "media_player.x", "method", "Input.Up", "Input.Back"],
    generic: ["remote", "send_command", "remote.x", "command", "up", "back"],
  };
  assert.deepEqual(Object.keys(expected).sort(), Object.keys(PRESETS).sort());
  for (const [platform, [domain, service, target, field, up, back]] of Object.entries(expected)) {
    const d = normalizeDevice({ entity: "media_player.x", remote: "remote.x", platform });
    const upCall = buildServiceCall("up", d, hassOf({}));
    assert.deepEqual(upCall, { domain, service, data: { entity_id: target, [field]: up } }, platform);
    assert.equal(buildServiceCall("back", d, hassOf({})).data[field], back, platform);
  }
});

test("platform and remote are detected from the entity registry", () => {
  const entities = {
    "media_player.shield": { entity_id: "media_player.shield", platform: "androidtv_remote", device_id: "dev1" },
    "remote.shield": { entity_id: "remote.shield", platform: "androidtv_remote", device_id: "dev1" },
    "remote.other": { entity_id: "remote.other", platform: "roku", device_id: "dev2" },
  };
  const r = resolveDevice(normalizeDevice("media_player.shield"), hassOf({}, entities));
  assert.equal(r.presetKey, "android_tv");
  assert.equal(r.remote, "remote.shield");
  assert.equal(r.dpad, true);
});

test("player-only presets need no remote, speakers get no d-pad", () => {
  const entities = { "media_player.lg": { entity_id: "media_player.lg", platform: "webostv", device_id: "d" } };
  const lg = resolveDevice(normalizeDevice("media_player.lg"), hassOf({}, entities));
  assert.equal(lg.dpad, true);
  assert.equal(lg.remote, null);
  const sonos = resolveDevice(normalizeDevice("media_player.sonos"), hassOf({}, {
    "media_player.sonos": { entity_id: "media_player.sonos", platform: "sonos", device_id: "s" },
  }));
  assert.equal(sonos.dpad, false);
  assert.equal(buildServiceCall("up", normalizeDevice("media_player.sonos"), hassOf({})), null);
});

test("commands override preset keys", () => {
  const d = normalizeDevice({ entity: "media_player.x", remote: "remote.x", platform: "roku", commands: { menu: "options" } });
  assert.equal(buildServiceCall("menu", d, hassOf({})).data.command, "options");
  assert.equal(buildServiceCall("up", d, hassOf({})).data.command, "up");
});

test("buttons follow supported_features", () => {
  const speaker = normalizeDevice("media_player.radio");
  const onlyVolume = FEATURES.VOLUME_SET | FEATURES.VOLUME_MUTE | FEATURES.PLAY | FEATURES.PAUSE | FEATURES.TURN_ON | FEATURES.TURN_OFF;
  const show = availableButtons(speaker, hassOf({ "media_player.radio": s("playing", { supported_features: onlyVolume, volume_level: 0.3 }) }));
  assert.ok(show.has("play_pause") && show.has("volume_up") && show.has("mute") && show.has("volume_set"));
  assert.ok(!show.has("next") && !show.has("previous") && !show.has("source") && !show.has("up"));

  const full = availableButtons(speaker, hassOf({
    "media_player.radio": s("on", { supported_features: ALL, source_list: ["TV", "Spotify"], volume_level: 0.5 }),
  }));
  assert.ok(full.has("next") && full.has("source"));
});

test("unknown feature sets show the standard buttons", () => {
  const show = availableButtons(normalizeDevice("media_player.mystery"), hassOf({}));
  assert.ok(show.has("play_pause") && show.has("volume_up") && show.has("power"));
  assert.ok(!show.has("volume_set") && !show.has("source"));
});

test("hide removes buttons and custom actions override anything", () => {
  const d = normalizeDevice({
    entity: "media_player.tv",
    hide: ["next"],
    actions: {
      volume_up: { perform_action: "script.avr_volume_up", data: { step: 2 } },
      home: { service: "remote.send_command", target: { entity_id: "remote.hub" }, data: { command: "Home", device: "TV" } },
    },
  });
  const show = availableButtons(d, hassOf({}));
  assert.ok(!show.has("next"));
  assert.ok(show.has("home"));
  assert.deepEqual(buildServiceCall("volume_up", d, hassOf({})), { domain: "script", service: "avr_volume_up", data: { step: 2 } });
  assert.deepEqual(buildServiceCall("home", d, hassOf({})), {
    domain: "remote", service: "send_command", data: { entity_id: "remote.hub", command: "Home", device: "TV" },
  });
});

test("config validation", () => {
  assert.throws(() => normalizeDevice({ entity: "light.kitchen" }));
  assert.throws(() => normalizeDevice({ entity: "media_player.x", platform: "betamax" }));
  assert.equal(normalizeDevice("media_player.x").entity, "media_player.x");
});
