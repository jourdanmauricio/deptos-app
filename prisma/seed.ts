// prisma/seed.ts
import 'dotenv/config';
import { PrismaClient } from '../lib/generated/prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

// Obtener datos del .env o usar valores por defecto
const userData = [
  {
    name: process.env.ADMIN_NAME,
    email: process.env.ADMIN_EMAIL,
    password: process.env.ADMIN_PASSWORD,
    role: process.env.ADMIN_ROLE,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
];

async function main() {
  console.log('🌱 Iniciando seed...');

  // Verificar si todas las variables de entorno están definidas
  if (!userData[0].name || !userData[0].email || !userData[0].password || !userData[0].role) {
    console.error('❌ Error: Algunas variables de entorno no están definidas');
    console.error('Por favor, verifica tus variables de entorno en .env');
    process.exit(1);
  }

  // Verificar si el usuario ya existe
  const existingUser = await prisma.user.findFirst({
    where: {
      email: userData[0].email,
    },
  });

  if (existingUser) {
    console.log('✅ Usuario ya existe, saltando creación...');
    return;
  }

  for (const u of userData) {
    // Verificar que el password existe (ya se validó arriba, pero TypeScript lo requiere)
    if (!u.password || !u.email || !u.name || !u.role) {
      console.error('❌ Error: Datos incompletos del usuario');
      continue;
    }

    // Hashear la contraseña antes de crear el usuario
    const hashedPassword = await bcrypt.hash(u.password, 10);

    const user = await prisma.user.create({
      data: {
        name: u.name,
        email: u.email,
        password: hashedPassword,
        role: u.role as any,
        createdAt: u.createdAt,
        updatedAt: u.updatedAt,
      },
    });
    console.log(`✅ Usuario creado: ${user.email}`);
  }
}

main()
  .catch((e) => {
    console.error('❌ Error en seed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
