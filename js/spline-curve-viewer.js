import { LitElement, html, css } from 'https://cdn.jsdelivr.net/gh/lit/dist@2/all/lit-all.min.js';
// import Chart from 'https://cdn.jsdelivr.net/npm/chart.js@4.4.1/dist/chart.umd.min.js';

class SplineCurveViewer extends LitElement {
  static properties = {
    data: { type: Array },
    currentPage: { type: Number },
    itemsPerPage: { type: Number }
  };

  constructor() {
    super();
    this.data = [];
    this.currentPage = 0;
    this.itemsPerPage = 10;
    this.chart = null;
    this.loadData();
  }

  async loadData() {
    try {
      const res = await fetch('./datasets/barcodesData.json'); // Ensure correct path
      this.data = await res.json();
      await this.updateComplete;
      this.renderChart();
    } catch (err) {
      console.error('Failed to load data:', err);
      this.data = [
        { barcodeName: "Demo Item", barcodePrice: 100 },
        { barcodeName: "Example Item", barcodePrice: 200 }
      ];
      await this.updateComplete;
      this.renderChart();
    }
  }

  get paginatedData() {
    const start = this.currentPage * this.itemsPerPage;
    const end = start + this.itemsPerPage;
    return this.data.slice(start, end);
  }

  renderChart() {
    const ctx = this.renderRoot.querySelector('#splineChart').getContext('2d');
    
    if (this.chart) {
      this.chart.destroy();
    }

    const labels = this.paginatedData.map(item => item.barcodeName);
    const values = this.paginatedData.map(item => item.barcodePrice);

    this.chart = new Chart(ctx, {
      type: 'line',
      data: {
        labels,
        datasets: [{
          label: 'Barcode Price',
          data: values,
          borderColor: 'rgba(0, 168, 255, 0.9)',
          backgroundColor: 'rgba(0, 168, 255, 0.2)',
          fill: true,
          tension: 0.4,
          pointRadius: 4,
          pointHoverRadius: 6,
        }]
      },
      options: {
        responsive: true,
        plugins: {
          legend: {
            labels: { color: 'white' }
          },
          tooltip: {
            callbacks: {
              label: ctx => `₹ ${ctx.parsed.y}`
            }
          }
        },
        scales: {
          x: {
            ticks: { color: 'white' },
            grid: { color: '#444' }
          },
          y: {
            beginAtZero: true,
            ticks: { color: 'white' },
            grid: { color: '#444' }
          }
        }
      }
    });
  }

  nextPage() {
    if ((this.currentPage + 1) * this.itemsPerPage < this.data.length) {
      this.currentPage++;
      this.updateComplete.then(() => this.renderChart());
    }
  }

  prevPage() {
    if (this.currentPage > 0) {
      this.currentPage--;
      this.updateComplete.then(() => this.renderChart());
    }
  }

  static styles = css`
    :host {
      display: block;
      background-color: #121212;
      color: white;
      padding: 20px;
      font-family: 'Segoe UI', sans-serif;
    }

    h2 {
      margin-bottom: 16px;
      font-size: 24px;
      color: #00d9ff;
    }

    canvas {
      width: 80%;
      max-width: 80%;
      height: 40%;
      max-height: 40%;
      background-color: #1e1e1e;
      border-radius: 12px;
      padding: 16px;
      box-shadow: 0 0 8px rgba(0, 168, 255, 0.2);
    }

    .pagination {
      display: flex;
      justify-content: center;
      align-items: center;
      margin-top: 16px;
      gap: 16px;
    }

    .pagination button {
      background-color: #222;
      color: #fff;
      border: none;
      padding: 8px 16px;
      border-radius: 6px;
      cursor: pointer;
      font-size: 14px;
      transition: background-color 0.3s;
    }

    .pagination button:hover {
      background-color: #333;
    }

    .pagination button:disabled {
      opacity: 0.5;
      cursor: not-allowed;
    }

    .pagination span {
      font-size: 14px;
      color: #bbb;
    }
  `;

  render() {
    const totalPages = Math.ceil(this.data.length / this.itemsPerPage);
    return html`
      <h2>Spline Chart: Barcode Prices</h2>
      <canvas id="splineChart" style={"height":"70px"}></canvas>
      
      <div class="pagination">
        <button @click=${this.prevPage} ?disabled=${this.currentPage === 0}>⟨ Prev</button>
        <span>Page ${this.currentPage + 1} / ${totalPages}</span>
        <button @click=${this.nextPage} ?disabled=${(this.currentPage + 1) >= totalPages}>Next ⟩</button>
      </div>
    `;
  }
}

customElements.define('spline-curve-viewer', SplineCurveViewer);
