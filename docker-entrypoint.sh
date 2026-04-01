#!/bin/sh
set -eu

MYSQL_SOCKET="/app/run/mysqld.sock"
MYSQL_DATADIR="/app/data/mysql"

if [ ! -d "$MYSQL_DATADIR/mysql" ]; then
  echo "[entrypoint] Initializing MariaDB data directory"
  mariadb-install-db --datadir="$MYSQL_DATADIR" --auth-root-authentication-method=normal >/dev/null
fi

echo "[entrypoint] Starting MariaDB"
mariadbd \
  --datadir="$MYSQL_DATADIR" \
  --bind-address=127.0.0.1 \
  --port=3306 \
  --socket="$MYSQL_SOCKET" \
  --pid-file=/app/run/mysqld.pid \
  --skip-log-error &

# Wait up to 60 seconds for MariaDB socket readiness.
ready=0
for _ in $(seq 1 60); do
  if mariadb --protocol=socket --socket="$MYSQL_SOCKET" -u root -e "SELECT 1" >/dev/null 2>&1; then
    ready=1
    break
  fi
  sleep 1
done

if [ "$ready" -ne 1 ]; then
  echo "MariaDB did not become ready within timeout" >&2
  exit 1
fi

echo "[entrypoint] Configuring MariaDB database and user"
mariadb --protocol=socket --socket="$MYSQL_SOCKET" -u root -e "CREATE DATABASE IF NOT EXISTS ${DB_NAME};"
mariadb --protocol=socket --socket="$MYSQL_SOCKET" -u root -e "CREATE USER IF NOT EXISTS '${DB_USER}'@'127.0.0.1' IDENTIFIED BY '${DB_PASSWORD}';"
mariadb --protocol=socket --socket="$MYSQL_SOCKET" -u root -e "CREATE USER IF NOT EXISTS '${DB_USER}'@'localhost' IDENTIFIED BY '${DB_PASSWORD}';"
mariadb --protocol=socket --socket="$MYSQL_SOCKET" -u root -e "GRANT ALL PRIVILEGES ON ${DB_NAME}.* TO '${DB_USER}'@'127.0.0.1';"
mariadb --protocol=socket --socket="$MYSQL_SOCKET" -u root -e "GRANT ALL PRIVILEGES ON ${DB_NAME}.* TO '${DB_USER}'@'localhost';"
mariadb --protocol=socket --socket="$MYSQL_SOCKET" -u root -e "FLUSH PRIVILEGES;"

echo "[entrypoint] Starting Redis"
redis-server --bind 127.0.0.1 --port 6379 --save "" --appendonly no --daemonize yes

echo "[entrypoint] Starting Node application"
exec node src/server.js
