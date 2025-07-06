import express, { Request, Response, NextFunction } from "express";
import eventController from "../controllers/event.controller";
import validate from "../middlewares/validators/validator";
import { createEventSchema } from "../framework-core/validators/event.schema";
import authMiddleware from "../middlewares/auth.middleware";
import { createCommentSchema } from "../framework-core/validators/comment.schema";

const router = express.Router();

router.post(
  "/",
  validate(createEventSchema),
  (req, res, next) => {
    authMiddleware.authenticate(req, res, next);
  },
  (req, res) => {
    eventController.createEvent(req, res);
  }
);

router.get(
  "/",
  (req, res, next) => {
    authMiddleware.authenticate(req, res, next);
  },
  (req, res) => {
    eventController.getAllEvents(req, res);
  }
);

router.get(
  "/with-users",
  (req, res, next) => {
    authMiddleware.authenticate(req, res, next);
  },
  (req, res) => {
    eventController.getAllEventswithUsers(req, res);
  }
);

router.patch(
  "/:eventId/like",
  (req, res, next) => {
    authMiddleware.authenticate(req, res, next);
  },
  (req, res) => {
    eventController.toggleLike(req, res);
  }
);

router.patch(
  "/:eventId/save",
  (req, res, next) => {
    authMiddleware.authenticate(req, res, next);
  },
  (req, res) => {
    eventController.toggleSave(req, res);
  }
);

router.get(
  "/:eventId/comments",
  (req, res, next) => {
    authMiddleware.authenticate(req, res, next);
  },
  (req, res) => {
    eventController.getEventComments(req, res);
  }
);

router.post(
  "/:eventId/comments",
  validate(createCommentSchema),
  (req, res, next) => {
    authMiddleware.authenticate(req, res, next);
  },
  (req, res) => {
    eventController.addComment(req, res);
  }
);

router.delete(
  "/comments/:commentId",
  (req, res, next) => {
    authMiddleware.authenticate(req, res, next);
  },
  (req, res) => {
    eventController.deleteComment(req, res);
  }
);

export default router;
