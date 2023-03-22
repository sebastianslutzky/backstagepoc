import { CatalogBuilder } from '@backstage/plugin-catalog-backend';
import { ScaffolderEntitiesProcessor } from '@backstage/plugin-scaffolder-backend';
import { Router } from 'express';
import { PluginEnvironment } from '../types';
import {AzureDevOpsEntityProvider } from '@backstage/plugin-catalog-backend-module-azure';

export default async function createPlugin(
  env: PluginEnvironment,
): Promise<Router> {
  const builder = await CatalogBuilder.create(env);
  builder.addProcessor(new ScaffolderEntitiesProcessor());

  

    var sch = env.scheduler.createScheduledTaskRunner({
      frequency: { seconds: 15 },
    timeout: { minutes: 3 },
    initialDelay: { seconds: 3 }
    });
  var azdo = AzureDevOpsEntityProvider.fromConfig(env.config, {
    logger: env.logger,
    schedule: sch ,

    // optional: alternatively, use schedule
    scheduler: env.scheduler,
  });

builder.addEntityProvider(
  azdo
);

  const { processingEngine, router } = await builder.build();
  await processingEngine.start();
  return router;
}
