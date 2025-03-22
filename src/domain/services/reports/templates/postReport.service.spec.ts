import { Test, TestingModule } from '@nestjs/testing';
import { CreateReportService } from './create-report.service';
import { PrismaService } from '../../../../infra/database/prisma/prisma.service';

describe('PostReportService', () => {
  let service: CreateReportService;
  let prisma: PrismaService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CreateReportService,
        {
          provide: PrismaService,
          useValue: {
            level: {
              findFirst: jest.fn(),
            },
            swimmer: {
              findFirst: jest.fn(),
              update: jest.fn(),
            },
            reportAndSteps: {
              deleteMany: jest.fn(),
            },
            report: {
              update: jest.fn(),
              create: jest.fn(),
            },
          },
        },
      ],
    }).compile();

    service = module.get<CreateReportService>(CreateReportService);
    prisma = module.get<PrismaService>(PrismaService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('handle', () => {
    const props = {
      levelId: 'level-id',
      steps: ['step-id-1', 'step-id-2'],
      observation: 'Good progress',
      memberNumber: 123,
      id: 'report-id',
      periodId: 'period-id',
    };

    it('should create a new report when id is "new"', async () => {
      prisma.level.findFirst = jest.fn().mockResolvedValue({
        id: 'level-id',
        levelNumber: 1,
        areas: [
          {
            steps: [
              { id: 'step-id-1', points: 3 },
              { id: 'step-id-2', points: 3 },
            ],
          },
        ],
      });

      prisma.swimmer.findFirst = jest.fn().mockResolvedValue({
        teacherNumber: 'teacher-number',
      });

      prisma.report.create = jest.fn().mockResolvedValue({ id: 'report-id' });

      prisma.swimmer.update = jest.fn().mockResolvedValue(null);

      const result = await service.handle(props);

      expect(prisma.level.findFirst).toHaveBeenCalledWith({
        where: { id: 'level-id' },
        include: { areas: { include: { steps: true } } },
      });
      expect(prisma.report.create).toHaveBeenCalledWith(
        expect.objectContaining({
          data: expect.objectContaining({
            approved: true,
            level: { connect: { id: 'level-id' } },
            swimmer: { connect: { memberNumber: 123 } },
            observation: 'Good progress',
          }),
        }),
      );
      expect(result).toEqual({ id: 'report-id' });
    });

    it('should update an existing report when id is not "new"', async () => {
      const propsWithId = { ...props, id: 'existing-id' };

      prisma.level.findFirst = jest.fn().mockResolvedValue({
        id: 'level-id',
        levelNumber: 1,
        areas: [
          {
            steps: [
              { id: 'step-id-1', points: 3 },
              { id: 'step-id-2', points: 3 },
            ],
          },
        ],
      });

      prisma.swimmer.findFirst = jest.fn().mockResolvedValue({
        teacherNumber: 'teacher-number',
      });

      prisma.reportAndSteps.deleteMany = jest.fn().mockResolvedValue(null);

      prisma.report.update = jest
        .fn()
        .mockResolvedValue({ id: 'updated-report-id' });

      prisma.swimmer.update = jest.fn().mockResolvedValue(null);

      const result = await service.handle(propsWithId);

      expect(prisma.reportAndSteps.deleteMany).toHaveBeenCalledWith({
        where: { reportId: 'existing-id' },
      });
      expect(prisma.report.update).toHaveBeenCalledWith(
        expect.objectContaining({
          data: expect.objectContaining({
            approved: true,
            level: { connect: { id: 'level-id' } },
          }),
          where: { id: 'existing-id' },
        }),
      );
      expect(result).toEqual({ id: 'updated-report-id' });
    });

    it('should throw an error if the level is not found', async () => {
      prisma.level.findFirst = jest.fn().mockResolvedValue(null);

      await expect(service.handle(props)).rejects.toThrow('Level not found');
    });

    it('should throw an error if the next level is not found when approved', async () => {
      prisma.level.findFirst = jest
        .fn()
        .mockResolvedValueOnce({
          id: 'level-id',
          levelNumber: 1,
          areas: [
            {
              steps: [
                { id: 'step-id-1', points: 3 },
                { id: 'step-id-2', points: 3 },
              ],
            },
          ],
        })
        .mockResolvedValueOnce(null);

      prisma.swimmer.findFirst = jest.fn().mockResolvedValue({
        teacherNumber: 'teacher-number',
      });

      await expect(service.handle(props)).rejects.toThrow(
        'Next level not found',
      );
    });

    it('should update the swimmer level when every step has 3 points', async () => {
      prisma.level.findFirst = jest
        .fn()
        .mockResolvedValueOnce({
          id: 'level-id',
          levelNumber: 1,
          areas: [
            {
              steps: [
                { id: 'step-id-1', points: 3 },
                { id: 'step-id-2', points: 3 },
              ],
            },
          ],
        })
        .mockResolvedValueOnce({
          id: 'next-level-id',
          levelNumber: 2,
        });

      prisma.swimmer.findFirst = jest.fn().mockResolvedValue({
        teacherNumber: 'teacher-number',
      });

      prisma.report.create = jest.fn().mockResolvedValue({ id: 'report-id' });

      prisma.swimmer.update = jest.fn().mockResolvedValue(null);

      props.id = 'report-id';

      const result = await service.handle(props);

      expect(prisma.level.findFirst).toHaveBeenCalledTimes(2);
      expect(prisma.swimmer.update).toHaveBeenCalledWith({
        where: { memberNumber: 123 },
        data: {
          actualLevel: { connect: { id: 'next-level-id' } },
          lastReportAccess: { connect: { id: 'report-id' } },
        },
      });
      expect(result).toEqual({ id: 'report-id' });
    });

    it('should update the swimmer level when updating a report and steps are approved', async () => {
      const propsWithId = { ...props, id: 'existing-id' };

      prisma.level.findFirst = jest.fn().mockResolvedValue({
        id: 'level-id',
        levelNumber: 1,
        areas: [
          {
            steps: [
              { id: 'step-id-1', points: 3 },
              { id: 'step-id-2', points: 3 },
            ],
          },
        ],
      });

      prisma.swimmer.findFirst = jest.fn().mockResolvedValue({
        teacherNumber: 'teacher-number',
      });

      prisma.reportAndSteps.deleteMany = jest.fn().mockResolvedValue(null);

      prisma.report.update = jest
        .fn()
        .mockResolvedValue({ id: 'updated-report-id' });

      prisma.swimmer.update = jest.fn().mockResolvedValue(null);

      const result = await service.handle(propsWithId);

      expect(prisma.reportAndSteps.deleteMany).toHaveBeenCalledWith({
        where: { reportId: 'existing-id' },
      });
      expect(prisma.swimmer.update).toHaveBeenCalledWith({
        where: { memberNumber: 123 },
        data: {
          actualLevel: { connect: { id: 'level-id' } },
          lastReport: expect.any(Date),
          lastReportAccess: { connect: { id: 'updated-report-id' } },
        },
      });
      expect(result).toEqual({ id: 'updated-report-id' });
    });
  });
});
