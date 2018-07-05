import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

export const swagger = (app) => {
  const options = new DocumentBuilder()
    .setTitle('Realthub')
    .setDescription('The Realthub API description')
    .setVersion('1.0')
    .addTag('realthub')
    .build();

  const document = SwaggerModule.createDocument(app, options);

  SwaggerModule.setup('swagger', app, document);
};
