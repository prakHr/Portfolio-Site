import { LitElement, html, css } from 'https://unpkg.com/lit?module';

class CardInputForm extends LitElement {
  static properties = {
    name: { type: String },
    amount: { type: Number },
  };

  constructor() {
    super();
    this.name = '';
    this.amount = 0;
  }

  static styles = css`
    .card {
      background: black;
      border-radius: 10px;
      box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
      padding: 20px;
      width: 100%;
      font-family: 'Arial', sans-serif;
    }

    h2 {
      margin-top: 0;
      font-size: 20px;
      color: blue;
    }

    .field {
      margin-bottom: 16px;
    }

    label {
      display: block;
      font-weight: bold;
      margin-bottom: 4px;
    }

    input[type="text"],
    input[type="number"] {
      width: 100%;
      padding: 8px;
      font-size: 14px;
      border: 1px solid #ccc;
      border-radius: 5px;
      box-sizing: border-box;
      color:white;
    }

    .output {
      margin-top: 16px;
      font-size: 14px;
      color: #444;
    }
  `;

  render() {
    return html`
      <div class="card">
        <h2>User Payment Card</h2>

        <div class="field">
          <label for="name">Name:</label>
          <input ?disabled=${true}
            id="name"
            type="text"
            .value=${this.name}
            @input=${(e) => this.name = e.target.value}
          />
        </div>

        <div class="field">
          <label for="amount">Total Bill:</label>
          <input ?disabled=${true}
            id="amount"
            type="number"
            .value=${this.amount}
            @input=${(e) => this.amount = Number(e.target.value)}
          />
        </div>

        
      </div>
    `;
  }
}

customElements.define('card-input-form', CardInputForm);
