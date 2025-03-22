import {
  Admin,
  Auth,
  Branch,
  Enterprise,
  Level,
  Period,
  Report,
  Responsible,
  Session,
  Step,
  Swimmer,
  SwimmerPeriodTeacherSelection,
  Teacher,
  TeacherPeriodGroupSelection,
  Area,
  BranchTeacher,
  ReportAndSteps,
} from '@prisma/client';

// Auth
const auth1: Auth = {
  id: 'auth-id-of-JovirDemari',
  email: 'jovir.demari@gmail.com',
  name: 'Jovir Demari',
  password: '123456',
  resetToken: null,
  role: 'admin',
};

const auth2: Auth = {
  id: 'auth-id-of-teacher1',
  email: 'teacher1@example.com',
  name: 'Teacher One',
  password: 'teacherpassword',
  resetToken: null,
  role: 'teacher',
};

const auth3: Auth = {
  id: 'auth-id-of-responsible1',
  email: 'responsible1@example.com',
  name: 'Responsible One',
  password: 'responsiblepassword',
  resetToken: null,
  role: 'responsible',
};

export const authsDummyDB: Auth[] = [auth1, auth2, auth3];

// Enterprise
const enterpriseA: Enterprise = {
  id: 'enterprise-of-raiar-cinquentenario',
  name: 'Raiar Cinquentenario',
};

export const enterprisesDummyDB: Enterprise[] = [enterpriseA];

// Branch
const branchA: Branch = {
  id: 'branch-of-raiar-cinquentenario',
  apiKey: 'strongApiKey',
  enterpriseId: enterpriseA.id,
  logoUrl: 'www.logourl.com',
  name: 'Raiar Cinquentenário',
  url: 'raiar-cinquentenario',
};

export const branchesDummyDB: Branch[] = [branchA];

// Admin
const admin1: Admin = {
  id: 'adminId-of-' + auth1.id,
  authId: auth1.id,
  enterpriseId: enterpriseA.id,
};

export const adminsDummyDB: Admin[] = [admin1];

// Responsible
const responsible1: Responsible = {
  id: 'responsibleId1',
  authId: auth3.id,
  branchId: branchA.id,
};

export const responsiblesDummyDB: Responsible[] = [responsible1];

// Swimmer
export const swimmersDummyDB: Swimmer[] = [
  {
    id: 'swimmer1',
    actualLevelName: 'Lambari',
    branchId: branchA.id,
    isActive: true,
    lastAccess: new Date(),
    memberNumber: 1,
    memberNumberStr: '1',
    name: 'Luke Skywalker',
    photoUrl: '',
    responsibleId: responsible1.id,
    teacherId: 'teacherId1',
  },
  {
    id: 'swimmer2',
    actualLevelName: 'Lambari',
    branchId: branchA.id,
    isActive: true,
    lastAccess: new Date(),
    memberNumber: 2,
    memberNumberStr: '2',
    name: 'Leia Skywalker',
    photoUrl: null,
    responsibleId: responsible1.id,
    teacherId: 'teacherId1',
  },
];

// Teacher
const teacher1: Teacher = {
  active: true,
  id: 'teacherId1',
  authId: auth2.id,
  name: 'Teacher One',
  email: auth2.email,
  photoUrl: null,
  password: auth2.password,
  resetToken: auth2.resetToken,
};

export const teachersDummyDB: Teacher[] = [teacher1];

// BranchTeacher
const branchTeacher1: BranchTeacher = {
  id: 'branchTeacherId1',
  branchId: branchA.id,
  teacherId: teacher1.id,
  teacherNumber: 1,
};

export const branchTeachersDummyDB: BranchTeacher[] = [branchTeacher1];

// Level
const level1: Level = {
  id: 'levelId1',
  name: 'Lambari',
  levelNumber: 1,
  branchId: branchA.id,
};

export const levelsDummyDB: Level[] = [level1];

// Period
const period1: Period = {
  id: 'periodId1',
  name: 'Summer 2025',
  startDate: new Date('2025-01-01'),
  endDate: new Date('2025-03-31'),
  branchId: branchA.id,
};

export const periodsDummyDB: Period[] = [period1];

// Area
const area1: Area = {
  id: 'areaId1',
  title: 'Beginner Skills',
  levelId: level1.id,
};

export const areasDummyDB: Area[] = [area1];

// Step
const step1: Step = {
  id: 'stepId1',
  description: 'Kick in the water',
  points: 10,
  areaId: area1.id,
};

export const stepsDummyDB: Step[] = [step1];

// Report
const report1: Report = {
  id: 'reportId1',
  createdAt: new Date(),
  approved: true,
  observation: 'Great improvement in swimming technique.',
  isAvailable: true,
  levelId: level1.id,
  idSwimmer: swimmersDummyDB[0].id,
  idTeacher: teacher1.id,
  periodId: period1.id,
  swimmerTeacherPeriodSelectionId: null,
};

export const reportsDummyDB: Report[] = [report1];

// ReportAndSteps
const reportAndSteps1: ReportAndSteps = {
  id: 'reportAndStepsId1',
  reportId: report1.id,
  stepId: step1.id,
};

export const reportAndStepsDummyDB: ReportAndSteps[] = [reportAndSteps1];

// Session
const session1: Session = {
  id: 'sessionId1',
  authId: auth1.id,
  createdAt: new Date(),
  token: 'sessionToken1',
};

export const sessionsDummyDB: Session[] = [session1];

// SwimmerPeriodTeacherSelection
const swimmerPeriodTeacherSelection1: SwimmerPeriodTeacherSelection = {
  id: 'swimmerPeriodTeacherSelectionId1',
  swimmerId: swimmersDummyDB[0].id,
  teacherPeriodGroupSelectionId: 'teacherPeriodGroupSelectionId1',
  periodId: period1.id,
};

export const swimmerPeriodTeacherSelectionsDummyDB: SwimmerPeriodTeacherSelection[] =
  [swimmerPeriodTeacherSelection1];

// TeacherPeriodGroupSelection
const teacherPeriodGroupSelection1: TeacherPeriodGroupSelection = {
  id: 'teacherPeriodGroupSelectionId1',
  periodId: period1.id,
  teacherId: teacher1.id,
  teacherAuthId: auth2.id,
};

export const teacherPeriodGroupSelectionsDummyDB: TeacherPeriodGroupSelection[] =
  [teacherPeriodGroupSelection1];
