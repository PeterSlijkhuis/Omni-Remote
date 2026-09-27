/*
 * Omni Remote Card
 * One universal remote for Home Assistant that follows whatever is playing.
 *
 * The card evaluates a prioritised list of media players and routes every
 * button (power, d-pad, transport, volume) to the device that is currently
 * active. Icon, name and accent colour morph along with it.
 */

import { LitElement, html, css, nothing } from "lit";
import {
  normalizeDevice,
  pickActiveDevice,
  resolveDevice,
  availableButtons,
  buildServiceCall,
  customCall,
  DOMAIN_ICONS,
  DPAD_KEYS,
} from "./logic.js";
import "./editor.js";

const VERSION = "1.1.0";
const REPEAT_DELAY = 400;
const REPEAT_INTERVAL = 150;
const REPEATABLE = new Set(["volume_up", "volume_down", "up", "down", "left", "right"]);

class OmniRemoteCard extends LitElement {
  static get properties() {
    return {
      hass: { attribute: false },
      _config: { state: true },
      _pinned: { state: true },
    };
  }

  static getConfigElement() {
    return document.createElement("omni-remote-card-editor");
  }

  static getStubConfig(hass) {
    const states = (hass && hass.states) || {};
    const players = Object.keys(states)
      .filter((id) => id.startsWith("media_player."))
      .sort((a, b) => (states[a].state === "playing" ? -1 : 0) - (states[b].state === "playing" ? -1 : 0))
      .slice(0, 3);
    return { entities: players.length ? players : ["media_player.living_room_tv"] };
  }

  setConfig(config) {
    if (!config || !Array.isArray(config.entities) || config.entities.length === 0) {
      throw new Error('Omni Remote: add at least one media player under "entities"');
    }
    this._config = {
      show_chips: true,
      show_artwork: true,
      show_volume_slider: true,
      show_source: true,
      ...config,
      devices: config.entities.map(normalizeDevice),
    };
    if (this._pinned && !this._config.devices.some((d) => d.entity === this._pinned)) {
      this._pinned = undefined;
    }
  }

  getCardSize() {
    return 7;
  }

  disconnectedCallback() {
    super.disconnectedCallback();
    this._stopRepeat();
  }

  get _active() {
    if (!this._config || !this.hass) return null;
    return pickActiveDevice(this._config.devices, this.hass.states, { pinned: this._pinned });
  }

  _call(call) {
    if (!call) return;
    this.hass.callService(call.domain, call.service, call.data);
    if (navigator.vibrate) navigator.vibrate(15);
  }

  // Resolve the target at tap time so a device switch between render and tap is respected.
  _press(action, value) {
    this._call(buildServiceCall(action, this._active, this.hass, value));
  }

  _pointerDown(action, ev) {
    if (ev.button !== undefined && ev.button !== 0) return;
    ev.preventDefault();
    this._press(action);
    if (!REPEATABLE.has(action)) return;
    this._stopRepeat();
    this._repeatTimer = setTimeout(() => {
      this._repeatTimer = setInterval(() => this._press(action), REPEAT_INTERVAL);
    }, REPEAT_DELAY);
  }

  _stopRepeat() {
    clearTimeout(this._repeatTimer);
    clearInterval(this._repeatTimer);
    this._repeatTimer = undefined;
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

  _button(show, action, icon, label, extraClass = "") {
    if (!show.has(action)) return nothing;
    return html`
      <button class="btn ${extraClass}" title=${label} aria-label=${label}
        @pointerdown=${(ev) => this._pointerDown(action, ev)}
        @pointerup=${this._stopRepeat} @pointerleave=${this._stopRepeat} @pointercancel=${this._stopRepeat}
        @click=${(ev) => ev.detail === 0 && this._press(action)}>
        <ha-icon .icon=${icon}></ha-icon>
      </button>
    `;
  }

  _row(show, keys, cls, content) {
    if (!keys.some((k) => show.has(k))) return nothing;
    return html`<div class="row ${cls}">${content()}</div>`;
  }

  _renderMissing() {
    const missing = this._config.devices.filter((d) => !this.hass.states[d.entity]);
    if (!missing.length) return nothing;
    return html`
      <div class="warning">
        Not found: ${missing.map((d) => d.entity).join(", ")}.
        Check the exact id under Settings, Devices &amp; services, Entities.
      </div>
    `;
  }

  _renderChips(device) {
    if (!this._config.show_chips || this._config.devices.length < 2) return nothing;
    return html`
      <div class="chips">
        ${this._config.devices.map((d) => {
          const ds = this.hass.states[d.entity];
          const live = ds && ["playing", "buffering"].includes(ds.state);
          const pinned = this._pinned === d.entity;
          const classes = ["chip", d.entity === device.entity ? "active" : "", live ? "live" : ""].join(" ");
          return html`
            <button class=${classes} style="--chip-color: ${d.color || "var(--primary-color)"}"
              title=${pinned ? "Tap to return to automatic" : "Tap to lock the remote to this device"}
              @click=${() => this._togglePin(d.entity)}>
              <ha-icon .icon=${this._deviceIcon(d)}></ha-icon>
              <span>${this._deviceName(d)}</span>
              ${pinned ? html`<ha-icon class="lock" icon="mdi:lock"></ha-icon>` : nothing}
            </button>
          `;
        })}
      </div>
    `;
  }

  _renderExtras(device, show, attrs) {
    const slider = this._config.show_volume_slider && show.has("volume_set");
    const source = this._config.show_source && show.has("source");
    if (!slider && !source) return nothing;
    const volState = this.hass.states[device.volume_entity || device.entity];
    const level = Math.round(((volState && volState.attributes.volume_level) || 0) * 100);
    return html`
      <div class="extras">
        ${slider
          ? html`
              <label class="slider">
                <ha-icon icon="mdi:volume-medium"></ha-icon>
                <input type="range" min="0" max="100" .value=${String(level)} aria-label="Volume"
                  @change=${(ev) => this._press("volume_set", ev.target.value / 100)}>
                <span class="level">${level}</span>
              </label>
            `
          : nothing}
        ${source
          ? html`
              <label class="source">
                <ha-icon icon="mdi:import"></ha-icon>
                <select aria-label="Source" @change=${(ev) => this._press("source", ev.target.value)}>
                  ${attrs.source ? nothing : html`<option value="" selected disabled>Source</option>`}
                  ${attrs.source_list.map(
                    (s) => html`<option value=${s} ?selected=${s === attrs.source}>${s}</option>`
                  )}
                </select>
              </label>
            `
          : nothing}
      </div>
    `;
  }

  _renderCustomButtons(device) {
    const buttons = [...(device.buttons || []), ...(this._config.buttons || [])];
    if (!buttons.length) return nothing;
    return html`
      <div class="row custom">
        ${buttons.map(
          (b) => html`
            <button class="btn small" title=${b.name || ""} aria-label=${b.name || b.icon || "Action"}
              @click=${() => this._call(customCall(b))}>
              ${b.icon ? html`<ha-icon .icon=${b.icon}></ha-icon>` : html`<span>${b.name}</span>`}
            </button>
          `
        )}
      </div>
    `;
  }

  render() {
    if (!this._config || !this.hass) return nothing;
    const device = this._active;
    const st = this.hass.states[device.entity];
    const state = st ? st.state : "unavailable";
    const attrs = (st && st.attributes) || {};
    const isOn = !!st && !["off", "standby", "unavailable", "unknown"].includes(state);
    const accent = device.color || this._config.color || "var(--primary-color)";
    const artwork = this._config.show_artwork && isOn && attrs.entity_picture;
    const title = attrs.media_title;
    const subtitle = attrs.media_artist || attrs.media_series_title || attrs.app_name || attrs.source;
    const resolved = resolveDevice(device, this.hass);
    const show = availableButtons(device, this.hass, resolved);
    const volumeState = this.hass.states[device.volume_entity || device.entity];
    const muted = volumeState && volumeState.attributes.is_volume_muted;
    const playing = state === "playing" || state === "buffering";
    const b = (...args) => this._button(show, ...args);

    return html`
      <ha-card style="--omni-accent: ${accent}">
        ${artwork ? html`<div class="art" style="background-image:url('${attrs.entity_picture}')"></div>` : nothing}
        <div class="content">
          ${this._renderMissing()}
          <div class="header">
            <div class="badge ${isOn ? "on" : ""}" @click=${this._moreInfo}>
              <ha-icon .icon=${this._deviceIcon(device)}></ha-icon>
            </div>
            <div class="info" @click=${this._moreInfo}>
              <div class="name">${this._deviceName(device)}</div>
              <div class="media">
                ${title ? html`<span class="title">${title}</span>` : html`<span class="state">${state}</span>`}
                ${subtitle ? html`<span class="sub">${subtitle}</span>` : nothing}
              </div>
            </div>
            ${b("power", "mdi:power", "Power", `power ${isOn ? "on" : ""}`)}
          </div>

          ${this._renderChips(device)}

          ${DPAD_KEYS.some((k) => show.has(k))
            ? html`
                <div class="dpad">
                  ${b("up", "mdi:chevron-up", "Up", "up")}
                  ${b("left", "mdi:chevron-left", "Left", "left")}
                  ${b("select", "mdi:circle-medium", "Select", "ok")}
                  ${b("right", "mdi:chevron-right", "Right", "right")}
                  ${b("down", "mdi:chevron-down", "Down", "down")}
                </div>
                ${this._row(show, ["back", "home", "menu"], "", () => html`
                  ${b("back", "mdi:arrow-left", "Back")}
                  ${b("home", "mdi:home", "Home")}
                  ${b("menu", "mdi:menu", "Menu")}
                `)}
              `
            : nothing}

          ${this._row(show, ["previous", "play_pause", "next"], "transport", () => html`
            ${b("previous", "mdi:skip-previous", "Previous")}
            ${b("play_pause", playing ? "mdi:pause" : "mdi:play", "Play or pause", "primary")}
            ${b("next", "mdi:skip-next", "Next")}
          `)}
          ${this._row(show, ["volume_down", "mute", "volume_up"], "volume", () => html`
            ${b("volume_down", "mdi:volume-minus", "Volume down")}
            ${b("mute", muted ? "mdi:volume-off" : "mdi:volume-high", "Mute", muted ? "muted" : "")}
            ${b("volume_up", "mdi:volume-plus", "Volume up")}
          `)}

          ${this._renderExtras(device, show, attrs)}
          ${this._renderCustomButtons(device)}
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
      .warning {
        font-size: 0.85em;
        padding: 8px 12px;
        border-radius: 8px;
        background: color-mix(in srgb, var(--warning-color, #ffa600) 18%, transparent);
      }
      .header {
        display: flex;
        align-items: center;
        gap: 12px;
      }
      .badge {
        flex: none;
        width: 44px;
        height: 44px;
        border-radius: 50%;
        display: grid;
        place-items: center;
        cursor: pointer;
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
        cursor: pointer;
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
        touch-action: manipulation;
        user-select: none;
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
      .btn.small {
        width: 44px;
        height: 44px;
        font: inherit;
        font-size: 0.75em;
      }
      .row {
        display: flex;
        justify-content: space-evenly;
      }
      .custom {
        flex-wrap: wrap;
        gap: 8px;
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
      .extras {
        display: flex;
        flex-direction: column;
        gap: 10px;
      }
      .extras label {
        display: flex;
        align-items: center;
        gap: 10px;
        color: var(--secondary-text-color);
      }
      .slider input {
        flex: 1;
        accent-color: var(--omni-accent);
      }
      .level {
        width: 2.5em;
        text-align: right;
        font-variant-numeric: tabular-nums;
      }
      .source select {
        flex: 1;
        padding: 6px 8px;
        border-radius: 8px;
        border: 1px solid var(--divider-color);
        background: var(--card-background-color, transparent);
        color: var(--primary-text-color);
        font: inherit;
      }
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
    documentationURL: "https://github.com/PeterSlijkhuis/Omni-Remote",
  });
  console.info(`%c OMNI-REMOTE-CARD %c ${VERSION} `, "background:#222;color:#fff", "background:#03a9f4;color:#fff");
}
