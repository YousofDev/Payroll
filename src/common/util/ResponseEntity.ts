import { Response } from "express";

export class ResponseEntity {
  static ok(response: Response, data?: unknown) {
    return response.status(200).json(data);
  }

  static created(response: Response, data?: unknown) {
    return response.status(201).json(data);
  }

  static accepted(response: Response, data?: unknown) {
    return response.status(202).json(data);
  }

  static noContent(response: Response) {
    return response.status(204).send();
  }
}
