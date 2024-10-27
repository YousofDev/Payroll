import { Router } from "express";
import { container } from "@config/dependencyContainer";
import { AdditionController } from "@app/controller/AdditionController";
import { env } from "@config/env";

const path = `${env.API_VERSION}/additions`;

const controller = container.resolve<AdditionController>("AdditionController");

const router = Router();

router.post(path, controller.createAddition);

router.get(path, controller.getAllAdditions);

router.get(`${path}/:id`, controller.getAdditionById);

router.put(`${path}/:id`, controller.updateAddition);

router.delete(`${path}/:id`, controller.deleteAdditionById);

export const additionRoutes = router;
