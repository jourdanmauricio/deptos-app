// diario
{
"idVariable": 40,
"descripcion": "Índice para Contratos de Locación (ICL-Ley 27.551, con dos decimales, base 30.6.20=1)",
"categoria": "Principales Variables",
"fecha": "2025-11-23",
"valor": 28.64
},

// mensual
{
"idVariable": 27,
"descripcion": "Inflación mensual (variación en %)",
"categoria": "Principales Variables",
"fecha": "2025-10-31",
"valor": 2.3
},

https://api.bcra.gob.ar/estadisticas/v4.0/monetarias/40

Contrato inició: 2023-07-15 → buscás ICL de ese día.
Ajustás en: 2024-07-15 → buscás ICL de ese día.
Hacés la relación → obtenés el aumento.

nuevo_precio = precio_anterior \* (ICL(fecha_ajuste) / ICL(fecha_ajuste_anterior))
