FROM python:3.10-slim

WORKDIR /app

COPY ApiRecommendSystem.py .

RUN pip install --no-cache-dir flask pandas numpy sqlalchemy mysql-connector-python

EXPOSE 8081

CMD ["python", "ApiRecommendSystem.py"]
