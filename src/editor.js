/*
 * Visual editor for the Omni Remote card.
 * Handles the common options; advanced keys (actions, buttons, commands, hide)
 * are kept untouched and can be edited in the YAML view.
 */

import { LitElement, html, css, nothing } from "lit";
import { PRESETS } from "./logic.js";

const CARD_SCHEMA = [
  { name: "color", selector: { text: {} } },
  {
    type: "grid",
    name: "",
    schema: [
      { name: "show_chips", selector: { boolean: {} } },
      { name: "show_artwork", selector: { boolean: {} } },
      { name: "show_volume_slider", selector: { boolean: {} } },
      { name: "show_source", selector: { boolean: {} } },
    ],
  },
];

const DEVICE_SCHEMA = [
  { name: "entity", required: true, selector: { entity: { filter: { domain: "media_player" } } } },
  {
    type: "grid",
    name: "",
    schema: [
      { name: "name", selector: { text: {} } },
      { name: "icon", selector: { icon: {} } },
      { name: "color", selector: { text: {} } },
      {
        name: "platform",
        selector: {
          select: {
            mode: "dropdown",
            options: [
              { value: "auto", label: "Detect automatically" },
              ...Object.entries(PRESETS).map(([value, p]) => ({ value, label: p.label })),
            ],
          },
        },
      },
    ],
  },
  { name: "remote", selector: { entity: { filter: { domain: "remote" } } } },
  { name: "volume_entity", selector: { entity: { filter: { domain: "media_player" } } } },
];

const ADD_SCHEMA = [{ name: "entity", selector: { entity: { filter: { domain: "media_player" } } } }];

const LABELS = {
  color: "Accent color (for example #1db954)",
  show_chips: "Device chips",
  show_artwork: "Artwork background",
  show_volume_slider: "Volume slider",
  show_source: "Source picker",
  entity: "Media player",
  name: "Name",
  icon: "Icon",
  platform: "Remote type",
  remote: "Remote entity (d-pad)",
  volume_entity: "Send volume to",
};

const HELPERS = {
  remote: "Leave empty to use the remote that belongs to the same device.",
  volume_entity: "Optional soundbar or receiver that should get volume and mute.",
};

const defaults = { show_chips: true, show_artwork: true, show_volume_slider: true, show_source: true };

function clean(obj) {
  const out = {};
  for (const [k, v] of Object.entries(obj)) {
    if (v === undefined || v === null || v === "" || (k === "platform" && v === "auto")) continue;
    out[k] = v;
  }
  return out;
}

class OmniRemoteCardEditor extends LitElement {
  static get properties() {
    return {
      hass: { attribute: false },
      _config: { state: true },
    };
  }

  setConfig(config) {
    this._config = config;
    this._loadFormElements();
  }

  // ha-form is lazy loaded by Home Assistant; opening a built-in editor pulls it in.
  async _loadFormElements() {
    if (customElements.get("ha-form")) return;
    const tile = customElements.get("hui-tile-card");
    if (tile && tile.getConfigElement) await tile.getConfigElement();
  }

  get _devices() {
    return (this._config.entities || []).map((e) => (typeof e === "string" ? { entity: e } : e));
  }

  _emit(config) {
    this._config = config;
    this.dispatchEvent(new CustomEvent("config-changed", { detail: { config }, bubbles: true, composed: true }));
  }

  _setDevices(devices) {
    this._emit({ ...this._config, entities: devices.map((d) => (Object.keys(d).length === 1 ? d.entity : d)) });
  }

  _cardChanged(ev) {
    ev.stopPropagation();
    this._emit({ ...this._config, ...clean(ev.detail.value) });
  }

  _deviceChanged(index, ev) {
    ev.stopPropagation();
    const devices = [...this._devices];
    const keep = { ...devices[index] };
    for (const s of DEVICE_SCHEMA.flatMap((s) => s.schema || [s])) delete keep[s.name];
    devices[index] = { ...keep, ...clean(ev.detail.value) };
    this._setDevices(devices);
  }

  _addDevice(ev) {
    ev.stopPropagation();
    const entity = ev.detail.value && ev.detail.value.entity;
    if (!entity) return;
    this._setDevices([...this._devices, { entity }]);
  }

  _move(index, delta) {
    const devices = [...this._devices];
    const target = index + delta;
    if (target < 0 || target >= devices.length) return;
    [devices[index], devices[target]] = [devices[target], devices[index]];
    this._setDevices(devices);
  }

  _remove(index) {
    const devices = this._devices.filter((_, i) => i !== index);
    this._setDevices(devices);
  }

  _label = (s) => LABELS[s.name] || s.name;
  _helper = (s) => HELPERS[s.name];

  render() {
    if (!this.hass || !this._config) return nothing;
    const devices = this._devices;
    return html`
      <p class="hint">
        Add your media players in priority order: the first one that is playing gets the remote.
        Can't find a device? Open Settings, Devices &amp; services, Entities and search for
        <code>media_player.</code> or <code>remote.</code>
      </p>

      ${devices.map(
        (d, i) => html`
          <div class="device">
            <div class="device-head">
              <span>${i + 1}. ${d.name || (this.hass.states[d.entity] && this.hass.states[d.entity].attributes.friendly_name) || d.entity}</span>
              <span class="actions">
                <button title="Move up" ?disabled=${i === 0} @click=${() => this._move(i, -1)}><ha-icon icon="mdi:arrow-up"></ha-icon></button>
                <button title="Move down" ?disabled=${i === devices.length - 1} @click=${() => this._move(i, 1)}><ha-icon icon="mdi:arrow-down"></ha-icon></button>
                <button title="Remove" @click=${() => this._remove(i)}><ha-icon icon="mdi:delete"></ha-icon></button>
              </span>
            </div>
            <ha-form .hass=${this.hass} .data=${{ platform: "auto", ...d }} .schema=${DEVICE_SCHEMA}
              .computeLabel=${this._label} .computeHelper=${this._helper}
              @value-changed=${(ev) => this._deviceChanged(i, ev)}></ha-form>
          </div>
        `
      )}

      <div class="device add">
        <div class="device-head"><span>Add a media player</span></div>
        <ha-form .hass=${this.hass} .data=${{}} .schema=${ADD_SCHEMA} .computeLabel=${this._label}
          @value-changed=${this._addDevice}></ha-form>
      </div>

      <h4>Card options</h4>
      <ha-form .hass=${this.hass} .data=${{ ...defaults, ...this._config }} .schema=${CARD_SCHEMA}
        .computeLabel=${this._label} @value-changed=${this._cardChanged}></ha-form>
      <p class="hint">Custom buttons, per-button actions and key overrides are available in the YAML editor.</p>
    `;
  }

  static get styles() {
    return css`
      .hint {
        color: var(--secondary-text-color);
        font-size: 0.9em;
      }
      .device {
        border: 1px solid var(--divider-color);
        border-radius: 8px;
        padding: 8px 12px 12px;
        margin-bottom: 12px;
      }
      .device-head {
        display: flex;
        align-items: center;
        justify-content: space-between;
        font-weight: 500;
        margin-bottom: 8px;
      }
      .actions button {
        background: none;
        border: none;
        color: var(--primary-text-color);
        cursor: pointer;
      }
      .actions button[disabled] {
        opacity: 0.3;
        cursor: default;
      }
    `;
  }
}

if (!customElements.get("omni-remote-card-editor")) {
  customElements.define("omni-remote-card-editor", OmniRemoteCardEditor);
}
