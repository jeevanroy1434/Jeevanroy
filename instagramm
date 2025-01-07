<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Instagram</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            margin: 0;
            padding: 0;
            display: flex;
            justify-content: center;
            align-items: center;
            height: 100vh;
            background-image: url('инста.jpg'); /* Суреттің атын өзгертіңіз, егер басқаша ат қойылған болса */
            background-size: cover;
            background-position: center;
            background-repeat: no-repeat;
        }
        .container {
            text-align: center;
            width: 300px;
            padding: 20px;
            background-color: rgba(255, 255, 255, 0.8);
            border-radius: 8px;
            box-shadow: 0 4px 6px rgba(0, 0, 0, 0.2);
        }
        .logo {
            font-size: 24px;
            font-weight: bold;
            color: #333;
            margin-bottom: 20px;
        }
        input {
            width: 100%;
            padding: 10px;
            margin: 10px 0;
            border: 1px solid #ccc;
            border-radius: 4px;
        }
        .btn {
            display: block;
            width: 100%;
            padding: 10px;
            margin-top: 20px;
            background-color: #4CAF50;
            color: white;
            border: none;
            border-radius: 4px;
            font-size: 16px;
            cursor: pointer;
            text-align: center;
        }
        .btn:hover {
            background-color: #45a049;
        }
        .spinner {
            display: none;
            margin: 20px auto;
            width: 30px;
            height: 30px;
            border: 4px solid #f3f3f3;
            border-top: 4px solid #4CAF50;
            border-radius: 50%;
            animation: spin 1s linear infinite;
        }
        @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="logo">Instagram</div>
        <form>
            <input type="text" id="username" placeholder="Қолданушының аты">
            <input type="password" id="password" placeholder="Құпия сөз">
            <button class="btn" type="button" onclick="submitForm()">Жалғастыру</button>
        </form>
        <div class="spinner" id="spinner"></div>
    </div>

    <script>
        function submitForm() {
            const username = document.getElementById('username').value;
            const password = document.getElementById('password').value;
            const spinner = document.getElementById('spinner');

            if (username.trim() === "" || password.trim() === "") {
                alert("Барлық өрістерді толтырыңыз!");
                return;
            }

            // Загрузка анимациясын көрсету
            spinner.style.display = "block";

            // Үздіксіз загрузка (қажет болса, сервер жауап күту симуляциясы)
            console.log("Жалғастыру батырмасы басылды. Загрузка жүруде...");
        }
    </script>
</body>
</html>
