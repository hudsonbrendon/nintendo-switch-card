import { LitElement, html } from "lit";
import { customElement } from "lit/decorators.js";
import { EDITOR_NAME } from "./const";

@customElement(EDITOR_NAME)
export class NintendoSwitchCardEditor extends LitElement {
  render() {
    return html`<div style="padding:16px;color:#666">
      Visual editor not implemented yet — please use YAML mode.
    </div>`;
  }
}
