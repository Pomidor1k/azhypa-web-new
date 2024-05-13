window.addEventListener('DOMContentLoaded', async () => {
    const tg = window.Telegram.WebApp

    tg.expand()
    let firstTestAttempts = localStorage.getItem('firstTestAttempts') || 0
    localStorage.setItem('firstTestAttempts', firstTestAttempts)

    let currentQuestion = 1
    let answers = {
        qst1: "",
        qst2: "",
        qst3: "",
        qst4: "",
        qst5: []
    }

    const answer = document.querySelectorAll('.question_item')

    const nextButton = document.querySelectorAll('.next_question_button')
    
    nextButton.forEach(nextButton => {
        nextButton.addEventListener('click', () => {
            tg.HapticFeedback.impactOccurred('heavy')
            const currentAnswers = document.querySelectorAll(`.page_${currentQuestion} .question_item`);
            if (Array.from(currentAnswers).every(element => !element.classList.contains('chosen'))) {
                tg.HapticFeedback.notificationOccurred('error')
                tg.showPopup({
                    title: "Ошибка",
                    message: "Пожалуйста, выберите ответ перед тем как продолжить!"
                })
                return;
            }
    
            if (currentQuestion === 5 && answers.qst5.length < 2) {
                tg.HapticFeedback.notificationOccurred('error')
                tg.showPopup({
                    title: "Ошибка",
                    message: "Пожалуйста, выберите несколько ответов!"
                })
                return;
            }
    
            if (currentQuestion === 1) {
                const currentDisplay = document.querySelector('.page_1')
                const nextDisplay = document.querySelector('.page_2')
                currentDisplay.style.display = 'none'
                nextDisplay.style.display = 'flex'
                currentQuestion++;
            } else if (currentQuestion === 2) {
                const currentDisplay = document.querySelector('.page_2')
                const nextDisplay = document.querySelector('.page_3')
                currentDisplay.style.display = 'none'
                nextDisplay.style.display = 'flex'
                currentQuestion++;
            } else if (currentQuestion === 3) {
                const currentDisplay = document.querySelector('.page_3')
                const nextDisplay = document.querySelector('.page_4')
                currentDisplay.style.display = 'none'
                nextDisplay.style.display = 'flex'
                currentQuestion++;
            } else if (currentQuestion === 4) {
                const currentDisplay = document.querySelector('.page_4')
                const nextDisplay = document.querySelector('.page_5')
                currentDisplay.style.display = 'none'
                nextDisplay.style.display = 'flex'
                currentQuestion++;
            } else if (currentQuestion === 5) {
                const currentPage = document.querySelector('.page_5')
                const successPage = document.querySelector('.success_page')
                const failPage = document.querySelector('.fail_page')
                const failPageWithSkip = document.querySelector('.fail_page_with_skip')

                answers.qst5 = answers.qst5.join('')
                let answerLined = Object.values(answers).join('')
                if (answerLined === '1810131718' || answerLined === '1810131817') {
                    currentPage.style.display = 'none'
                    successPage.style.display = 'flex'
                } else {
                    

                    firstTestAttempts++
                    localStorage.setItem("firstTestAttempts", firstTestAttempts)

                    if (firstTestAttempts < 3) {
                        currentPage.style.display = 'none'
                        failPage.style.display = 'flex'
                    } else {
                        currentPage.style.display = 'none'
                        failPageWithSkip.style.display = 'flex'
                    }
                }
            }
        });
    });
    
    

    answer.forEach(answerElement => {
        answerElement.addEventListener('click', () => {
            tg.HapticFeedback.impactOccurred('soft')
            const isChosen = answerElement.classList.contains('chosen');

            if (currentQuestion !== 5) {
                answer.forEach(element => {
                    element.classList.remove('chosen');
                });
            }

            if (!isChosen) {
                answerElement.classList.add('chosen');
            } else if (currentQuestion === 5) {
                answerElement.classList.remove('chosen');
            }

            if (currentQuestion === 1) {
                answers.qst1 = answerElement.id;
            } else if (currentQuestion === 2) {
                answers.qst2 = answerElement.id;
            } else if (currentQuestion === 3) {
                answers.qst3 = answerElement.id;
            } else if (currentQuestion === 4) {
                answers.qst4 = answerElement.id;
            } else if (currentQuestion === 5) {
                let index = answers.qst5.indexOf(answerElement.id);
                if (index !== -1) {
                    answers.qst5.splice(index, 1);
                } else {
                    answers.qst5.push(answerElement.id);
                }
            }
            
            
        });
    });


    const goBackToBotButton = document.querySelector('.go_back_to_bot')

    goBackToBotButton.addEventListener('click', () => {
        tg.HapticFeedback.impactOccurred('heavy')
        const data = JSON.stringify({
            webAppType: 'test-one-passed',
            testAttempts: localStorage.getItem("firstTestAttempts"),
            testSkipped: false,
            testPassed: true
        })

        tg.sendData(data)
    })


    const restartButton = document.querySelector('.fail_button')
    restartButton.addEventListener('click', () => {
        tg.HapticFeedback.notificationOccurred('error')
        location.reload();
    })


    const skipTestButton = document.querySelector('.skip_test_button')

    skipTestButton.addEventListener('click', () => {
        tg.HapticFeedback.notificationOccurred('error')
        const data = JSON.stringify({
            webAppType: 'test-one-skipped',
            testAttempts: localStorage.getItem("firstTestAttempts"),
            testSkipped: true,
            testPassed: false
        })

        tg.sendData(data)
    })
    

})
