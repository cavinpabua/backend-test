import { Inject, Injectable } from '@nestjs/common';
import { ConfigType } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import config from '../../config';
import { SurvivorsService } from '../../modules/survivors/services/survivors.service';
import { PayloadToken } from './../models/token.model';

@Injectable()
export class AuthService {
  constructor(
    private survivorsService: SurvivorsService,
    private jwtService: JwtService,
    @Inject(config.KEY)
    private configService: ConfigType<typeof config>,
  ) {}

  async validateUser(email: string, password: string) {
    const user: {
      password: string;
      id: number;
      role: string;
    } = await this.survivorsService.findByEmailAndGetPassword(email);

    if (user) {
      const isMatch = await bcrypt.compare(password, user.password);

      if (isMatch) {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const { password, ...rta } = user;
        return rta;
      }
    }
    return null;
  }

  async login(user: PayloadToken) {
    const { accessToken } = this.jwtToken(user);
    const refreshToken = this.jwtRefreshToken(user);
    await this.survivorsService.setCurrentRefreshToken(refreshToken, user.id);

    return {
      accessToken,
      refreshToken,
    };
  }

  jwtToken(user: PayloadToken) {
    const payload: PayloadToken = { role: user.role, id: user.id };
    return {
      accessToken: this.jwtService.sign(payload),
    };
  }

  jwtRefreshToken(user: PayloadToken) {
    const payload = { role: user.role, id: user.id };

    const refreshToken = this.jwtService.sign(payload, {
      secret: this.configService.jwt.jwtRefreshSecret,
      expiresIn: `${this.configService.jwt.refreshTokenExpiration}`,
    });

    return refreshToken;
  }

  async logout(user: PayloadToken) {
    return await this.survivorsService.removeRefreshToken(user.id);
  }

  async updatePassword(
    user: PayloadToken,
    oldPassword: string,
    newPassword: string,
  ) {
    return await this.survivorsService.updatePassword(
      user.id,
      oldPassword,
      newPassword,
    );
  }

  async createAccessTokenFromRefreshToken(user: PayloadToken) {
    return this.jwtToken(user);
  }
}
