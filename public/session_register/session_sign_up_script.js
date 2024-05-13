window.addEventListener("DOMContentLoaded", async () => {
    const tg = window.Telegram.WebApp
    tg.expand()

    document.addEventListener('click', function (event) {
        const textarea = document.querySelector('.info_enter_textfield');
        const targetElement = event.target;
    
        // Если кликнули не по textarea, убираем фокус
        if (!textarea.contains(targetElement)) {
          textarea.blur();
        }
    });

    const userAnswName = document.querySelector('#userAnswName');
    const userAnswInst = document.querySelector('#userAnswInst');
    const userAnswWhoAreYou = document.querySelector('#userAnswWhoAreYou');
    const userAnswAim = document.querySelector('#userAnswAim');
    const userAnswAimRealize = document.querySelector('#userAnswAimRealize');
    const userAnswWeaknesses = document.querySelector('#userAnswWeaknesses');
    const userAnswClient = document.querySelector('#userAnswClient');

    const allInputs = [
        userAnswName,
        userAnswInst,
        userAnswWhoAreYou,
        userAnswAim,
        userAnswAimRealize,
        userAnswWeaknesses,
        userAnswClient
    ];

    // Функция для проверки заполнения всех полей
    function areAllInputsFilled() {
        return allInputs.every(input => input.value.trim() !== '');
    }

    // Слушатель события input для всех полей
    allInputs.forEach(input => {
        input.addEventListener('input', () => {
            if (areAllInputsFilled()) {
                tg.MainButton.text = 'Отправить данные';
                tg.MainButton.color = '#00FF85';
                tg.MainButton.show();
            } else {
                tg.MainButton.hide();
            }
        });
    });

    tg.MainButton.onClick(() => {
        const data = JSON.stringify({
            webAppType: 'session-register',
            userAnswName: userAnswName.value,
            userAnswInst: userAnswInst.value,
            userAnswWhoAreYou: userAnswWhoAreYou.value,
            userAnswAim: userAnswAim.value,
            userAnswAimRealize: userAnswAimRealize.value,
            userAnswWeaknesses: userAnswWeaknesses.value,
            userAnswClient: userAnswClient.value
        })

        tg.sendData(data)
    })
})
