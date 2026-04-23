# 🚀 GitHub Pages Setup Guide

## ✅ Что было сделано

1. ✅ Приложение собирается в папку `docs/` (стандартная папка для GitHub Pages)
2. ✅ npm скрипт `build:gh-pages` автоматически:
   - Копирует файлы из `browser/` в корень `docs/`
   - Создает `.nojekyll` файл
   - Собирает с правильным `--base-href /camp-level/`

---

## 📋 Полная инструкция

### Шаг 1: Собрать приложение

```bash
npm run build:gh-pages
```

Это создаст структуру `docs/`:
```
docs/
├── .nojekyll ✅ (отключает Jekyll)
├── index.html ✅ (главный файл)
├── main-XXXX.js
├── styles-XXXX.css
├── assets/
└── browser/ (вспомогательная папка)
```

### Шаг 2: Загрузить на GitHub

```bash
git add .
git commit -m "Deploy to GitHub Pages"
git push origin main
```

### Шаг 3: Настроить GitHub Pages в Settings

1. Открить GitHub → репозиторий
2. **Settings** → **Pages**
3. В разделе "**Build and deployment**":
   - Source: **Deploy from a branch**
   - Branch: **main**
   - Folder: **`/docs`** ← ВЫБРАТЬ ЭТО!
4. **Save**

GitHub Pages обновится через 1-2 минуты.

---

## ✅ Приложение будет доступно:

```
https://YOUR_USERNAME.github.io/camp-level/
```

### ✅ Будет работать:
- `/#/` → Receiver (главная)
- `/#/sender` → Sender режим
- `/#/offline` → Offline режим
- `/#/manual` → Manual режим (с mock слайдерами)

---

## 🔧 Если что-то не работает

### Видит README вместо приложения?

**Решение:**
1. Settings → Pages проверить что выбрана папка `/docs`
2. Проверить что `docs/index.html` существует
3. Проверить что `docs/.nojekyll` есть

### Черный экран при загрузке?

**Решение:**
```bash
# Пересобрать и загрузить еще раз
npm run build:gh-pages
git add . && git commit -m "Fix" && git push
```

---

## 📝 Рабочий процесс (каждый раз)

```bash
# 1. Разработка
ng serve

# 2. Когда готово к деплою
npm run build:gh-pages

# 3. Загрузить на GitHub
git add .
git commit -m "feat: описание изменений"
git push origin main

# ✅ Через 1-2 минуты приложение обновится!
```

---

**Готово!** 🎉 Ваше приложение на GitHub Pages!

