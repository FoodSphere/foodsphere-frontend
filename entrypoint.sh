#!/bin/sh
# entrypoint.sh

echo "Starting Next.js Runtime Injection..."

if [ -z "$NEXT_PUBLIC_API_BASE_URL" ]; then
  echo "Warning: NEXT_PUBLIC_API_BASE_URL is not set in environment!"
else
  echo "Injecting NEXT_PUBLIC_API_BASE_URL: $NEXT_PUBLIC_API_BASE_URL"
  
  find /app/.next -type f -name "*.js" -exec sed -i "s|__NEXT_PUBLIC_API_BASE_URL__|${NEXT_PUBLIC_API_BASE_URL}|g" {} +
fi

if [ -z "$NEXT_PUBLIC_CUSTOMER_BASE_URL" ]; then
  echo "Warning: NEXT_PUBLIC_CUSTOMER_BASE_URL is not set in environment!"
else
  echo "Injecting NEXT_PUBLIC_CUSTOMER_BASE_URL: $NEXT_PUBLIC_CUSTOMER_BASE_URL"
  
  find /app/.next -type f -name "*.js" -exec sed -i "s|__NEXT_PUBLIC_CUSTOMER_BASE_URL__|${NEXT_PUBLIC_CUSTOMER_BASE_URL}|g" {} +
fi

if [ -z "$NEXT_PUBLIC_BASE_SRIPE_URL" ]; then
  echo "Warning: NEXT_PUBLIC_BASE_SRIPE_URL is not set in environment!"
else
  echo "Injecting NEXT_PUBLIC_BASE_SRIPE_URL: $NEXT_PUBLIC_BASE_SRIPE_URL"
  
  find /app/.next -type f -name "*.js" -exec sed -i "s|__NEXT_PUBLIC_BASE_SRIPE_URL__|${NEXT_PUBLIC_BASE_SRIPE_URL}|g" {} +
fi

echo "Starting the application..."

exec "$@"