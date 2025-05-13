import { Component, CUSTOM_ELEMENTS_SCHEMA, ElementRef, AfterViewInit, ViewChild, NgZone, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
// ZenGrid bileşenleri
import { ZenGrid, ZenGridToolbar } from 'zen-grid';

// Bu satır geliştirme amaçlıdır, gerçek uygulamada kaldırılabilir
console.log('ZenGrid sınıfı import edildi:', !!ZenGrid, 'ZenGridToolbar sınıfı import edildi:', !!ZenGridToolbar);

// Arabirim ekleyelim
interface ToolbarOptions {
  visible: boolean;
  search: boolean;
  export: boolean;
  language: string;
}

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  template: `
    <h1>Zen-Grid Angular Demo</h1>
    
    <div class="container">
      <zen-grid-toolbar></zen-grid-toolbar>
      
      <zen-grid #zenGrid
        [data]="users" 
        [columns]="columns"
        [pagination-options]="paginationOptions"
        [sort-options]="sortOptions"
        [toolbar-options]="toolbarOptions">
      </zen-grid>

      <div class="settings-panel">
        <div class="setting">
          <label>Sayfa Boyutu:</label>
          <select #pageSizeSelect (change)="updatePageSize(pageSizeSelect.value)">
            <option value="2">2</option>
            <option value="3" selected>3</option>
            <option value="5">5</option>
            <option value="10">10</option>
          </select>
        </div>
        
        <div class="setting-group">
          <h3>Toolbar Ayarları</h3>
          <div class="setting">
            <label>Görünürlük:</label>
            <button (click)="updateToolbarVisibility(true)">Görünür</button>
            <button (click)="updateToolbarVisibility(false)">Gizli</button>
          </div>
          
          <div class="setting">
            <label>Arama:</label>
            <button (click)="updateToolbarSearch(true)">Açık</button>
            <button (click)="updateToolbarSearch(false)">Kapalı</button>
          </div>
          
          <div class="setting">
            <label>Dışa Aktarma:</label>
            <button (click)="updateToolbarExport(true)">Açık</button>
            <button (click)="updateToolbarExport(false)">Kapalı</button>
          </div>
          
          <div class="setting">
            <label>Dil:</label>
            <button (click)="updateToolbarLanguage('tr')">Türkçe</button>
            <button (click)="updateToolbarLanguage('en')">İngilizce</button>
          </div>
        </div>
      </div>
      
      <!-- Geçerli ayarları göster -->
      <div class="current-settings">
        <h3>Geçerli Toolbar Ayarları</h3>
        <pre>{{ toolbarOptions | json }}</pre>
      </div>
      
      <!-- Direkt veri görüntüleme -->
      <div class="manual-data">
        <h3>Manuel Veri Görüntüleme</h3>
        <table class="basic-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Ad Soyad</th>
              <th>E-posta</th>
              <th>Yaş</th>
              <th>Şehir</th>
            </tr>
          </thead>
          <tbody>
            <tr *ngFor="let user of users">
              <td>{{user.id}}</td>
              <td>{{user.name}}</td>
              <td>{{user.email}}</td>
              <td>{{user.age}}</td>
              <td>{{user.city}}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  `,
  styles: [`
    .container {
      margin: 20px;
      padding: 20px;
      border: 1px solid #eee;
      border-radius: 4px;
    }
    .settings-panel {
      margin-top: 20px;
      padding: 10px;
      background-color: #f9f9f9;
      border: 1px solid #eee;
      border-radius: 4px;
    }
    .setting {
      margin-bottom: 10px;
    }
    .setting label {
      display: inline-block;
      width: 120px;
      font-weight: bold;
    }
    .setting button {
      margin-right: 5px;
      padding: 5px 10px;
      border: 1px solid #ddd;
      border-radius: 4px;
      background-color: #fff;
      cursor: pointer;
    }
    .setting button:hover {
      background-color: #f0f0f0;
    }
    .setting-group {
      margin-top: 15px;
      padding: 10px;
      border: 1px solid #ddd;
      border-radius: 4px;
    }
    .setting-group h3 {
      margin-top: 0;
      margin-bottom: 10px;
    }
    .current-settings {
      margin-top: 15px;
      padding: 10px;
      border: 1px solid #ddd;
      border-radius: 4px;
      background-color: #f5f5f5;
    }
    .current-settings pre {
      margin: 0;
      padding: 10px;
      background-color: #fff;
      border: 1px solid #eee;
      border-radius: 4px;
      overflow: auto;
    }
    .manual-data {
      margin-top: 30px;
      padding: 15px;
      border: 1px solid #ddd;
      border-radius: 4px;
      background-color: #f9f9f9;
    }
    .basic-table {
      width: 100%;
      border-collapse: collapse;
      margin-top: 10px;
    }
    .basic-table th, .basic-table td {
      border: 1px solid #ddd;
      padding: 8px;
      text-align: left;
    }
    .basic-table th {
      background-color: #f2f2f2;
    }
    .basic-table tr:nth-child(even) {
      background-color: #f5f5f5;
    }
  `],
})
export class AppComponent implements AfterViewInit, OnInit {
  @ViewChild('zenGrid') zenGridElement?: ElementRef;
  
  users = [
    { id: 1, name: 'Ahmet Yılmaz', email: 'ahmet@example.com', age: 28, city: 'İstanbul' },
    { id: 2, name: 'Mehmet Demir', email: 'mehmet@example.com', age: 34, city: 'Ankara' },
    { id: 3, name: 'Berkant Şahin', email: 'berkant@example.com', age: 27, city: 'İzmir' },
    { id: 4, name: 'Fatma Şahin', email: 'fatma@example.com', age: 30, city: 'Bursa' },
    { id: 5, name: 'Ali Can', email: 'ali@example.com', age: 32, city: 'Antalya' },
    { id: 6, name: 'Zeynep Aydın', email: 'zeynep@example.com', age: 27, city: 'Adana' },
    { id: 7, name: 'Mustafa Yıldız', email: 'mustafa@example.com', age: 36, city: 'Konya' },
    { id: 8, name: 'Emine Çelik', email: 'emine@example.com', age: 29, city: 'Eskişehir' },
    { id: 9, name: 'Hüseyin Öztürk', email: 'huseyin@example.com', age: 33, city: 'Trabzon' },
    { id: 10, name: 'Hatice Yılmaz', email: 'hatice@example.com', age: 31, city: 'Samsun' }
  ];
  
  columns = [
    { field: 'id', header: 'ID', width: '50px', sortable: true },
    { field: 'name', header: 'Ad Soyad', sortable: true },
    { field: 'email', header: 'E-posta' },
    { field: 'age', header: 'Yaş', sortable: true, align: 'right' },
    { field: 'city', header: 'Şehir', sortable: true }
  ];
  
  paginationOptions = {
    pageSize: 3,
    currentPage: 1,
    totalItems: 10,
    showFirstLastButtons: true,
    maxPageButtons: 5
  };
  
  sortOptions = {
    field: 'name',
    direction: 'asc'
  };
  
  toolbarOptions: ToolbarOptions = {
    visible: true,
    search: true,
    export: true,
    language: 'tr'
  };
  
  constructor(private zone: NgZone) {}
  
  /**
   * Zen-Grid ve Zen-Grid-Toolbar arasındaki bağlantıları manuel olarak kurar
   * Bu fonksiyon, web bileşenleri arasındaki iletişim sorunlarını çözmek için eklendi
   */
  private setupComponentConnections(): void {
    console.log('Angular: Grid ve Toolbar arasındaki bağlantılar kuruluyor');
    
    // Tüm sayfayı tara
    setTimeout(() => {
      // ZenGrid ve ZenGridToolbar elementlerini bul
      const gridElements = document.querySelectorAll('zen-grid');
      const toolbarElements = document.querySelectorAll('zen-grid-toolbar');
      
      console.log(`Angular: ${gridElements.length} grid ve ${toolbarElements.length} toolbar bulundu`);
      
      if (gridElements.length > 0 && toolbarElements.length > 0) {
        // Her grid için en yakın toolbar'ı bul ve referansları kur
        gridElements.forEach((grid, index) => {
          const toolbar = toolbarElements[index] || toolbarElements[0];
          
          // Test script ile grid ve toolbar arasında doğrudan bağlantı kur
          try {
            // @ts-ignore: Web bileşeni özel özellikleri
            grid._toolbarElement = toolbar;
            
            // @ts-ignore: Web bileşeni özel özellikleri
            toolbar.gridElement = grid;
            
            console.log('Angular: Grid ve Toolbar arasında manuel bağlantı kuruldu');
            
            // Sıfırdan arama fonksiyonunu kur
            const searchInput = toolbar.shadowRoot?.querySelector('.zen-grid-search-input') as HTMLInputElement;
            if (searchInput) {
              searchInput.addEventListener('input', (e) => {
                const target = e.target as HTMLInputElement;
                const searchTerm = target.value;
                console.log('Angular: Manuel arama eventlistener çalıştı:', searchTerm);
                
                // @ts-ignore: filter metodu
                if (typeof grid.filter === 'function') {
                  if (searchTerm.trim()) {
                    // @ts-ignore: filter metodu
                    grid.filter({ searchTerm: searchTerm.trim() });
                  } else {
                    // @ts-ignore: filter metodu
                    grid.filter({});
                  }
                }
              });
              console.log('Angular: Arama kutusuna manuel event listener eklendi');
            }
          } catch (e) {
            console.error('Angular: Grid-Toolbar bağlantısı manuel kurulurken hata:', e);
          }
        });
      }
    }, 500);
  }
  
  ngOnInit() {
    console.log('AppComponent ngOnInit çağrıldı');
    
    // Bileşenlerin durumunu kontrol et
    if (!customElements.get('zen-grid')) {
      console.warn('zen-grid henüz tanımlanmamış!');
    }
    
    if (!customElements.get('zen-grid-toolbar')) {
      console.warn('zen-grid-toolbar henüz tanımlanmamış!');
    }
    
    // Grid ve Toolbar arasındaki bağlantıyı manuel olarak kur
    this.setupComponentConnections();
    
    // 2 saniye sonra tekrar kontrol et
    setTimeout(() => {
      if (!customElements.get('zen-grid')) {
        console.error('zen-grid hala tanımlanmamış!');
      } else {
        console.log('zen-grid tanımlı durumda.');
      }
      
      if (!customElements.get('zen-grid-toolbar')) {
        console.error('zen-grid-toolbar hala tanımlanmamış!');
      } else {
        console.log('zen-grid-toolbar tanımlı durumda.');
      }
    }, 2000);
  }
  
  ngAfterViewInit() {
    // Toolbar seçeneklerini manuel olarak ayarla
    if (this.zenGridElement && this.zenGridElement.nativeElement) {
      console.log('ngAfterViewInit: Toolbar seçenekleri atanıyor:', this.toolbarOptions);
      
      // Doğrudan attribute olarak ayarla (en güvenli yöntem)
      this.zenGridElement.nativeElement.setAttribute('toolbar-options', 
        JSON.stringify({
          visible: this.toolbarOptions.visible,
          search: this.toolbarOptions.search, 
          export: this.toolbarOptions.export,
          language: this.toolbarOptions.language
        })
      );
      
      // Biraz gecikme ile event tetikleyelim
      setTimeout(() => {
        this.updateToolbarOptions();
      }, 300);
    }
    
    // Manuel olarak event dinleyicisi ekle
    if (this.zenGridElement && this.zenGridElement.nativeElement) {
      this.zenGridElement.nativeElement.addEventListener('selectionChange', 
        (event: Event) => {
          this.zone.run(() => {
            const customEvent = event as CustomEvent;
            this.onSelectionChange(customEvent.detail);
          });
        });
      
      this.zenGridElement.nativeElement.addEventListener('sortChange',
        (event: Event) => {
          this.zone.run(() => {
            const customEvent = event as CustomEvent;
            this.onSortChange(customEvent.detail);
          });
        });
      
      this.zenGridElement.nativeElement.addEventListener('pageChange',
        (event: Event) => {
          this.zone.run(() => {
            const customEvent = event as CustomEvent;
            this.onPageChange(customEvent.detail);
          });
        });
    }
  }
  
  updatePageSize(size: string) {
    const pageSize = parseInt(size, 10);
    this.paginationOptions = {
      ...this.paginationOptions,
      pageSize,
      currentPage: 1 // Sayfa boyutu değiştiğinde ilk sayfaya dön
    };
    
    if (this.zenGridElement && this.zenGridElement.nativeElement) {
      this.zenGridElement.nativeElement.paginationOptions = this.paginationOptions;
    }
  }
  
  onSelectionChange(selectedRows: any[]) {
    console.log('Seçili satırlar:', selectedRows);
  }
  
  onSortChange(sortOptions: any) {
    console.log('Sıralama değişti:', sortOptions);
    this.sortOptions = sortOptions;
  }
  
  onPageChange(pageNumber: number) {
    console.log('Sayfa değişti:', pageNumber);
    this.paginationOptions = {
      ...this.paginationOptions,
      currentPage: pageNumber
    };
  }
  
  updateToolbarVisibility(visible: boolean) {
    this.toolbarOptions = {
      ...this.toolbarOptions,
      visible: visible ? true : false
    };
    
    console.log('Toolbar görünürlüğü değişti:', visible);
    this.updateToolbarOptions();
  }
  
  updateToolbarSearch(search: boolean) {
    this.toolbarOptions = {
      ...this.toolbarOptions,
      search: search ? true : false
    };
    
    console.log('Arama görünürlüğü değişti:', search);
    this.updateToolbarOptions();
  }
  
  updateToolbarExport(exportVisible: boolean) {
    this.toolbarOptions = {
      ...this.toolbarOptions,
      export: exportVisible ? true : false
    };
    
    console.log('Dışa aktarma görünürlüğü değişti:', exportVisible);
    this.updateToolbarOptions();
  }
  
  updateToolbarLanguage(language: string) {
    this.toolbarOptions = {
      ...this.toolbarOptions,
      language
    };
    
    console.log('Dil değişti:', language);
    this.updateToolbarOptions();
  }
  
  updateToolbarOptions() {
    if (this.zenGridElement && this.zenGridElement.nativeElement) {
      // Boolean değerleri sayılara dönüştür (1 = true, 0 = false)
      const numericToolbarOptions = {
        visible: this.toolbarOptions.visible ? true : false,
        search: this.toolbarOptions.search ? true : false,
        export: this.toolbarOptions.export ? true : false,
        language: this.toolbarOptions.language
      };
      
      console.log('Toolbar seçenekleri güncelleniyor:', numericToolbarOptions);
      
      try {
        // 1. Doğrudan öznitelik (attribute) ayarla - en güvenilir yöntem
        this.zenGridElement.nativeElement.setAttribute(
          'toolbar-options', 
          JSON.stringify(numericToolbarOptions)
        );
        console.log('Toolbar seçenekleri attribute olarak ayarlandı');
        
        // 2. HTML özelliği olarak ayarla
        this.zenGridElement.nativeElement.toolbarOptions = numericToolbarOptions;
        console.log('Toolbar seçenekleri property olarak ayarlandı');
        
        // 3. Özel olay tetikle
        setTimeout(() => {
          if (this.zenGridElement && this.zenGridElement.nativeElement) {
            const event = new CustomEvent('toolbarOptionsChange', {
              detail: numericToolbarOptions
            });
            
            console.log('ToolbarOptionsChange olayı tetikleniyor:', event.detail);
            
            try {
              this.zenGridElement.nativeElement.dispatchEvent(event);
              console.log('Toolbar seçenekleri olayı gönderildi');
            } catch (error) {
              console.error('Toolbar olay tetikleme hatası:', error);
            }
          }
        }, 0);
        
      } catch (err) {
        console.error('Toolbar seçenekleri güncellenirken hata oluştu:', err);
      }
    }
  }
}
