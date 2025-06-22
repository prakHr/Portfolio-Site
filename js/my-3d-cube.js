import { LitElement, html, css } from 'https://cdn.jsdelivr.net/gh/lit/dist@2/all/lit-all.min.js';

class My3DCube extends LitElement {
  static styles = css`
    :host {
      display: block;
      perspective: 1000px;
    }

    .scene {
      width: 300px;
      height: 300px;
      margin: 40px auto;
      position: relative;
      transform-style: preserve-3d;
      animation: spin 20s infinite linear;
      transform: rotateX(-20deg) rotateY(-20deg);
    }

    .face {
      position: absolute;
      width: 300px;
      height: 300px;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 1.5rem;
      font-weight: bold;
      color: white;
      cursor: pointer;
      user-select: none;
      border: 1px solid #444;
      background: rgba(255, 255, 255, 0.08);
      backdrop-filter: blur(8px);
      transition: background 0.3s ease;
      box-shadow: 0 0 12px #00000044;
    }

    .face:hover {
      background: rgba(255, 255, 255, 0.2);
      border-color: #fff;
    }

    /* Face transforms */
    .front  { transform: rotateY(0deg)    translateZ(150px); }
    .back   { transform: rotateY(180deg)  translateZ(150px); }
    .right  { transform: rotateY(90deg)   translateZ(150px); }
    .left   { transform: rotateY(-90deg)  translateZ(150px); }
    .top    { transform: rotateX(90deg)   translateZ(150px); }
    .bottom { transform: rotateX(-90deg)  translateZ(150px); }

    /* Optional: color hints per face */
    .front  { background-color: rgba(255, 99, 132, 0.1); }
    .back   { background-color: rgba(54, 162, 235, 0.1); }
    .right  { background-color: rgba(255, 206, 86, 0.1); }
    .left   { background-color: rgba(75, 192, 192, 0.1); }
    .top    { background-color: rgba(153, 102, 255, 0.1); }
    .bottom { background-color: rgba(255, 159, 64, 0.1); }

    @keyframes spin {
      0%   { transform: rotateX(-20deg) rotateY(0deg); }
      100% { transform: rotateX(-20deg) rotateY(360deg); }
    }
  `;

  chartMap = {
    front: 'pie',
    back: 'bar',
    right: 'doughnut',
    left: 'polarArea',
    top: 'radar',
    bottom: 'line'
  };

  renderFace(face) {
    return html`
      <div class="face ${face}" @click=${() => this._onFaceClick(face)}>
        ${face.toUpperCase()}
      </div>
    `;
  }

  _onFaceClick(face) {
    const chartType = this.chartMap[face];
    this.dispatchEvent(new CustomEvent('face-clicked', {
      detail: { face, chartType },
      bubbles: true,
      composed: true
    }));
  }

  render() {
    return html`
      <div class="scene">
        ${this.renderFace('front')}
        ${this.renderFace('back')}
        ${this.renderFace('right')}
        ${this.renderFace('left')}
        ${this.renderFace('top')}
        ${this.renderFace('bottom')}
      </div>
    `;
  }
}

customElements.define('my-3d-cube', My3DCube);
