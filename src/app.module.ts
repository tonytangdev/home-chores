import { Module } from '@nestjs/common';
import { AuthModule } from '@thallesp/nestjs-better-auth';
import { auth } from './utils/auth';

@Module({
  imports: [AuthModule.forRoot({ auth })],
})
export class AppModule {}
