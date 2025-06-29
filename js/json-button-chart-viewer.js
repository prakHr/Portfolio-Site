import { LitElement, html, css } from 'https://cdn.jsdelivr.net/gh/lit/dist@2/all/lit-all.min.js';

class JsonBubbleChartViewer extends LitElement {
  static properties = {
    data: { type: Array },
    selectedStore: { type: String }
  };

  constructor() {
    super();
    this.data = [];
    this.selectedStore = 'All';
    this.chartInstance = null;
    this.loadJson();
  }

  static styles = css`
    :host {
      display: block;
      font-family: sans-serif;
      background-color: #1e1e1e;
      color: white;
      padding: 20px;
    }
    select {
      padding: 6px;
      font-size: 14px;
      margin-bottom: 10px;
    }
    .chart-container {
      background: #2a2a2a;
      padding: 20px;
      border-radius: 10px;
      max-width: 800px;
      margin: 0 auto;
    }
    canvas {
      width: 100% !important;
      height: 400px !important;
    }
  `;

  async loadJson() {
    try {
      const response = await fetch('./datasets/munshigDemo.json');
      if (!response.ok) throw new Error("Failed to fetch");
      const json = await response.json();
      this.data = json;
    } catch (err) {
      console.warn('Using fallback data due to error:', err);
      this.data = [
        { "Demo Store": Array(1000).fill("Sample item") }
      ];
    }
    this.updateComplete.then(() => this.renderBubbleChart());
  }

  getFrequencyDict() {
    const freq = {};
    for (const obj of this.data) {
      const [store, items] = Object.entries(obj)[0];
      if (this.selectedStore === 'All' || store === this.selectedStore) {
        for (const item of items) {
          freq[item] = (freq[item] || 0) + 1;
        }
      }
    }
    return freq;
  }

  handleFilterChange(e) {
    this.selectedStore = e.target.value;
    this.renderBubbleChart();
  }

  renderBubbleChart() {
    const freq = this.getFrequencyDict();
    const data = Object.entries(freq).map(([label, count]) => ({
      x: Math.random() * 100,
      y: Math.random() * 100,
      r: Math.min(10 + count * 3, 40),
      label
    }));

    const ctx = this.renderRoot.querySelector('#bubbleChart')?.getContext('2d');
    if (!ctx) return;

    if (this.chartInstance) {
      this.chartInstance.destroy();
    }

    this.chartInstance = new Chart(ctx, {
      type: 'bubble',
      data: {
        datasets: [{
          label: 'Item Frequency',
          data,
          backgroundColor: data.map(() => `hsla(${Math.random() * 360}, 70%, 60%, 0.7)`),
          borderColor: '#fff3',
          borderWidth: 1
        }]
      },
      options: {
        animation: {
          duration: 1000,
          easing: 'easeOutBounce'
        },
        plugins: {
          tooltip: {
            callbacks: {
              label: ctx => `${ctx.raw.label}: ${(ctx.raw.r - 10) / 3}`
            }
          }
        },
        onClick: (_e, elements) => {
          if (elements.length) {
            const label = elements[0].element.$context.raw.label;
            window.open(`https://www.google.com/search?q=${encodeURIComponent(label)}`, '_blank');
          }
        },
        scales: {
          x: { display: false, min: 0, max: 100 },
          y: { display: false, min: 0, max: 100 }
        }
      }
    });
  }

  render() {
    const stores = this.data.map(obj => Object.keys(obj)[0]);

    return html`
      <div>
        <label for="storeFilter">Filter by Store:</label>
        <select id="storeFilter" @change=${this.handleFilterChange}>
          <option value="All">All</option>
          ${stores.map(store => html`<option value="${store}">${store}</option>`)}
        </select>
      </div>

      <div class="chart-container">
        <h3>Bubble Chart: Item Frequencies</h3>
        <canvas id="bubbleChart"></canvas>
      </div>
    `;
  }
}

customElements.define('json-button-chart-viewer', JsonBubbleChartViewer);
