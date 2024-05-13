window.addEventListener('DOMContentLoaded', async () => {
    const tg = window.Telegram.WebApp

    tg.expand()
    let secondTestAttempts = localStorage.getItem('secondTestAttempts') || 0
    localStorage.setItem('secondTestAttempts', secondTestAttempts)

    let currentQuestion = 1
    let answers = {
        qst1: [],
        qst2: "",
        qst3: []
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
    
            if (currentQuestion === 1 && answers.qst1.length < 2) {
                tg.HapticFeedback.notificationOccurred('error')
                tg.showPopup({
                    title: "Ошибка",
                    message: "Пожалуйста, выберите несколько ответов!"
                })
                return;
            } 
            if (currentQuestion === 3 && answers.qst3.length < 2) {
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
                const currentPage = document.querySelector('.page_3')
                const successPage = document.querySelector('.success_page')
                const failPage = document.querySelector('.fail_page')
                const failPageWithSkip = document.querySelector('.fail_page_with_skip')

                answers.qst1 = answers.qst1.join('')
                answers.qst3 = answers.qst3.join('')
                let answerLined = Object.values(answers).join('')
                if (answerLined === '126910' || answerLined === '126109' || answerLined === '216109' || answerLined === '216910') {
                    currentPage.style.display = 'none'
                    successPage.style.display = 'flex'
                } else {
                    

                    secondTestAttempts++
                    localStorage.setItem("secondTestAttempts", secondTestAttempts)

                    if (secondTestAttempts < 3) {
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
    
            if (currentQuestion !== 1 && currentQuestion !== 3) {
                answer.forEach(element => {
                    element.classList.remove('chosen');
                });
            }
    
            if (isChosen) {
                answerElement.classList.remove('chosen');
            } else {
                answerElement.classList.add('chosen');
            }
    
            if (currentQuestion === 1) {
                let index = answers.qst1.indexOf(answerElement.id);
                if (index !== -1) {
                    answers.qst1.splice(index, 1);
                } else {
                    answers.qst1.push(answerElement.id);
                }
            } else if (currentQuestion === 2) {
                answers.qst2 = answerElement.id;
            } else if (currentQuestion === 3) {
                let index = answers.qst3.indexOf(answerElement.id);
                if (index !== -1) {
                    answers.qst3.splice(index, 1);
                } else {
                    answers.qst3.push(answerElement.id);
                }
            }
        });
    });


    const restartButton = document.querySelector('.fail_button')
    restartButton.addEventListener('click', () => {
        tg.HapticFeedback.notificationOccurred('error')
        location.reload();
    })
    


    const goBackToBotButton = document.querySelector('.go_back_to_bot')

    goBackToBotButton.addEventListener('click', () => {
        tg.HapticFeedback.impactOccurred('heavy')
        const data = JSON.stringify({
            webAppType: 'test-two-passed',
            testAttempts: localStorage.getItem("secondTestAttempts"),
            testSkipped: false,
            testPassed: true
        })

        tg.sendData(data)
    })


    const skipTestButton = document.querySelector('.skip_test_button')

    skipTestButton.addEventListener('click', () => {
        tg.HapticFeedback.notificationOccurred('error')
        const data = JSON.stringify({
            webAppType: 'test-two-skipped',
            testAttempts: localStorage.getItem("secondTestAttempts"),
            testSkipped: true,
            testPassed: false
        })

        tg.sendData(data)
    })
    

})
