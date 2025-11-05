FROM node:18

WORKDIR /app

# คัดลอกเฉพาะ package.json ก่อน แล้วติดตั้ง
COPY package*.json ./
RUN npm install

# จากนั้นคัดลอกไฟล์โปรเจกต์ทั้งหมด
COPY . .

EXPOSE 5003

CMD ["node", "server.js"]
