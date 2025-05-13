import { Component, CUSTOM_ELEMENTS_SCHEMA, ElementRef, AfterViewInit, ViewChild, NgZone } from '@angular/core';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  template: `
    <h1>Zen-Grid Angular Demo</h1>
    
    <div class="container">
      <!-- Toolbar Bileşeni -->
      <zen-grid-toolbar #zenGridToolbar></zen-grid-toolbar>
      
      <!-- Grid Bileşeni -->
      <zen-grid #zenGrid
        [data]="users" 
        [columns]="columns"
        [pagination-options]="paginationOptionStr"
        [sort-options]="sortOptionStr">
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
  `],
})
export class AppComponent implements AfterViewInit {
  @ViewChild('zenGrid') zenGridElement!: ElementRef;
  @ViewChild('zenGridToolbar') zenGridToolbarElement!: ElementRef;
  
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
    { field: 'id', header: 'Sıra', width: '50px', sortable: true },
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
  
  // JSON stringler olarak tutulacak özellikler
  get paginationOptionStr(): string {
    return JSON.stringify(this.paginationOptions);
  }
  
  get sortOptionStr(): string {
    return JSON.stringify(this.sortOptions);
  }
  
  constructor(private zone: NgZone) {}
  
  ngAfterViewInit() {
    // Grid için olay dinleyicilerini ekle
    this.setupGridEventListeners();
    
    // Toolbar için özel ayarlamaları yap
    this.setupCustomToolbar();
  }
  
  /**
   * Grid olaylarını dinleyicilere bağlar
   */
  setupGridEventListeners() {
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
  
  /**
   * Toolbar için özel ayarlamaları yapar
   */
  setupCustomToolbar() {
    if (this.zenGridToolbarElement && this.zenGridToolbarElement.nativeElement) {
      // Burada özel toolbar öğeleri ekleyebiliriz veya varsayılan davranışı kullanabiliriz
      // Örnek: toolbar.clearRightSection() ve kendi özel butonlarımızı eklemek istesek
      // Ancak varsayılan olarak toolbar zaten otomatik olarak bağlanıyor
      
      // Örnek: Başlığı değiştirmek
      setTimeout(() => {
        if (this.zenGridToolbarElement && this.zenGridToolbarElement.nativeElement) {
          const titleElement = this.zenGridToolbarElement.nativeElement.shadowRoot?.querySelector('.zen-grid-toolbar-title');
          if (titleElement) {
            titleElement.textContent = 'Kullanıcılar Tablosu';
          }
        }
      }, 100);
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
} 