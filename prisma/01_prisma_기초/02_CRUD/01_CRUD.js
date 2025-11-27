import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function main() {
  // 1) CREATE: 한 건 추가
  const createMain = await prisma.user.create({
    data: {
      email: 'leon@example.com',
      name: 'leon',
      age: 30,
    },
  });
  console.log('CREATE: ', createMain);

  // 2) READ(기본): 전체 조회
  const getMains = await prisma.user.findMany();
  console.log('READ: ', getMains);

  // 2-1) READ (조건 + 정렬 + 선택)
  const getMain = await prisma.user.findMany({
    where: { age: { gte: 20 } }, // 20살 이상
    orderBy: { age: 'asc' }, // 오름차순 정렬
    select: {
      id: true,
      name: true,
    },
  });
  console.log('READ: ', getMain);

  // 2-2) 고급 READ: 페이징
  const page1 = await prisma.user.findMany({ take: 2, skip: 0 });
  const page2 = await prisma.user.findMany({ take: 2, skip: 2 });
  console.log('PAGE1 ->', page1);
  console.log('PAGE2 ->', page2);

  // 3) UPDATE: 필드 수정
  const updateMain = await prisma.user.update({
    where: { id: createMain.id },
    data: {
      name: 'leon97',
      age: 29,
    },
  });
  console.log('UPDATE: ', updateMain);

  // 4) DELETE: 유저 삭제
  const deleteMain = await prisma.user.delete({
    where: { id: createMain.id },
  });
  console.log('DELETE: ', deleteMain);
}

// 에러 발생시 서버 강제로 종료
main()
  .catch((e) => console.error(e))
  .finally(async () => {
    await prisma.$disconnect();
  });
