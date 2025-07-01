import { LitElement, html, css } from 'https://unpkg.com/lit?module';

class AppDrawer extends LitElement {
	static properties = {
		activeView: { type: String },
	};

	constructor() {
		super();
		this.activeView = 'cubePlotter';
	}

	static styles = css`
	:host {
		display: flex;
		height: 100vh;
		font-family: 'Segoe UI', 'Roboto', sans-serif;
		background-color: #121212;
		color: #ffffff;
	}

	.drawer {
		width: 150px;
		background-color: #1e1e1e;
		display: flex;
		flex-direction: column;
		padding: 16px;
		box-shadow: 2px 0 5px rgba(0, 0, 0, 0.5);
		border-right: 1px solid #2a2a2a;
	}

	.drawer h2 {
		font-size: 20px;
		font-weight: 600;
		margin-bottom: 20px;
		color: #ffffff;
	}

	.drawer button {
		background-color: transparent;
		border: none;
		color: #ffffff;
		padding: 12px 16px;
		text-align: left;
		cursor: pointer;
		font-size: 16px;
		border-radius: 8px;
		transition: background-color 0.2s, transform 0.2s;
	}

	.drawer button:hover {
		background-color: #2a2a2a;
		transform: translateX(4px);
	}

	.drawer button:focus {
		outline: none;
		background-color: #333333;
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
	`;


	render() {
		return html`
		<div class="drawer">
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
		`;
	}

	renderView() {
		// console.log('Active view is:', this.activeView);
		switch (this.activeView) {
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
			return html`<paginated-animated-table></paginated-animated-table>`;
		
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
