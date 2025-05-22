import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '../prisma/prisma.service';
import * as bcrypt from 'bcrypt';
import { SignInDto } from './dto/sign-in.dto';
import { SignUpDto } from './dto/sign-up.dto';
import { Role } from 'generated/prisma';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
  ) {}

  async validateUser(email: string, password: string): Promise<any> {
    const user = await this.prisma.user.findUnique({ where: { email } });
    if (user && (await bcrypt.compare(password, user.password))) {
      const { password, ...result } = user;
      void password;
      return result;
    }
    return null;
  }

  async login(signInDto: SignInDto) {
    const user = await this.validateUser(signInDto.email, signInDto.password);

    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const payload = { email: user.email, sub: user.id, role: user.role };

    return {
      accessToken: this.jwtService.sign(payload),
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
      },
    };
  }

  async register(signUpDto: SignUpDto) {
    const hashedPassword = await bcrypt.hash(signUpDto.password, 10);

    const user = await this.prisma.user.create({
      data: {
        name: signUpDto.name,
        email: signUpDto.email,
        password: hashedPassword,
        role: Role.CUSTOMER,
      },
    });

    const { password, ...result } = user;
    void password;

    return result;
  }

  // This method verifies tokens from Next-Auth
  async validateNextAuthToken(token: string) {
    try {
      // Verify JWT token from Next-Auth
      const payload = this.jwtService.verify(token);
      return this.prisma.user.findUnique({
        where: { id: payload.sub },
        select: {
          id: true,
          email: true,
          name: true,
          role: true,
        },
      });
    } catch (error) {
      return null;
    }
  }
}
