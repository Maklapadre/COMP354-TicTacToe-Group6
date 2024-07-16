// Get the table element where contributors will be displayed
let table = document.getElementById("counthere");

// Function to render the contributors table
function renderContributorsTable(contributors) {
  let i = 1;
  // Iterate over each contributor and create a table row
  contributors.forEach(({ login, html_url, contributions }) => {
    let row = table.insertRow(i);
    let slNoCell = row.insertCell(0);
    let userNameCell = row.insertCell(1);
    let urlUser = row.insertCell(2);
    let noOfContributions = row.insertCell(3);

    // Set cell values
    slNoCell.innerText = i;
    userNameCell.innerText = login;
    urlUser.innerHTML = `<a href="${html_url}">${html_url}</a>`;
    noOfContributions.innerText = contributions;
    i++;
  });

  // Update the number of contributors
  document.getElementById("ct").innerHTML = i - 1 + " Contributors";
}

// Fetch contributors data from GitHub API
fetch("https://api.github.com/repos/yelynn1/tictactoe/contributors")
  .then((response) => response.json())
  .then((contributors) => renderContributorsTable(contributors))
  .catch((err) => console.log("Request Failed", err));
