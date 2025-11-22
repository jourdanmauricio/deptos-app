-- Agregar columna payslip a la tabla Party
-- ALTER TABLE Party ADD COLUMN payslip TEXT;

-- Agregar columna status a la tabla Party
ALTER TABLE Party ADD COLUMN status TEXT NOT NULL DEFAULT 'ACTIVE';
