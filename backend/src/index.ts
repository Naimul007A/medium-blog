import { Hono } from 'hono'
import { HTTPException } from 'hono/http-exception'
import routes from './routes'
const app = new Hono<{
    Bindings: {
        DATABASE_URL: string
    }
}>()

app.get('/', (c) => {
    return c.text('Server is running')
})
app.route("/api/v1", routes)
app.onError((err, c) => {
    if (err instanceof HTTPException) {
        // Get the custom response
        return err.getResponse()
    }
    // Handle other errors
    return c.text('Internal Server Error', 500)
})
export default app
