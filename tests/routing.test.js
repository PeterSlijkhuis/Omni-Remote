import { test } from "node:test";
import assert from "node:assert/strict";
import { normalizeDevice, pickActiveDevice, buildServiceCall } from "../src/logic.js";

const devices = [
  { entity: "media_player.living_room_tv", remote: "remote.living_room_tv", volume_entity: "media_player.soundbar" },
  { entity: "media_player.kitchen_speakers" },
  { entity: "media_player.bedroom" },
].map(normalizeDevice);

const s = (state, attributes = {}) => ({ state, attributes });

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
    pickActiveDevice(devices, {
      "media_player.living_room_tv": s("on"),
      "media_player.bedroom": s("paused"),
    }).entity,
    "media_player.bedroom"
  );
  assert.equal(
    pickActiveDevice(devices, {
      "media_player.living_room_tv": s("off"),
      "media_player.kitchen_speakers": s("idle"),
    }).entity,
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
  assert.deepEqual(buildServiceCall("volume_up", devices[0], {}), {
    domain: "media_player", service: "volume_up", data: { entity_id: "media_player.soundbar" },
  });
  assert.equal(buildServiceCall("volume_down", devices[1], {}).data.entity_id, "media_player.kitchen_speakers");
});

test("mute toggles based on the volume target's current state", () => {
  const call = buildServiceCall("mute", devices[0], { "media_player.soundbar": s("on", { is_volume_muted: true }) });
  assert.deepEqual(call.data, { entity_id: "media_player.soundbar", is_volume_muted: false });
});

test("power turns on when off and off when on", () => {
  assert.equal(buildServiceCall("power", devices[1], { "media_player.kitchen_speakers": s("off") }).service, "turn_on");
  assert.equal(buildServiceCall("power", devices[1], { "media_player.kitchen_speakers": s("playing") }).service, "turn_off");
});

test("d-pad needs a remote and honours command overrides", () => {
  assert.equal(buildServiceCall("up", devices[1], {}), null);
  assert.deepEqual(buildServiceCall("back", devices[0], {}).data, { entity_id: "remote.living_room_tv", command: "menu" });
  const android = normalizeDevice({ entity: "media_player.shield", remote: "remote.shield", commands: { up: "DPAD_UP" } });
  assert.equal(buildServiceCall("up", android, {}).data.command, "DPAD_UP");
});

test("config validation rejects non media_player entities", () => {
  assert.throws(() => normalizeDevice({ entity: "light.kitchen" }));
  assert.equal(normalizeDevice("media_player.x").entity, "media_player.x");
});
