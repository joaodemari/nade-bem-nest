// import { Controller, Get, Delete, Param } from '@nestjs/common';
// import { SwimmerEntity } from '../../domain/entities/swimmer-entity';
// import { SwimmersService } from '../../domain/services/swimmers.service';

// @Controller('swimmers')
// export abstract class BaseController {
//   constructor(private readonly swimmerService: SwimmersService) {}

//   @Get()
//   findAll(): Promise<SwimmerEntity[]> {
//     return this.swimmerService.findAll();
//   }

//   @Get(':id')
//   findOne(@Param('id') id: string): Promise<SwimmerEntity | void> {
//     return this.swimmerService.findById(id);
//   }

//   @Delete(':id')
//   remove(@Param('id') id: string): Promise<void | boolean | SwimmerEntity> {
//     return this.swimmerService.delete(id);
//   }
// }
