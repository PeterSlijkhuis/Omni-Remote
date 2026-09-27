/*
 * Omni Remote Card
 * One universal remote for Home Assistant that follows whatever is playing.
 *
 * The card evaluates a prioritised list of media players and routes every
 * button (power, d-pad, transport, volume) to the device that is currently
 * active. Icon, name and accent colour morph along with it.
 */

import { LitElement, html, css } from "lit";
import { normalizeDevice, pickActiveDevice, buildServiceCall, DOMAIN_ICONS } from "./logic.js";

const VERSION = "1.0.0";

class OmniRemoteCard extends LitElement {
  static get properties() {
    return {
      hass: { attribute: false },
      _config: { state: true },
      _pinned: { state: true },
    };
  }

  static getStubConfig(hass) {
    const players = Object.keys((hass && hass.states) || {})
      .filter((id) => id.startsWith("media_player."))
      .slice(0, 2);
    return { entities: players.length ? players : ["media_player.living_room_tv"] };
  }

  setConfig(config) {
    if (!config || !Array.isArray(config.entities) || config.entities.length === 0) {
      throw new Error('Omni Remote: add at least one media player under "entities"');
    }
    this._config = {
      show_chips: true,
      show_artwork: true,
      ...config,
      devices: config.entities.map(normalizeDevice),
    };
    if (this._pinned && !this._config.devices.some((d) => d.entity === this._pinned)) {
      this._pinned = undefined;
    }
  }

  getCardSize() {
    return 6;
  }

  get _active() {
    if (!this._config || !this.hass) return null;
    return pickActiveDevice(this._config.devices, this.hass.states, { pinned: this._pinned });
  }

  _press(action, ev) {
    if (ev) ev.stopPropagation();
    // Resolve the target at tap time so a device switch between render and tap is respected.
    const call = buildServiceCall(action, this._active, this.hass.states);
    if (!call) return;
    this.hass.callService(call.domain, call.service, call.data);
    if (navigator.vibrate) navigator.vibrate(15);
  }

  _togglePin(entity) {
    this._pinned = this._pinned === entity ? undefined : entity;
  }

  _moreInfo() {
    const device = this._active;
    if (!device) return;
    const ev = new Event("hass-more-info", { bubbles: true, composed: true });
    ev.detail = { entityId: device.entity };
    this.dispatchEvent(ev);
  }

  _deviceName(device) {
    const st = this.hass.states[device.entity];
    return device.name || (st && st.attributes.friendly_name) || device.entity;
  }

  _deviceIcon(device) {
    const st = this.hass.states[device.entity];
    const cls = st && st.attributes.device_class;
    return device.icon || (st && st.attributes.icon) || DOMAIN_ICONS[cls] || "mdi:remote";
  }

  _button(action, icon, label, extraClass = "") {
    return html`
      <button class="btn ${extraClass}" title=${label} aria-label=${label}
        @click=${(ev) => this._press(action, ev)}>
        <ha-icon .icon=${icon}></ha-icon>
      </button>
    `;
  }

  render() {
    if (!this._config || !this.hass) return html``;
    const device = this._active;
    const st = this.hass.states[device.entity];
    const state = st ? st.state : "unavailable";
    const attrs = (st && st.attributes) || {};
    const isOn = st && !["off", "standby", "unavailable", "unknown"].includes(state);
    const accent = device.color || this._config.color || "var(--primary-color)";
    const artwork = this._config.show_artwork && isOn && attrs.entity_picture;
    const title = attrs.media_title;
    const subtitle = attrs.media_artist || attrs.media_series_title || attrs.app_name || attrs.source;
    const hasDpad = !!device.remote;
    const volumeState = this.hass.states[device.volume_entity || device.entity];
    const muted = volumeState && volumeState.attributes.is_volume_muted;
    const playing = state === "playing" || state === "buffering";

    return html`
      <ha-card style="--omni-accent: ${accent}">
        ${artwork ? html`<div class="art" style="background-image:url('${attrs.entity_picture}')"></div>` : ""}
        <div class="content">
          <div class="header" @click=${this._moreInfo}>
            <div class="badge ${isOn ? "on" : ""}">
              <ha-icon .icon=${this._deviceIcon(device)}></ha-icon>
            </div>
            <div class="info">
              <div class="name">${this._deviceName(device)}</div>
              <div class="media">
                ${title ? html`<span class="title">${title}</span>` : html`<span class="state">${state}</span>`}
                ${subtitle ? html`<span class="sub">${subtitle}</span>` : ""}
              </div>
            </div>
            <button class="btn power ${isOn ? "on" : ""}" aria-label="Power"
              @click=${(ev) => this._press("power", ev)}>
              <ha-icon icon="mdi:power"></ha-icon>
            </button>
          </div>

          ${this._config.show_chips && this._config.devices.length > 1
            ? html`
                <div class="chips">
                  ${this._config.devices.map((d) => {
                    const ds = this.hass.states[d.entity];
                    const live = ds && ["playing", "buffering"].includes(ds.state);
                    const classes = [
                      "chip",
                      d.entity === device.entity ? "active" : "",
                      this._pinned === d.entity ? "pinned" : "",
                      live ? "live" : "",
                    ].join(" ");
                    return html`
                      <button class=${classes} style="--chip-color: ${d.color || "var(--primary-color)"}"
                        title=${this._pinned === d.entity ? "Tap to return to automatic" : "Tap to lock the remote to this device"}
                        @click=${() => this._togglePin(d.entity)}>
                        <ha-icon .icon=${this._deviceIcon(d)}></ha-icon>
                        <span>${this._deviceName(d)}</span>
                        ${this._pinned === d.entity ? html`<ha-icon class="lock" icon="mdi:lock"></ha-icon>` : ""}
                      </button>
                    `;
                  })}
                </div>
              `
            : ""}

          ${hasDpad
            ? html`
                <div class="dpad">
                  ${this._button("up", "mdi:chevron-up", "Up", "up")}
                  ${this._button("left", "mdi:chevron-left", "Left", "left")}
                  ${this._button("select", "mdi:circle-medium", "Select", "ok")}
                  ${this._button("right", "mdi:chevron-right", "Right", "right")}
                  ${this._button("down", "mdi:chevron-down", "Down", "down")}
                </div>
                <div class="row">
                  ${this._button("back", "mdi:arrow-left", "Back")}
                  ${this._button("home", "mdi:home", "Home")}
                </div>
              `
            : ""}

          <div class="row transport">
            ${this._button("previous", "mdi:skip-previous", "Previous")}
            ${this._button("play_pause", playing ? "mdi:pause" : "mdi:play", "Play or pause", "primary")}
            ${this._button("next", "mdi:skip-next", "Next")}
          </div>

          <div class="row volume">
            ${this._button("volume_down", "mdi:volume-minus", "Volume down")}
            ${this._button("mute", muted ? "mdi:volume-off" : "mdi:volume-high", "Mute", muted ? "muted" : "")}
            ${this._button("volume_up", "mdi:volume-plus", "Volume up")}
          </div>
        </div>
      </ha-card>
    `;
  }

  static get styles() {
    return css`
      ha-card {
        --omni-accent: var(--primary-color);
        position: relative;
        overflow: hidden;
        transition: box-shadow 0.4s ease;
        box-shadow: inset 0 3px 0 0 var(--omni-accent), var(--ha-card-box-shadow, none);
      }
      .art {
        position: absolute;
        inset: 0;
        background-size: cover;
        background-position: center;
        filter: blur(28px) saturate(1.4);
        opacity: 0.25;
        transform: scale(1.2);
        pointer-events: none;
      }
      .content {
        position: relative;
        padding: 16px;
        display: flex;
        flex-direction: column;
        gap: 16px;
      }
      .header {
        display: flex;
        align-items: center;
        gap: 12px;
        cursor: pointer;
      }
      .badge {
        flex: none;
        width: 44px;
        height: 44px;
        border-radius: 50%;
        display: grid;
        place-items: center;
        background: color-mix(in srgb, var(--omni-accent) 15%, transparent);
        color: var(--secondary-text-color);
        transition: background 0.4s ease, color 0.4s ease;
      }
      .badge.on {
        background: var(--omni-accent);
        color: var(--text-primary-color, #fff);
      }
      .info {
        flex: 1;
        min-width: 0;
      }
      .name {
        font-size: 1.1em;
        font-weight: 500;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
      }
      .media {
        display: flex;
        flex-direction: column;
        font-size: 0.9em;
        color: var(--secondary-text-color);
      }
      .media span {
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
      }
      .state {
        text-transform: capitalize;
      }
      .chips {
        display: flex;
        gap: 8px;
        overflow-x: auto;
        scrollbar-width: none;
      }
      .chip {
        flex: none;
        display: inline-flex;
        align-items: center;
        gap: 6px;
        padding: 4px 12px 4px 8px;
        border-radius: 16px;
        border: 1px solid var(--divider-color);
        background: none;
        color: var(--primary-text-color);
        font: inherit;
        font-size: 0.85em;
        cursor: pointer;
        --mdc-icon-size: 18px;
      }
      .chip.live ha-icon:first-child {
        color: var(--chip-color);
      }
      .chip.active {
        border-color: var(--chip-color);
        background: color-mix(in srgb, var(--chip-color) 18%, transparent);
      }
      .chip .lock {
        --mdc-icon-size: 14px;
      }
      .btn {
        border: none;
        background: color-mix(in srgb, var(--primary-text-color) 6%, transparent);
        color: var(--primary-text-color);
        border-radius: 50%;
        width: 52px;
        height: 52px;
        display: grid;
        place-items: center;
        cursor: pointer;
        transition: background 0.2s ease, transform 0.1s ease, color 0.4s ease;
        -webkit-tap-highlight-color: transparent;
      }
      .btn:hover {
        background: color-mix(in srgb, var(--omni-accent) 20%, transparent);
      }
      .btn:active {
        transform: scale(0.92);
      }
      .btn.primary,
      .btn.ok {
        background: var(--omni-accent);
        color: var(--text-primary-color, #fff);
      }
      .btn.power {
        flex: none;
        width: 44px;
        height: 44px;
        color: var(--secondary-text-color);
      }
      .btn.power.on {
        color: var(--omni-accent);
      }
      .btn.muted {
        color: var(--error-color, #db4437);
      }
      .row {
        display: flex;
        justify-content: space-evenly;
      }
      .dpad {
        display: grid;
        grid-template-columns: repeat(3, 60px);
        grid-template-rows: repeat(3, 60px);
        gap: 6px;
        justify-content: center;
      }
      .dpad .btn {
        width: 60px;
        height: 60px;
      }
      .dpad .up { grid-area: 1 / 2; }
      .dpad .left { grid-area: 2 / 1; }
      .dpad .ok { grid-area: 2 / 2; }
      .dpad .right { grid-area: 2 / 3; }
      .dpad .down { grid-area: 3 / 2; }
    `;
  }
}

if (!customElements.get("omni-remote-card")) {
  customElements.define("omni-remote-card", OmniRemoteCard);
  window.customCards = window.customCards || [];
  window.customCards.push({
    type: "omni-remote-card",
    name: "Omni Remote",
    description: "One remote that follows whichever media player is active.",
    preview: true,
  });
  console.info(`%c OMNI-REMOTE-CARD %c ${VERSION} `, "background:#222;color:#fff", "background:#03a9f4;color:#fff");
}
