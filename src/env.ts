import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserModule } from '../src/module/user.module';
// import { SpaceModule } from '../src/module/space.module';
import { ConfigModule } from '@nestjs/config';
import * as Joi from 'joi';



@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: process.env.NODE_ENV === '.env' ? '.env' : '.env.prod',
      validationSchema: Joi.object({
        NODE_ENV: Joi.string().valid('dev', 'prod').required(),
        DB_HOST: Joi.string().required(),
        DB_PORT: Joi.string().required(),
        DB_USERNAME: Joi.string().required(),
        DB_PASSWORD: Joi.string().required(),
        DB_NAME: Joi.string().required(),
      }),
    }),
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: process.env.DB_HOST,
      port: +process.env.DB_PORT,
      username: process.env.DB_USERNAME,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
      entities: ['dist/**/*.entity.{ts,js}'],
      synchronize: process.env.DB_SYNC === 'true',
    }),
    UserModule,
    // SpaceModule,

  ],
  controllers: [],
  providers: [],
})
export class AppModule {}




/*
//env.ts

import * as dotenv from 'dotenv'; //.env 파일안에있는 환경변수들을 찾아서 테스트하는 라이브러리
import * as path from 'path';
import fs from 'fs';
import appRoot from 'app-root-path';
import * as pkg from '../package.json';
import { getOsEnv, normalizePort, getOsEnvOptional, getOsEnvNumberOptional, getOsEnvNumber } from './lib/utils';


const postfix = () => { //NODE_ENV기반으로  .env파일의 postfix를 결정
    const envs = [ ['prod', ''], ['dev']]; //NODE_ENV가 prod일 경우 .env.prod dev일경우 .env.dev  //dev나 prod가 일치하지않으면 그냥 .env파일경로 결정
    const env = process.env.NODE_ENV?.toLowerCase(); //Node.JS의 process객체를통해 접근

    //postfix = env 파일의 경로를 결정하기 위해 NODE_ENV 환경 변수를 기반으로 사용할 파일의 접미사를 결정하는 함수.

    if (!env) return '';

    let result = '.' + env;
    // return true 는 break
    // return false 는 continue
    envs.some(e => {
        const key = e[0];
        const found = env.includes(key);
        if (found) result = '.' + (e.length > 1 ? e[1] : key);

        return found;
    });

    return result;
}
// const config = { path: path.join(appRoot.path, `.env${postfix()}`) };
const config = { path: path.join(appRoot.path, '.env') };



(() => {
    try {
        if (fs.existsSync(config.path)) {

        } else {
            console.error(JSON.stringify(config));
            process.exit(1);
        }
    } catch(err) {
        console.error(JSON.stringify(config), err);
        process.exit(1);
    }
})();

dotenv.config(config); //.env.test 파일안에있는 환경변수들을 찾아서nod.js 사용되는 전역변수에 접근할수있게 해서


export const env = {
    mode: {
        prod: process.env.NODE_ENV?.toLowerCase().includes('prod'),
        dev: process.env.NODE_ENV?.toLowerCase().includes('dev'),
        test: process.env.NODE_ENV?.toLowerCase().includes('test'),
        value: process.env.NODE_ENV?.toLowerCase(),
    },

    mysql: {
        port: getOsEnv('MYSQL_PORT'),
        schema: getOsEnv('MYSQL_SCHEMA'),
        read: {
            host: getOsEnv('MYSQL_READ_HOST'),
            username: getOsEnv('MYSQL_READ_USERNAME'),
            password: getOsEnv('MYSQL_READ_PASSWORD'),
        },
        write: {
            host: getOsEnv('MYSQL_WRITE_HOST'),
            username: getOsEnv('MYSQL_WRITE_USERNAME'),
            password: getOsEnv('MYSQL_WRITE_PASSWORD'),
        },
        core: {
            port: getOsEnv('MYSQL_CORE_PORT'),
            schema: getOsEnv('MYSQL_CORE_SCHEMA'),
            read: {
                host: getOsEnv('MYSQL_CORE_READ_HOST'),
                username: getOsEnv('MYSQL_CORE_READ_USERNAME'),
                password: getOsEnv('MYSQL_CORE_READ_PASSWORD'),
            },
            write: {
                host: getOsEnv('MYSQL_CORE_WRITE_HOST'),
                username: getOsEnv('MYSQL_CORE_WRITE_USERNAME'),
                password: getOsEnv('MYSQL_CORE_WRITE_PASSWORD'),
            },
        }
    },
}

*/