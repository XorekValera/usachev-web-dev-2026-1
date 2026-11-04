document.addEventListener("DOMContentLoaded", function () {
  const form = document.getElementById("feedback-form");
  const success = document.getElementById("feedback-success");

  if (!form || !success) {
    return;
  }

  form.addEventListener("submit", function (event) {
    event.preventDefault();

    if (!form.checkValidity()) {
      form.reportValidity();
      return;
    }

    form.reset();
    form.hidden = true;
    success.hidden = false;
  });
});
