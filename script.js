let dataState = {
  loading: true,
  commentData: null,
};

// Function to fetch data from JSON file
async function fetchData() {
  try {
    const response = await fetch('data.json');

    if (!response.ok) {
      throw new Error('Network response was not ok');
    }

    dataState.commentData = await response.json();
    dataState.loading = false;
  } catch (error) {
    console.error('Error loading JSON:', error);
    dataState.loading = false;
  } finally {
    if (dataState.loading) {
      console.log('Loading...');
    } else {
      renderComments();
    }
  }
}

// Function to render comments
function renderComments() {
  const container = document.getElementById('container');
  const { comments, currentUser } = dataState.commentData;

  comments.forEach((comment) => {
    const commentItem = createCommentHTML(comment, currentUser);
    container.insertAdjacentHTML('beforeend', commentItem);
  });

  attachEventListeners();
}

// Function to create HTML for a single comment
function createCommentHTML(comment, currentUser) {
  const { id, content, createdAt, score, replies, user } = comment;
  const commentItem = `
    <div class="commentList g-20" id="commentList-${id}">
      <div class="commentContainer" id="comment-${id}">
        <div class="post comment card ${user.username}">
          <div class="profile">
            <img src="${user.image.webp}" alt="" />
            <p class="userName" id="profile-${id}">${user.username}</p>
            <span class="timeStamp">${createdAt}</span>
          </div>

          <div class="commentText">
            <p>${content}</p>
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
              : `<div class="editDeleteContainer g-20">
              <button class="editDelete edit" type="button" id="editBtn-${id}">
                <i class="fa-solid fa-pencil"></i>
                Edit
              </button> 
              <button class="editDelete delete" type="button" id="deleteBtn-${id}">
                <i class="fa-solid fa-trash"></i>
                Delete
              </button> 
            </div>`
          }
        </div>

        <!-- List of Replies -->
        <div class="commentReplyListCover">
          <span class="line"></span>

          <div class="commentReplyListContainer g-10" id="commentReplyListContainer-${id}">
            ${
              replies
                ? replies
                    .map(
                      ({ id, content, createdAt, score, user }) => `
                  <div class="comment commentReplyList card ${
                    user.username
                  }" id="comment-${id}">
                    <div class="profile">
                      <img src="${user.image.webp}" alt="${user.username}" />
                      <p class="userName" id="profile-${id}">${
                        user.username
                      }</p>
                      <span class="timeStamp">${createdAt}</span>
                    </div>
                    
                    <div class="commentText">
                      <p>${content}</p>
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
                        : `<div class="editDeleteContainer g-20">
                            <button class="editDelete edit" type="button" id="editBtn-${id}">
                              <i class="fa-solid fa-pencil"></i>
                              Edit
                            </button> 
                            <button class="editDelete delete" type="button" id="deleteBtn-${id}">
                              <i class="fa-solid fa-trash"></i>
                              Delete
                            </button> 
                          </div>`
                    } 
                  </div>`
                    )
                    .join('')
                : ''
            }
          </div>
        </div>
        <!-- List of Replies Ends -->
      </div>
    </div>`;
  return commentItem;
}

// Function to attach event listeners to buttons
function attachEventListeners() {
  document.querySelectorAll('.edit').forEach((button) => {
    button.addEventListener('click', (e) => handleEdit(e));
  });

  document.querySelectorAll('.delete').forEach((button) => {
    button.addEventListener('click', (e) => handleDelete(e));
  });

  // Attach event listeners to reply buttons
  document.querySelectorAll('.post .replyTriggerBtn').forEach((button) => {
    const commentId = button.id.split('-')[1];
    button.addEventListener('click', () => handleReply(commentId));
  });

  document
    .querySelectorAll('.commentReplyListCover .replyTriggerBtn')
    .forEach((button) => {
      const replyId = button.id.split('-')[1];
      button.addEventListener('click', () => handleReply(replyId));
    });
}

// Function to handle editing a comment
function handleEdit(e) {
  const editBtn = e.target;
  const id = editBtn.id.split('-')[1];
  const postToEdit = document.getElementById(`comment-${id}`);
  const deleteBtn = postToEdit.querySelector('.delete');
  const commentText = postToEdit.querySelector('.commentText p');

  commentText.contentEditable = true;
  commentText.classList.add('border');
  commentText.insertAdjacentHTML(
    'afterend',
    `<button class ='updateBtn' id="updatePost-${id}">Update</button>`
  );

  const updateBtn = postToEdit.querySelector(`#updatePost-${id}`);

  // New text
  commentText.addEventListener('keyup', () => {
    handleContentInput(commentText.innerText, updateBtn);
  });

  updateBtn.addEventListener('click', () => handleUpdate(e));

  e.target.disabled = true;
  deleteBtn.disabled = true;

  function handleUpdate(e) {
    if (handleContentInput(commentText.innerText, e.target)) {
      commentText.classList.remove('border');
      commentText.contentEditable = false;
      editBtn.disabled = false;
      deleteBtn.disabled = false;
      updateBtn.remove();
    }
    console.log(handleContentInput(commentText.innerText, e.target));
  }
}

// Function to handle deleting a comment
function handleDelete(e) {
  const id = e.target.id.split('-')[1];
  const postToBeDeleted = document.getElementById(`comment-${id}`);
  if (
    prompt('Are you sure you want to delete this comment? (yes/no)') === 'yes'
  ) {
    postToBeDeleted.remove();
  }
}

// Reply input checker
function handleContentInput(content, actionButton) {
  if (content.trim().length >= 2) {
    actionButton.disabled = false;
    return true;
  } else {
    actionButton.disabled = true;
  }
}

// Function to handle replying to a comment
function handleReply(id) {
  const { currentUser } = dataState.commentData;
  const buttonElement = document.getElementById(`commentReplyBtn-${id}`);
  const replyInputs = document.querySelectorAll('.commentReply');
  let postOwner = document.getElementById(`profile-${id}`).innerText;
  let content = `<span>@${postOwner}</span>`;
  let commentList = document.getElementById(`commentList-${id}`);
  const replyCommentReply = buttonElement.parentElement;

  const currentUserReply = `
    <div class="card commentReply fadeIn" id="replyInputContainer${id}">
      <img src="${currentUser.image.webp}" alt="${currentUser.username}" />
      <div class="textarea" role="textbox" contenteditable title="commentReply" id="postContent-${id}">
        ${content}
      </div>
      <button type="button" id="postReplyBtn-${id}" disabled>REPLY</button>
    </div>`;

  // Remove reply input on all posts
  replyInputs.forEach((notCommentToReply) => {
    notCommentToReply.parentElement.removeChild(notCommentToReply);
  });

  // Disable reply button on comment reply
  document.querySelectorAll('.replyTriggerBtn').forEach((button) => {
    buttonElement.id === button.id
      ? (buttonElement.disabled = true)
      : (button.disabled = false);
  });

  // Add reply input to comment's reply button clicked
  replyCommentReply.className.includes('commentReplyList')
    ? replyCommentReply.parentElement.parentElement.parentElement.insertAdjacentHTML(
        'beforeend',
        currentUserReply
      )
    : commentList.insertAdjacentHTML('beforeend', currentUserReply);

  const postReplyBtn = document.getElementById(`postReplyBtn-${id}`);
  const postContent = document.getElementById(`postContent-${id}`);

  // Scroll to the newly added reply input
  postContent.scrollIntoView({ behavior: 'smooth' });

  postContent.addEventListener('keyup', (e) => {
    content = e.target.innerText;
    handleContentInput(content, postReplyBtn);
  });

  // Add event listener to send comment button
  postReplyBtn.addEventListener('click', (e) => handlePost(e, content));

  // Fuction to post a comment
  const handlePost = (e, content) => {
    const parentElement = e.target.parentElement.parentElement; // Find the parent element

    const replyList = document.getElementById(
      `commentReplyListContainer-${parentElement.id.split('-')[1]}`
    );

    let lastCommentid =
      replyList.lastElementChild === null
        ? 0
        : ++replyList.lastElementChild.id.split('-')[1];

    const currentUserReply = `
      <div class="comment commentReplyList card ${
        currentUser.username
      }" id="comment-${++lastCommentid}">
        <div class="profile">
          <img src="${currentUser.image.webp}" alt="${currentUser.username}" />
          <p class="userName" id="profile-${currentUser.username}">${
      currentUser.username
    }</p>
          <span class="timeStamp">A week ago</span>
        </div>
          
        <div class="commentText">
          <p>${content}</p>
        </div>
        <div class="likeDislike">
          <button class="like" type="button">+</button>
          <span class="count">0</span>
          <button class="dislike" type="button">-</button>
        </div>
        <div class="editDeleteContainer g-20">
          <button class="editDelete edit" type="button" id="editBtn-${lastCommentid}">
            <i class="fa-solid fa-pencil"></i>
            Edit
          </button> 
          <button class="editDelete delete" type="button" id="deleteBtn-${lastCommentid}">
            <i class="fa-solid fa-trash"></i>
            Delete
          </button> 
        </div>
      </div>`;

    if (content === undefined) {
      postReplyBtn.disabled = true;
    } else {
      if (handleContentInput(postContent.innerText, postReplyBtn)) {
        replyList.insertAdjacentHTML('beforeend', currentUserReply);
        parentElement.removeChild(e.target.parentElement);
        buttonElement.disabled = false;
      } else {
        alert("Can't be empty");
      }
      document
        .getElementById(`deleteBtn-${lastCommentid}`)
        .addEventListener('click', (e) => handleDelete(e));
      document
        .getElementById(`editBtn-${lastCommentid}`)
        .addEventListener('click', (e) => handleEdit(e));
    }
  };
}

// Call the fetchData function when you want to initiate the data fetch
fetchData();
