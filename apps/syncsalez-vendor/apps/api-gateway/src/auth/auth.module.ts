import { Module } from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { JwtModule } from '@nestjs/jwt';
import { JwtStrategy } from './jwt.strategy';

@Module({
  imports: [
    ClientsModule.register([
      {
        name: 'NATS_SERVICE',
        transport: Transport.NATS,
        options: {
          servers: [process.env.NATS_SERVER || 'nats://localhost:4222'],
        },
      },
    ]),
    JwtModule.register({
      secret:
        process.env.JWT_SECRET ||
        'gZreortW4FpU/B18GnfSIgsavhS0Li/B9igAYKK44TU=',
      signOptions: { expiresIn: '365d' },
    }),
  ],
  controllers: [AuthController],
  providers: [AuthService, JwtStrategy],
})
export class AuthModule {}
