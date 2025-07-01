import { LitElement, html, css } from 'https://cdn.jsdelivr.net/npm/lit@3.1.2/+esm';
import { customElement, state } from 'https://cdn.jsdelivr.net/npm/lit@3.1.2/decorators.js/+esm';
import gsap from 'https://cdn.jsdelivr.net/npm/gsap@3.12.5/+esm';

// @customElement('paginated-animated-table')
class PaginatedAnimatedTable extends LitElement {
    static properties = {
    data: { type: Array },
    currentPage: {type: Number},
    itemsPerPage: {type: Number}
    
  };
  static styles = css`
    table {
      width: 100%;
      border-collapse: collapse;
    }
    th, td {
      padding: 8px;
      border: 1px solid #ccc;
    }
    .pagination {
      margin-top: 10px;
      display: flex;
      justify-content: center;
      gap: 10px;
    }
  `;

    constructor() {
        super();
        this.data = [];           // Your JSON structure (array of objects)
        this.currentPage = 1;  // Which shop is selected
        this.itemsPerPage = 10;
  }
  async connectedCallback() {
    super.connectedCallback();
    const response = await fetch('./datasets/barcodesData.json');
    this.data = await response.json();
    await this.updateComplete;
    this.animateTable();
  }

  get paginatedData() {
    const start = (this.currentPage - 1) * this.itemsPerPage;
    return this.data.slice(start, start + this.itemsPerPage);
  }

  nextPage() {
    if (this.currentPage * this.itemsPerPage < this.data.length) {
      this.currentPage++;
      this.updateComplete.then(() => this.animateTable());
    }
  }

  prevPage() {
    if (this.currentPage > 1) {
      this.currentPage--;
      this.updateComplete.then(() => this.animateTable());
    }
  }

  animateTable() {
    const rows = this.renderRoot.querySelectorAll('tbody tr');
    gsap.fromTo(rows, { opacity: 0, y: 10 }, { opacity: 1, y: 0, duration: 0.5, stagger: 0.1 });
  }

  render() {
    return html`
      <table>
        <thead>
          <tr>
            <th>Name</th>
            <th>Number</th>
            <th>Price</th>
            <th>Stock</th>
          </tr>
        </thead>
        <tbody>
          ${this.paginatedData.map(
            item => html`
              <tr>
                <td>${item.barcodeName}</td>
                <td>${item.barcodeNumber}</td>
                <td>${item.barcodePrice}</td>
                <td>
                ${item.barcodeStock > 0 ? html`✅ Total ${item.barcodeStock} items available` : html`❌`}
                </td>

                
              </tr>
            `
          )}
        </tbody>
      </table>
      <div class="pagination">
        <button @click=${this.prevPage} ?disabled=${this.currentPage === 1}>Prev</button>
        <span>Page ${this.currentPage}</span>
        <button @click=${this.nextPage} ?disabled=${this.currentPage * this.itemsPerPage >= this.data.length}>Next</button>
      </div>
    `;
  }
}
customElements.define('paginated-animated-table', PaginatedAnimatedTable);
