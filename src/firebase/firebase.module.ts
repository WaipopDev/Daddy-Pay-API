import { Module } from '@nestjs/common';
import { FirebaseService } from './firebase.service';
import { FirebaseController } from './firebase.controller';
import { LoggerRepository } from 'src/repositories/Logger.repository';

@Module({
  controllers: [FirebaseController],
  providers: [FirebaseService, LoggerRepository],
  exports: [FirebaseService],
})
export class FirebaseModule {}
