import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import bcrypt from 'bcryptjs';
import { env } from '../env';

export interface UserRecord {
  id: number;
  username: string;
  passwordHash: string;
}

@Injectable()
export class AuthService {
  // In-memory single user for demo. In real apps, replace with DB.
  private readonly user: UserRecord = {
    id: 1,
    username: env.ADMIN_USER,
    passwordHash: bcrypt.hashSync(env.ADMIN_PASS, 10),
  };

  constructor(private readonly jwt: JwtService) {}

  async validateAndLogin(username: string, password: string): Promise<{ access_token: string }> {
    const isUser = username === this.user.username;
    const ok = isUser && (await bcrypt.compare(password, this.user.passwordHash));
    if (!ok) throw new UnauthorizedException('Credenciais inválidas');
    const token = await this.jwt.signAsync({ sub: this.user.id, username: this.user.username });
    return { access_token: token };
  }
}


