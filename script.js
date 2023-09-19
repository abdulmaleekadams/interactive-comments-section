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

      const currentUserReply = `<div class="commentReply card fadeIn">
<img src="${currentUser.image.webp}" alt= "${currentUser.username}" />
<div class="textarea" role="textbox" contenteditable title="commentReply">
  Post your comment
</div>
<button type="button">REPLY</button>
</div>`;

      comments.map((comment) => {
        const { content, createdAt, score, replies, user, id } = comment;
        const commentItem = `
        <div class="commentContainer" id = ${id}>
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
            <button class="replyTriggerBtn" type="button" id="supReplyBtn-${id}">
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
                      `<div class="comment commentReplyList card" id="reply-${id}">
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
              <button class="replyTriggerBtn" type="button" id="subReplyBtn-${id}">
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
      const postReplyBtn = document.querySelectorAll('.post .replyTriggerBtn');
      const repliesListContainer = document.querySelectorAll(
        '.commentReplyListContainer'
      );
      const replyChildCommentBtn = document.querySelectorAll(
        '.commentReplyListContainer  .textarea + button'
      );
      // Event listeners

      // Child Comment reply
      replyChildCommentBtn.forEach((post) => {
        const comment = post.previousElementSibling;
        comment.addEventListener('keydown', () => {
          post.disabled = !(
            comment.innerText.trim() !== '' && comment.innerText.length > 10
          );
        });

        post.addEventListener('click', () => {
          if (
            comment.innerText.trim() !== '' &&
            comment.innerText.length > 10
          ) {
            post.parentElement.insertAdjacentHTML(
              'beforebegin',
              repliesComponent
            );
            comment.innerText = 'Post your comment';
          }
        });
      });

      // Parent Reply
      let id = 0;
      postReplyBtn.forEach((replyBtn) => {
        replyBtn.addEventListener('click', (e) => {
          const container = e.target.parentElement.parentElement;
          container.insertAdjacentHTML('afterend', currentUserReply);
          // Disable Comment Reply Trigger Action Button
          e.target.disabled = true;
          const replyParentCommentBtn = document.querySelectorAll(
            '.commentList > .commentReply .textarea + button'
          );

          replyParentCommentBtn.forEach((replyBtn) => {
            replyBtn.disabled = true;
            const replyInput = replyBtn.previousElementSibling;

            replyInput.addEventListener('keydown', (e) => {
              const currentInput = e.target.innerText;
              replyBtn.disabled = !(
                currentInput.trim() !== '' && currentInput.length > 10
              );
              console.log(currentInput);
            });

            replyBtn.addEventListener('click', () => {
              const childCommentList =
                replyBtn.parentElement.previousElementSibling.lastElementChild
                  .lastElementChild;
              console.log(childCommentList);
              if (
                replyInput.innerText.trim() !== '' &&
                replyInput.innerText.length > 10
              ) {
                childCommentList.insertAdjacentHTML(
                  'beforeend',
                  `<div class="comment commentReplyList card" id="reply-${id}">
                  <div class="profile">
                    <img src="${currentUser.image.webp}" alt="${currentUser.username}" />
                    <p class="userName">ramsesmiron</p>
                    <span class="timeStamp">${createdAt}</span>
                  </div>
                
                  <div class="commentText">
                    <p>
                      ${replyInput.innerText}
                    </p>
                  </div>
                  <div class="likeDislike">
                    <button class="like" type="button">+</button>
                    <span class="count">${score}</span>
                    <button class="dislike" type="button">-</button>
                  </div>
                  <button class="replyTriggerBtn" type="button" id="subReplyBtn-${id}">
                    <i class="fa-solid fa-reply"></i>
                    Reply
                  </button> 
                </div>`
                );
                replyInput.innerText = 'Post your comment';
              }
            });
          });
        });
      });

      // ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++ //
    }
  }
}

// Call the fetchData function when you want to initiate the data fetch
fetchData();

// Component HTML
let postReply = `<div class="commentReply card fadeIn">
<img src="./images/avatars/image-juliusomo.webp" alt="" />
<div
  class="textarea"
  role="textbox"
  contenteditable
  title="commentReply"
>
  Post your comment
</div>
<button type="button">REPLY</button>
</div>`,
  repliesComponent = `<div class="comment commentReplyList card">
  <div class="profile">
    <img src="./images/avatars/image-ramsesmiron.webp" alt="" />
    <p class="userName">ramsesmiron</p>
    <span class="timeStamp">2 weeks ago</span>
  </div>

  <div class="commentText">
    <p>
      If you're still new, I'd recommend focusing on the
      fundamentals of HTML, CSS, and JS before considering React.
      It's very tempting to jump ahead but lay a solid foundation
      first.
    </p>
  </div>
  <div class="likeDislike">
    <button class="like" type="button">+</button>
    <span class="count">12</span>
    <button class="dislike" type="button">-</button>
  </div>
  <button class="replyTriggerBtn" type="button">
    <i class="fa-solid fa-reply"></i>
    Reply
  </button>
</div>`;
