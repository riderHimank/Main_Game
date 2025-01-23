FROM node:18-alpine
WORKDIR /app
COPY . /app
RUN npm install -g live-server
EXPOSE 8080
CMD ["live-server", "--port=8080", "--open=index.html"]