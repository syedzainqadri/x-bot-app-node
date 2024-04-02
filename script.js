const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main(uid,email,displayName,password,allpostslist) {
    const newUser = await prisma.user.create({
        data: {
            uid: uid,
            email: email,
            displayName: displayName,
            password: password,
            allpostslist: allpostslist,
        },
    });
    console.log('New User:', newUser);
}

main()
  .catch(e => {
    throw e
  })
  .finally(async () => {
    await prisma.$disconnect()
  });
