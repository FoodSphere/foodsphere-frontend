# Stage 1: Install dependencies
FROM node:20-alpine AS deps
# ตรวจสอบว่ามี libc6-compat สำหรับบาง library ใน alpine
RUN apk add --no-cache libc6-compat
WORKDIR /app

# ติดตั้ง pnpm
RUN corepack enable && corepack prepare pnpm@latest --activate

# Copy package files
COPY package.json pnpm-lock.yaml* ./
RUN pnpm i --frozen-lockfile

# Stage 2: Build the application
FROM node:20-alpine AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .

ENV NEXT_PUBLIC_BASE_URL=__NEXT_PUBLIC_BASE_URL__
ENV NEXT_PUBLIC_API_BASE_URL=__NEXT_PUBLIC_API_BASE_URL__
ENV NEXT_PUBLIC_CUSTOMER_BASE_URL=__NEXT_PUBLIC_CUSTOMER_BASE_URL__
ENV NEXT_PUBLIC_BASE_SRIPE_URL=__NEXT_PUBLIC_BASE_SRIPE_URL__

# ติดตั้ง pnpm อีกครั้งใน stage นี้
RUN corepack enable && corepack prepare pnpm@latest --activate

# ปิดการส่ง telemetry ของ Next.js (ถ้าต้องการ)
ENV NEXT_TELEMETRY_DISABLED=1

RUN pnpm run build

# Stage 3: Runner
FROM node:20-alpine AS runner
WORKDIR /app

ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1

# สร้าง user ใหม่เพื่อความปลอดภัย (ไม่ใช้ root)
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

# Copy ไฟล์ที่จำเป็นจาก stage builder
# standalone mode จะรวบรวมไฟล์ที่จำเป็นต้องใช้ตอน runtime มาให้
COPY --from=builder /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

USER nextjs

EXPOSE 3001
ENV PORT=3001

COPY --chown=nextjs:nodejs entrypoint.sh ./
RUN chmod +x ./entrypoint.sh

ENTRYPOINT ["./entrypoint.sh"]
# รัน server โดยใช้ node โดยตรง (ไม่ต้องใช้ pnpm start ในขั้นตอนนี้)
CMD ["node", "server.js"]