import { useState } from "react";

function Comment({ comment, onReply, username, isReply = false }) {
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
      <div className="flex items-center space-x-2 mb-2">
        <p className="bg-gray-500 w-8 h-8 rounded-full flex items-center justify-center font-bold text-[1.2rem]">{username ? username[0].toUpperCase() : "A"}</p>
        <p className="text-white">{comment.text}</p>
        </div>

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
            className="w-full p-1 rounded bg-gray-600 text-white text-xs focus:ring-indigo-600 focus:ring-2 focus:outline-none transition duration-300"
          />
          <button
            onClick={handleReplySubmit}
            className="mt-1 bg-blue-500 text-white px-2 py-1 text-xs rounded cursor-pointer"
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
