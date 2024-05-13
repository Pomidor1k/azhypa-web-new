window.addEventListener("DOMContentLoaded", async () => {
  const tg = window.Telegram.WebApp;
  tg.expand();
  const input = document.querySelector(".input_field");

  // Обработчик события для инпута
  input.addEventListener("input", (event) => {
    const inputValue = input.value.trim();

    // Проверка на пустоту инпута
    if (inputValue === "") {
      tg.MainButton.hide();
    } else {
      // Проверка на пробелы
      if (inputValue.includes(" ")) {
        tg.MainButton.color = "#FF003D";
        tg.MainButton.setText("Уберите пробелы");
        tg.MainButton.disable();
      } else {
        // Проверка на допустимые символы
        const validCharsRegex = /^[+\dA-Za-z._@-]+$/;
        if (validCharsRegex.test(inputValue)) {
          tg.MainButton.color = "#00FF85";
          tg.MainButton.setText("Далее");
          tg.MainButton.enable();
          tg.MainButton.show();
        } else {
          tg.MainButton.color = "#FF003D";
          tg.MainButton.setText("Недопустимый символ");
          tg.MainButton.disable();
          tg.MainButton.show();
        }
      }
    }
  });

  // Обработчик события для клика в любую другую область экрана
  document.addEventListener("click", (event) => {
    // Проверяем, был ли клик вне инпута
    if (!input.contains(event.target)) {
      // Убираем фокус с инпута
      input.blur();
    }
  });

  tg.MainButton.onClick(() => {
    let userEmailOrPhone = input.value;
    fetch("/check-user-primary-payment", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        userEmailOrPhone: userEmailOrPhone,
        paymentStep: "primary-payment",
      }),
    })
      .then((response) => response.json())
      .then((data) => {
        console.log(data);
        if (data.data === "error") {
          const title = document.querySelector(".title_wrapper");
          title.style.backgroundImage =
            "linear-gradient(0deg, #FF00C7 0.02%, #FF003D 99.35%)";
          title.textContent = "Извините, произошла ошибка. Попробуйте ещё раз!";
          input.value = "";
          tg.MainButton.hide();
        } else {
          const dataToSend = JSON.stringify({
            webAppType: "primary-payment",
            userEmail: data.data.userEmail,
            userPhone: data.data.userPhone,
            userName: data.data.userName,
            paymentPrice: data.data.paymentPrice,
            productId: data.data.productId,
          });

          tg.sendData(dataToSend);
        }
      })
      .catch((error) => {
        console.error("Произошла ошибка:", error);
        const title = document.querySelector(".title_wrapper");
        title.style.backgroundImage =
          "linear-gradient(0deg, #FF00C7 0.02%, #FF003D 99.35%)";
        title.textContent = "Извините, произошла ошибка. Попробуйте ещё раз!";
      });
  });
});
