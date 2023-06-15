const express = require("express");
require("dotenv").config();
const Blog = require("../models/Blog");
const auth = require("../middlewares/auth.middleware");
const blogRouter = express.Router();

blogRouter.get("/blogs", auth, async (req, res) => {
  try {
    let filters = {};
    const category = req.query.category;
    const title = req.query.title;
    const order = req.query.order;
    let sort = {};
    if (category) {
      filters.category = category;
    }
    if (title) {
      filters.title = title;
    }
    if (order === "asc") {
      sort.date = 1;
    } else if (order === "desc") {
      sort.date = -1;
    }
    const blogs = await Blog.find(filters).sort(sort);
    res.status(200).json(blogs);
  } catch (err) {
    res
      .status(500)
      .send({ message: "Unable to process the request at the moment" });
  }
});


blogRouter.post("/blogs", auth, async (req, res) => {
  try {
    const blogs = new Blog(req.body);
    await blogs.save();
    res.status(201).send(blogs);
  } catch (err) {
    res
      .status(500)
      .send({ message: "Unable to process the request at the moment" });
  }
});

blogRouter.put("/blogs/:id/like", auth, async (req, res) => {
  try {
    const id = req.params.id;
    const blogs = await Blog.findOneAndUpdate(
      { _id: id },
      { $inc: { likes: 1 } },
      { new: true }
    );
    res.status(200).send(blogs);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
});

blogRouter.put("/blogs/:id/comment", auth, async (req, res) => {
  try {
    const id = req.params.id;
    const { username, content } = req.body;
    const blogs = await Blog.findOneAndUpdate(
      { _id: id },
      { $push: { comments: { username, content } } },
      { new: true }
    );
    res.status(200).send(blogs);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
});

blogRouter.patch("/blogs/:id", auth, async (req, res) => {
  try {
    const id = req.params.id;
    const userId = req.body.userID;
    const blog = await Blog.findById(id);
    if (!blog) {
      return res.status(404).json({ message: "Blog not found" });
    }

    if (blog.userID.toString() !== userId) {
      return res
        .status(403)
        .json({ message: "Unauthorised user" });
    }
    const blogs = await Blog.findByIdAndUpdate(id, req.body, { new: true });
    res.status(201).send(blogs);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
});

blogRouter.delete("/blogs/:id", auth, async (req, res) => {
  try {
    const id = req.params.id;
    const userId = req.body.userID;

    const blog = await Blog.findById(id);
    if (!blog) {
      return res.status(404).json({ message: "Blog not found" });
    }

    if (blog.userID.toString() !== userId) {
      return res
        .status(403)
        .json({ message: "Unauthorised user" });
    }

    await Blog.findByIdAndDelete(id);
    res.status(200).json({ message: "Blog deleted successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = blogRouter;
