FROM node:18.0.0-bullseye

RUN apt-get update && DEBIAN_FRONTEND=noninteractive apt-get install -y \
    ffmpeg \
    xorg \
    xserver-xorg \
    xvfb \
    libx11-dev \
    libxext-dev \
    chromium \
 && apt-get clean \
 && rm -rf /var/lib/apt/lists/*

WORKDIR /app

ARG SPACES_KEY=unspecified
ENV SPACES_KEY=${SPACES_KEY}

ARG SPACES_SECRET=unspecified
ENV SPACES_SECRET=${SPACES_SECRET}

COPY package*.json ./

RUN npm install

COPY . .

RUN chown -R node:node /app

USER node

# ENV PORT 3000

EXPOSE 3000

ENV NODE_ENV production

RUN npm run build

CMD npm run start
