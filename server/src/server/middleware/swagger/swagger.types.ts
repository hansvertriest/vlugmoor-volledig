import { ISwaggerBuildDefinitionModel } from 'swagger-express-ts/swagger.builder';

export interface ISwaggerModels {
  [key: string]: ISwaggerBuildDefinitionModel;
}
