import {
  FastifyBaseLogger,
  FastifyInstance,
  RawReplyDefaultExpression,
  RawRequestDefaultExpression,
  RawServerDefault,
  RouteHandlerMethod,
  RouteShorthandMethod,
} from "fastify";
import { ZodTypeProvider, jsonSchemaTransform, serializerCompiler, validatorCompiler } from "fastify-type-provider-zod";
import { ZodError } from "zod";
import fastify from "fastify";
import fastifySwagger from "@fastify/swagger";
import fastifyCors from "@fastify/cors";
import { ActionNotFoundError } from "../../app/Actions/domain/errors/ActionNotFoundError";
import { ActionAlreadyOpennedError } from "../../app/Actions/domain/errors/ActionAlreadyOpennedError";
import { ActionsControllerContainer } from "../../app/Actions/adapters/ActionsControllersContainer";
import { FetchControllerContainer } from "../../app/Fetch/adapters/FetchControllerContainer";
import { PdfControllerContainer } from "../../app/Pdf/adapters/PdfControllersContainer";


declare module "fastify" {
  interface FastifyRequest {
    customerId: string;
  }
}

type ServerInstance = FastifyInstance<
  RawServerDefault,
  RawRequestDefaultExpression<RawServerDefault>,
  RawReplyDefaultExpression<RawServerDefault>,
  FastifyBaseLogger,
  ZodTypeProvider
>;

export class Server {
  private static instance: Server;

  private serverInstance: ServerInstance = fastify();

  private constructor() {
    this.initialize();
  }

  private initialize() {
    this.serverInstance
      .setValidatorCompiler(validatorCompiler)
      .setSerializerCompiler(serializerCompiler)
      .register(fastifySwagger, {
        openapi: {
          info: {
            title: "Production API",
            description: "Production backend API",
            version: "1.0.0",
          },
          servers: [],
        },
        transform: jsonSchemaTransform,
      })
      .register(fastifyCors, {
        origin: "*",
      })
      .setErrorHandler((error, _, response) => {

        if (error instanceof ActionNotFoundError) {
          response.status(404).send(error);
        }
        if (error instanceof ActionAlreadyOpennedError) {
          response.status(400).send(error);
        }
        if (error instanceof ZodError) {
          response.status(400).send({
            error: "bad request",
            message: error.issues,
          });
        }
        response.status(500).send(error);

      })
      .withTypeProvider<ZodTypeProvider>()
      .after(() => {
        ActionsControllerContainer.execute();
        FetchControllerContainer.execute();
        PdfControllerContainer.execute();
      });

      this.serverInstance.addHook("onRoute", (routeOptions) => {
        console.log(`Registered route: ${routeOptions.method} ${routeOptions.url}`);
      })
  }

  public static getInstance(): Server {
    if (!Server.instance) Server.instance = new Server();
    return Server.instance;
  }

  public get: RouteShorthandMethod<
    RawServerDefault,
    RawRequestDefaultExpression<RawServerDefault>,
    RawReplyDefaultExpression<RawServerDefault>,
    ZodTypeProvider
  > = (url, options) => {
    return this.serverInstance.get(url, options as RouteHandlerMethod);
  };

  public post: RouteShorthandMethod<
    RawServerDefault,
    RawRequestDefaultExpression<RawServerDefault>,
    RawReplyDefaultExpression<RawServerDefault>,
    ZodTypeProvider
  > = (url, options) => {
    return this.serverInstance.post(url, options as RouteHandlerMethod);
  };


  public listen = () => {

    this.serverInstance.ready((err) => {
      if (err) {
        console.error("Fastify initialization error:", err);
        process.exit(1);
      }
      this.serverInstance.log.info("Fastify server started in debug mode");
   });
  
    this.serverInstance.listen({ port: 8080, host: 'localhost' }, (error, address) => {
      if (error) {
        console.error("Error starting the server:", error);
        process.exit(1);
      }
  
    console.log(`Server listening at ${address}`);
    });

 };


}
