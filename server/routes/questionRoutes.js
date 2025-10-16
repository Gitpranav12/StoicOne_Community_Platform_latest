const express = require('express');
const router = express.Router();
const questionController = require('../controllers/questionController');

router.post('/', questionController.create);
router.get('/', questionController.list);
router.get('/recent', questionController.recent); 
router.get('/:id', questionController.detail);
router.get('/tags/all', questionController.allTags);
// ANSWERS
router.post('/answer', questionController.addAnswer);
router.get('/:id/answers', questionController.getAnswersByQuestion);

// COMMENTS
router.post('/comment', questionController.addComment);
router.get('/:id/comments', questionController.getCommentsByQuestion);

// VOTES
router.post('/vote', questionController.voteQuestion);
router.get('/:id/votes', questionController.getQuestionVotes);

//Tags
router.get('/tags/all', questionController.allTags);


// .............Added by Raj Thakre ..........
// DELETE question
router.delete('/:id', questionController.delete);
// Flag a question
router.post('/:id/flag', questionController.flag);
// Optional: get flags
router.get('/:id/flags', questionController.getFlags);
router.post('/:id/unflag', questionController.unflag);

// .............Added by Raj Thakre ..........
// DELETE answer
router.delete('/answers/:id', questionController.deleteAnswer);

// .............Added by pranav 26 sep ..........
// For Edit The Question
router.put('/:id', questionController.update);
// .............Added by Pranav Jawarkar 27 sep ..........
// To get the vote (upvote/downvote) done by a specific user on a question
router.get('/:id/uservote', questionController.getUserVote);
// .............Added by Pranav Jawarkar 27 sep..........
// Update answer
router.put('/answers/:id', questionController.updateAnswer);

module.exports = router;
