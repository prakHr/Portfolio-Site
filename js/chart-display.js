import { LitElement, html } from 'https://cdn.jsdelivr.net/gh/lit/dist@2/all/lit-all.min.js';

class ChartDisplay extends LitElement {
  static properties = {
    chartType: { type: String }
  };

  constructor() {
    super();
    this.chartType = 'pie';
  }

  firstUpdated() {
  //   fetch('./data.json')
  // .then(res => {
  //   if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
  //   return res.json();
  // })
  // .then(data => { /* use data */ })
  // .catch(err => console.error('Failed to load JSON:', err));
    fetch('./datasets/data.json')
      .then(res => res.json())
      .then(data => {
        const ctx = this.renderRoot.querySelector('canvas').getContext('2d');
        new Chart(ctx, {
          type: this.chartType,
          data: {
            labels: data.labels,
            datasets: [{
              label: 'Bills',
              data: data.quantities,
              backgroundColor: ['#ff6384', '#36a2eb', '#ffcd56', '#4bc0c0', '#9966ff']
            }]
          },
          options: {
            responsive: true
          }
        });
      });
  }

  render() {
    return html`
      <div class="chart-container" style={"width":"30%","height":"30%"}>
        <canvas></canvas>
      </div>
    `;
    // return html`<canvas width="250" height="250"></canvas>`;
  }
}

customElements.define('chart-display', ChartDisplay);
