FROM cypress/browsers:node-16.18.1-chrome-110.0.5481.96-1-ff-109.0-edge-110.0.1587.41-1
RUN mkdir /cypressproject
WORKDIR /cypressproject
COPY ./package.json ./
COPY ./cypress.config.js ./
COPY ./report ./report
COPY ./cypress ./cypress
RUN npm install
ENTRYPOINT ["npx","cypress","run"]
CMD [ ""]