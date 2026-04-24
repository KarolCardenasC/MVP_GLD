# Stage 1: Build the application
FROM maven:3.9.6-eclipse-temurin-17-alpine AS build
WORKDIR /app
COPY pom.xml .
COPY src ./src
# Build the jar skipping tests to speed up the process
RUN mvn clean package -DskipTests

# Stage 2: Run the application
FROM eclipse-temurin:17-jre-alpine
WORKDIR /app
COPY --from=build /app/target/*.jar app.jar

# Create the uploads directory
RUN mkdir -p /tmp/uploads

EXPOSE 8080
ENTRYPOINT ["java","-Xmx256m","-jar","app.jar","--spring.profiles.active=prod"]
