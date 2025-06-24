		import { LitElement, html, css } from 'https://cdn.jsdelivr.net/gh/lit/dist@2/all/lit-all.min.js';
	
		class InputDropdownForm extends LitElement {
		  static properties = {
			input1: { type: String },
			input2: { type: String },
			dropdownValue: { type: String },
			lat: { type: String },
			lon: { type: String },
			error: { type: String },
			generatedButtons: { type: Array },
			selectedAddress: { type: String },
			var_lat: { type: String },
			var_lon: { type: String },
			selectedDirection: { type: String },
			distance: { type: Number }
		  };
	
		  static styles = css`
			:host {
			  display: block;
			  font-family: 'Roboto', Arial, sans-serif;
			  background-color: #181818;
			  color: #fff;
			  padding: 20px;
			  max-width: 700px;
			  margin: 30px auto;
			  border-radius: 8px;
			  box-shadow: 0 0 12px rgba(0,0,0,0.8);
			}
	
			input, select {
			  background-color: #282828;
			  border: none;
			  color: #fff;
			  padding: 10px 14px;
			  margin: 8px 10px 8px 0;
			  border-radius: 4px;
			  font-size: 14px;
			  width: 250px;
			  box-sizing: border-box;
			  transition: background-color 0.3s;
			}
	
			input::placeholder {
			  color: #b3b3b3;
			}
	
			input:focus, select:focus {
			  outline: none;
			  background-color: #3a3a3a;
			}
	
			select {
			  width: 110px;
			}
	
			button {
			  background-color: #cc0000; /* YouTube Red */
			  border: none;
			  color: white;
			  padding: 10px 18px;
			  margin: 8px 10px 8px 0;
			  border-radius: 4px;
			  font-weight: 600;
			  cursor: pointer;
			  font-size: 14px;
			  box-shadow: 0 2px 4px rgba(204,0,0,0.7);
			  transition: background-color 0.2s ease-in-out;
			}
	
			button:hover {
			  background-color: #e60000;
			}
	
			.button-container {
			  max-height: 300px;
			  overflow-y: auto;
			  border: 1px solid #333;
			  padding: 10px;
			  margin-top: 20px;
			  border-radius: 6px;
			  background-color: #202020;
			}
	
			.button-container button {
			  background-color: #cc0000;
			  margin: 4px;
			  padding: 8px 12px;
			  font-size: 13px;
			  box-shadow: 0 1px 2px rgba(204,0,0,0.9);
			}
	
			.button-container button:hover {
			  background-color: #e60000;
			}
	
			.address-output {
			  margin-top: 30px;
			  padding: 15px 20px;
			  border-radius: 6px;
			  background-color: #282828;
			  color: #fff;
			  font-size: 15px;
			  line-height: 1.4;
			  box-shadow: 0 0 10px rgba(255, 0, 0, 0.5);
			  white-space: pre-wrap;
			}
	
			p {
			  margin: 8px 0;
			}
	
			p.error {
			  color: #ff4444;
			  font-weight: 700;
			}
		  `;
	
		  constructor() {
			super();
			this.input1 = '';
			this.input2 = '';
			this.dropdownValue = '4';
			this.lat = '';
			this.lon = '';
			this.error = '';
			this.generatedButtons = [];
			this.selectedAddress = '';
			this.var_lat = '';
			this.var_lon = '';
			this.selectedDirection = '';
			this.distance = null;

		  }
		  haversineDistance(lat1, lon1, lat2, lon2) {
			const toRad = deg => deg * Math.PI / 180;
			const R = 6371; // Radius of Earth in km

			const dLat = toRad(lat2 - lat1);
			const dLon = toRad(lon2 - lon1);

			const a = Math.sin(dLat / 2) ** 2 +
						Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) *
						Math.sin(dLon / 2) ** 2;

			const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

			return R * c;
			}
		  handleInput1Change(e) {
			this.input1 = e.target.value;
		  }
	
		  handleInput2Change(e) {
			this.input2 = e.target.value;
		  }
	
		  handleDropdownChange(e) {
			this.dropdownValue = e.target.value;
		  }
	
		  async getLatLonFromAddress(address, useragent) {
			const url = `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(address)}&format=json`;
	
			try {
			  const response = await fetch(url, {
				headers: {
				  'User-Agent': useragent || 'lit-app/1.0'
				}
			  });
	
			  const data = await response.json();
			  if (data.length > 0) {
				const { lat, lon } = data[0];
				this.lat = lat;
				this.lon = lon;
				this.error = '';
	
				const latNum = parseFloat(lat);
				const lonNum = parseFloat(lon);
				const n = parseInt(this.dropdownValue);
	
				const directions = [
				  ([lat, lon], offset) => [lat + offset, lon],
				  ([lat, lon], offset) => [lat, lon + offset],
				  ([lat, lon], offset) => [lat - offset, lon],
				  ([lat, lon], offset) => [lat, lon - offset]
				];
	
				const result = [];
				let offset = 1;
				while (result.length < n) {
				  for (let dir of directions) {
					if (result.length >= n) break;
					const [lt, ln] = dir([latNum, lonNum], offset);
					result.push({
					  label: `Lat: ${lt.toFixed(6)}, Lon: ${ln.toFixed(6)}`,
					  value: [lt, ln]
					});
				  }
				  offset++;
				}
	
				const baseLat = latNum;
				const baseLon = lonNum;

				this.generatedButtons = result.sort((a, b) => {
				const dist = ([lat, lon]) => Math.sqrt(((lat - baseLat)*(lat - baseLat))+((lon - baseLon)*(lon - baseLon))) ;
				return dist(a.value) - dist(b.value);
				});

			  } else {
				this.error = 'No results found.';
				this.generatedButtons = [];
				this.distance = null;
			  }
			} catch (err) {
			  this.error = 'Failed to fetch coordinates.';
			  this.generatedButtons = [];
			  this.distance = null;
			}
		  }
	
		  async handleGeneratedButtonClick([lat, lon]) {
			this.var_lat = lat;
			this.var_lon = lon;

			const baseLat = parseFloat(this.lat);
			const baseLon = parseFloat(this.lon);
			const varLatNum = parseFloat(lat);
			const varLonNum = parseFloat(lon);

			const dLat = varLatNum - baseLat;
			const dLon = varLonNum - baseLon;
			this.distance = this.haversineDistance(baseLat, baseLon, varLatNum, varLonNum).toFixed(2);

			if (Math.abs(dLat) > Math.abs(dLon)) {
				this.selectedDirection = dLat > 0 ? 'North' : 'South';
			} else {
				this.selectedDirection = dLon > 0 ? 'East' : 'West';
			}


			const url = `https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lon}&format=json`;
	
			try {
			  const response = await fetch(url, {
				headers: {
				  'User-Agent': this.input2 || 'lit-app/1.0'
				}
			  });
			  const data = await response.json();
			  this.selectedAddress = data.display_name || 'No address found';
			} catch (err) {
			  this.selectedAddress = 'Failed to fetch address.';
			}
		  }
	
		  renderButtonRows() {
			const buttonsPerRow = 4;
			const rows = [];
	
			for (let i = 0; i < this.generatedButtons.length; i += buttonsPerRow) {
			  const chunk = this.generatedButtons.slice(i, i + buttonsPerRow);
			  rows.push(chunk);
			}
	
			return html`
			  ${rows.map(row => html`
				<div>
				  ${row.map(item => html`
					<button @click=${() => this.handleGeneratedButtonClick(item.value)}>
					  ${item.label}
					</button>
				  `)}
				  <br />
				</div>
			${this.selectedDirection
				? html`
					<div class="address-output">
						<strong>Selected Direction from Base:</strong> ${this.selectedDirection}<br />
						${this.distance
						? html`<strong>Distance:</strong> ${this.distance} km<br />`
						: ''}
					</div>
					`
				: ''}

			  `)}
			`;
		  }
	
		  render() {
			return html`
			  <div>
				<input
				  type="text"
				  placeholder="Address"
				  @input=${this.handleInput1Change}
				  spellcheck="false"
				  autocomplete="off"
				/>
				<input
				  type="text"
				  placeholder="User Agent"
				  @input=${this.handleInput2Change}
				  spellcheck="false"
				  autocomplete="off"
				/>
				<select @change=${this.handleDropdownChange}>
				  <option value="4">4</option>
				  <option value="8">8</option>
				  <option value="20">20</option>
				  <option value="100">100</option>
				  <option value="160">160</option>
				  <option value="1600">1600</option>
				  <option value="16000">16000</option>
				</select>
				<button @click=${() => this.getLatLonFromAddress(this.input1, this.input2)}>
				  Search
				</button>
	
				${this.error
				  ? html`<p class="error">${this.error}</p>`
				  : this.lat && this.lon
					? html`<p>Latitude: ${this.lat}</p><p>Longitude: ${this.lon}</p>`
					: html`<p>No data yet</p>`}
	
				<div class="button-container">
				  ${this.renderButtonRows()}
				</div>
	
				${this.selectedAddress
				  ? html`
					  <div class="address-output">
						<strong>Reverse Geocoded Address:</strong><br />
						${this.selectedAddress}
					  </div>
					`
				  : ''}
			  </div>
			`;
		  }
		}
	
		customElements.define('input-dropdown-form', InputDropdownForm);
