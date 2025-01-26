import { Admin, Auth, Branch, Enterprise, Swimmer } from '@prisma/client';

const auth1 = {
  email: 'jovir.demari@gmail.com',
  id: 'auth-id-of-JovirDemari',
  name: 'Jovir Demari',
  password: '123456',
  resetToken: null,
  role: 'admin',
};

export const authsDummyDB: Auth[] = [auth1];

const enterpriseA: Enterprise = {
  id: 'enterprise-of-raiar-cinquentenario',
  name: 'Raiar Cinquentenario',
};

export const enterprisesDummyDB: Enterprise[] = [enterpriseA];

const branchA: Branch = {
  id: 'branch-of-raiar-cinquentenario',
  apiKey: 'strongApiKey',
  enterpriseId: enterpriseA.id,
  logoUrl: 'www.logourl.com',
  name: 'Raiar Cinquentenário',
  url: 'raiar-cinquentenario',
};

export const branchesDummyDB: Branch[] = [branchA];

const admin1 = {
  id: 'adminId-of-' + auth1.id,
  authId: auth1.id,
  enterpriseId: enterpriseA.id,
};

export const adminsDummyDB: Admin[] = [admin1];

export const swimmersDummyDB: Swimmer[] = [
  {
    actualLevelName: 'Lambari',
    branchId: 'raiarCinquentenario',
    id: 'swimmer1',
    isActive: true,
    lastAccess: new Date(),
    lastReport: new Date(),
    lastReportId: 'lastReportId1',
    memberNumber: 1,
    name: 'Luke Skywalker',
    photoUrl: '',
    memberNumberStr: '1',
    responsibleId: 'responsibleId1',
    teacherId: 'teacherId1',
  },
  {
    actualLevelName: 'Lambari',
    branchId: 'raiarCinquentenario',
    id: 'swimmer2',
    isActive: true,
    lastAccess: new Date(),
    lastReport: new Date(),
    lastReportId: 'ultimoReportSwimmer2',
    memberNumber: 2,
    name: 'Leia Skywalker',
    photoUrl: null,
    memberNumberStr: '2',
    responsibleId: 'responsibleId1',
    teacherId: 'teacherId1',
  },
];
