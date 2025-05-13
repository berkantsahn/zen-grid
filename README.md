# Zen-Grid

Modern ve esnek veri tablosu komponenti. Angular, React ve Vue ile sorunsuz çalışır.

## Özellikler

- Web Component olarak tüm JavaScript framework'lerinde kullanılabilir
- Sıralama, filtreleme ve sayfalama özellikleri
- Özelleştirilebilir hücreler ve sütunlar
- Duyarlı tasarım
- TypeScript desteği

## Kurulum

```bash
npm install zen-grid
# veya
yarn add zen-grid
```

## Kullanım

### HTML

```html
<zen-grid id="my-table"></zen-grid>

<script>
  const table = document.getElementById('my-table');
  table.data = [
    { id: 1, name: 'Ahmet', age: 25 },
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

## Geliştirme

```bash
# Bağımlılıkları yükle
npm install

# Geliştirme sunucusunu başlat
npm run dev

# Dağıtım için derle
npm run build
```

## Lisans

MIT 