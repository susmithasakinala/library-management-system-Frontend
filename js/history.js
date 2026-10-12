let allRecords = [];
loadHistory();

async function loadHistory() {
  allRecords = await apiGet("/issues");
  allRecords.sort((a, b) => b.id - a.id);   // newest first
  showRecords("ALL");
}

function filterHistory(status) {
  showRecords(status);
}

function showRecords(status) {
  const list = status === "ALL" ? allRecords : allRecords.filter(r => r.status === status);
  const tbody = document.getElementById("historyTable");

  if (list.length === 0) {
    tbody.innerHTML = `<tr><td colspan="7">No records found.</td></tr>`;
    return;
  }

  tbody.innerHTML = "";
  list.forEach(r => {
    const badge = r.status === "RETURNED"
      ? `<span class="badge-ok">Returned</span>`
      : `<span class="badge-issued">Issued</span>`;
    const fine = r.fineAmount > 0 ? "Rs. " + r.fineAmount : "-";
    tbody.innerHTML += `
      <tr>
        <td>${r.student.name} (${r.student.rollNo})</td>
        <td>${r.book.title}</td>
        <td>${r.issueDate}</td>
        <td>${r.dueDate}</td>
        <td>${r.returnDate || "-"}</td>
        <td>${badge}</td>
        <td>${fine}</td>
      </tr>`;
  });
}