# Container image that runs your code
FROM disintar/toncli-local:slim
#FROM disintar/toncli-local:m1-slim

ADD . /app
WORKDIR /app
RUN toncli build && toncli run_tests

WORKDIR /app/dapp
RUN npm ci && npm run build

WORKDIR /app/dapp/build



ENTRYPOINT ["/app/entrypoint.sh"]