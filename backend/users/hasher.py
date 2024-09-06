import json
import bcrypt

# Cargar el archivo JSON
with open('users.json', 'r', encoding='utf-8') as file:
    data = json.load(file)

# Iterar sobre los usuarios y hashear contraseñas si no están hasheadas
for user in data['users']:
    contraseña = user['contraseña']
    
    # Verificar si la contraseña ya está hasheada
    if not contraseña.startswith('$2b$'):
        # Generar el hash de la contraseña
        hashed_password = bcrypt.hashpw(contraseña.encode('utf-8'), bcrypt.gensalt())
        user['contraseña'] = hashed_password.decode('utf-8')

# Guardar el archivo JSON actualizado con las contraseñas hasheadas
with open('users.json', 'w', encoding='utf-8') as file:
    json.dump(data, file, ensure_ascii=False, indent=4)

print("Contraseñas hasheadas correctamente.")
