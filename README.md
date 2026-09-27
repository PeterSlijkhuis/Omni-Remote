# Omni Remote

[![Validate](https://github.com/PeterSlijkhuis/Omni-Remote/actions/workflows/validate.yml/badge.svg)](https://github.com/PeterSlijkhuis/Omni-Remote/actions/workflows/validate.yml)
[![CI](https://github.com/PeterSlijkhuis/Omni-Remote/actions/workflows/ci.yml/badge.svg)](https://github.com/PeterSlijkhuis/Omni-Remote/actions/workflows/ci.yml)
[![HACS Custom](https://img.shields.io/badge/HACS-Custom-41BDF5.svg)](https://hacs.xyz/docs/faq/custom_repositories)

One universal remote card for Home Assistant that follows whatever is playing.

Put all your media players in one card. When the living room TV is streaming, the d-pad, volume and play/pause buttons control the TV and the card takes on the TV's icon and color. Turn the TV off and start music on the multi-room speakers, and the same buttons now control the speakers, with the card switching look to match.

| Speakers playing | TV playing |
| --- | --- |
| <img src="docs/speakers.png" width="300" alt="Omni Remote controlling multi-room speakers"> | <img src="docs/tv.png" width="300" alt="Omni Remote controlling a TV with the d-pad"> |

## Features

- **Follows the action.** Picks the device that is playing, then paused, then on, in the order you list them.
- **Works with any media player.** Speakers, TVs, streamers, receivers, Kodi, Plex, Jellyfin, Sonos, Chromecast and anything else that shows up as a `media_player`.
- **D-pad for TVs and streamers.** Built-in key maps for Apple TV, Android TV / Google TV / Nvidia Shield, Fire TV (ADB), Roku, LG webOS, Samsung, Sony Bravia, Philips and Kodi. The integration and its remote entity are detected automatically.
- **Only useful buttons.** Buttons a player does not support (for example next track on a TV input) are hidden.
- **Volume slider and source picker** when the player supports them.
- **Hold to repeat** on volume and d-pad buttons.
- **Send volume elsewhere,** for example to a soundbar or AV receiver.
- **Custom buttons and actions.** Add app shortcuts, or replace what any button does with your own action or script.
- **Lock to one device** by tapping its chip; tap again to go back to automatic.
- **Visual editor** with entity pickers, so no YAML is needed for the basics.

## How it picks a device

The card walks your `entities` list in order and picks:

1. The first device that is **playing** (or buffering).
2. Otherwise the first device that is **paused**.
3. Otherwise the first device that is **on** or **idle**.
4. Otherwise the first device in the list, so the power button can turn it on.

So the order of `entities` is your priority: put the device you care about most first.

## Installation

### HACS (recommended)

1. Open HACS, then the three-dot menu, then **Custom repositories**.
2. Add `https://github.com/PeterSlijkhuis/Omni-Remote` with type **Dashboard**.
3. Search for **Omni Remote Card**, install it and reload your browser.

### Manual

1. Download `omni-remote-card.js` from the latest release (or `dist/omni-remote-card.js` from this repository).
2. Copy it to `config/www/omni-remote-card.js`.
3. Settings, Dashboards, three-dot menu, **Resources**, add `/local/omni-remote-card.js` as a **JavaScript module**.
4. Reload your browser.

## Finding your entity ids

The card needs the entity ids of your media players (they start with `media_player.`) and, for a d-pad, optionally a remote (starting with `remote.`). Any of these will show them:

- **Settings, Devices & services, Entities.** Type `media_player.` or `remote.` in the search box. The entity id is in the second column. Click a row and then the cog icon to see or rename it.
- **Settings, Devices & services, Devices.** Open your TV or speaker; its media player and remote are listed together on the device page.
- **Developer tools, States.** Filter on `media_player.` to see every player with its current state, which is handy to check which one reports `playing`.
- **The card's visual editor.** Add the card from the dashboard editor and pick players from the dropdown; it only lists media players.

Tips:

- One physical device often has several media players (for example a Cast player and a TV player for the same TV). Try each and keep the one whose state and buttons behave best, or list both.
- Groups count as players too: a Sonos, Music Assistant or Cast speaker group can be one entry.
- If an id is wrong, the card shows a warning naming it.

## Configuration

### Visual editor

Edit the dashboard, add a card and search for **Omni Remote**. You can add, order and remove players, set name, icon and color, and pick the remote type and remote entity. Custom buttons and action overrides are set in the YAML editor.

### Short form

```yaml
type: custom:omni-remote-card
entities:
  - media_player.living_room_tv
  - media_player.kitchen_speakers
```

### Full example

```yaml
type: custom:omni-remote-card
entities:
  - entity: media_player.living_room_apple_tv
    name: Living Room TV
    icon: mdi:television
    color: "#e5a00d"
    volume_entity: media_player.soundbar      # volume and mute go to the soundbar
    buttons:
      - icon: mdi:netflix
        name: Netflix
        perform_action: media_player.select_source
        data:
          entity_id: media_player.living_room_apple_tv
          source: Netflix

  - entity: media_player.kitchen_speakers
    name: Kitchen
    icon: mdi:speaker-multiple
    color: "#1db954"

  - entity: media_player.bedroom_lg_tv
    name: Bedroom
    icon: mdi:television-classic
    color: "#a50034"
    platform: lg_webos                        # usually detected automatically
    hide: [previous, next]
```

### Card options

| Option | Default | Description |
| --- | --- | --- |
| `entities` | required | Media players in priority order. Each item is an entity id or an object (below). |
| `color` | theme primary color | Accent color used when a device has no `color` of its own. |
| `show_chips` | `true` | Show the device chips used to lock the remote to one device. |
| `show_artwork` | `true` | Show a blurred copy of the current artwork behind the card. |
| `show_volume_slider` | `true` | Show a volume slider when the player supports setting the volume. |
| `show_source` | `true` | Show a source picker when the player has a source list. |
| `buttons` | none | Custom buttons shown for every device (same format as below). |

### Device options

| Option | Default | Description |
| --- | --- | --- |
| `entity` | required | The `media_player` entity. |
| `name` | friendly name | Name shown on the card. |
| `icon` | entity icon | Icon shown when this device is active. |
| `color` | card `color` | Accent color when this device is active. |
| `platform` | `auto` | Which d-pad key map to use. See the table below. |
| `remote` | auto | A `remote` entity. When empty, the remote on the same device is used. |
| `volume_entity` | `entity` | Send volume and mute to another player, such as a soundbar or AV receiver. |
| `hide` | none | Buttons to hide, for example `[previous, next, menu]`. |
| `commands` | preset | Override d-pad key names, for example `{ menu: "INFO" }`. |
| `actions` | none | Replace what a button does. Keys are button names, values are actions (below). |
| `buttons` | none | Extra buttons for this device, each with `icon` and/or `name` plus an action. |

Button names: `power`, `previous`, `play_pause`, `next`, `volume_down`, `mute`, `volume_up`, `up`, `down`, `left`, `right`, `select`, `back`, `home`, `menu`.

### Platforms

With `platform: auto` the card reads which integration the media player belongs to and picks the matching key map. Set it yourself when detection does not work, for example for a TV controlled through a Broadlink or Harmony hub.

| `platform` | Integration | D-pad is sent with |
| --- | --- | --- |
| `apple_tv` | Apple TV | `remote.send_command` |
| `android_tv` | Android TV Remote (Google TV, Shield, Chromecast with Google TV) | `remote.send_command` |
| `android_adb` | Android Debug Bridge (Fire TV, Android TV over ADB) | `androidtv.adb_command` |
| `roku` | Roku | `remote.send_command` |
| `lg_webos` | LG webOS TV | `webostv.button` |
| `samsung_tv` | Samsung Smart TV | `remote.send_command` |
| `sony_bravia` | Sony Bravia TV | `remote.send_command` |
| `philips_tv` | Philips TV | `remote.send_command` |
| `kodi` | Kodi | `kodi.call_method` |
| `generic` | Anything else with a `remote` entity | `remote.send_command` with `up`, `down`, `left`, `right`, `select`, `back`, `home`, `menu` |

Players without a remote (speakers, Cast, Sonos and so on) simply show no d-pad.

### Actions

An action is any Home Assistant action (service) with optional `data` and `target`:

```yaml
actions:
  volume_up:
    perform_action: script.receiver_volume_up
  home:
    perform_action: remote.send_command
    target:
      entity_id: remote.harmony_hub
    data:
      device: Living Room TV
      command: Home
```

`service:` is accepted as an alias for `perform_action:`.

## Buttons and what they call

| Button | Action |
| --- | --- |
| Power | `media_player.turn_on` / `turn_off`, or `remote.turn_on` / `turn_off` when the player cannot power itself |
| Previous, play/pause, next | `media_player.media_previous_track`, `media_play_pause`, `media_next_track` |
| Volume down, mute, volume up, slider | `media_player.volume_down`, `volume_mute`, `volume_up`, `volume_set` on `volume_entity` |
| Source | `media_player.select_source` |
| D-pad, Back, Home, Menu | Depends on `platform`, see above |

Tapping the icon or name opens the more-info dialog of the active device.

## Development

```sh
npm install
npm test        # routing logic tests
npm run build   # writes dist/omni-remote-card.js
```

The source lives in `src/`. `dist/omni-remote-card.js` is the bundled file Home Assistant loads; the CI workflow fails if it is out of date, so rebuild and commit it after changing `src/`.

To publish a version, create a GitHub release with a tag such as `v1.1.0`. The release workflow builds the card and attaches `omni-remote-card.js`, which HACS then offers as an update.
