import { createLogger, format, transports } from 'winston'
import 'winston-daily-rotate-file'

const getLogger = (fileName = 'application') => {
  const fileLogTransport = new transports.File({
    filename: `logs/${fileName}-%DATE%.log`,
    zippedArchive: true
  })

  const consoleTransport = new transports.Console({
    level: process.env.LOG_LEVEL,
    handleExceptions: false,
    format: format.printf((il) => String(il.message))
  })

  const logger = createLogger({
    level: 'info',
    format: format.combine(
      format.timestamp({
        format: 'YYYY-MM-DD HH:mm:ss'
      }),
      format.errors({ stack: true }),
      format.splat(),
      format.printf(
        ({ level, message, label = process.env.NODE_ENV, timestamp }) =>
          `${timestamp} [${label}] ${level}: ${message}`
      )
    ),
    defaultMeta: { service: 'my-app' },
    transports: [consoleTransport]
  })

  if (process.env.NODE_ENV === 'development') {
    logger.add(fileLogTransport)
  }

  return logger
}

export const logger = getLogger()
