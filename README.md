### mysql

yarn add mysql2 @nestjs/typeorm typeorm

TypeormModule.forRootAsync({
useFactory:(configService:ConfigService){
return {
type:'mysql',//容易少写
database:'booking',//需要手动创建数据库，到docker镜像里面
}
}
})

### config

yarn add @nestjs/config
ConfigModule.forRoot({
envFilePath:'./config/.env.development',//config配置需要在项目根目录下，在src下似乎识别不到
})

### 按照模块划分创建模块

### 按照库表设计添加实体

### redis

保存验证码

### nodemailer

封装邮件发送
