import {
  OnQueueActive,
  OnQueueCompleted,
  Process,
  Processor,
} from '@nestjs/bull';
import { REFRESH_QUEUE } from '../http/constants/queue.constants';
import { Job } from 'bull';
import { Logger } from '@nestjs/common';
import axios from 'axios';
import { EnvService } from '../env/env.service';
import { SwimmerEvo } from 'src/domain/evo/entities/swimmer-evo-entity';
import { SwimmersRepository } from 'src/domain/repositories/swimmers-repository';

@Processor(REFRESH_QUEUE)
export class RefreshSwimmersConsumer {
  private readonly logger = new Logger(RefreshSwimmersConsumer.name);
  constructor(
    private readonly env: EnvService,
    private readonly swimmersRepository: SwimmersRepository,
  ) {}

  @OnQueueActive()
  onActive(job: Job) {
    this.logger.log(`Refreshing swimmers of teacher : JobID ${job.id}`);
  }

  @Process()
  async handle(job: Job<{ teacherNumber: number }>) {
    const swimmersInEvo: SwimmerEvo[] = await this.fetchSwimmers(
      job.data.teacherNumber,
    );
    await this.swimmersRepository.upsertManyFromEvo(swimmersInEvo);
    await this.swimmersRepository.deleteDuplicates();
  }

  @OnQueueCompleted()
  onCompleted(job: Job) {
    this.logger.log(
      `Refreshing swimmers of teacher has been completed: JobID ${job.id}`,
    );
  }

  ajustAnoNasc(data: string): number {
    const ano = data?.split('-')[0];
    return +ano;
  }

  private fetchSwimmers = async (
    teacherNumber: number,
  ): Promise<SwimmerEvo[]> => {
    const url = 'https://evo-integracao.w12app.com.br/api/v1/members';
    const evo_cred = this.env.get('EVO_CRED');
    const credentials = btoa(evo_cred);
    let hasEnded = false;
    let skip = 0;
    const swimmersInEvo: SwimmerEvo[] = [];
    while (!hasEnded) {
      const response = await axios.get(`${url}`, {
        params: {
          skip: skip,
          status: 1,
        },
        headers: {
          Authorization: `Basic ${credentials}`, // Use btoa here
        },
      });
      if (!(response.status === 200)) {
        console.log('Error fetching swimmers');
        return;
      }
      const { data } = response;
      const swimmersInRequest: SwimmerEvo[] = data.filter(
        (alunoData: SwimmerEvo) => {
          const anonasc = this.ajustAnoNasc(
            alunoData.birthDate ?? '2013-02-02',
          );

          return (
            anonasc > 2008 && alunoData.idEmployeeInstructor === teacherNumber
          );
        },
      );

      if (data.length !== 0) {
        swimmersInEvo.push(...swimmersInRequest);
        skip += 50;
      } else {
        hasEnded = true;
      }
    }

    return swimmersInEvo;
  };
}
