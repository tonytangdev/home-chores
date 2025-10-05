import { Module } from '@nestjs/common';
import { AuthModule } from '@thallesp/nestjs-better-auth';
import { auth } from './utils/auth';
import { UserModule } from './user/user.module';

@Module({
  imports: [AuthModule.forRoot({ auth }), UserModule],
})
export class AppModule {}
