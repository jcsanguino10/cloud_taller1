FROM python:3.12.2

RUN mkdir -p /home/app_back

COPY . /home/app_back

WORKDIR /home/app_back

RUN pip install --no-cache-dir -r requirements.txt

EXPOSE 8000

CMD ["uvicorn", "app:app", "--host", "0.0.0.0", "--port", "8000"]