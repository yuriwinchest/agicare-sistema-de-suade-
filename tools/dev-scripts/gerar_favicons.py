import os
import subprocess
import sys

# Tenta instalar as dependências
try:
    print("Instalando dependências...")
    subprocess.check_call([sys.executable, "-m", "pip", "install", "cairosvg", "Pillow"])
    print("Dependências instaladas com sucesso!")
except Exception as e:
    print(f"Erro ao instalar dependências: {e}")
    sys.exit(1)

# Importa as bibliotecas após a instalação
from io import BytesIO
from PIL import Image
import cairosvg

# Diretório do projeto
projeto_dir = os.path.dirname(os.path.abspath(__file__))
public_dir = os.path.join(projeto_dir, "public")

# Caminho do SVG
svg_path = os.path.join(public_dir, "favicon.svg")

# Verifica se o arquivo existe
if not os.path.exists(svg_path):
    print(f"Erro: Arquivo {svg_path} não encontrado!")
    sys.exit(1)

# Tamanhos a serem gerados
sizes = [
    {"name": "favicon-16x16.png", "size": 16},
    {"name": "favicon-32x32.png", "size": 32},
    {"name": "apple-touch-icon.png", "size": 180},
    {"name": "android-chrome-192x192.png", "size": 192},
    {"name": "android-chrome-512x512.png", "size": 512},
]

# Também criar um favicon.ico (combinação de 16x16, 32x32 e 48x48)
ico_sizes = [16, 32, 48]

print(f"Processando o arquivo SVG: {svg_path}")

# Função para converter SVG para PNG
def svg_to_png(svg_path, output_path, width, height):
    try:
        # Converte SVG para PNG com CairoSVG
        png_data = cairosvg.svg2png(
            url=svg_path, 
            output_width=width, 
            output_height=height
        )
        
        # Salva o PNG
        with open(output_path, 'wb') as f:
            f.write(png_data)
        
        print(f"Gerado: {output_path} ({width}x{height})")
        return png_data
    except Exception as e:
        print(f"Erro ao gerar {output_path}: {e}")
        return None

# Gerar PNGs
for item in sizes:
    output_path = os.path.join(public_dir, item["name"])
    svg_to_png(svg_path, output_path, item["size"], item["size"])

# Gerar favicon.ico
try:
    print("Gerando favicon.ico...")
    # Cria imagens para cada tamanho do favicon.ico
    ico_images = []
    for size in ico_sizes:
        png_data = svg_to_png(svg_path, os.path.join(public_dir, f"temp_{size}.png"), size, size)
        if png_data:
            img = Image.open(BytesIO(png_data))
            ico_images.append(img)
    
    # Salva o favicon.ico com todos os tamanhos
    if ico_images:
        favicon_path = os.path.join(public_dir, "favicon.ico")
        ico_images[0].save(
            favicon_path, 
            format="ICO", 
            sizes=[(img.width, img.height) for img in ico_images],
            append_images=ico_images[1:]
        )
        print(f"Gerado: {favicon_path}")
    
    # Remove os arquivos temporários
    for size in ico_sizes:
        temp_file = os.path.join(public_dir, f"temp_{size}.png")
        if os.path.exists(temp_file):
            os.remove(temp_file)
except Exception as e:
    print(f"Erro ao gerar favicon.ico: {e}")

print("Processo concluído!") 