const Koa = require('koa');
const Router = require('koa-router');
const bodyParser = require('koa-bodyparser');

const db = require('@paralect/node-mongo').connect("mongodb://db/docker");
const service = db.createService('user');
const loggerService = db.createService('logger');

const router = Router();

router.get('/me', async (ctx) => {
  const user = await service.find();
  ctx.status = 200;
  ctx.body = user.results;
})

router.post('/logs', async (ctx) => {
  if(!ctx.request.body.event){
    ctx.body=JSON.stringify({message: "enter event plz"})
  }
  else {
    await loggerService.create(ctx.request.body);
    ctx.body=JSON.stringify({message: "completed"});
  }
});

router.get('/logs', async (ctx) => {
  const logs = await loggerService.find();
  ctx.status = 200;
  ctx.body = logs.results;
});

const app = new Koa();

app.use(bodyParser());
app.use(router.routes());

app.listen(3033);