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
      const container = document.getElementById('container');

      const { comments, currentUser } = dataState.commentData;

      comments.map((comment) => {
        const { content, createdAt, score, replies, user, id } = comment;
        const commentItem = `
        <div class="commentList g-20" id="commentList-${id}">
        <div class="commentContainer" id = "comment-${id}">
          <div class="post comment card">
            <div class="profile">
              <img src="${user.image.webp}" alt="" />
              <p class="userName" id="profile-${id}">${user.username}</p>
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
            ${
              currentUser.username !== user.username
                ? `<button class="replyTriggerBtn" type="button" id="commentReplyBtn-${id}">
              <i class="fa-solid fa-reply"></i>
              Reply
            </button>`
                : ''
            }
          </div>

          <!-- List of Replies -->
          <div class="commentReplyListCover">
            <span class="line"></span>

            <div class="commentReplyListContainer g-10" id="commentReplyListContainer-${id}">
            ${
              replies
                ? replies.map(
                    ({ id, content, createdAt, score, user }) =>
                      `<div class="comment commentReplyList card" id="comment-${id}">
              <div class="profile">
                <img src="${user.image.webp}" alt="${user.username}" />
                <p class="userName" id="profile-${id}">${user.username}</p>
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
              ${
                currentUser.username !== user.username
                  ? `<button class="replyTriggerBtn" type="button" id="commentReplyBtn-${id}">
                <i class="fa-solid fa-reply"></i>
                Reply
              </button> `
                  : ''
              } 
              </div>`
                  )
                : ''
            }</div>
          </div>
          <!-- List of Replies Ends -->
          </div></div>`;
        container.insertAdjacentHTML('beforeend', commentItem);
      });

      console.log({ comments: comments, currentUser });

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
      // Handle Reply
      const handleReply = (id) => {
        const parentElement = document.getElementById(`comment-${id}`); // Find the parent element
        const buttonElement = document.getElementById(`commentReplyBtn-${id}`); // Find the parent element
        const replyInputs = document.querySelectorAll('.commentReply');
        let postOwner = document.getElementById(`profile-${id}`).innerText;
        let content = `<span>@${postOwner}</span>`;
        let commentList = document.getElementById(`commentList-${id}`);
        const replyCommentReply = buttonElement.parentElement;

        const currentUserReply = `<div class="card commentReply fadeIn" id="replyInputContainer${id}">
<img src="${currentUser.image.webp}" alt= "${currentUser.username}" />
<div class="textarea" role="textbox" contenteditable title="commentReply" id="postContent-${id}">
   ${content}
</div>
<button type="button" id="postReplyBtn-${id}" disabled>REPLY</button>
</div>`;

        replyInputs.forEach((notCommentToReply) => {
          // notCommentToReply.style.display = 'none';
          notCommentToReply.parentElement.removeChild(notCommentToReply);
        });

        // Disable reply button on comment reply
        document.querySelectorAll('.replyTriggerBtn').forEach((button) => {
          buttonElement.id === button.id
            ? (buttonElement.disabled = true)
            : (button.disabled = false);
        });

        replyCommentReply.className.includes('commentReplyList')
          ? replyCommentReply.parentElement.parentElement.parentElement.insertAdjacentHTML(
              'beforeend',
              currentUserReply
            )
          : commentList.insertAdjacentHTML('beforeend', currentUserReply);

        const postReplyBtn = document.getElementById(`postReplyBtn-${id}`);
        const postContent = document.getElementById(`postContent-${id}`);

        postContent.addEventListener('keyup', (e) => {
          content = e.target.innerText;
          handleContentInput(content);
        });

        const handleContentInput = (content) => {
          console.log(content, content.length);

          if (
            content.trim() !== '' &&
            (content.length - postOwner.length >= 4 || content.length >= 3)
          ) {
            postReplyBtn.disabled = false;
            return true;
          } else postReplyBtn.disabled = true;
        };

        postReplyBtn.addEventListener('click', (e) => handlePost(e, content));

        // Rendering the UI

        const handlePost = (e, content) => {
          const replyList = document.getElementById(`commentReplyListContainer-${e.target.id.split('-')[1]}`);

          const currentUserReply = `
                    <div class="comment commentReplyList card" id="comment-${id}">
            <div class="profile">
              <img src="${currentUser.image.webp}" alt="${currentUser.username}" />
              <p class="userName" id="profile-${id}">${currentUser.username}</p>
              <span class="timeStamp">A week ago</span>
            </div>
          
            <div class="commentText">
              <p>
              ${content}
              </p>
            </div>
            <div class="likeDislike">
            <button class="like" type="button">+</button>
              <span class="count">0</span>
              <button class="dislike" type="button">-</button>
            </div>
               <button class="replyTriggerBtn" type="button">
              <i class="fa-solid fa-reply"></i>
              Reply
            </button>
            </div>
          `;

          if (content === undefined) {
            postReplyBtn.disabled = true;
          } else {
            handleContentInput(content) && console.log(parentElement);
            replyList.insertAdjacentHTML('beforeend', currentUserReply);
            console.log(replyList);
            parentElement.parentElement.removeChild(e.target.parentElement);
            buttonElement.disabled = false;
          }
        };
      };
    }

    // ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++ //
  }
}

// Call the fetchData function when you want to initiate the data fetch
fetchData();
