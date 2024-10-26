import { Router } from "express";
import { container } from "@config/dependencyContainer";
import { AdditionTypeController } from "@app/controller/AdditionTypeController";
import { env } from "@config/env";

const path = `${env.API_VERSION}/addition-types`;

const controller = container.resolve<AdditionTypeController>(
  "AdditionTypeController"
);

const router = Router();

router.get(`${path}`, controller.getAllAdditionTypes);

router.post(`${path}`, controller.createAdditionType);

router.get(`${path}/:id`, controller.getAdditionTypeById);

router.put(`${path}/:id`, controller.updateAdditionType);

router.delete(`${path}/:id`, controller.deleteAdditionTypeById);

export const additionTypeRoutes = router;
