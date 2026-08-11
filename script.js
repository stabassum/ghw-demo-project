(function () {
  "use strict";

  var STORAGE_KEY = "portfolio-guestbook-comments";

  /**
   * Pure validation: reject empty name or comment.
   * @param {{ name?: string, comment?: string }} data
   * @returns {{ valid: boolean, errors: string[] }}
   */
  function validateComment(data) {
    var errors = [];
    var name = data && typeof data.name === "string" ? data.name.trim() : "";
    var comment =
      data && typeof data.comment === "string" ? data.comment.trim() : "";

    if (!name) {
      errors.push("Name is required.");
    }
    if (!comment) {
      errors.push("Comment is required.");
    }

    return {
      valid: errors.length === 0,
      errors: errors,
    };
  }

  function escapeHTML(str) {
    return String(str)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#39;");
  }

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

  /**
   * Persist a single comment (newest first) under one localStorage key.
   * @param {{ name: string, comment: string, createdAt?: number }} comment
   */
  function saveComment(comment) {
    var comments = getComments();
    comments.unshift({
      name: comment.name,
      comment: comment.comment,
      createdAt: comment.createdAt || Date.now(),
    });
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

  /**
   * Draw comments newest-first. User text is escaped before any HTML insert.
   */
  function renderComments() {
    var list = document.getElementById("comments-list");
    var empty = document.getElementById("comments-empty");
    if (!list) return;

    var comments = getComments();

    while (list.firstChild) {
      list.removeChild(list.firstChild);
    }

    if (comments.length === 0) {
      if (empty) empty.hidden = false;
      return;
    }

    if (empty) empty.hidden = true;

    comments.forEach(function (item) {
      var name = item.name || "";
      var body = item.comment != null ? item.comment : item.body || "";

      var li = document.createElement("li");
      li.className = "comment-card";

      // Only escaped strings are ever passed into innerHTML — never raw input.
      li.innerHTML =
        '<p class="comment-author">' +
        escapeHTML(name) +
        "</p>" +
        '<p class="comment-body">' +
        escapeHTML(body) +
        "</p>";

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

      var data = {
        name: nameInput.value,
        comment: bodyInput.value,
      };

      var result = validateComment(data);
      if (!result.valid) {
        setStatus(status, result.errors.join(" "), true);
        return;
      }

      saveComment({
        name: data.name.trim(),
        comment: data.comment.trim(),
        createdAt: Date.now(),
      });

      renderComments();
      form.reset();
      setStatus(status, "Comment saved in this browser.", false);
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

  // Expose for optional test runners / debugging without a bundler.
  window.validateComment = validateComment;
  window.escapeHTML = escapeHTML;
  window.getComments = getComments;
  window.saveComment = saveComment;
  window.renderComments = renderComments;

  document.addEventListener("DOMContentLoaded", function () {
    initGuestbook();
    initContactForm();
  });
})();
