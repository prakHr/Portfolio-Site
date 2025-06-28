import { LitElement, html, css } from 'https://cdn.jsdelivr.net/gh/lit/dist@2/all/lit-all.min.js';

class JsonButtonChartViewer extends LitElement {
  static properties = {
    data: { type: Array },
  };

  constructor() {
    super();
    this.data = [];
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

  .chart-container {
    margin-top: 20px;
    background: #2a2a2a;
    border-radius: 10px;
    padding: 20px;
    max-width: 800px;
    margin-left: auto;
    margin-right: auto;
  }

  canvas {
    width: 100% !important;
    height: 400px !important;
  }
`;


  async loadJson() {
    try {
      const response = await fetch('./datasets/munshigDemo.json');
      if (!response.ok) throw new Error("Failed to fetch data");
      const json = await response.json();
      this.data = json;
    } catch (err) {
      console.warn('Using fallback data:', err);
      this.data = [
        { "Mahesh Kirana": ["Apple", "Banana", "Apple"] },
        { "Fresh Mart": ["Banana", "Carrot", "Apple"] }
      ];
    }

    await this.updateComplete;
    this.renderBubbleChart();
  }

  getFrequencyDict() {
    const freq = {};
    this.data.forEach(store => {
      const key = Object.keys(store)[0];
      store[key].forEach(item => {
        const cleaned = item.trim();
        freq[cleaned] = (freq[cleaned] || 0) + 1;
      });
    });
    return freq;
  }

  renderBubbleChart() {
  const freq = this.getFrequencyDict();

  const data = Object.entries(freq).map(([label, count]) => ({
    x: Math.random() * 100,
    y: Math.random() * 100,
    r: Math.min(10 + count * 2, 30), // Bounded size
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
        label: 'Item Frequencies',
        data: data,
        backgroundColor: data.map(() =>
          `hsla(${Math.random() * 360}, 70%, 60%, 0.7)`
        ),
        borderColor: 'rgba(255,255,255,0.3)',
        borderWidth: 1
      }]
    },
    options: {
      plugins: {
        tooltip: {
          callbacks: {
            label: ctx => `${ctx.raw.label}: ${Math.round((ctx.raw.r - 10) / 2)}`
          }
        }
      },
      onClick: (_event, elements) => {
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
    return html`
      <div class="chart-container">
        <h3>Bubble Chart: Item Frequencies</h3>
        <canvas id="bubbleChart" width="600" height="400"></canvas>
      </div>
    `;
  }
}

customElements.define('json-button-chart-viewer', JsonButtonChartViewer);
