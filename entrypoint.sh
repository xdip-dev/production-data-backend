#!/bin/bash

# Apply Prisma migrations and capture the output
output=$(npx prisma migrate deploy 2>&1)

# Check if migrations were applied successfully or if there were no changes
echo "$output"
if [[ "$output" == *"No migrations to apply"* ]]; then
    echo "No migrations to apply, schema is up-to-date."
elif [[ "$output" == *"Prisma Migrate applied"* ]]; then
    echo "Migrations applied successfully."
else
    echo "Checking migration status or applying migrations..."
fi

# Start the application
echo "Starting the application..."
exec npm run start