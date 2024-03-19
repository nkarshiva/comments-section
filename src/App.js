import React, { useState, useEffect} from 'react';
import './App.css'; // Assuming you have a CSS file for styling

const CommentSection = () => {
  const [name, setName] = useState('');
  const [comment, setComment] = useState('');
  const [comments, setComments] = useState(() => {
    // Initialize comments array with data from localStorage or an empty array
    const storedComments = localStorage.getItem('comments');
    return storedComments ? JSON.parse(storedComments) : [];
  });
  const [replyName, setReplyName] = useState('');
  const [replyComment, setReplyComment] = useState('');
  const [replyingToIndex, setReplyingToIndex] = useState(null);

  const [editingCommentIndex, setEditingCommentIndex] = useState(null);
  const [editedComment, setEditedComment] = useState('');

  const [sortOrder, setSortOrder] = useState('asc'); // Track sorting order: 'asc' or 'desc'

  const handleNameChange = (e) => {
    setName(e.target.value);
  };

  const handleCommentChange = (e) => {
    setComment(e.target.value);
  };

  const handlePostComment = () => {
    if (name.trim() !== '' && comment.trim() !== '') {
      const newComment = {
        name,
        comment,
        dateTime: new Date().toISOString()
      };
      const updatedComments = [...comments, newComment];
      sortComments(updatedComments); // Sort comments after adding new comment
      setComments(updatedComments);
      setName('');
      setComment('');
    } else {
      alert('Please enter your name and comment text.');
    }
  };

  const handleEditComment = (index) => {
    setEditingCommentIndex(index);
    setEditedComment(comments[index].comment);
  };

  const handleSaveEditedComment = (index) => {
    const updatedComments = [...comments];
    updatedComments[index].comment = editedComment;
    setComments(updatedComments);
    setEditingCommentIndex(null);
    setEditedComment('');
  };

  const handleCancelEditComment = () => {
    setEditingCommentIndex(null);
    setEditedComment('');
  };

  const handleReplyComment = (index) => {
    setReplyingToIndex(index);
  };

  const handlePostReply = (index) => {
    if (replyName.trim() !== '' && replyComment.trim() !== '') {
      const newReply = {
        name: replyName,
        comment: replyComment,
        dateTime: new Date().toISOString()
      };
      const updatedComments = [...comments];
      updatedComments[index].replies = updatedComments[index].replies || [];
      updatedComments[index].replies.push(newReply);
      updatedComments[index].replies.sort((a, b) => new Date(a.dateTime) - new Date(b.dateTime));
      setComments(updatedComments);
      setReplyingToIndex(null);
      setReplyComment('');
      setReplyName('');
    } else {
      alert('Please enter your name and reply text.');
    }
  };

  const handleDeleteComment = (index) => {
    const updatedComments = [...comments];
    updatedComments.splice(index, 1);
    setComments(updatedComments);
  };

  const handleDeleteReply = (commentIndex, replyIndex) => {
    const updatedComments = [...comments];
    updatedComments[commentIndex].replies.splice(replyIndex, 1);
    setComments(updatedComments);
  };

  const toggleSortOrder = () => {
    setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    const updatedComments = [...comments];
    sortComments(updatedComments); // Sort comments based on updated sorting order
    setComments(updatedComments);
  };

  const sortComments = (commentsArray) => {
    commentsArray.sort((a, b) => {
      const dateA = new Date(a.dateTime).getTime();
      const dateB = new Date(b.dateTime).getTime();
      if (sortOrder === 'asc') {
        return dateA - dateB;
      } else {
        return dateB - dateA;
      }
    });
  };

  useEffect(() => {
    // Retrieve comments from localStorage when component mounts
    const storedComments = localStorage.getItem('comments');
    if (storedComments) {
      setComments(JSON.parse(storedComments));
    }
  }, []);

  useEffect(() => {
    // Save comments to localStorage whenever comments state changes
    localStorage.setItem('comments', JSON.stringify(comments));
  }, [comments]);

  return (
    <div className="comment-section-container">
      <div className="comment-section">
        <div className="comment-input">
          <input
            type="text"
            placeholder="Your Name"
            value={name}
            onChange={handleNameChange}
          />
          <textarea
            placeholder="Your Comment"
            value={comment}
            onChange={handleCommentChange}
          ></textarea>
          <button className="post-button" onClick={handlePostComment}>
            Post
          </button>
        </div>
      </div>
      <div className='sort-container'>
        {
          comments.length > 0 ?
            <p className="sort-text" onClick={toggleSortOrder}>
              {sortOrder === 'asc' ? 'Sort date and time by descending' : 'Sort date and time by ascending'}
            </p>
            :
            null
        }
      </div>

      <div className="comments-list">
        {comments.map((c, index) => (
          <div key={index} className="comment">
            <div className='comment-name-and-date'>
              <div className="comment-name">{c.name}</div>
              <div className="comment-datetime">{new Date(c.dateTime).toLocaleString()}</div>
            </div>

            {editingCommentIndex === index ? (
              <div className="comment-edit">
                <textarea
                  value={editedComment}
                  onChange={(e) => setEditedComment(e.target.value)}
                ></textarea>
                <div>
                  <a className="save-button" onClick={() => handleSaveEditedComment(index)}>
                    Save
                  </a>
                  <a className="cancel-button" onClick={handleCancelEditComment}>
                    Cancel
                  </a>
                </div>
              </div>
            ) : (
              <div className="comment-text">{c.comment}</div>
            )}

            <div className="comment-buttons" style={{ marginTop: "10px" }}>
              <a className="edit-button" onClick={() => handleEditComment(index)}>
                Edit
              </a>
              <a className="reply-button" onClick={() => handleReplyComment(index)}>
                Reply
              </a>
              <button className="delete-button" onClick={() => handleDeleteComment(index)}>
                D
              </button>
            </div>
            {replyingToIndex === index && (
              <div className="reply-box">
                <input
                  type="text"
                  placeholder="Your Name"
                  value={replyName}
                  onChange={(e) => setReplyName(e.target.value)}
                />
                <textarea
                  placeholder="Your Reply"
                  value={replyComment}
                  onChange={(e) => setReplyComment(e.target.value)}
                ></textarea>
                <button className="post-reply-button" onClick={() => handlePostReply(index)}>
                  Post
                </button>
              </div>
            )}
          </div>
        ))}
      </div>
      <div className="replies-section">
        {comments.map((c, commentIndex) => (
          <div key={commentIndex} className="comment-replies">
            {c.replies && c.replies.map((reply, replyIndex) => (
              <div key={replyIndex} className="reply">
                <div className='reply-name-and-date'>
                  <div className="reply-name">{reply.name}</div>
                  <div className="reply-datetime">{new Date(reply.dateTime).toLocaleString()}</div>
                </div>
                <div className="reply-text">{reply.comment}</div>
                <button className="delete-button" onClick={() => handleDeleteReply(commentIndex, replyIndex)}>
                  D
                </button>
              </div>
            ))}
          </div>

        ))}
      </div>
    </div>
  );
};

export default CommentSection;
