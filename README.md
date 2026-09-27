# Omni Remote

One universal remote card for Home Assistant that follows whatever is playing.

Put all your media players in one card. When the living room TV is streaming, the d-pad, volume and play/pause buttons control the TV and the card takes on the TV's icon and color. Turn the TV off and start music on the multi-room speakers, and the same buttons now control the speakers, with the card switching look to match.

## How it picks a device

The card walks your `entities` list in order and picks:

1. The first device that is **playing** (or buffering).
2. Otherwise the first device that is **paused**.
3. Otherwise the first device that is **on** or **idle**.
4. Otherwise the first device in the list, so the power button can turn it on.

So the order of `entities` is your priority: put the device you care about most first.

Tap a device chip under the header to lock the remote to that device. Tap it again to go back to automatic.

## Installation

### HACS

1. HACS, then the three-dot menu, then **Custom repositories**.
2. Add `https://github.com/PeterSlijkhuis/Omni-Remote` with type **Dashboard**.
3. Install **Omni Remote Card** and reload your browser.

### Manual

1. Copy `dist/omni-remote-card.js` to `config/www/omni-remote-card.js`.
2. Settings, Dashboards, three-dot menu, **Resources**, add `/local/omni-remote-card.js` as a **JavaScript module**.
3. Reload your browser.

## Example

```yaml
type: custom:omni-remote-card
entities:
  - entity: media_player.living_room_apple_tv
    name: Living Room TV
    icon: mdi:television
    color: "#e5a00d"
    remote: remote.living_room_apple_tv       # enables the d-pad
    volume_entity: media_player.soundbar       # volume goes to the soundbar
  - entity: media_player.kitchen_speakers
    name: Kitchen
    icon: mdi:speaker-multiple
    color: "#1db954"
  - entity: media_player.bedroom_shield
    name: Bedroom
    icon: mdi:television-classic
    color: "#76b900"
    remote: remote.bedroom_shield
    commands:                                  # Android TV style key names
      up: DPAD_UP
      down: DPAD_DOWN
      left: DPAD_LEFT
      right: DPAD_RIGHT
      select: DPAD_CENTER
      back: BACK
      home: HOME
```

The short form works too:

```yaml
type: custom:omni-remote-card
entities:
  - media_player.living_room_tv
  - media_player.kitchen_speakers
```

## Options

### Card

| Option | Default | Description |
| --- | --- | --- |
| `entities` | required | Media players in priority order. Each item is an entity id or an object (below). |
| `color` | theme primary color | Accent color used when a device has no `color` of its own. |
| `show_chips` | `true` | Show the device chips used to lock the remote to one device. |
| `show_artwork` | `true` | Show a blurred copy of the current artwork behind the card. |

### Each device

| Option | Default | Description |
| --- | --- | --- |
| `entity` | required | The `media_player` entity. |
| `name` | friendly name | Name shown on the card. |
| `icon` | entity icon | Icon shown when this device is active. |
| `color` | card `color` | Accent color when this device is active. |
| `remote` | none | A `remote` entity. The d-pad, Back and Home buttons only appear when this is set. |
| `volume_entity` | `entity` | Send volume and mute to another player, such as a soundbar or AV receiver. |
| `commands` | Apple TV names | Override the commands sent through `remote.send_command` for `up`, `down`, `left`, `right`, `select`, `back` and `home`. Defaults: `up`, `down`, `left`, `right`, `select`, `menu`, `home`. |

## Buttons

| Button | Service |
| --- | --- |
| Power | `media_player.turn_on` or `media_player.turn_off` |
| Previous, play/pause, next | `media_player.media_previous_track`, `media_play_pause`, `media_next_track` |
| Volume down, mute, volume up | `media_player.volume_down`, `volume_mute`, `volume_up` on `volume_entity` |
| D-pad, Back, Home | `remote.send_command` on `remote` |

Tapping the header opens the more-info dialog of the active device.

## Development

```sh
npm install
npm test        # routing logic tests
npm run build   # writes dist/omni-remote-card.js
```

The source lives in `src/`. `dist/omni-remote-card.js` is the bundled file Home Assistant loads, so rebuild and commit it after changing `src/`.
