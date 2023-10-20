import { createApiAdaptor, defaultPoster, parseId, getResponse } from '~/adaptors';
import { Readable } from 'stream';

export default defineEventHandler(
    async (event) => {
        const { key, id } = parseId(event.context.params!.id);
        const adaptor = createApiAdaptor(key)!;
        const poster = await adaptor.parsePoster(id);
        try {
            if (poster) {
                const response = await getResponse(poster, {
                    headers: {
                        'referer': adaptor.baseUrl
                    }
                });
                const headers = response.headers;
                setHeader(event, 'cache-control', 'public, max-age=604800');
                const inheritedHeaders = [
                    'content-type'
                ];
                for (const key of inheritedHeaders) {
                    setHeader(event, key, headers.get(key)!)
                }
                const arrayBuffer = await response.arrayBuffer()
                return sendStream(event, Readable.from(Buffer.from(arrayBuffer)));
            }
            else {
                throw new Error('can not find poster')
            }
        }
        catch (err) {
            return sendRedirect(event, defaultPoster, 301)
        }
    }
)
