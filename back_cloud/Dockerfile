FROM python:3.11

RUN apt-get update && apt-get install -y libpq-dev pandoc texlive-fonts-recommended texlive-fonts-extra && rm -rf /var/lib/apt/lists/*
RUN apt-get install -y pkg-config libicu-dev pandoc texlive-fonts-recommended texlive-fonts-extra

RUN mkdir -p /home/app_back

COPY . /home/app_back

WORKDIR /home/app_back

RUN pip install --no-cache-dir -r requirements.txt


EXPOSE 8000

CMD ["uvicorn", "app:app", "--host", "0.0.0.0", "--port", "8000"]