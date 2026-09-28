# Investigación y cálculo del catálogo ampliado

Se revisaron técnicas, ingredientes y preparaciones argentinas en:

- [Ministerio de Salud, SARA 2](https://iah.msal.gov.ar/doc/720.pdf): composición por 100 g, carbohidratos disponibles, energía, proteína, grasas y fibra. Los alias y aproximaciones de unidades domésticas están documentados por ingrediente en `data/nutrition/sara2.json`.
- [Argentina.gob.ar: verduras y frutas](https://www.argentina.gob.ar/node/213612) y [legumbres, cereales, papa y pastas](https://www.argentina.gob.ar/node/213611): platos de cocina cotidiana y combinaciones de ingredientes.
- [Cocineros Argentinos: tarta de zapallitos y choclo](https://cocinerosargentinos.com/recetas/vegetariano/tarta-de-zapallitos-y-choclo), [milanesas de berenjena](https://cocinerosargentinos.com/recetas/vegetariano/milanesas-de-berenjena) y [chipá](https://cocinerosargentinos.com/recetas/masas-saladas/chipa-1): proporciones y métodos.
- [Paulina Cocina: viandas](https://www.paulinacocina.net/viandas-saludables/13747): preparaciones transportables y conservación.

Las fichas se reescribieron y normalizaron. Los enlaces en la ficha son referencias de técnica o familia de platos; no indican que esa fuente publique exactamente esa variante ni que sus cantidades sean las mismas.

Los macros se calculan sumando cada ingrediente según la cantidad registrada y dividiendo por el rendimiento. Son estimaciones por porción: marcas, cocción, peso escurrido y tamaño real pueden variar. Para un alimento envasado prevalece su etiqueta. La auditoría `npm run catalogo:audit` recalcula las recetas nuevas y detecta fichas incompletas, valores fuera de rango y duplicados próximos. El catálogo antiguo se complementa sin perder ids y se revisaron manualmente los rendimientos de recetas que describían un lote pero declaraban una porción.
