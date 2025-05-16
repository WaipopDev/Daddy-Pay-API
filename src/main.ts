import { NestFactory } from '@nestjs/core';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { AppModule } from './app.module';
import { BadRequestException, ValidationPipe, VersioningType } from '@nestjs/common';

async function bootstrap() {
    const app = await NestFactory.create(AppModule);
    app.enableCors();

    app.enableVersioning({
        type: VersioningType.URI,
        defaultVersion: '1',
    });
    app.setGlobalPrefix('api');

    // Validation
    app.useGlobalPipes(
        new ValidationPipe({
            whitelist: true,
            transform: true,
            exceptionFactory: (errors) => {
                const result = errors.map((error) => {
                    const constraints = error.constraints ?? {};
                    const message = Object.values(constraints)[0] ?? 'Invalid input';

                    return {
                        property: error.property,
                        message,
                    };
                });

                throw new BadRequestException({ message: 'Validation failed', errors: result });
            },
            stopAtFirstError: true,
        }),
    );
    const config = new DocumentBuilder()
        .setTitle('Daddy Pay API')
        .setDescription('The Daddy Pay API description')
        .setVersion('1.0')
        .addBearerAuth()
        .build();
    const documentFactory = () => SwaggerModule.createDocument(app, config);
    SwaggerModule.setup('document', app, documentFactory);

    console.log('process.env.PORT', process.env.PORT)
    await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
