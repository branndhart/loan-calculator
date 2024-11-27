// Получаем элементы со страницы
const loanAmountInput = document.getElementById('loanAmount');
const annualRateInput = document.getElementById('annualRate');
const loanTermInput = document.getElementById('loanTerm');
const interestPaymentSpan = document.getElementById('interestPayment');
const annuityPaymentSpan = document.getElementById('annuityPayment');
const buttons = document.querySelectorAll('.calculator-button');
const initialLoanAmount = 1000000;
const initialAnnualRate = 24;
const initialLoanTerm = 60;
loanAmountInput.value = numberWithSpaces(initialLoanAmount);
annualRateInput.value = initialAnnualRate;
loanTermInput.value = initialLoanTerm;

loanAmountInput.addEventListener('input', function () {
    buttons.forEach(button => {
        if (button.classList.contains('active') && button.getAttribute('data-type') === 'loan-amount') {
            button.classList.remove('active');
        }
    });
    calculatePaymentsWithDelay();
});

annualRateInput.addEventListener('input', function () {
    buttons.forEach(button => {
        if (button.classList.contains('active') && button.getAttribute('data-type') === 'annual-rate') {
            button.classList.remove('active');
        }
    });
    calculatePaymentsWithDelay();
});

loanTermInput.addEventListener('input', function () {
    buttons.forEach(button => {
        if (button.classList.contains('active') && button.getAttribute('data-type') === 'loan-term') {
            button.classList.remove('active');
        }
    });
    calculatePaymentsWithDelay();
});

loanAmountInput.addEventListener('input', function () {
    const enteredAmount = parseFloat(loanAmountInput.value.replace(/\s/g, '').replace(',', ''));

    buttons.forEach(button => {
        const buttonValue = parseFloat(button.getAttribute('data-value').replace(/\s/g, '').replace(',', ''));
        if (button.getAttribute('data-type') === 'loan-amount') {
            if (buttonValue === enteredAmount) {
                button.classList.add('active');
            } else {
                button.classList.remove('active');
            }
        }
    });

    calculatePaymentsWithDelay();
});

annualRateInput.addEventListener('input', function () {
    const enteredRate = parseFloat(annualRateInput.value);

    buttons.forEach(button => {
        const buttonValue = parseFloat(button.getAttribute('data-value'));
        if (button.getAttribute('data-type') === 'annual-rate') {
            if (buttonValue === enteredRate) {
                button.classList.add('active');
            } else {
                button.classList.remove('active');
            }
        }
    });

    calculatePaymentsWithDelay();
});

loanTermInput.addEventListener('input', function () {
    const enteredTerm = parseInt(loanTermInput.value);

    buttons.forEach(button => {
        const buttonValue = parseInt(button.getAttribute('data-value'));
        if (button.getAttribute('data-type') === 'loan-term') {
            if (buttonValue === enteredTerm) {
                button.classList.add('active');
            } else {
                button.classList.remove('active');
            }
        }
    });

    calculatePaymentsWithDelay();
});




document.addEventListener('DOMContentLoaded', function () {
    // Находим все группы кнопок
    const buttonGroups = document.querySelectorAll('.button-group');

    // Для каждой группы кнопок
    buttonGroups.forEach(buttonGroup => {
        // Находим все кнопки внутри группы
        const buttons = buttonGroup.querySelectorAll('.calculator-button');

        // Добавляем обработчики событий для каждой кнопки
        buttons.forEach(button => {
            button.addEventListener('click', function () {
                // Убираем класс 'active' у всех кнопок внутри группы
                buttons.forEach(btn => btn.classList.remove('active'));

                // Добавляем класс 'active' только к нажатой кнопке
                this.classList.add('active');
            });
        });

        // // По умолчанию делаем первую кнопку в группе синей (активной)
        // if (buttons.length > 0) {
        //     buttons[0].classList.add('active');
        // }
    });
});


function setLoanAmount(amount, button) {
    animateValue(parseFloat(loanAmountInput.value.replace(/\s/g, '').replace(',', '')), parseFloat(amount.replace(/\s/g, '')), loanAmountInput);
    // setActiveButton(button);
}

function setAnnualRate(rate, button) {
    animateValue(parseFloat(annualRateInput.value), rate, annualRateInput);
    // setActiveButton(button);
}

function setLoanTerm(term, button) {
    animateValue(parseFloat(loanTermInput.value), term, loanTermInput);
    // setActiveButton(button);
}

function setActiveButton(button) {
    buttons.forEach(btn => btn.classList.remove('active'));
    // button.classList.add('active');
}




// Функция расчета платежей с задержкой в 200 мс
let timeoutId;

function calculatePaymentsWithDelay() {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => {
        calculatePayments();
    }, 500);
}

// Функция расчета платежей
function calculatePayments() {
    const loanAmount = parseFloat(loanAmountInput?.value?.replace(/\s/g, '').replace(',', '') || '0', 10);
    const annualRate = parseFloat(annualRateInput?.value || '8');
    const loanTerm = parseInt(loanTermInput?.value || '12', 10);



    const monthlyRate = annualRate / 12 / 100;
    const monthlyInterestPayment = loanAmount * monthlyRate;
    const annuityFactor = (monthlyRate * Math.pow(1 + monthlyRate, loanTerm)) / (Math.pow(1 + monthlyRate, loanTerm) - 1);
    const annuityPayment = loanAmount * annuityFactor;

    // Вычисляем аннуитетный ежемесячный платеж
    // const monthlyInterestRate = 0.42 / 12;
    // const annuityCoefficient = (monthlyInterestRate * Math.pow(1 + monthlyInterestRate, loanTerm)) /
    //     (Math.pow(1 + monthlyInterestRate, loanTerm) - 1);
    // const annuityPayment = Math.round(loanAmount * annuityCoefficient);

    animateTextChange(parseFloat(interestPaymentSpan.textContent.replace(/\s/g, '')), monthlyInterestPayment, interestPaymentSpan);
    animateTextChange(parseFloat(annuityPaymentSpan.textContent.replace(/\s/g, '')), annuityPayment, annuityPaymentSpan);

    if (isNaN(monthlyInterestPayment)) {
        interestPaymentSpan.textContent = '';
    } else {
        animateTextChange(parseFloat(interestPaymentSpan.textContent.replace(/\s/g, '')), monthlyInterestPayment, interestPaymentSpan);
    }

    if (isNaN(annuityPayment)) {
        annuityPaymentSpan.textContent = '';
    } else {
        animateTextChange(parseFloat(annuityPaymentSpan.textContent.replace(/\s/g, '')), annuityPayment, annuityPaymentSpan);
    }
}

// Функция для анимации изменения числа
function animateTextChange(startValue, endValue, targetElement) {
    const duration = 300; // продолжительность анимации в миллисекундах
    const startTime = new Date().getTime(); // время начала анимации

    function updateValue(currentValue, targetValue, startTime) {
        const currentTime = new Date().getTime() - startTime;
        if (currentTime >= duration) {
            targetElement.textContent = numberWithSpaces(Math.round(targetValue)); // Округление до целого числа
        } else {
            const diffValue = targetValue - currentValue;
            const progress = currentTime / duration;
            const increment = diffValue * progress;
            const newValue = currentValue + increment;
            targetElement.textContent = numberWithSpaces(Math.round(newValue)); // Округление до целого числа
            requestAnimationFrame(() => updateValue(currentValue, targetValue, startTime));
        }
    }

    requestAnimationFrame(() => updateValue(startValue, endValue, startTime));
}

// Функция добавления пробелов между разрядами числа
function numberWithSpaces(number) {
    return number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ' ');
}

function animateValue(startValue, endValue, targetElement) {
    const duration = 200; // продолжительность анимации в миллисекундах
    const startTime = new Date().getTime(); // время начала анимации

    function updateValue(currentValue, targetValue, startTime) {
        const currentTime = new Date().getTime() - startTime;
        if (currentTime >= duration) {
            targetElement.value = numberWithSpaces(targetValue);
            calculatePayments();
        } else {
            const diffValue = targetValue - currentValue;
            const progress = currentTime / duration;
            const increment = diffValue * progress;
            const newValue = currentValue + increment;
            targetElement.value = numberWithSpaces(Math.round(newValue));
            requestAnimationFrame(() => updateValue(currentValue, targetValue, startTime));
        }
    }

    requestAnimationFrame(() => updateValue(startValue, endValue, startTime));
}

loanAmountInput.addEventListener('input', calculatePaymentsWithDelay);
annualRateInput.addEventListener('input', calculatePaymentsWithDelay);
loanTermInput.addEventListener('input', calculatePaymentsWithDelay);

loanAmountInput.addEventListener('input', function () {
    const value = loanAmountInput.value.replace(/[^\d.,]/g, ''); // Удаляем все, кроме цифр, точек и запятых
    const formattedValue = numberWithSpaces(value); // Форматируем число с разделителями
    loanAmountInput.value = formattedValue; // Устанавливаем отформатированное значение в поле ввода
    calculatePaymentsWithDelay();
});

annualRateInput.addEventListener('input', function () {
    calculatePaymentsWithDelay();
});

loanTermInput.addEventListener('input', function () {
    calculatePaymentsWithDelay();
});


loanAmountInput.addEventListener('input', calculatePaymentsWithDelay);
annualRateInput.addEventListener('input', calculatePaymentsWithDelay);
loanTermInput.addEventListener('input', calculatePaymentsWithDelay);

calculatePayments();
