# Giai đoạn 1: Build ứng dụng Spring Boot
FROM maven:3.9.9-eclipse-temurin-17-alpine AS builder

WORKDIR /app

# Sao chép file cấu hình Maven và source code
COPY pom.xml .
COPY src ./src

# Build JAR, bỏ qua test để nhanh hơn
RUN mvn clean package -DskipTests

# Giai đoạn 2: Tạo image chạy ứng dụng
FROM eclipse-temurin:17-jre-alpine

WORKDIR /app

# Sao chép JAR từ giai đoạn build
COPY --from=builder /app/target/*.jar app.jar

# Tạo user non-root để tăng bảo mật
RUN addgroup -S mygroup && adduser -S myuser -G mygroup
USER myuser

# Mở port 8080
EXPOSE 8080

# Chạy ứng dụng
CMD ["java", "-jar", "app.jar"]