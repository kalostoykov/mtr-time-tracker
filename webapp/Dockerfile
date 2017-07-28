FROM node:4.4.7
EXPOSE 8080
RUN mkdir /webapp
WORKDIR /webapp
ADD . /webapp/
RUN npm install
RUN npm install -g bower
RUN bower install --allow-root
ENTRYPOINT ["npm", "start"]
