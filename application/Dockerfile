FROM python:3.9-slim

WORKDIR /app

# Create logs directory
RUN mkdir -p /tmp/gum-logs && chmod 777 /tmp/gum-logs

COPY ./requirements.txt ./requirements.txt
RUN pip install --no-cache-dir -r requirements.txt

COPY . .

EXPOSE 8000

CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000"] 