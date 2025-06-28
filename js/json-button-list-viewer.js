import { LitElement, html, css } from 'https://cdn.jsdelivr.net/gh/lit/dist@2/all/lit-all.min.js';
// import 'https://cdn.jsdelivr.net/npm/@lit-labs/virtualizer@0.14.2/lit-virtualizer.js?module';
import * as litLabsvirtualizer from 'https://esm.run/@lit-labs/virtualizer';

class JsonButtonListViewer extends LitElement {
  static properties = {
    data: { type: Array },
    selectedKey: { type: String }
  };

  constructor() {
    super();
    this.data = [];           // Your JSON structure (array of objects)
    this.selectedKey = null;  // Which shop is selected
    this.loadJson();
  }

  async loadJson() {
    try {
      const response = await fetch('./datasets/munshigDemo.json');
      if (!response.ok) throw new Error("Failed to fetch data");
      const json = await response.json();

      if (!Array.isArray(json)) throw new Error("Data must be an array");
      this.data = json;
    } catch (err) {
      // console.warn("Fallback due to error:", err);
      this.data = [
        { "Demo Store": Array(1000).fill("Sample item") }
      ];
    }
  }

  static styles = css`
    :host {
        display: block;
        padding: 16px;
        font-family: sans-serif;
        background-color: #1e1e1e;
        color: white;
    }

    button {
        margin: 6px;
        padding: 8px 12px;
        background: #333;
        color: white;
        border: none;
        border-radius: 6px;
        cursor: pointer;
    }

    button:hover {
        background: #555;
    }

    .list-container {
        margin-top: 16px;
        border: 1px solid #444;
        border-radius: 6px;
        padding: 10px;
        background-color: #2a2a2a;
    }

    .grid-item {
        background-color: #333;
        padding: 12px;
        margin: 6px;
        border-radius: 8px;
        text-align: center;
        font-size: 14px;
    }
    lit-virtualizer[layout="grid"] {
        --grid-item-width: 120px;
        --grid-item-height: auto;
    }
    `;


  getSelectedItems() {
    const entry = this.data.find(obj => Object.keys(obj)[0] === this.selectedKey);
    return entry ? entry[this.selectedKey] : [];
  }

  render() {
    // console.log("Selected items:", this.getSelectedItems().slice(0, 5));
    
    return html`
      <div>
        ${this.data.map(obj => {
          const key = Object.keys(obj)[0];
          return html`<button @click=${() => (this.selectedKey = key)}>${key}</button>`;
        })}
      </div>
      


      <div class="list-container">
        ${this.selectedKey
          ? html`
                <div class="title">${this.selectedKey} Items (${this.getSelectedItems().length})</div>
                <lit-virtualizer
                scroller
                layout="grid"
                .items=${this.getSelectedItems()}
                .renderItem=${item => html`
                <div class="grid-item">${item}
                    <a class="grid-item" href="https://www.google.com/search?q=${encodeURIComponent(item)}" target="_blank" rel="noopener noreferrer">
                        Link
                    </a>
                </div>`}
                style="height: 250px; overflow-y: auto; --grid-item-width: 160px;"
                ></lit-virtualizer>
            `
          : html`<p>Select a shop to view its items.</p>`}
      </div>
    `;
  }
}

customElements.define('json-button-list-viewer', JsonButtonListViewer);
