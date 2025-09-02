import { useState } from "react";

function Comment({ comment, onReply, isReply = false }) {
  const [showReplyBox, setShowReplyBox] = useState(false);
  const [replyText, setReplyText] = useState("");

  const handleReplySubmit = () => {
    if (!replyText.trim()) return;

    onReply({
      id: Date.now(),
      text: replyText,
      parentId: comment.id,
      replies: [],
    });

    setReplyText("");
    setShowReplyBox(false);
  };

  return (
    <div
      className={`${
        isReply
          ? "bg-gray-700 p-2 rounded-lg text-sm" // replies smaller & lighter
          : "bg-gray-800 p-4 rounded-lg"
      }`}
    >
      <p className="text-white">{comment.text}</p>

      <button
        className="text-blue-400 text-xs mt-1"
        onClick={() => setShowReplyBox(!showReplyBox)}
      >
        Reply
      </button>

      {showReplyBox && (
        <div className="mt-2">
          <textarea
            value={replyText}
            onChange={(e) => setReplyText(e.target.value)}
            placeholder="Write your reply..."
            className="w-full p-1 rounded bg-gray-600 text-white text-xs"
          />
          <button
            onClick={handleReplySubmit}
            className="mt-1 bg-blue-500 text-white px-2 py-1 text-xs rounded"
          >
            Submit
          </button>
        </div>
      )}

      {comment.replies.length > 0 && (
        <div className="ml-6 mt-2 space-y-2">
          {comment.replies.map((reply) => (
            <Comment
              key={reply.id}
              comment={reply}
              onReply={onReply}
              isReply={true} // ✅ mark nested as replies
            />
          ))}
        </div>
      )}
    </div>
  );
}

export default Comment;
