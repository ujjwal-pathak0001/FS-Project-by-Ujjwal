export const requestLogger = (req, res, next) => {
  const start = process.hrtime.bigint();
  res.on("finish", () => {
    const ms = Number(process.hrtime.bigint() - start) / 1_000_000;
    console.log(
      `[request] ${JSON.stringify({
        time: new Date().toISOString(),
        method: req.method,
        path: req.originalUrl,
        status: res.statusCode,
        tenantId: req.tenantId || req.user?.tenantId || null,
        durationMs: Number(ms.toFixed(2)),
      })}`
    );
  });
  next();
};
