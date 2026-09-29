# Investigación y cálculo del catálogo ampliado

Se revisaron técnicas, ingredientes y preparaciones argentinas en:

- [Ministerio de Salud, SARA 2](https://iah.msal.gov.ar/doc/720.pdf): composición por 100 g, carbohidratos disponibles, energía, proteína, grasas y fibra. Los alias y aproximaciones de unidades domésticas están documentados por ingrediente en `data/nutrition/sara2.json`.
- [Argentina.gob.ar: verduras y frutas](https://www.argentina.gob.ar/node/213612) y [legumbres, cereales, papa y pastas](https://www.argentina.gob.ar/node/213611): platos de cocina cotidiana y combinaciones de ingredientes.
- [Cocineros Argentinos: tarta de zapallitos y choclo](https://cocinerosargentinos.com/recetas/vegetariano/tarta-de-zapallitos-y-choclo), [milanesas de berenjena](https://cocinerosargentinos.com/recetas/vegetariano/milanesas-de-berenjena) y [chipá](https://cocinerosargentinos.com/recetas/masas-saladas/chipa-1): proporciones y métodos.
- [Paulina Cocina: viandas](https://www.paulinacocina.net/viandas-saludables/13747): preparaciones transportables y conservación.

Las fichas se reescribieron y normalizaron. Los enlaces en la ficha son referencias de técnica o familia de platos; no indican que esa fuente publique exactamente esa variante ni que sus cantidades sean las mismas.

Los macros se calculan sumando cada ingrediente según la cantidad registrada y dividiendo por el rendimiento. Son estimaciones por porción: marcas, cocción, peso escurrido y tamaño real pueden variar. Para un alimento envasado prevalece su etiqueta. La auditoría `npm run catalogo:audit` recalcula las recetas nuevas y detecta fichas incompletas, valores fuera de rango y duplicados próximos. El catálogo antiguo se complementa sin perder ids y se revisaron manualmente los rendimientos de recetas que describían un lote pero declaraban una porción.

## Kiosco argentino

`data/catalogo/kiosco.json` contiene trece productos identificables por marca y presentación. Los carbohidratos, azúcares, calorías y porciones provienen de las tablas publicadas por [Arcor (Porción Justa)](https://www.arcor.com/ar/alimentacion-productos-porcion-justa), [Arcor (sin azúcar)](https://www.arcor.com/ar/alimentacion-productos-sin-azucar), [Coca-Cola Argentina](https://www.coca-cola.com/ar/es/brands/coca-cola/zero) y [Sprite Argentina](https://www.coca-cola.com/ar/es/brands/sprite/productos). Cada ficha enlaza a la fuente. El catálogo distingue bolsita Nutritivo de Energía: la primera declara 4 g CHO en 27 g, la segunda 11 g en 28,5 g. “Sin azúcar” no es una clasificación de carbohidratos: Menthoplus Zero Strong declara 25 g CHO por cuatro caramelos, por lo que queda fuera del filtro de hasta 10 g. El filtro se aplica a alimentos y no a bebidas; no se relaja para ofrecer resultados por encima de 10 g. Las fórmulas, formatos y disponibilidad pueden cambiar: prevalece el envase comprado.
