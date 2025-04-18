import { Module } from '@nestjs/common';
import { KbankService } from './kbank.service';
import { KbankController } from './kbank.controller';
import { FirebaseModule } from 'src/firebase/firebase.module';

@Module({
  imports: [
    FirebaseModule
  ],
  controllers: [KbankController],
  providers: [KbankService],
})
export class KbankModule {}
