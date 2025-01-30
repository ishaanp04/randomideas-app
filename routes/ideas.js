const express = require('express');
const router = express.Router();
const Idea = require('../models/Idea');

// get all ideas
router.get('/', async (request, response) => {
  // response.json({ success: true, data: ideas });

  try {
    const ideas = await Idea.find();
    response.json({ success: true, data: ideas });
  } catch (error) {
    console.log(error);
    response
      .status(500)
      .json({ success: false, error: 'Something went wrong.' });
  }
});

// get an idea by id
router.get('/:id', async (request, response) => {
  try {
    const idea = await Idea.findById(request.params.id);
    response.json({ success: true, data: idea });
  } catch (error) {
    console.log(error);
    response
      .status(500)
      .json({ success: false, error: 'Something went wrong' });
  }
});

// add an idea
router.post('/', async (request, response) => {
  const idea = new Idea({
    text: request.body.text,
    tag: request.body.tag,
    username: request.body.username,
  });

  try {
    const savedIdea = await idea.save();
    response.json({ success: true, data: savedIdea });
  } catch (error) {
    console.log(error);
    response
      .status(500)
      .json({ success: false, error: 'Something went wrong' });
  }
});

// update idea
router.put('/:id', async (request, response) => {
  try {
    const updatedIdea = await Idea.findByIdAndUpdate(
      request.params.id,
      {
        $set: {
          text: request.body.text,
          tag: request.body.tag,
        },
      },
      { new: true }
    );
    response.json({ success: true, data: updatedIdea });
  } catch (error) {
    console.log(error);
    response
      .status(500)
      .json({ success: false, error: 'Something went wrong' });
  }
});

// delete idea
router.delete('/:id', async (request, response) => {
  try {
    await Idea.findByIdAndDelete(request.params.id);
    response.json({ success: true, data: {} });
  } catch (error) {
    console.log(error);
    response
      .status(500)
      .json({ success: false, error: 'Something went wrong' });
  }
});

module.exports = router;
