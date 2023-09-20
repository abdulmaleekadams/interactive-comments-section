let dataState = {
  loading: true, // Set initial loading state to true
  commentData: null, // Initialize commentData as null
};

async function fetchData() {
  try {
    // JSON file path fetch
    const response = await fetch('data.json');

    if (!response.ok) {
      throw new Error('Network response was not ok');
    }

    // Store the data
    dataState.commentData = await response.json();
    // Set loading state to false once data is fetched
    dataState.loading = false;
  } catch (error) {
    console.error('Error loading JSON:', error);
    // Handle loading state in case of an error
    dataState.loading = false;
  } finally {
    // Check the loading state here, and you can update your UI accordingly
    if (dataState.loading) {
      console.log('Loading...');
    } else {
      const commentList = document.getElementById('commentList');

      const { comments, currentUser } = dataState.commentData;

      const currentUserReply = `<div class="card commentReply fadeIn">
<img src="${currentUser.image.webp}" alt= "${currentUser.username}" />
<div class="textarea" role="textbox" contenteditable title="commentReply">
  Post your comment
</div>
<button type="button">REPLY</button>
</div>`;

      comments.map((comment) => {
        const { content, createdAt, score, replies, user, id } = comment;
        const commentItem = `
        <div class="commentContainer" id = "comment-${id}">
          <div class="post comment card">
            <div class="profile">
              <img src="${user.image.webp}" alt="" />
              <p class="userName">${user.username}</p>
              <span class="timeStamp">${createdAt}</span>
            </div>

            <div class="commentText">
              <p>
                ${content}
              </p>
            </div>
            <div class="likeDislike">
              <button class="like" type="button">+</button>
              <span class="count">${score}</span>
              <button class="dislike" type="button">-</button>
            </div>
            <button class="replyTriggerBtn" type="button" id="commentReplyBtn-${id}">
              <i class="fa-solid fa-reply"></i>
              Reply
            </button>
          </div>

          <!-- List of Replies -->
          <div class="commentReplyListCover">
            <span class="line"></span>

            <div class="commentReplyListContainer g-10">
            ${
              replies
                ? replies.map(
                    ({ id, content, createdAt, score, user }) =>
                      `<div class="comment commentReplyList card" id="comment-${id}">
              <div class="profile">
                <img src="${user.image.webp}" alt="${user.username}" />
                <p class="userName">ramsesmiron</p>
                <span class="timeStamp">${createdAt}</span>
              </div>
            
              <div class="commentText">
                <p>
                  ${content}
                </p>
              </div>
              <div class="likeDislike">
                <button class="like" type="button">+</button>
                <span class="count">${score}</span>
                <button class="dislike" type="button">-</button>
              </div>
              <button class="replyTriggerBtn" type="button" id="commentReplyBtn-${id}">
                <i class="fa-solid fa-reply"></i>
                Reply
              </button> 
            </div>`
                  )
                : ''
            }</div>
          </div>
          <!-- List of Replies Ends -->
        </div>`;
        commentList.insertAdjacentHTML('beforeend', commentItem);
      });

      console.log({ comments: comments, currentUser });

      // ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++ //

      // DOM Elements
      // const postReplyBtn = document.querySelectorAll('.post .replyTriggerBtn');
      // const repliesListContainer = document.querySelectorAll(
      //   '.commentReplyListContainer'
      // );
      // const replyChildCommentBtn = document.querySelectorAll(
      //   '.commentReplyListContainer  .textarea + button'
      // );
      // // Event listeners

      // // Child Comment reply
      // replyChildCommentBtn.forEach((post) => {
      //   const comment = post.previousElementSibling;
      //   comment.addEventListener('keydown', () => {
      //     post.disabled = !(
      //       comment.innerText.trim() !== '' && comment.innerText.length > 10
      //     );
      //   });

      //   post.addEventListener('click', () => {
      //     if (
      //       comment.innerText.trim() !== '' &&
      //       comment.innerText.length > 10
      //     ) {
      //       post.parentElement.insertAdjacentHTML(
      //         'beforebegin',
      //         repliesComponent
      //       );
      //       comment.innerText = 'Post your comment';
      //     }
      //   });
      // });

      // // Parent Reply
      // let id = 0;
      // postReplyBtn.forEach((replyBtn) => {
      //   replyBtn.addEventListener('click', (e) => {
      //     const container = e.target.parentElement.parentElement;
      //     container.insertAdjacentHTML('afterend', currentUserReply);
      //     // Disable Comment Reply Trigger Action Button
      //     e.target.disabled = true;
      //     const replyParentCommentBtn = document.querySelectorAll(
      //       '.commentList > .commentReply .textarea + button'
      //     );

      //     replyParentCommentBtn.forEach((replyBtn) => {
      //       replyBtn.disabled = true;
      //       const replyInput = replyBtn.previousElementSibling;

      //       replyInput.addEventListener('keydown', (e) => {
      //         const currentInput = e.target.innerText;
      //         replyBtn.disabled = !(
      //           currentInput.trim() !== '' && currentInput.length > 10
      //         );
      //         console.log(currentInput);
      //       });

      //       replyBtn.addEventListener('click', () => {
      //         const date = new Date();

      //         const seconds = date.getSeconds();

      //         let createdAt = `${seconds} ${
      //           seconds > 1 ? 'seconds' : 'second'
      //         } ago`;

      //         let score = 0;

      //         const childCommentList =
      //           replyBtn.parentElement.previousElementSibling.lastElementChild
      //             .lastElementChild;
      //         console.log(childCommentList);
      //         if (
      //           replyInput.innerText.trim() !== '' &&
      //           replyInput.innerText.length > 10
      //         ) {
      //           childCommentList.insertAdjacentHTML(
      //             'beforeend',
      //             `<div class="comment commentReplyList card" id="reply-${id}">
      //             <div class="profile">
      //               <img src="${currentUser.image.webp}" alt="${currentUser.username}" />
      //               <p class="userName">ramsesmiron</p>
      //               <span class="timeStamp">${createdAt}</span>
      //             </div>

      //             <div class="commentText">
      //               <p>
      //                 ${replyInput.innerText}
      //               </p>
      //             </div>
      //             <div class="likeDislike">
      //               <button class="like" type="button">+</button>
      //               <span class="count">${score}</span>
      //               <button class="dislike" type="button">-</button>
      //             </div>
      //             <button class="replyTriggerBtn" type="button" id="subReplyBtn-${id}">
      //               <i class="fa-solid fa-reply"></i>
      //               Reply
      //             </button>
      //           </div>`
      //           );
      //           replyInput.innerText = 'Post your comment';
      //         }
      //       });
      //     });
      //   });
      // });

      // Attach event listeners to top-level comment reply buttons
      document.querySelectorAll('.post .replyTriggerBtn').forEach((button) => {
        const commentId = button.id.split('-')[1]; // Extract comment ID from button ID
        button.addEventListener('click', () => handleReply(commentId));
      });

      // Attach event listeners to reply comment reply buttons
      document
        .querySelectorAll('.commentReplyListCover .replyTriggerBtn')
        .forEach((button) => {
          const replyId = button.id.split('-')[1]; // Extract comment ID from button ID
          button.addEventListener('click', () => handleReply(replyId));
        });

      let opened = null;
      const handleReply = (id) => {
        const parentElement = document.getElementById(`comment-${id}`); // Find the parent element
        const buttonElement = document.getElementById(`commentReplyBtn-${id}`); // Find the parent element
        const replyInputs = document.querySelectorAll('.commentReply');

        if (!parentElement) return;
        console.log(document.querySelectorAll('.commentReply'));

        replyInputs.forEach((notCommentToReply) => (notCommentToReply.style.display = 'none'));

        // Close the currently open comment input
        parentElement.insertAdjacentHTML('afterend', currentUserReply);
        buttonElement.disabled = true
      };

    }

    // ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++ //
  }
}

// Call the fetchData function when you want to initiate the data fetch
fetchData();
