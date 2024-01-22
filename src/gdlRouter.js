import express from "express";
import { GDL } from "./models/gdl.js";
import { Comment } from "./models/comments.js";
import { Event } from "./models/events.js";
import { User } from "./models/users.js";
import { genericError } from "./middlewares/genericError.js";
import uploadFile from "../src/configuration/confGdl.js";
import path from "path";

const gdlRouter = express.Router();

gdlRouter.get("/", async (req, res, next) => {
  //ritorna tutti i gdl
  try {
    const gdl = await GDL.find({}).populate("user");
    res.json(gdl);
  } catch (error) {
    next(error);
  }
});

gdlRouter.get("/:id", async (req, res, next) => {
  //ritorna un gdl specifico
  try {
    const { id } = req.params;
    const gdl = await GDL.findById(id).populate(
      "user userId",
      "_id name surname avatar"
    );

    if (!gdl) {
      return res.status(404).send();
    }

    res.json(gdl);
  } catch (error) {
    next(error);
  }
});

gdlRouter.get("/:id/comments", async (req, res, next) => {
  //ritorna tutti i commenti di un gdl specifico
  try {
    const comments = await Comment.find({ gdl: req.params.id }).populate(
      "user",
      "_id name surname avatar"
    );

    if (!comments) {
      return res.status(404).send();
    }
    res.json(comments);
  } catch (error) {
    console.error(error);
    next(error);
  }
});

gdlRouter.get("/:id/events", async (req, res, next) => {
  //ritorna tutti gli eventi di un gdl specifico
  try {
    const events = await Event.find({ gdl: req.params.id }).populate(
      "user gdl"
    );

    if (!events) {
      return res.status(404).send();
    }
    res.json(events);
  } catch (error) {
    console.error(error);
    next(error);
  }
});

gdlRouter.get("/:id/comments/:commentId", async (req, res, next) => {
  //ritorna un commento specifico di un gdl specifico
  try {
    const { commentId } = req.params;
    const comment = await Comment.findById(commentId).populate(
      "user",
      "_id name surname avatar"
    );

    if (!comment) {
      return res.status(404).send();
    }

    res.json(comment);
  } catch (error) {
    next(error);
  }
});

gdlRouter.get("/:id/events/:eventId", async (req, res, next) => {
  //ritorna un evento specifico di un gdl specifico
  try {
    const { eventId } = req.params;
    const event = await Event.findById(eventId).populate("user gdl");

    if (!event) {
      return res.status(404).send();
    }

    res.json(event);
  } catch (error) {
    next(error);
  }
});

gdlRouter.get("/:id/users", async (req, res, next) => {
  //ritorna tutti gli utenti di un gdl specifico
  try {
    const users = await User.find({ gdl: req.params.id }).populate("userId");

    if (!users) {
      return res.status(404).send();
    }
    res.json(users);
  } catch (error) {
    console.error(error);
    next(error);
  }
});

gdlRouter.get("/:id/users/:userId", async (req, res, next) => {
  //ritorna un utente specifico di un gdl specifico
  try {
    const { userId } = req.params;
    const user = await User.findById(userId).populate("userId");

    if (!user) {
      return res.status(404).send();
    }

    res.json(user);
  } catch (error) {
    next(error);
  }
});

gdlRouter.post("/", async (req, res, next) => {
  //aggiunge un nuovo gdl
  try {
    const newGdl = new GDL(req.body);

    await newGdl.save();

    res.status(201).json(newGdl);
  } catch (error) {
    error.statusCode = 400;
    next(error);
  }
});

gdlRouter.post("/:id", async (req, res, next) => {
  //aggiunge un nuovo commento ad un gdl specifico
  try {
    const newComment = new Comment(req.body);

    await newComment.save();

    res.status(201).json(newComment);
  } catch (error) {
    error.statusCode = 400;
    next(error);
  }
});

gdlRouter.post("/:id/events", async (req, res, next) => {
  //aggiunge un nuovo evento ad un gdl specifico
  try {
    const newEvent = new Event(req.body);

    await newEvent.save();

    res.status(201).json(newEvent);
  } catch (error) {
    error.statusCode = 400;
    next(error);
  }
});

gdlRouter.put("/:id", async (req, res, next) => {
  //modifica un gdl specifico
  try {
    const updatedGdl = await GDL.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    res.json(updatedGdl);
  } catch (error) {
    next(error);
  }
});

gdlRouter.put("/:id/comments/:commentId", async (req, res, next) => {
  //modifica un commento ad un gdl specifico
  try {
    const updatedComment = await Comment.findByIdAndUpdate(
      req.params.commentId,
      req.body,
      {
        new: true,
      }
    );
    res.json(updatedComment);
  } catch (error) {
    next(error);
  }
});

gdlRouter.put("/:id/events/:eventId", async (req, res, next) => {
  //modifica un evento ad un gdl specifico
  try {
    const updatedEvent = await Event.findByIdAndUpdate(
      req.params.eventId,
      req.body,
      {
        new: true,
      }
    );
    res.json(updatedEvent);
  } catch (error) {
    next(error);
  }
});

gdlRouter.delete("/:id", async (req, res, next) => {
  //elimina un gdl specifico
  try {
    const deletedGdl = await GDL.findByIdAndDelete(req.params.id);

    if (!deletedGdl) {
      res.status(404).send();
    } else {
      res.status(204).send();
    }
  } catch (error) {
    next(error);
  }
});

gdlRouter.delete("/:id/comments/:commentId", async (req, res, next) => {
  //elimina un commento ad un gdl specifico
  try {
    const deletedComment = await Comment.findByIdAndDelete(
      req.params.commentId
    );

    if (!deletedComment) {
      res.status(404).send();
    } else {
      res.status(204).send();
    }
  } catch (error) {
    next(error);
  }
});

gdlRouter.delete("/:id/events/:eventId", async (req, res, next) => {
  //elimina un evento ad un gdl specifico
  try {
    const deletedEvent = await Event.findByIdAndDelete(req.params.eventId);

    if (!deletedEvent) {
      res.status(404).send();
    } else {
      res.status(204).send();
    }
  } catch (error) {
    next(error);
  }
});

gdlRouter.patch(
  "/:id/cover",
  uploadFile.single("cover"),
  async (req, res, next) => {
    //aggiunge la cover ad un gdl specifico
    try {
      console.log(req.file);
      let updatedCover = await GDL.findByIdAndUpdate(
        req.params.id,
        { cover: req.file.path },
        { new: true }
      );
      if (!updatedCover) {
        return res.status(404).json({ error: "Cover non trovata." });
      } else {
        res.json(updatedCover);
      }
    } catch (error) {
      next(error);
    }
  }
);

export default gdlRouter;
