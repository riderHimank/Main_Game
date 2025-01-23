FROM node:18-alpine
WORKDIR /app
COPY . /app
RUN npm install -g live-server
EXPOSE 80
CMD ["live-server", "--open=index.html"]