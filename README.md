# Messiah

prevent next 1.5B hack

<img src="image/concept.png"  width="100%">

## Incident Report

| File                                                                                      | Lost |
| ----------------------------------------------------------------------------------------- | ---- |
| [Bybit Hack Report](./incident/Bybit/Bybit-Incident-Investigation-Preliminary-Report.pdf) | 1.5B |

## How to reproduce bybit hack detection

1. open n8n locally
2. import `n8n_workflow/scan_js.json` into n8n
3. visit n8n dashboard `http://localhost:5678`
4. copy the real malicious js file content `incidnet/Bybit/_app-52c9031bfa03da47.js`
5. paste to chatbox and execute it
6. check the result under the structured output component in workflow

<img src="image/scan_js_workflow.png"  width="100%">
<img src="image/scan_js_result.png"  width="100%">

## n8n & Backend Installation Setup

1. Setup Python environment:

```bash
# Initialize virtual environment and install dependencies
pyenv virtualenv 3.11 Messiah
pyenv activate Messiah
poetry shell
poetry install
```

2. Configure environment variables in `.env`:

```bash
cp .env.example .env
```

Update the environment variables in `.env` file if needed.

3. Start n8n and database:

```bash
source .env
docker-compose up -d
```

4. Access the n8n dashboard, Open your browser and navigate to `http://localhost:5678`

5. (First time only) Setup owner account, activate free n8n pro features

## Cli:

How to download target website all JS files

```bash
poetry run python cli/main.py scan
```

## Tech Stack:

- Python
- n8n
