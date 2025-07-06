import { LitElement, html, css } from 'https://unpkg.com/lit?module';

class AppDrawer extends LitElement {
	static properties = {
		activeView: { type: String },
		cardData: { type: Array }, // NEW
	};

	constructor() {
		super();
		this.activeView = 'cubePlotter';
		this.cardData = []; // INIT
	}

	static styles = css`
	:host {
      display: block;
      font-family: 'Roboto', sans-serif;
      padding: 1rem;
      background-color: #f9f9f9;
    }

    .grid-container {
      display: grid;
      grid-template-areas:
        "cube viewer"
        "chart spline"
        "table table";
      grid-template-columns: 1fr 1fr;
      grid-gap: 1rem;
    }

    .cube {
      grid-area: cube;
      background: white;
      padding: 1rem;
      box-shadow: 0 2px 6px rgba(0,0,0,0.1);  
	

    }

    .viewer {
      grid-area: viewer;
      background: white;
      padding: 1rem;
      box-shadow: 0 2px 6px rgba(0,0,0,0.1);
    }

    .chart {
      grid-area: chart;
      background: white;
      padding: 1rem;
      box-shadow: 0 2px 6px rgba(0,0,0,0.1);
    }

    .spline {
      grid-area: spline;
      background: white;
      padding: 1rem;
      box-shadow: 0 2px 6px rgba(0,0,0,0.1);
    }

    .table {
      grid-area: table;
      background: white;
      padding: 1rem;
      box-shadow: 0 2px 6px rgba(0,0,0,0.1);
    }

    #chart-area-dynamic {
      width: 100%;
      height: 150px;
      background: #eee;
      margin-top: 1rem;
    }
  
	

	
	.content {
		flex-grow: 1;
		padding: 24px;
		background-color: #181818;
		overflow: auto;
	}

	::-webkit-scrollbar {
		width: 6px;
	}

	::-webkit-scrollbar-thumb {
		background-color: #444;
		border-radius: 3px;
	}
		:host {
      display: block;
      height: 100vh;
      width: 100vw;
    }

    .layout-row {
      display: flex;
      flex-direction: row;
      height: 100%;
    }

    

    .drawer {
		width: 100%;
		background-color: #1e1e1e;
		display: flex;
		flex-direction: row; /* <-- CHANGED */
		padding: 16px;
		box-shadow: 0 2px 5px rgba(0, 0, 0, 0.5);
		border-bottom: 1px solid #2a2a2a;
		flex-wrap: wrap; /* Optional: wrap buttons if they overflow */
	}

	.drawer button {
		background-color: transparent;
		border: none;
		color: #ffffff;
		padding: 8px 12px;
		text-align: center;
		cursor: pointer;
		font-size: 14px;
		border-radius: 6px;
		transition: background-color 0.2s, transform 0.2s;
		white-space: nowrap;
		margin: 4px;
	}

	.layout-column {
		display: flex;
		flex-direction: column;
		height: 100%;
	}

    .drawer button:hover {
      background-color: #2a2a2a;
      transform: translateX(4px);
    }

    .drawer button:focus {
      outline: none;
      background-color: #333333;
    }

    .main-content {
      flex: 1;
      padding: 20px;
      overflow: auto;
      background-color: #f0f0f0;
    }

    .dashboard-grid {
      display: grid;
      grid-template-areas:
        "cube viewer"
        "chart spline"
        "table table";
      grid-template-columns: 1fr 1fr;
      grid-gap: 1rem;
    }

    .dashboard-grid > div {
      background: white;
      padding: 1rem;
      box-shadow: 0 2px 6px rgba(0,0,0,0.1);
    }

    .cube { grid-area: cube; }
    .viewer { grid-area: viewer; }
    .chart { grid-area: chart; }
    .spline { grid-area: spline; }
    .table { grid-area: table; }

    #chart-area-dynamic {
      width: 100%;
      height: 150px;
      background: #eee;
      margin-top: 1rem;
    }
	  
	.card-row {
		display: flex;
		flex-direction: row;
		gap: 1rem;
		margin-top: 1rem;
		
	}

	card-input-form {
		flex: 1 0 auto;
		min-width: 100px;

		
	}
	`;

	firstUpdated() {
		// Replace URL with your actual path or API
		fetch('./datasets/data.json')
			.then(res => res.json())
			.then(data => {
			this.cardData = data.labels.map((label, index) => ({
				name: label,
				amount: data.quantities[index]
			}));
			});
		}

	render() {
		return html`
		<div class="layout-column">
		<div class="drawer">
			<button @click=${() => this.activeView = 'MaterialUI'}>Material UI</button>
			<button @click=${() => this.activeView = 'wordcloud'}>Word Cloud of Home page</button>
			<button @click=${() => this.activeView = 'locationUtube'}>Location U-tube</button>
			<button @click=${() => this.activeView = 'cubePlotter'}>3d Cube Clicked Chart-Plotter</button>
			<button @click=${() => this.activeView = 'jsonComponent'}>Json button list viewer</button>
			<button @click=${() => this.activeView = 'jsonChartComponent'}>Json button chart viewer</button>
			<button @click=${() => this.activeView = 'jsonSplineChartComponent'}>Json button spline-chart viewer</button>
			<button @click=${() => this.activeView = 'paginatedTableComponent'}>Json Data Paginated Table viewer</button>
			
		</div>
		<div class="content">
			${this.renderView()}
		</div>
		</div>
		`;
	}

	renderView() {
		// console.log('Active view is:', this.activeView);
		switch (this.activeView) {
		case 'MaterialUI':
			return html`
			<div class="dashboard-grid">
				<div class="card-row">
					${this.cardData.map(
						(item) => html`
							<card-input-form
								name=${item.name}
								amount=${item.amount}
								style="width: ${100 / this.cardData.length}%; color: gold; background-color:black;"
							></card-input-form>
								`
					)}
				</div>	
				
				<div class="cube">
				<my-3d-cube></my-3d-cube>
				</div>

				<div class="viewer">
				<json-button-list-viewer></json-button-list-viewer>
				</div>

				<div class="chart">
				<json-button-chart-viewer></json-button-chart-viewer>
				</div>

				<div class="spline">
				<spline-curve-viewer></spline-curve-viewer>
				</div>

				<div class="table">
				<paginated-animated-table></paginated-animated-table>
				</div>
			</div>
			`;
		case 'locationUtube':
			return html`<input-dropdown-form></input-dropdown-form>`;
		case 'wordcloud':
			return html`<div style="margin: 20%;"><svg-word-cloud></svg-word-cloud></div>`;
		case 'cubePlotter':
			return html`<my-3d-cube></my-3d-cube>
			<div id="chart-area-dynamic" style="width:30%;height:30%"></div>`;
		case 'jsonComponent':
			return html`
				<div>
				<json-button-list-viewer></json-button-list-viewer>
				</div>
			`;
		case 'jsonChartComponent':
			return html`<json-button-chart-viewer></json-button-chart-viewer>`
		case 'jsonSplineChartComponent':
			return html`
				<div>
				<spline-curve-viewer></spline-curve-viewer>
				</div>
			`;
		case 'paginatedTableComponent':
			return html`<div class="table"><paginated-animated-table></paginated-animated-table></div>`;
			
		}
	}
updated(changedProperties) {
	if (changedProperties.has('activeView') && this.activeView === 'cubePlotter') {
		const cube = this.renderRoot.querySelector('my-3d-cube');
		if (cube) {
			cube.addEventListener('face-clicked', (event) => {
				// console.log("reached here");
				const chartType = event.detail.chartType;
				const container = this.renderRoot.getElementById('chart-area-dynamic');

				if (container) {
						container.innerHTML = '';

						const chart = document.createElement('chart-display');
						chart.setAttribute('chartType', chartType);
						container.appendChild(chart);
					}
				});
			}
		}
	}

}

customElements.define('app-drawer', AppDrawer);
