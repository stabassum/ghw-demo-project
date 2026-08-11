(function () {
  "use strict";

  var STORAGE_KEY = "portfolio-guestbook-comments";

  function getComments() {
    try {
      var raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) return [];
      var parsed = JSON.parse(raw);
      return Array.isArray(parsed) ? parsed : [];
    } catch (err) {
      return [];
    }
  }

  function saveComments(comments) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(comments));
  }

  function setStatus(el, message, isError) {
    if (!el) return;
    el.textContent = message;
    if (isError) {
      el.classList.add("is-error");
    } else {
      el.classList.remove("is-error");
    }
  }

  function renderComments() {
    var list = document.getElementById("comments-list");
    var empty = document.getElementById("comments-empty");
    if (!list || !empty) return;

    var comments = getComments();

    while (list.firstChild) {
      list.removeChild(list.firstChild);
    }

    if (comments.length === 0) {
      empty.hidden = false;
      return;
    }

    empty.hidden = true;

    comments.forEach(function (item) {
      var li = document.createElement("li");
      li.className = "comment-item";

      var author = document.createElement("p");
      author.className = "comment-author";
      author.textContent = item.name;

      var body = document.createElement("p");
      body.className = "comment-body";
      body.textContent = item.body;

      li.appendChild(author);
      li.appendChild(body);
      list.appendChild(li);
    });
  }

  function initGuestbook() {
    var form = document.getElementById("comment-form");
    var nameInput = document.getElementById("comment-name");
    var bodyInput = document.getElementById("comment-body");
    var status = document.getElementById("comment-status");

    if (!form || !nameInput || !bodyInput) return;

    renderComments();

    form.addEventListener("submit", function (event) {
      event.preventDefault();

      var name = nameInput.value.trim();
      var body = bodyInput.value.trim();

      if (!name || !body) {
        setStatus(status, "Please enter both a name and a comment.", true);
        return;
      }

      var comments = getComments();
      comments.unshift({
        name: name,
        body: body,
        createdAt: Date.now(),
      });
      saveComments(comments);

      nameInput.value = "";
      bodyInput.value = "";
      setStatus(status, "Comment saved in this browser.", false);
      renderComments();
    });
  }

  function initContactForm() {
    var form = document.getElementById("contact-form");
    var nameInput = document.getElementById("contact-name");
    var emailInput = document.getElementById("contact-email");
    var messageInput = document.getElementById("contact-message");
    var status = document.getElementById("contact-status");

    if (!form || !nameInput || !emailInput || !messageInput) return;

    form.addEventListener("submit", function (event) {
      event.preventDefault();

      var name = nameInput.value.trim();
      var email = emailInput.value.trim();
      var message = messageInput.value.trim();

      if (!name || !email || !message) {
        setStatus(status, "Please fill in name, email, and message.", true);
        return;
      }

      form.reset();
      setStatus(
        status,
        "Thanks! This demo form does not send email — your message stayed in the browser.",
        false
      );
    });
  }

  document.addEventListener("DOMContentLoaded", function () {
    initGuestbook();
    initContactForm();
  });
})();
