# Coach headshots

Place one photo per coach in this folder. The site loads them automatically by filename.

## Required files

Use **lowercase slugs** and **`.jpg`** extension (JPEG recommended, 800×1000px or similar portrait crop):

| File name | Coach |
|-----------|--------|
| `sean-weatherspoon.jpg` | Sean Weatherspoon (Coach Spoon) |
| `johnny-venters.jpg` | Johnny Venters |
| `dustin-chovanic.jpg` | Dustin Chovanic |
| `christian-blake.jpg` | Christian Blake (Coach Blake) |

## Full path (from repo root)

```
public/images/coaches/sean-weatherspoon.jpg
public/images/coaches/johnny-venters.jpg
public/images/coaches/dustin-chovanic.jpg
public/images/coaches/christian-blake.jpg
```

## Tips

- Prefer consistent lighting and a similar crop (head + shoulders) across all four photos.
- Keep file sizes reasonable (under ~500 KB each) for fast page loads.
- PNG or WebP can be used if you update `getCoachPhotoPath()` in `lib/marketing/coaches.ts` to match your extension.

Until these files exist, coach images may not render in the browser. Add the files above and refresh the page.
