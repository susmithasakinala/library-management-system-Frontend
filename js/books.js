loadBooks();

async function loadBooks() {
  renderBooks(await apiGet("/books"));
}

async function searchBooks(keyword) {
  renderBooks(await apiGet("/books?keyword=" + encodeURIComponent(keyword)));
}

function renderBooks(books) {
  const tbody = document.getElementById("bookTable");
  tbody.innerHTML = "";
  books.forEach(b => {
    tbody.innerHTML += `
      <tr>
        <td>${b.title}</td><td>${b.author}</td><td>${b.isbn}</td>
        <td>${b.category || ""}</td><td>${b.quantity}</td><td>${b.available}</td>
        <td class="actions">
          <button onclick='editBook(${JSON.stringify(b)})'>Edit</button>
          <button onclick="deleteBook(${b.id})">Delete</button>
        </td>
      </tr>`;
  });
}

function editBook(book) {
  document.getElementById("formTitle").innerText = "Edit Book";
  document.getElementById("bookId").value = book.id;
  document.getElementById("available").value = book.available;
  document.getElementById("title").value = book.title;
  document.getElementById("author").value = book.author;
  document.getElementById("isbn").value = book.isbn;
  document.getElementById("category").value = book.category || "";
  document.getElementById("quantity").value = book.quantity;
}

async function saveBook() {
  const id = document.getElementById("bookId").value;
  const quantity = Number(document.getElementById("quantity").value);
  const data = {
    title: document.getElementById("title").value,
    author: document.getElementById("author").value,
    isbn: document.getElementById("isbn").value,
    category: document.getElementById("category").value,
    quantity: quantity,
    available: id ? Number(document.getElementById("available").value) : quantity
  };
  try {
    if (id) await apiPut("/books/" + id, data);
    else await apiPost("/books", data);
    document.getElementById("msg").innerText = "Saved!";
    document.getElementById("msg").className = "success";
    clearForm();
    loadBooks();
  } catch (e) {
    document.getElementById("msg").innerText = e.message;
    document.getElementById("msg").className = "error";
  }
}

function clearForm() {
  document.getElementById("formTitle").innerText = "Add Book";
  ["bookId","available","title","author","isbn","category","quantity"].forEach(id =>
    document.getElementById(id).value = "");
}

async function deleteBook(id) {
  if (!confirm("Delete this book?")) return;
  try {
    await apiDelete("/books/" + id);
    loadBooks();
  } catch (e) {
    alert("Cannot delete: this book has issue history.");
  }
}