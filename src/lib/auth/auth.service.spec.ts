/// <reference types="jest" />
import { JwtService } from '@nestjs/jwt';
import { AuthService } from './auth.service';

describe('AuthService', () => {
  it('should login with default admin credentials', async () => {
    const jwt = new JwtService({ secret: 'test-secret' });
    const svc = new AuthService(jwt);
    const res = await svc.validateAndLogin('admin', 'admin123');
    expect(typeof res.access_token).toBe('string');
    expect(res.access_token.length).toBeGreaterThan(10);
  });
});


