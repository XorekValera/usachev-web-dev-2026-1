function showNotification(message, options) {
  const settings = options || {};
  const overlay = document.createElement("div");
  overlay.className = "notification-overlay";

  const notification = document.createElement("div");
  notification.className = "notification";

  if (settings.type === "error") {
    notification.classList.add("notification--error");
  }

  const text = document.createElement("p");
  text.className = "notification__text";
  text.textContent = message;

  const button = document.createElement("button");
  button.className = "notification__button";
  button.type = "button";
  button.textContent = settings.buttonText || "Окей";
  button.addEventListener("click", function () {
    overlay.remove();

    if (typeof settings.onClose === "function") {
      settings.onClose();
    }
  });

  notification.append(text, button);
  overlay.append(notification);
  document.body.append(overlay);
}
