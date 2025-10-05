import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { apiReference } from '@scalar/nestjs-api-reference';
import { auth } from './utils/auth';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    bodyParser: false,
  });

  const config = new DocumentBuilder()
    .setTitle('Home chores')
    .setDescription('API for managing home chores')
    .setVersion('1.0')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  const openAPISchema = await auth.api.generateOpenAPISchema();

  // Add 'Auth' tag to all Better Auth paths and prepend basePath
  const authPaths = Object.entries(openAPISchema.paths || {}).reduce(
    (acc, [path, methods]: [string, any]) => {
      const taggedMethods = Object.entries(methods).reduce(
        (methodAcc, [method, operation]: [string, any]) => ({
          ...methodAcc,
          [method]: {
            ...operation,
            tags: ['Auth'],
          },
        }),
        {},
      );
      // Prepend /api/auth to the path
      const fullPath = `/api/auth${path}`;
      return { ...acc, [fullPath]: taggedMethods };
    },
    {},
  );

  // Merge the schemas properly
  const mergedSchema = {
    ...document,
    paths: {
      ...document.paths,
      ...authPaths,
    },
    components: {
      schemas: {
        ...document.components?.schemas,
        ...openAPISchema.components?.schemas,
      },
      securitySchemes: {
        ...document.components?.securitySchemes,
        ...openAPISchema.components?.securitySchemes,
      },
    },
  };

  app.use(
    '/docs',
    apiReference({
      theme: 'elysiajs',
      pageTitle: 'Home Chores API',
      content: mergedSchema,
    }),
  );

  await app.listen(process.env.PORT ?? 3000);
}
void bootstrap();
