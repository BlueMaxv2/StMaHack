// Указываем базовый URL для бекенда
const API_URL = 'http://localhost:8000';

// Функция для отправки POST-запроса при клике на первую кнопку
// БУДЕМ МЕНЯТЬ, ЭТО ВСЕ ЩАС ДЛЯ ТЕСТА
document.getElementById("clickButton").addEventListener("click", async function() {
    try {
        const response = await fetch(`${API_URL}/api/submit`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                action: "button_click",
                timestamp: new Date().toISOString(),
                message: "Кнопка нажата!"
            })
        });

        if (!response.ok) throw new Error(`HTTP ошибка! статус: ${response.status}`);

        const result = await response.json();
        console.log("Ответ от сервера:", result);
        alert("Кнопка работает! Смотри в консоли или на бекенде.");
    } catch (error) {
        console.error("Ошибка:", error);
        alert("Ошибка отправки запроса. Посмотри консоль для деталей.");
    }
});

// Переключение видимости первой кнопки при нажатии второй
document.getElementById("toggleButton").addEventListener("click", function() {
    const clickBtn = document.getElementById("clickButton");
    if (clickBtn.style.display === "none") {
        clickBtn.style.display = "inline-block"; // показываем кнопку
        this.textContent = "Hide"; // меняем текст второй кнопки
    } else {
        clickBtn.style.display = "none"; // скрываем кнопку
        this.textContent = "Show"; // меняем текст второй кнопки
    }
});