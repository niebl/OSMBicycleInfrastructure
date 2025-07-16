# syntax=docker/dockerfile:1

FROM node
WORKDIR /app
COPY . .

RUN npm install

#CMD ["node", "bicycleinfrastructure.js"]
#CMD ["./serve.py"]
CMD ["./start.sh"]
# CMD ["bash", "/app/start.sh"]
EXPOSE 8000
