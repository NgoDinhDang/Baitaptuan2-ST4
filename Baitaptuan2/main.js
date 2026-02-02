// READ - Lấy tất cả bài post (hiển thị cả bài bị xoá mềm)
async function LoadData() {
    let res = await fetch("http://localhost:3000/posts")
    let posts = await res.json();
    let body = document.getElementById("body_table");
    body.innerHTML = '';
    for (const post of posts) {
        // Kiểm tra nếu bài post bị xoá mềm thì hiển thị gạch ngang
        let isDeleted = post.isDeleted || false;
        let rowStyle = isDeleted ? 'style="text-decoration: line-through; opacity: 0.6;"' : '';
        let deleteButton = isDeleted 
            ? `<input type="submit" value="Restore" onclick="Restore('${post.id}')" style="background-color: green; color: white;"/>`
            : `<input type="submit" value="Delete" onclick="Delete('${post.id}')" style="background-color: red; color: white;"/>`;
        
        body.innerHTML += `<tr ${rowStyle}>
            <td>${post.id}</td>
            <td>${post.title}</td>
            <td>${post.views}</td>
           <td>${deleteButton}</td>
        </tr>`
    }

}
// CREATE/UPDATE - Thêm hoặc cập nhật bài post
// - Khi ID trống: tạo mới với ID tự tăng = maxId + 1
// - Khi ID có: cập nhật bài post đó
async function Save() {
    let id = document.getElementById("id_txt").value;
    let title = document.getElementById("title_txt").value;
    let views = document.getElementById("view_txt").value;
    
    // Nếu ID trống, tạo ID mới = maxId + 1
    if (!id) {
        let res = await fetch("http://localhost:3000/posts");
        let posts = await res.json();
        let maxId = Math.max(0, ...posts.map(p => parseInt(p.id) || 0));
        id = String(maxId + 1); // Chuyển thành string
    }
    
    let getItem = await fetch('http://localhost:3000/posts/' + id)
    if (getItem.ok) {
        // Cập nhật bài post đã tồn tại
        let res = await fetch('http://localhost:3000/posts/'+id, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                title: title,
                views: views
            })
        });
        if (res.ok) {
            console.log("Cập nhật thành công");
        }
    } else {
        // Tạo bài post mới
        try {
            let res = await fetch('http://localhost:3000/posts', {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    id: id,
                    title: title,
                    views: views,
                    isDeleted: false
                })
            });
            if (res.ok) {
                console.log("Thêm mới thành công");
            }
        } catch (error) {
            console.log(error);
        }
    }
    // Xóa nội dung input
    document.getElementById("id_txt").value = '';
    document.getElementById("title_txt").value = '';
    document.getElementById("view_txt").value = '';
    LoadData();
    return false;
}
// DELETE - Xoá mềm: chỉ đánh dấu isDeleted = true, không xoá thực tế
async function Delete(id) {
    let res = await fetch("http://localhost:3000/posts/" + id, {
        method: 'PATCH',
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            isDeleted: true
        })
    })
    if (res.ok) {
        console.log("Xoá mềm thành công");
    }
    LoadData();
    return false;
}

// RESTORE - Khôi phục bài post đã bị xoá mềm (isDeleted = false)
async function Restore(id) {
    let res = await fetch("http://localhost:3000/posts/" + id, {
        method: 'PATCH',
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            isDeleted: false
        })
    })
    if (res.ok) {
        console.log("Khôi phục thành công");
    }
    LoadData();
    return false;
}

// ===== COMMENTS CRUD =====

// READ - Lấy tất cả comments (hiển thị cả comment bị xoá mềm)
async function LoadComments() {
    let res = await fetch("http://localhost:3000/comments")
    let comments = await res.json();
    let body = document.getElementById("comments_body");
    if (!body) return;
    body.innerHTML = '';
    for (const comment of comments) {
        // Kiểm tra nếu comment bị xoá mềm thì hiển thị gạch ngang
        let isDeleted = comment.isDeleted || false;
        let rowStyle = isDeleted ? 'style="text-decoration: line-through; opacity: 0.6;"' : '';
        let deleteButton = isDeleted 
            ? `<input type="submit" value="Restore" onclick="RestoreComment('${comment.id}')" style="background-color: green; color: white;"/>`
            : `<input type="submit" value="Delete" onclick="DeleteComment('${comment.id}')" style="background-color: red; color: white;"/>`;
        
        body.innerHTML += `<tr ${rowStyle}>
            <td>${comment.id}</td>
            <td>${comment.text}</td>
            <td>${comment.postId || 'N/A'}</td>
           <td>
               <input type="submit" value="Edit" onclick="EditComment('${comment.id}', '${comment.text}', '${comment.postId || ''}')" style="background-color: #2196F3;"/>
               ${deleteButton}
           </td>
        </tr>`
    }
}

// CREATE/UPDATE - Thêm hoặc cập nhật comment
// - Khi ID trống: tạo mới với ID tự tăng = maxId + 1
// - Khi ID có: cập nhật comment đó
async function SaveComment() {
    let id = document.getElementById("comment_id").value;
    let text = document.getElementById("comment_text").value;
    let postId = document.getElementById("comment_postId").value;
    
    // Nếu ID trống, tạo ID mới = maxId + 1
    if (!id) {
        let res = await fetch("http://localhost:3000/comments");
        let comments = await res.json();
        let maxId = Math.max(0, ...comments.map(c => {
            let numId = parseInt(c.id);
            return isNaN(numId) ? 0 : numId;
        }));
        id = String(maxId + 1);
    }
    
    let getItem = await fetch('http://localhost:3000/comments/' + id);
    if (getItem.ok) {
        // Cập nhật comment đã tồn tại
        let res = await fetch('http://localhost:3000/comments/' + id, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                text: text,
                postId: postId ? parseInt(postId) : null
            })
        });
        if (res.ok) {
            console.log("Cập nhật comment thành công");
        }
    } else {
        // Tạo comment mới
        try {
            let res = await fetch('http://localhost:3000/comments', {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    id: id,
                    text: text,
                    postId: postId ? parseInt(postId) : null
                })
            });
            if (res.ok) {
                console.log("Thêm comment thành công");
            }
        } catch (error) {
            console.log(error);
        }
    }
    // Xóa nội dung input
    document.getElementById("comment_id").value = '';
    document.getElementById("comment_text").value = '';
    document.getElementById("comment_postId").value = '';
    LoadComments();
    return false;
}

// DELETE - Xoá mềm comment: chỉ đánh dấu isDeleted = true, không xoá thực tế
async function DeleteComment(id) {
    let res = await fetch("http://localhost:3000/comments/" + id, {
        method: 'PATCH',
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            isDeleted: true
        })
    })
    if (res.ok) {
        console.log("Xoá mềm comment thành công");
    }
    LoadComments();
    return false;
}

// RESTORE - Khôi phục comment đã bị xoá mềm (isDeleted = false)
async function RestoreComment(id) {
    let res = await fetch("http://localhost:3000/comments/" + id, {
        method: 'PATCH',
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            isDeleted: false
        })
    })
    if (res.ok) {
        console.log("Khôi phục comment thành công");
    }
    LoadComments();
    return false;
}

// EDIT - Điền dữ liệu comment vào form để chỉnh sửa
function EditComment(id, text, postId) {
    document.getElementById("comment_id").value = id;
    document.getElementById("comment_text").value = text;
    document.getElementById("comment_postId").value = postId;
}

// RESTORE - Khôi phục comment đã bị xoá mềm (isDeleted = false)
async function RestoreComment(id) {
    let res = await fetch("http://localhost:3000/comments/" + id, {
        method: 'PATCH',
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            isDeleted: false
        })
    })
    if (res.ok) {
        console.log("Khôi phục comment thành công");
    }
    LoadComments();
    return false;
}

// Gọi hàm LoadData khi trang load xong
LoadData();
LoadComments();