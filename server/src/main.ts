import { Logger } from '@nestjs/common'
import { HttpAdapterHost, NestFactory } from '@nestjs/core'
import { AppModule } from './app.module'
import { GlobalExceptionFilter } from './common/exceptions/filters/globalException.filter'
import { ValidationPipe } from './common/pipes/validation.pipe'

const bootstrap = async () => {
  const app = await NestFactory.create(AppModule)
  const version = 'v1'

  app.enableCors({
    origin: '*',
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS'
  })
  app.setGlobalPrefix(version)
  app.useGlobalPipes(new ValidationPipe())

  const adapterHost = app.get(HttpAdapterHost)
  app.useGlobalFilters(new GlobalExceptionFilter(adapterHost))

  const port = Number(process.env.PORT) || 3333

  await app.listen(port, () => {
    Logger.log(`Listening at http://localhost:${port}/${version}`)
  })
}
bootstrap()
