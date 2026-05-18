import os from "os";

export interface HealthDependencies {
	mongodb?: { status: string; readyState: number };
	rabbitmq?: { status: string };
}

export function getServerMetrics(
	serviceName: string,
	startedAt: number,
	dependencies?: HealthDependencies,
) {
	const memory = process.memoryUsage();
	return {
		status: "ok",
		service: serviceName,
		timestamp: new Date().toISOString(),
		port: process.env.PORT,
		uptime: {
			processSeconds: Math.floor(process.uptime()),
			serviceSeconds: Math.floor((Date.now() - startedAt) / 1000),
		},
		metrics: {
			memory: {
				rssBytes: memory.rss,
				heapTotalBytes: memory.heapTotal,
				heapUsedBytes: memory.heapUsed,
				externalBytes: memory.external,
			},
			cpu: process.cpuUsage(),
			system: {
				loadAverage: os.loadavg(),
				freeMemoryBytes: os.freemem(),
				totalMemoryBytes: os.totalmem(),
				cpuCount: os.cpus().length,
			},
			process: {
				pid: process.pid,
				nodeVersion: process.version,
				platform: process.platform,
				arch: process.arch,
				env: process.env.NODE_ENV ?? "development",
			},
		},
		...(dependencies ? { dependencies } : {}),
	};
}
