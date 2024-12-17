import { SearchLogger } from '../logger/logger';
import { searchProviderService } from '../service';

export class EventService {

	// TODO implement a (performant) cache => TODO Completed Here

	private errorCache: Map<string, unknown> = new Map();

	private _generateCacheKey(name: string, value: string): string {
		return `${name}:${value}`;
	}

	private _pushError(name: string, value: string, _payload?: unknown) {

		const key = this._generateCacheKey(name, value);

		if (this.errorCache.has(key)) {
			SearchLogger.debug(`Error '${key}' is already cached, skipping duplicate log.`);
			return;
		}

		this.errorCache.set(key, _payload);

		SearchLogger.debug(`Error on event '${name}' with id '${value}'`);

	}

	promoteEvent(name: string, value: string, payload?: unknown) {
		if (!searchProviderService.activeProvider?.on(name, value)) {
			this._pushError(name, value, payload);
		}
	}
}


