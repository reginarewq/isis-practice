from flask import Flask, jsonify, request, abort
from flask_cors import CORS
import psycopg2
from psycopg2.extras import RealDictCursor
import json

app = Flask(__name__)
CORS(app)

# Отключаем ASCII кодировку для русских букв
app.config['JSON_AS_ASCII'] = False

# НАСТРОЙКИ БД (ПРОВЕРЬТЕ СВОИ ДАННЫЕ!)
DB_CONFIG = {
    "host": "localhost",
    "database": "farm",
    "user": "postgres",
    "password": "12345",
    "port": 5432
}

def get_db():
    try:
        conn = psycopg2.connect(**DB_CONFIG, cursor_factory=RealDictCursor)
        return conn
    except Exception as e:
        print(f"Ошибка подключения к БД: {e}")
        return None


# ==================== ГЛАВНАЯ ====================
@app.route('/')
def home():
    return jsonify({
        "status": "ok",
        "message": "Фермерское хозяйство API работает",
        "endpoints": {
            "animals": "/api/animals",
            "feeds": "/api/feeds",
            "products": "/api/products",
            "vaccinations": "/api/vaccinations",
            "customers": "/api/customers"
        }
    })


# ==================== ЖИВОТНЫЕ ====================
@app.route('/api/animals', methods=['GET'])
def get_animals():
    conn = get_db()
    if not conn:
        return jsonify({"error": "Ошибка подключения к БД"}), 500
    cur = conn.cursor()
    cur.execute('SELECT id, tag_number, name, animal_type, breed, birth_date, gender FROM animals ORDER BY id')
    rows = cur.fetchall()
    cur.close()
    conn.close()
    return jsonify(rows)


@app.route('/api/animals', methods=['POST'])
def add_animal():
    data = request.get_json()
    if not data.get('tag_number') or not data.get('animal_type'):
        return jsonify({"error": "tag_number и animal_type обязательны"}), 400
    
    conn = get_db()
    if not conn:
        return jsonify({"error": "Ошибка подключения к БД"}), 500
    cur = conn.cursor()
    cur.execute('''
        INSERT INTO animals (tag_number, name, animal_type, breed, birth_date, gender)
        VALUES (%s, %s, %s, %s, %s, %s) RETURNING *
    ''', (data.get('tag_number'), data.get('name'), data.get('animal_type'),
          data.get('breed'), data.get('birth_date'), data.get('gender')))
    new = cur.fetchone()
    conn.commit()
    cur.close()
    conn.close()
    return jsonify(new), 201


@app.route('/api/animals/<int:animal_id>', methods=['DELETE'])
def delete_animal(animal_id):
    conn = get_db()
    if not conn:
        return jsonify({"error": "Ошибка подключения к БД"}), 500
    cur = conn.cursor()
    cur.execute('DELETE FROM animals WHERE id = %s RETURNING id', (animal_id,))
    deleted = cur.fetchone()
    conn.commit()
    cur.close()
    conn.close()
    if not deleted:
        return jsonify({"error": "Животное не найдено"}), 404
    return jsonify({"message": "Удалено", "id": animal_id})


# ==================== КОРМА ====================
@app.route('/api/feeds', methods=['GET'])
def get_feeds():
    conn = get_db()
    if not conn:
        return jsonify({"error": "Ошибка подключения к БД"}), 500
    cur = conn.cursor()
    cur.execute('SELECT id, name, feed_type, unit, stock_quantity FROM feeds ORDER BY id')
    rows = cur.fetchall()
    cur.close()
    conn.close()
    return jsonify(rows)


@app.route('/api/feeds', methods=['POST'])
def add_feed():
    data = request.get_json()
    if not data.get('name'):
        return jsonify({"error": "name обязателен"}), 400
    
    conn = get_db()
    if not conn:
        return jsonify({"error": "Ошибка подключения к БД"}), 500
    cur = conn.cursor()
    cur.execute('''
        INSERT INTO feeds (name, feed_type, unit, stock_quantity)
        VALUES (%s, %s, %s, %s) RETURNING *
    ''', (data.get('name'), data.get('feed_type'), data.get('unit'), data.get('stock_quantity')))
    new = cur.fetchone()
    conn.commit()
    cur.close()
    conn.close()
    return jsonify(new), 201


@app.route('/api/feeds/<int:feed_id>', methods=['DELETE'])
def delete_feed(feed_id):
    conn = get_db()
    if not conn:
        return jsonify({"error": "Ошибка подключения к БД"}), 500
    cur = conn.cursor()
    cur.execute('DELETE FROM feeds WHERE id = %s RETURNING id', (feed_id,))
    deleted = cur.fetchone()
    conn.commit()
    cur.close()
    conn.close()
    if not deleted:
        return jsonify({"error": "Корм не найден"}), 404
    return jsonify({"message": "Удалено", "id": feed_id})


# ==================== ПРОДУКЦИЯ ====================
@app.route('/api/products', methods=['GET'])
def get_products():
    conn = get_db()
    if not conn:
        return jsonify({"error": "Ошибка подключения к БД"}), 500
    cur = conn.cursor()
    cur.execute('''
        SELECT p.*, a.name as animal_name 
        FROM products p
        LEFT JOIN animals a ON p.animal_id = a.id
        ORDER BY p.production_date DESC
    ''')
    rows = cur.fetchall()
    cur.close()
    conn.close()
    return jsonify(rows)


@app.route('/api/products', methods=['POST'])
def add_product():
    data = request.get_json()
    if not data.get('animal_id') or not data.get('product_type'):
        return jsonify({"error": "animal_id и product_type обязательны"}), 400
    
    conn = get_db()
    if not conn:
        return jsonify({"error": "Ошибка подключения к БД"}), 500
    cur = conn.cursor()
    cur.execute('''
        INSERT INTO products (animal_id, product_type, quantity, production_date)
        VALUES (%s, %s, %s, %s) RETURNING *
    ''', (data.get('animal_id'), data.get('product_type'), data.get('quantity'), data.get('production_date')))
    new = cur.fetchone()
    conn.commit()
    cur.close()
    conn.close()
    return jsonify(new), 201


@app.route('/api/products/<int:product_id>', methods=['DELETE'])
def delete_product(product_id):
    conn = get_db()
    if not conn:
        return jsonify({"error": "Ошибка подключения к БД"}), 500
    cur = conn.cursor()
    cur.execute('DELETE FROM products WHERE id = %s RETURNING id', (product_id,))
    deleted = cur.fetchone()
    conn.commit()
    cur.close()
    conn.close()
    if not deleted:
        return jsonify({"error": "Продукция не найдена"}), 404
    return jsonify({"message": "Удалено", "id": product_id})


# ==================== ПРИВИВКИ ====================
@app.route('/api/vaccinations', methods=['GET'])
def get_vaccinations():
    conn = get_db()
    if not conn:
        return jsonify({"error": "Ошибка подключения к БД"}), 500
    cur = conn.cursor()
    cur.execute('''
        SELECT v.*, a.name as animal_name 
        FROM vaccinations v
        LEFT JOIN animals a ON v.animal_id = a.id
        ORDER BY v.vaccination_date DESC
    ''')
    rows = cur.fetchall()
    cur.close()
    conn.close()
    return jsonify(rows)


@app.route('/api/vaccinations', methods=['POST'])
def add_vaccination():
    data = request.get_json()
    if not data.get('animal_id') or not data.get('vaccine_name'):
        return jsonify({"error": "animal_id и vaccine_name обязательны"}), 400
    
    conn = get_db()
    if not conn:
        return jsonify({"error": "Ошибка подключения к БД"}), 500
    cur = conn.cursor()
    cur.execute('''
        INSERT INTO vaccinations (animal_id, vaccine_name, vaccination_date, next_date, vet_name)
        VALUES (%s, %s, %s, %s, %s) RETURNING *
    ''', (data.get('animal_id'), data.get('vaccine_name'), 
          data.get('vaccination_date'), data.get('next_date'), data.get('vet_name')))
    new = cur.fetchone()
    conn.commit()
    cur.close()
    conn.close()
    return jsonify(new), 201


@app.route('/api/vaccinations/<int:vacc_id>', methods=['DELETE'])
def delete_vaccination(vacc_id):
    conn = get_db()
    if not conn:
        return jsonify({"error": "Ошибка подключения к БД"}), 500
    cur = conn.cursor()
    cur.execute('DELETE FROM vaccinations WHERE id = %s RETURNING id', (vacc_id,))
    deleted = cur.fetchone()
    conn.commit()
    cur.close()
    conn.close()
    if not deleted:
        return jsonify({"error": "Прививка не найдена"}), 404
    return jsonify({"message": "Удалено", "id": vacc_id})


# ==================== ПОКУПАТЕЛИ ====================
@app.route('/api/customers', methods=['GET'])
def get_customers():
    conn = get_db()
    if not conn:
        return jsonify({"error": "Ошибка подключения к БД"}), 500
    cur = conn.cursor()
    cur.execute('SELECT id, last_name, first_name, phone, email, address FROM customers ORDER BY id')
    rows = cur.fetchall()
    cur.close()
    conn.close()
    return jsonify(rows)


@app.route('/api/customers', methods=['POST'])
def add_customer():
    data = request.get_json()
    if not data.get('last_name') or not data.get('first_name'):
        return jsonify({"error": "last_name и first_name обязательны"}), 400
    
    conn = get_db()
    if not conn:
        return jsonify({"error": "Ошибка подключения к БД"}), 500
    cur = conn.cursor()
    cur.execute('''
        INSERT INTO customers (last_name, first_name, phone, email, address)
        VALUES (%s, %s, %s, %s, %s) RETURNING *
    ''', (data.get('last_name'), data.get('first_name'), 
          data.get('phone'), data.get('email'), data.get('address')))
    new = cur.fetchone()
    conn.commit()
    cur.close()
    conn.close()
    return jsonify(new), 201


@app.route('/api/customers/<int:customer_id>', methods=['DELETE'])
def delete_customer(customer_id):
    conn = get_db()
    if not conn:
        return jsonify({"error": "Ошибка подключения к БД"}), 500
    cur = conn.cursor()
    cur.execute('DELETE FROM customers WHERE id = %s RETURNING id', (customer_id,))
    deleted = cur.fetchone()
    conn.commit()
    cur.close()
    conn.close()
    if not deleted:
        return jsonify({"error": "Покупатель не найден"}), 404
    return jsonify({"message": "Удалено", "id": customer_id})


# ==================== ЗАПУСК ====================
if __name__ == '__main__':
    print("=" * 50)
    print("🚀 Фермерское хозяйство API")
    print("=" * 50)
    print("📍 http://localhost:5000")
    print("📋 http://localhost:5000/api/animals")
    print("=" * 50)
    app.run(debug=True, port=5000, host='localhost')