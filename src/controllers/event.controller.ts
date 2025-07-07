import { Request, Response } from "express";
import EventModel from "../models/event.model";
import { Types } from "mongoose";
import CommentModel from "../models/comment.model";
import { ICommentPopulated } from "../types/comment";

const createEvent = async (req: Request, res: Response) => {
  try {
    const { type, status, imageUrl, title, details, description, liveUrl } =
      req.body;

    const userId = req.user?.id;

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: "Utilisateur non authentifié",
      });
    }

    if (imageUrl && !imageUrl.startsWith("data:image/")) {
      return res.status(400).json({
        success: false,
        message: "Format d'image invalide",
      });
    }

    const newEvent = new EventModel({
      userId,
      type,
      status: status || "coming",
      imageUrl,
      title,
      details,
      description,
      liveUrl,
    });

    await newEvent.save();

    const eventObject = newEvent.toObject();

    const eventFormated = {
      id: newEvent._id,
      ...eventObject,
    };
    return res.status(201).json({
      success: true,
      message: "Événement créé avec succès",
      data: { event: eventFormated },
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Erreur lors de la création de l'événement",
      error: (error as Error).message,
    });
  }
};

const getAllEvents = async (req: Request, res: Response) => {
  try {
    const userId = req.user?.id;
    const events = await EventModel.find().sort({ createdAt: -1 }).lean();

    const formattedEvents = events.map((event) => ({
      id: event._id.toString(),
      ...event,
      isLiked: userId
        ? event.likes?.some((id) => id.toString() === userId)
        : false,
      isSaved: userId
        ? event.saves?.some((id: any) => id.toString() === userId)
        : false,
    }));

    return res.status(200).json({
      success: true,
      data: { events: formattedEvents },
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Erreur lors de la récupération des événements",
      error: (error as Error).message,
    });
  }
};

const getAllEventswithUsers = async (req: Request, res: Response) => {
  try {
    const userId = req.user?.id;

    const events = await EventModel.find()
      .populate({
        path: "userId",
        select: "username _id",
        model: "User",
      })
      .sort({ createdAt: -1 })
      .exec();

    const formattedEvents = await Promise.all(
      events.map(async (event: any) => {
        const eventObj = event.toObject();

        const commentsCount = await CommentModel.countDocuments({
          eventId: eventObj._id,
        });

        return {
          id: eventObj._id.toString(),
          type: eventObj.type,
          status: eventObj.status,
          imageUrl: eventObj.imageUrl,
          title: eventObj.title,
          details: eventObj.details,
          description: eventObj.description,
          liveUrl: eventObj.liveUrl,
          createdAt: eventObj.createdAt,
          isLiked: userId
            ? eventObj.likes?.some((id: any) => id.toString() === userId)
            : false,

          isSaved: userId
            ? eventObj.saves?.some((id: any) => id.toString() === userId)
            : false,

          stats: {
            likes: eventObj.likes?.length || 0,
            comments: commentsCount,
          },
          organizer: {
            id: eventObj.userId?._id?.toString() || null,
            username: eventObj.userId?.username || "Utilisateur inconnu",
          },
        };
      })
    );

    return res.status(200).json({
      success: true,
      data: { events: formattedEvents },
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message:
        "Erreur lors de la récupération des événements avec utilisateurs",
      error: (error as Error).message,
    });
  }
};

const toggleLike = async (req: Request, res: Response) => {
  try {
    const userId = req.user?.id;
    const { eventId } = req.params;

    if (!userId) {
      return res
        .status(401)
        .json({ success: false, message: "Utilisateur non authentifié" });
    }

    const event = await EventModel.findById(eventId);
    if (!event) {
      return res
        .status(404)
        .json({ success: false, message: "Événement introuvable" });
    }

    const alreadyLiked = event.likes.includes(userId);

    if (alreadyLiked) {
      event.likes = event.likes.filter((id) => id.toString() !== userId);
    } else {
      event.likes.push(userId);
    }

    await event.save();

    return res.status(200).json({
      success: true,
      liked: !alreadyLiked,
      message: alreadyLiked
        ? "Événement retiré des likes"
        : "Événement liké avec succès",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Erreur lors du like de l'événement",
      error: (error as Error).message,
    });
  }
};

const toggleSave = async (req: Request, res: Response) => {
  try {
    const userId = req.user?.id;
    const { eventId } = req.params;

    if (!userId) {
      return res
        .status(401)
        .json({ success: false, message: "Utilisateur non authentifié" });
    }

    const event = await EventModel.findById(eventId);
    if (!event) {
      return res
        .status(404)
        .json({ success: false, message: "Événement introuvable" });
    }

    const alreadySaved = event.saves.includes(userId);

    if (alreadySaved) {
      event.saves = event.saves.filter((id) => id.toString() !== userId);
    } else {
      event.saves.push(userId);
    }

    await event.save();

    return res.status(200).json({
      success: true,
      saved: !alreadySaved,
      message: alreadySaved
        ? "Événement retiré des favoris"
        : "Événement ajouté aux favoris avec succès",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Erreur lors de l'enregistrement de l'événement",
      error: (error as Error).message,
    });
  }
};
const addComment = async (req: Request, res: Response) => {
  try {
    const { eventId } = req.params;
    const { text } = req.body;
    const userId = req.user?.id;

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: "Utilisateur non authentifié",
      });
    }

    if (!text || text.trim().length === 0) {
      return res.status(400).json({
        success: false,
        message: "Le texte du commentaire est requis",
      });
    }

    if (text.length > 500) {
      return res.status(400).json({
        success: false,
        message: "Le commentaire ne peut pas dépasser 500 caractères",
      });
    }

    const eventExists = await EventModel.findById(eventId);
    if (!eventExists) {
      return res.status(404).json({
        success: false,
        message: "Événement introuvable",
      });
    }

    const newComment = new CommentModel({
      eventId: new Types.ObjectId(eventId),
      userId: new Types.ObjectId(userId),
      text: text.trim(),
    });

    await newComment.save();

    // Cast to ICommentPopulated
    const populatedComment = (await CommentModel.findById(newComment._id)
      .populate({
        path: "userId",
        select: "username _id",
        model: "User",
      })
      .exec()) as ICommentPopulated | null; // Use ICommentPopulated here

    if (!populatedComment) {
      return res.status(500).json({
        success: false,
        message: "Erreur lors de la création du commentaire",
      });
    }

    // Now commentObj will have the correct type for userId
    const commentObj = populatedComment.toObject();
    const formattedComment = {
      id: commentObj._id.toString(),
      eventId: commentObj.eventId.toString(),
      text: commentObj.text,
      createdAt: commentObj.createdAt,
      user: {
        id: commentObj.userId._id.toString(), // No error here
        username: commentObj.userId.username, // No error here
      },
    };

    return res.status(201).json({
      success: true,
      message: "Commentaire ajouté avec succès",
      data: { comment: formattedComment },
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Erreur lors de l'ajout du commentaire",
      error: (error as Error).message,
    });
  }
};

const getEventComments = async (req: Request, res: Response) => {
  try {
    const { eventId } = req.params;

    const eventExists = await EventModel.findById(eventId);
    if (!eventExists) {
      return res.status(404).json({
        success: false,
        message: "Événement introuvable",
      });
    }

    const comments = (await CommentModel.find({ eventId })
      .populate({
        path: "userId",
        select: "username _id",
        model: "User",
      })
      .sort({ createdAt: -1 })

      .exec()) as unknown as ICommentPopulated[];

    const formattedComments = comments.map((comment) => {
      const commentObj = comment.toObject();
      return {
        id: commentObj._id.toString(),
        eventId: commentObj.eventId.toString(),
        text: commentObj.text,
        createdAt: commentObj.createdAt,
        user: {
          id: commentObj.userId?._id?.toString() || null,
          username: commentObj.userId?.username,
        },
      };
    });

    return res.status(200).json({
      success: true,
      data: { comments: formattedComments },
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Erreur lors de la récupération des commentaires",
      error: (error as Error).message,
    });
  }
};

const deleteComment = async (req: Request, res: Response) => {
  try {
    const { commentId } = req.params;
    const userId = req.user?.id;

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: "Utilisateur non authentifié",
      });
    }

    const comment = await CommentModel.findById(commentId);
    if (!comment) {
      return res.status(404).json({
        success: false,
        message: "Commentaire introuvable",
      });
    }

    if (comment.userId.toString() !== userId) {
      return res.status(403).json({
        success: false,
        message: "Vous n'êtes pas autorisé à supprimer ce commentaire",
      });
    }

    await CommentModel.findByIdAndDelete(commentId);

    return res.status(200).json({
      success: true,
      message: "Commentaire supprimé avec succès",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Erreur lors de la suppression du commentaire",
      error: (error as Error).message,
    });
  }
};

export default {
  createEvent,
  getAllEvents,
  getAllEventswithUsers,
  toggleLike,
  deleteComment,
  addComment,
  getEventComments,
  toggleSave,
};
