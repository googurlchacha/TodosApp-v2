# Simple Todos app

- **Frontend:** Vite + React (calls `/api/...`)
- **Backend:** NestJS + TypeORM + PostgreSQL
- **Local:** Docker Compose
- **Cloud:** Kubernetes manifests for GKE

## Run locally (Docker Compose)

```bash
docker compose up --build
```

Open **http://localhost:8080** (frontend). The API is proxied from the browser to the backend; you can also hit the API at **http://localhost:3000/api/todos**.

## Run locally (without Docker)

Terminal 1 — Postgres (or use any Postgres and set `DB_*` env vars):

```bash
docker run --rm -e POSTGRES_USER=todo -e POSTGRES_PASSWORD=todo -e POSTGRES_DB=todos -p 5432:5432 postgres:16-alpine
```

Terminal 2 — backend:

```bash
cd backend && npm install && npm run start:dev
```

Terminal 3 — frontend:

```bash
cd frontend && npm install && npm run dev
```

Open **http://localhost:5173** (Vite proxies `/api` to port 3000).

## Deploy to GKE (short version)

1. Create a GKE cluster and run `gcloud container clusters get-credentials CLUSTER_NAME --zone ZONE` (or region flag as appropriate).
2. Create an Artifact Registry **Docker** repository if needed, then authenticate Docker to the registry:

   ```bash
   gcloud artifacts repositories create todo-repo --repository-format=docker --location=us-central1
   gcloud auth configure-docker us-central1-docker.pkg.dev
   ```

3. Build and push using the **same** image names as in `k8s/04-backend.yaml` and `k8s/05-frontend.yaml` (edit those two files first if your GCP **project**, **region**, or **repository** name differs):

   ```bash
   docker build -t us-central1-docker.pkg.dev/YOUR_PROJECT_ID/todo-repo/todos-backend:latest ./backend
   docker build -t us-central1-docker.pkg.dev/YOUR_PROJECT_ID/todo-repo/todos-frontend:latest ./frontend
   docker push us-central1-docker.pkg.dev/YOUR_PROJECT_ID/todo-repo/todos-backend:latest
   docker push us-central1-docker.pkg.dev/YOUR_PROJECT_ID/todo-repo/todos-frontend:latest
   ```

4. In **`k8s/03-postgres.yaml`**, set a strong `stringData.password` in `postgres-secret`.
5. Apply manifests (order is handled by numbered file names):

   ```bash
   kubectl apply -f ./k8s
   ```

6. `kubectl get svc todo-frontend -n todos` — when **EXTERNAL-IP** is ready, open `http://EXTERNAL-IP`.

The Deployments use **`imagePullPolicy: Always`** so new `:latest` pushes are picked up on pod restart.

Postgres in-cluster is fine for demos; production setups often use [Cloud SQL](https://cloud.google.com/sql) instead.

## GitHub Actions CI/CD

Workflow file: `.github/workflows/deploy-gke.yaml`

Set these **Repository Variables**:
- `GCP_PROJECT_ID`
- `GKE_CLUSTER`
- `GKE_LOCATION` (zone or region, e.g. `us-central1`)
- `GAR_REGION` (e.g. `us-central1`)
- `GAR_REPOSITORY` (e.g. `todo-repo`)

Set this **Repository Secret**:
- `GCP_SA_KEY` (service account JSON key)

The workflow:
1. Builds and pushes backend/frontend images to Artifact Registry (`:latest`)
2. Runs `kubectl apply -f ./k8s`
3. Restarts `todo-backend` and `todo-frontend` deployments in namespace `todos`
