  import { LitElement, html, css } from 'https://unpkg.com/lit?module';

    class SvgWordCloud extends LitElement {
      static styles = css`
        :host {
          display: block;
          padding: 1rem;
          background-color: #1e1e1e;
          color: white;
          font-family: 'Segoe UI', sans-serif;
        }
        svg {
          width: 100%;
          height: 600px;
          background: #121212;
          border-radius: 10px;
        }
        text {
          cursor: pointer;
          opacity: 0;
          transform: scale(0.8);
          animation: fadeIn 0.5s forwards;
        }
        @keyframes fadeIn {
          to {
            opacity: 1;
            transform: scale(1);
          }
        }
      `;

      async firstUpdated() {
        const text = await this.getTextFromPage('index.html');
        this.renderWordCloud(text);
      }

      async getTextFromPage(url) {
        const res = await fetch(url);
        const html = await res.text();
        const doc = new DOMParser().parseFromString(html, 'text/html');
        return doc.body.innerText;
      }

      getWordFrequencies(text) {
        const stopwords = new Set(['the', 'is', 'for', 'and', 'of', 'a', 'to', 'in', 'on', 'with']);
        const words = text.toLowerCase().match(/\b[a-z]{3,}\b/g) || [];
        const freq = {};
        for (const word of words) {
          if (!stopwords.has(word)) {
            freq[word] = (freq[word] || 0) + 1;
          }
        }
        return freq;
      }

      renderWordCloud(text) {
        const frequencies = this.getWordFrequencies(text);
        const entries = Object.entries(frequencies).sort((a, b) => b[1] - a[1]).slice(0, 50);

        const svg = this.renderRoot.querySelector('svg');
        const width = svg.clientWidth;
        const height = svg.clientHeight;

        svg.innerHTML = '';

        entries.forEach(([word, freq], index) => {
			const fontSize = 12 + freq * 2;
			const x = Math.random() * (width - 100);
			const y = Math.random() * (height - 50);
			const color = `hsl(${Math.random() * 360}, 70%, 60%)`;

			const text = document.createElementNS('http://www.w3.org/2000/svg', 'text');
			text.setAttribute('x', x);
			text.setAttribute('y', y);
			text.setAttribute('fill', color);
			text.setAttribute('font-size', fontSize);
			text.setAttribute('font-weight', 'bold');
			text.setAttribute('text-anchor', 'middle');
			text.setAttribute('style', `
			animation-delay: ${index * 0.05}s;
			transition: transform 0.2s ease, fill 0.2s ease;
			`);
			text.textContent = word;

			// Hover effect
			text.addEventListener('mouseenter', () => {
			text.setAttribute('fill', 'white');
			text.setAttribute('transform', `scale(1.2)`);
			});
			text.addEventListener('mouseleave', () => {
			text.setAttribute('fill', color);
			text.setAttribute('transform', `scale(1)`);
			});

			// Click action
			text.addEventListener('click', () => {
			alert(`You clicked: ${word}`);
			});

          svg.appendChild(text);
        });
      }

      render() {
        return html`<svg viewBox="0 0 800 600"></svg>`;
      }
    }

    customElements.define('svg-word-cloud', SvgWordCloud);
  