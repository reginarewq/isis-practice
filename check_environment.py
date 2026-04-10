import sys
import os
import subprocess

def check_tool(name, command):
    """Проверяет наличие инструмента в системе."""
    try:
        result = subprocess.run(
            command, capture_output=True, text=True, shell=True
        )
        version = result.stdout.strip() or result.stderr.strip()
        print(f"[OK] {name}: {version}")
        return True
    except FileNotFoundError:
        print(f"[!] {name}: НЕ УСТАНОВЛЕН")
        return False

def main():
    print("=" * 50)
    print("ПРОВЕРКА РАБОЧЕГО ОКРУЖЕНИЯ")
    print("=" * 50)
    print()

    # Информация о системе
    print(f"Операционная система: {os.name} ({sys.platform})")
    print(f"Python: {sys.version}")
    print(f"Рабочая директория: {os.getcwd()}")
    print()

    # Проверяемые инструменты
    tools = [
        ("Git", "git --version"),
        ("Python (pip)", "pip --version"),
        ("Node.js", "node --version"),
        ("Docker", "docker --version"),
    ]

    print("Проверка инструментов:")
    results = []
    for name, cmd in tools:
        results.append(check_tool(name, cmd))

    print()
    ok_count = sum(results)
    print(f"Итого: {ok_count}/{len(tools)} инструментов установлено.")

    if all(results):
        print("Все инструменты готовы к работе!")
    else:
        print("Установите недостающие инструменты.")

if __name__ == "__main__":
    main()