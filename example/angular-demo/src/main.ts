import { bootstrapApplication } from '@angular/platform-browser';
import { appConfig } from './app/app.config';
import { AppComponent } from './app/app.component';

// Web bileşeni oluşturmak için alternatif bir yaklaşım
// Basit bir test web bileşeni oluşturalım
class TestZenGrid extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
    
    // Stil oluştur
    const style = document.createElement('style');
    style.textContent = `
      :host {
        display: block;
        border: 2px solid blue;
        padding: 20px;
        margin: 20px 0;
      }
      .content {
        background-color: #f0f8ff;
        padding: 15px;
      }
    `;
    
    // İçerik oluştur
    const content = document.createElement('div');
    content.className = 'content';
    content.innerHTML = `
      <h2>Test ZenGrid Bileşeni</h2>
      <p>Bu geçici bir test bileşenidir.</p>
    `;
    
    this.shadowRoot?.appendChild(style);
    this.shadowRoot?.appendChild(content);
    
    console.log('TestZenGrid bileşeni oluşturuldu');
  }
}

class TestZenGridToolbar extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
    
    // Stil oluştur
    const style = document.createElement('style');
    style.textContent = `
      :host {
        display: block;
        border: 2px solid green;
        padding: 10px;
        margin-bottom: 10px;
        background-color: #e6ffe6;
      }
      .buttons {
        display: flex;
        gap: 10px;
      }
      button {
        padding: 5px 10px;
        background: #4CAF50;
        color: white;
        border: none;
        border-radius: 4px;
        cursor: pointer;
      }
    `;
    
    // İçerik oluştur
    const content = document.createElement('div');
    content.innerHTML = `
      <h3>Test ZenGrid Toolbar</h3>
      <div class="buttons">
        <button>Test Buton 1</button>
        <button>Test Buton 2</button>
      </div>
    `;
    
    this.shadowRoot?.appendChild(style);
    this.shadowRoot?.appendChild(content);
    
    console.log('TestZenGridToolbar bileşeni oluşturuldu');
  }
}

// Test bileşenlerini tanımla
if (!customElements.get('zen-grid')) {
  console.log('zen-grid test bileşeni kaydediliyor...');
  customElements.define('zen-grid', TestZenGrid);
}

if (!customElements.get('zen-grid-toolbar')) {
  console.log('zen-grid-toolbar test bileşeni kaydediliyor...');
  customElements.define('zen-grid-toolbar', TestZenGridToolbar);
}

console.log('Test bileşenleri tanımlandı');

bootstrapApplication(AppComponent, appConfig)
  .catch((err) => console.error('Angular başlatma hatası:', err));
