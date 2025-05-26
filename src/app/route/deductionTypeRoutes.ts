import { Router } from "express";
import { container } from "@config/dependencyContainer";
import { DeductionTypeController } from "@app/controller/DeductionTypeController";
import { env } from "@config/env";
import { catchRouteErrors } from "@util/catchRouteErrors";
import { hasAuthority } from "@middleware/hasAuthority";

const path = `${env.API_VERSION}/deduction-types`;

const controller = container.resolve(DeductionTypeController);

const router = Router();

router.get(`${path}`, controller.getAllDeductionTypes.bind(controller));

router.post(
  `${path}`,
  hasAuthority("ADMIN"),
  controller.createDeductionType.bind(controller)
);

router.get(`${path}/:id`, controller.getDeductionTypeById.bind(controller));

router.put(
  `${path}/:id`,
  hasAuthority("ADMIN"),
  controller.updateDeductionType.bind(controller)
);

router.delete(
  `${path}/:id`,
  hasAuthority("ADMIN"),
  controller.deleteDeductionTypeById.bind(controller)
);

catchRouteErrors(router);

export const deductionTypeRoutes = router;
