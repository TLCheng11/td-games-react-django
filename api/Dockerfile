FROM python:3.10.7-slim-buster

# create group and user
RUN adduser --system --group worker
# set ownership and permissions
# RUN chown -R worker:worker .

RUN python -m venv /opt/venv
# Make sure we use the virtualenv:
ENV PATH="/opt/venv/bin:$PATH"

WORKDIR /home/worker/app

RUN pip install --upgrade pip

COPY --chown=worker:worker requirements.txt .
RUN pip install -r requirements.txt

COPY --chown=worker:worker . .

USER worker