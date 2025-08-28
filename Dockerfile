FROM node:lts-buster

# Installer les dépendances système
RUN apt-get update && \
    apt-get install -y \
    ffmpeg \
    imagemagick \
    webp && \
    apt-get upgrade -y && \
    rm -rf /var/lib/apt/lists/*

# Installer PM2 globalement
RUN npm install pm2 -g

# Créer le répertoire de l'application
WORKDIR /app

# Copier les fichiers package.json et package-lock.json
COPY package*.json ./

# Installer les dépendances de l'application
RUN npm install --legacy-peer-deps

# Copier le code source de l'application
COPY . .

# Exposer le port nécessaire
EXPOSE 10000

# Commande de démarrage
CMD ["pm2-runtime", "index.js"]