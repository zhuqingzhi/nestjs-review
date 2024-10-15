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

### jwt登录验证

#### 使用自定义装饰器添加登录和权限元数据

#### 使用自定义守卫LoginGuard和PermissionGuard实现登录和权限校验

loginGuard解析token后，request.user={}
在permissionGuard中校验permission是否在user.permission中

#### 实现access_token和refresh_token的刷新接口

#### 修改用户接口

@ResponseInterceptor修改响应结构
@UserInfo参数装饰器获取用户
createParamDecorator；@Controller类装饰器；@ApplyDecorators可以用在任何地方

#### 用户列表

#### 考虑失败响应

在考虑成功响应的时候应该考虑到失败的响应;响应统一

```js
// 成功响应：@ResponseInterceptor
{
    data,
    message,
    code
}
{
    //失败响应：ErrorExceptionFilter
    statusCode:401,
    error:'unauthorized',
    message:''
}
```

// 封装未登录错误
throw new UnloginError()

修改HttpException的处理逻辑
全局的exceptionFilter用来处理不同错误返回相同结构的响应
由于有校验错误，class-validator
因此response里面会返回校验错误，需要一起处理

#### 模糊查询用户列表

```js
if(UpdateUserDto.email){
    conditions.email=Like(`%${}%`)
}
where:conditions
take,
skip
```

#### swagger文档

controller:@ApiTag
dto:@ApiProperty
handler:@ApiQUery,@ApiResponse,@ApiBody,
