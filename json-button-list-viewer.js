import { LitElement, html, css } from 'https://cdn.jsdelivr.net/gh/lit/dist@2/all/lit-all.min.js';
import { virtualize } from 'https://unpkg.com/@lit-labs/virtualizer@0.10.0/virtualize.js?module';

class JsonButtonListViewer extends LitElement {
  static properties = {
    data: { type: Object },
    selectedKey: { type: String }
  };

  constructor() {
    console.log("11");
    super();
    this.data = {};
    this.selectedKey = null;
    this.loadJson();
  }

  async loadJson() {
    try {
      const response = await fetch('./datasets/munshigDemo.json');
      if (!response.ok) throw new Error("Failed to load JSON");
      this.data = await response.json();
    } catch (err) {
      console.warn('Loading fallback data due to fetch error:', err);
      this.data = {
        Fruits: ["Apple", "Banana", "Cherry", "Date", "Fig", "Grape", "Kiwi"],
        Colors: ["Red", "Blue", "Green", "Yellow", "Purple"],
        Animals: ["Cat", "Dog", "Elephant", "Frog", "Goat", "Horse"]
      };
    }
  }

  static styles = css`
    :host {
      display: block;
      font-family: sans-serif;
      color: white;
      padding: 1rem;
      background-color: #1e1e1e;
    }

    button {
      margin: 6px;
      padding: 8px 14px;
      font-size: 14px;
      border: none;
      background-color: #333;
      color: white;
      border-radius: 6px;
      cursor: pointer;
      transition: background-color 0.3s;
    }

    button:hover {
      background-color: #555;
    }

    .list-container {
      margin-top: 16px;
      max-height: 250px;
      overflow-y: auto;
      border: 1px solid #444;
      padding: 10px;
      background-color: #2a2a2a;
      border-radius: 4px;
    }
  `;

  render() {
    return html`
      <div>
        ${Object.keys(this.data || {}).map(
          key => html`
            <button @click=${() => (this.selectedKey = key)}>${key}</button>
          `
        )}
      </div>

      <div class="list-container">
        ${this.selectedKey
          ? virtualize({
              items: this.data[this.selectedKey],
              renderItem: item => html`<div>${item}</div>`
            })
          : html`<p>Select a category to view items.</p>`}
      </div>
    `;
  }
}

customElements.define('json-button-list-viewer', JsonButtonListViewer);
