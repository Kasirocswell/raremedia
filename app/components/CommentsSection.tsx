import React, { useState, useEffect } from 'react';
import { supabase } from '../../supabase/client';
import { User } from '@supabase/supabase-js';

interface Comment {
  id: string;
  content_id: string;
  user_id: string;
  text: string;
  created_at: string;
}

interface Props {
  contentId: string;
}

const CommentsSection: React.FC<Props> = ({ contentId }) => {
  const [comments, setComments] = useState<Comment[]>([]);
  const [newComment, setNewComment] = useState<string>('');

  useEffect(() => {
    fetchComments();
  }, [contentId]);

  const fetchComments = async () => {
    const { data, error } = await supabase
      .from('comments')
      .select('*')
      .eq('content_id', contentId);

    if (error) {
      console.error('Error fetching comments:', error);
    } else if (data) {
      setComments(data);
    }
  };

  const handleCommentSubmit = async () => {
    const { data: userResponse, error } = await supabase.auth.getUser();
    const user: User | null = userResponse?.user || null;

    if (user) {
      const { data, error } = await supabase
        .from('comments')
        .insert([{ content_id: contentId, text: newComment, user_id: user.id }]);

      if (error) {
        console.error('Error submitting comment:', error);
      } else if (data) {
        setComments([...comments, ...data]);
        setNewComment('');
      }
    } else {
      console.error('No user logged in');
    }
  };

  return (
    <div>
      <h3 className="text-lg font-semibold mb-2">Comments</h3>
      <div>
        {comments.map((comment) => (
          <div key={comment.id} className="mb-2">
            <p className='text-white'>{comment.text}</p>
            {/* Additional comment details like user and timestamp can be added here */}
          </div>
        ))}
      </div>
      <div>
        <textarea
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
          placeholder="Add a comment..."
          className="w-full text-black p-2 border border-gray-300 rounded"
        ></textarea>
        <button
          onClick={handleCommentSubmit}
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          Post Comment
        </button>
      </div>
    </div>
  );
};

export default CommentsSection;
