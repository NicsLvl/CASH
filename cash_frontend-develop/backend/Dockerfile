FROM python:3

RUN pip install pipenv

RUN mkdir /usr/src/app/
WORKDIR /usr/src/app/

COPY Pipfile* ./
RUN pipenv lock --keep-outdated --requirements > requirements.txt
RUN pip install --no-cache-dir -r requirements.txt

COPY . ./

EXPOSE 5000

CMD gunicorn --workers=5 application:application --timeout 300
