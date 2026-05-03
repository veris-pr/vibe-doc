FROM python:3.14-slim

WORKDIR /app

RUN apt update
RUN apt-get update && apt-get install -y \
    curl \
    libpq-dev \
    gcc

RUN curl -LsSf https://astral.sh/uv/install.sh | sh
ENV PATH="/root/.local/bin:${PATH}"

RUN uv pip install --system \
    psycopg2-binary \
    python-multipart \
    httpx \
    redis \
    alembic \
    jinja2 \
    "fastapi[standard]" \
    "uvicorn[standard]" \
    sqlalchemy \
    asyncpg \
    pydantic \
    pydantic-settings \
    "python-jose[cryptography]" \
    "passlib[bcrypt]" \
    slowapi

COPY . .

CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8100"]
