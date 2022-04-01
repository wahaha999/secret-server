import { NextFunction, Request, Response, Router } from "express";
import { Secret } from "../models/Secret";
import * as crypto from "../helper/crypto";

class SecretRouter {
  private _router = Router();

  get router() {
    return this._router;
  }

  constructor() {
    this._configure();
  }

  /**
   * Connect routes to their matching controller endpoints.
   */
  private _configure() {
    // @route   GET v1/get
    // @desc    Get all secrets
    // @access  Public
    this._router.get(
      "/get",
      async (req: Request, res: Response, next: NextFunction) => {
        try {
          const secrets = await Secret.find({});

          res.status(200).json(
            secrets.map((s) => ({
              hash: s._id,
              secretText: "********",
              expireAt: s.expireAt,
              createdAt: s.createdAt,
            }))
          );
        } catch (error) {
          next(error);
        }
      }
    );

    // @route   GET v1/create
    // @desc    Create a secret
    // @access  Public
    this._router.post(
      "/secret",
      (req: Request, res: Response, next: NextFunction) => {
        try {
          const { secretText, expireAt } = req.body;
          console.log(crypto.encrypt(secretText), expireAt);
          const secret = new Secret({
            secretText: crypto.encrypt(secretText),
            expireAt: expireAt,
          });

          secret.save(function (err, doc) {
            console.log(doc._id);
          });

          res.send("Secret is created successfully");
        } catch (error) {
          next(error);
        }
      }
    );

    // @route   GET v1/get/:hash
    // @desc    Get a secret by hash
    // @access  Public
    this._router.get(
      "/secret/:hash",
      async (req: Request, res: Response, next: NextFunction) => {
        try {
          const id = req.params.hash;
          const secret = await Secret.findOne({ _id: id });

          const current = new Date();
          const expireTime = new Date(secret.expireAt);

          if (current.getTime() < expireTime.getTime()) {
            res.send(crypto.decrypt(secret.secretText));
          } else {
            res.send("The secret is expired. You can not see this secret");
          }
        } catch (error) {
          next(error);
        }
      }
    );
  }
}

export = new SecretRouter().router;
