const tagName = "ds-spinner";
const styleId = "ds-spinner-styles";

if (!document.getElementById(styleId)) {
  const style = document.createElement("style");

  style.id = styleId;
  style.textContent = `
    ds-spinner {
      display: inline-flex;
      width: var(--ds-component-icon-size-sm);
      height: var(--ds-component-icon-size-sm);
      align-items: center;
      justify-content: center;
      color: inherit;
      vertical-align: middle;
    }

    ds-spinner[size="medium"] {
      width: var(--ds-component-icon-size-md);
      height: var(--ds-component-icon-size-md);
    }

    ds-spinner[size="large"] {
      width: var(--ds-component-icon-size-lg);
      height: var(--ds-component-icon-size-lg);
    }

    ds-spinner > svg {
      display: block;
      width: 100%;
      height: 100%;
      animation: ds-spinner-rotate 1s linear infinite;
      transform-origin: center;
    }

    ds-spinner > svg path {
      stroke-width: var(--ds-semantic-border-width-default);
    }

    @media (prefers-reduced-motion: reduce) {
      ds-spinner > svg {
        animation: none;
      }
    }

    @keyframes ds-spinner-rotate {
      to {
        transform: rotate(360deg);
      }
    }
  `;
  document.head.append(style);
}

const svg = `
  <svg aria-hidden="true" viewBox="0 0 16.5 16.5" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M15.75 8.25037C15.7499 9.83419 15.2484 11.3773 14.3174 12.6586C13.3864 13.9399 12.0737 14.8936 10.5674 15.383C9.06108 15.8724 7.4385 15.8723 5.9322 15.3829C4.42591 14.8934 3.11323 13.9396 2.1823 12.6583C1.25138 11.3769 0.749989 9.83377 0.75 8.24995C0.750011 6.66612 1.25142 5.12296 2.18237 3.84162C3.11331 2.56028 4.426 1.60654 5.9323 1.1171C7.4386 0.627656 9.06119 0.627633 10.5675 1.11703" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round"/>
  </svg>
`;

/**
 * Decorative loading indicator. The parent owns status text and announcements.
 */
export class Spinner extends HTMLElement {
  connectedCallback() {
    this.setAttribute("aria-hidden", "true");
    if (!this.querySelector("svg")) this.innerHTML = svg;
  }
}

if (!customElements.get(tagName)) customElements.define(tagName, Spinner);
