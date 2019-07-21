FROM keymetrics/pm2:10-alpine

ARG NS
ARG NAME
ARG PORT

ENV NODE_ENV production
ENV NS ${NS:-prefix}
ENV NAME ${NAME:-somename}
ENV PORT ${PORT:-8000}

WORKDIR /$NS/$NAME

ADD . .
RUN chmod +x ./* && npm install

RUN npm run build

CMD [ "pm2-runtime", "start", "./ecosystem.config.js", "--env", "production" ]

VOLUME /$NS/$NAME/volume/logs

EXPOSE ${PORT:-8000}
