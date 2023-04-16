function get(element) {
  ele = document.querySelector(element);
  if (ele) return ele;
  throw new Error("This Element Don't Exist");
}
let url = "";

get(".nav-toggle").addEventListener("click", () => {
  toggleNav();
});
get(".transparent-background").addEventListener("click", () => {
  toggleNav();
});
let error = "";
var httpRegex =
  /^https?:\/\/(?:www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b(?:[-a-zA-Z0-9()@:%_\+.~#?&\/=]*)$/;

let shortedLinksArray = window.localStorage.getItem("shortedLinksArray")
  ? JSON.parse(window.localStorage.getItem("shortedLinksArray"))
  : [];
if ([...shortedLinksArray].length > 0) {
  shortedLinksArray.forEach((li) => {
    showLink(li.original_link, li.full_short_link);
  });
}
function validateUrl(url) {
  //   console.log(httpRegex.test(url));
  if (httpRegex.test(url))
    return shortIt(url)
      .then((data) => {
        shortedLinksArray.push({
          original_link: data.original_link,
          full_short_link: data.full_short_link,
        });
        window.localStorage.setItem(
          "shortedLinksArray",
          JSON.stringify(shortedLinksArray)
        );
        showLink(data.original_link, data.full_short_link);
        get(".input-cont>input").value = "";
      })
      .catch((error) => console.log(error));

  error = "Your url is not valid";
  get(".input-cont>span").textContent = error;
}

get("#submit-url").addEventListener("click", () => {
  url = get(".input-cont>input").value;
  validateUrl(url);
});

// toggle nav function
function toggleNav() {
  get(".nav-links").classList.toggle("active");
  get(".transparent-background").classList.toggle("active");
  document.body.classList.toggle("no-scroll");
}

// fetch link
async function shortIt(url) {
  const response = await fetch("https://api.shrtco.de/v2/shorten?url=" + url);
  //   console.log(response);
  const data = await response.json();
  //   console.log(data);

  return ({ full_short_link, original_link } = data.result);
}

function showLink(origin, shorted) {
  // Create a div element for the outermost container
  const container = document.createElement("div");
  container.classList.add("shorted-link");

  // Create the link div and append it to the container
  const linkDiv = document.createElement("div");
  linkDiv.classList.add("link");
  container.appendChild(linkDiv);

  // Create the link anchor element and set its href and target attributes
  const linkAnchor = document.createElement("a");
  linkAnchor.href = origin;
  linkAnchor.target = "_blank";
  linkAnchor.textContent = origin;
  linkDiv.appendChild(linkAnchor);

  // Create the shorted div and append it to the container
  const shortedDiv = document.createElement("div");
  shortedDiv.classList.add("shorted");
  container.appendChild(shortedDiv);

  // Create the shorted anchor element and set its href and target attributes
  const shortedAnchor = document.createElement("a");
  shortedAnchor.href = shorted;
  shortedAnchor.target = "_blank";
  shortedAnchor.textContent = shorted;
  shortedDiv.appendChild(shortedAnchor);

  // Create the copy button element and append it to the container
  const copyButton = document.createElement("button");
  copyButton.classList.add("copy-btn");
  copyButton.textContent = "Copy";
  container.appendChild(copyButton);

  // Add the container element to the document body
  get(".shorted-links").appendChild(container);
}



// copy link
document.querySelectorAll(".copy-btn").forEach((cBtn) => {
  cBtn.addEventListener("click", () => {
    cBtn.classList.add("copied");
    cBtn.textContent = "copied!";
    const linkToCopy = cBtn.previousElementSibling.firstChild.textContent;
    navigator.clipboard.writeText(linkToCopy);
  });
});
