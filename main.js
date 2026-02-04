const POST_API = "http://localhost:3000/posts";
const COMMENT_API = "http://localhost:3000/comments";

/* ===== POST ===== */

async function loadPosts() {
  let res = await fetch(POST_API);
  let posts = await res.json();
  let body = document.getElementById("postBody");
  body.innerHTML = "";

  posts.forEach(p => {
    body.innerHTML += `
      <tr style="${p.isDeleted ? 'text-decoration:line-through;color:gray' : ''}">
        <td>${p.id}</td>
        <td>${p.title}</td>
        <td>${p.views}</td>
        <td>
          <button onclick="editPost('${p.id}')">Edit</button>
          <button onclick="deletePost('${p.id}')">Delete</button>
          <button onclick="loadComments('${p.id}')">Comments</button>
        </td>
      </tr>
    `;
  });
}

function getNextId(posts) {
  let max = 0;
  posts.forEach(p => max = Math.max(max, parseInt(p.id)));
  return (max + 1).toString();
}

async function savePost() {
  let id = document.getElementById("id_txt").value;
  let title = document.getElementById("title_txt").value;
  let views = document.getElementById("view_txt").value;

  let posts = await fetch(POST_API).then(r => r.json());

  if (id) {
    await fetch(`${POST_API}/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, title, views, isDeleted: false })
    });
  } else {
    await fetch(POST_API, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        id: getNextId(posts),
        title,
        views,
        isDeleted: false
      })
    });
  }

  loadPosts();
}

async function editPost(id) {
  let post = await fetch(`${POST_API}/${id}`).then(r => r.json());
  document.getElementById("id_txt").value = post.id;
  document.getElementById("title_txt").value = post.title;
  document.getElementById("view_txt").value = post.views;
}

async function deletePost(id) {
  let post = await fetch(`${POST_API}/${id}`).then(r => r.json());
  post.isDeleted = true;

  await fetch(`${POST_API}/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(post)
  });

  loadPosts();
}

/* ===== COMMENTS CRUD ===== */

async function loadComments(postId) {
  let res = await fetch(`${COMMENT_API}?postId=${postId}`);
  let comments = await res.json();
  let list = document.getElementById("commentList");
  list.innerHTML = "";

  comments.forEach(c => {
    list.innerHTML += `
      <li>
        ${c.content}
        <button onclick="deleteComment('${c.id}')">X</button>
      </li>
    `;
  });
}

function addComment() {
  let postId = document.getElementById("comment_postId").value;
  let content = document.getElementById("comment_content").value;

  fetch(COMMENT_API, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      id: Date.now().toString(),
      postId,
      content
    })
  });
}

function deleteComment(id) {
  fetch(`${COMMENT_API}/${id}`, { method: "DELETE" });
}
