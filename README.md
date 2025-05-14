# Zen-Grid

Modern ve esnek veri tablosu komponenti. Angular, React ve Vue ile sorunsuz çalışır.

*A modern and flexible data table component. Works seamlessly with Angular, React, and Vue.*

## Özellikler | Features

- Web Component olarak tüm JavaScript framework'lerinde kullanılabilir
- Sıralama, filtreleme ve sayfalama özellikleri
- Özelleştirilebilir hücreler ve sütunlar
- Duyarlı tasarım
- TypeScript desteği

*- Can be used in all JavaScript frameworks as a Web Component*
*- Sorting, filtering, and pagination features*
*- Customizable cells and columns*
*- Responsive design*
*- TypeScript support*

## Kurulum | Installation

```bash
npm install zen-grid
# veya | or
yarn add zen-grid
```

## Kullanım | Usage

### HTML

```html
<zen-grid id="my-table"></zen-grid>

<script>
  const table = document.getElementById('my-table');
  table.data = [
    { id: 1, name: 'Berkant', age: 27 },
    { id: 2, name: 'Mehmet', age: 30 },
    { id: 3, name: 'Ayşe', age: 28 }
  ];
  table.columns = [
    { field: 'id', header: 'ID' },
    { field: 'name', header: 'İsim' },
    { field: 'age', header: 'Yaş' }
  ];
</script>
```

### Angular

```html
<zen-grid [data]="users" [columns]="columns"></zen-grid>
```

### React

```jsx
<ZenGrid data={users} columns={columns} />
```

### Vue

```html
<zen-grid :data="users" :columns="columns"></zen-grid>
```

## Geliştirme | Development

```bash
# Bağımlılıkları yükle | Install dependencies
npm install

# Geliştirme sunucusunu başlat | Start development server
npm run dev

# Dağıtım için derle | Build for production
npm run build
```

## Lisans | License

MIT 