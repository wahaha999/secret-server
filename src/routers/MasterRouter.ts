import { Router } from "express";
import SecretRouter from "./Secret";

class MasterRouter {
  private _router = Router();
  private _secrtrouter = SecretRouter;

  get router() {
    return this._router;
  }

  constructor() {
    this._configure();
  }

  /**
   * Connect routes to their matching routers.
   */
  private _configure() {
    this._router.use("/", this._secrtrouter);
  }
}

export = new MasterRouter().router;
